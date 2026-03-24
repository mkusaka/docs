import { performance } from "node:perf_hooks";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";
const OPENAI_MODELS = (process.env.OPENAI_MODELS || "gpt-5-mini,gpt-5-nano")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const OPENAI_REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT || "low";
const OPENAI_JUDGE_MODEL = process.env.OPENAI_JUDGE_MODEL || "gpt-5.4";
const RUNS_PER_CASE = Number.parseInt(process.env.RUNS_PER_CASE || "1", 10);
const REQUEST_TIMEOUT_MS = Number.parseInt(process.env.REQUEST_TIMEOUT_MS || "120000", 10);

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is required");
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

const contentIndexPath = path.resolve("lib/generated/content-index.json");
const contentIndex = JSON.parse(await readFile(contentIndexPath, "utf8"));
const postsBySlug = new Map(contentIndex.map((post) => [post.slug, post]));

const cases = [
  {
    id: "generate-ja-quick-short",
    slug: "android-earth-mark",
    style: "quick",
    language: "ja",
  },
  {
    id: "generate-ja-detailed-medium",
    slug: "iterm2-cycle-tabs-mru",
    style: "detailed",
    language: "ja",
  },
  {
    id: "generate-en-detailed-medium",
    slug: "ai-cli-ctrl-z",
    style: "detailed",
    language: "en",
  },
  {
    id: "generate-zh-quick-long",
    slug: "codex-cli-opencode-zen",
    style: "quick",
    language: "zh",
  },
  {
    id: "generate-ko-detailed-medium",
    slug: "opencode-ctrl-h",
    style: "detailed",
    language: "ko",
  },
].map((entry) => {
  const post = postsBySlug.get(entry.slug);
  if (!post) {
    throw new Error(`Unknown slug in benchmark cases: ${entry.slug}`);
  }
  return {
    ...entry,
    post,
  };
});

function getOutputLanguageName(language) {
  switch (language) {
    case "en":
      return "English";
    case "zh":
      return "Chinese";
    case "ko":
      return "Korean";
    default:
      return "Japanese";
  }
}

function buildGenerateSystemPrompt(language) {
  const lang = getOutputLanguageName(language);

  return `You are a ghostwriter for a personal tech blog.
Transform the given notes/bullet points into a compelling blog post.

CRITICAL — Output language: You MUST write the entire output in ${lang}. Every sentence must be in ${lang}.

Output format (highest priority):
- Output only the blog post body in Markdown
- Do NOT output any preamble ("Sure, here's", "承知しました", "以下に記事を作成します" etc.) in any language
- Do NOT output any closing remarks ("いかがでしたか", "Give it a try!" etc.)
- The very first character of your output must be the first character of the blog post

Anti-hallucination (highest priority):
- Do NOT add facts, examples, commands, or steps not in the draft. Limit content to what's in the draft
- Do NOT create URLs not in the draft. Only use URLs from the draft for References; omit the References section if none exist
- Do NOT write uncertain information as fact

Content rules:
- Include all information and claims from the draft without omission
- Preserve code blocks, links, and images as-is
- Do NOT use expressions implying another source exists ("original article", "元の記事", "原文" etc.)

Style:
- Write in a natural, personal blog voice
- Use subjective expressions moderately (e.g., "I think", "convenient", "tried it out")
- Output in Markdown format`;
}

function getStyleInstruction(style) {
  switch (style) {
    case "quick":
      return `\nStyle instructions:
- Output only 3-5 bullet points summarizing the key takeaways. Nothing else.
- Do NOT add prose, explanations, references, or code blocks after the bullets. End with the bullets.
- Each bullet must be one sentence, concise.
- No headings (#). Use only bullet points (-).`;
    case "detailed":
      return `\nStyle instructions:
- Use polite language throughout
- Include background explanations on why something matters and in what scenarios it's useful (but do NOT add facts not in the draft)
- Write step-by-step so first-time readers can follow
- Convey the practical value of each point with concrete use cases`;
    case "original":
    default:
      return "";
  }
}

function buildGenerateUserPrompt(post, style) {
  return `Write a blog post based on the following notes/draft.
IMPORTANT: Do NOT add facts or examples not in the draft. Content must stay within the scope of the draft.
${getStyleInstruction(style)}

Draft:
${post.rawContent}`;
}

function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s<>"'`)\]）】。、，]+/g);
  return matches
    ? Array.from(
        new Set(matches.map((value) => value.replace(/[)`）.,'"`]+$/g, "")).filter(Boolean)),
      )
    : [];
}

function stripCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, "").trim();
}

function removeUrls(text) {
  return text.replace(/https?:\/\/[^\s<>"'`)\]）】。、，]+/g, " ");
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function detectLanguageByScript(language, output) {
  const visibleText = removeUrls(stripCodeBlocks(output))
    .replace(/`[^`]*`/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\s+/g, " ");

  const scriptCounts = {
    latin: countMatches(visibleText, /[A-Za-z]/g),
    hiragana: countMatches(visibleText, /[\u3040-\u309F]/g),
    katakana: countMatches(visibleText, /[\u30A0-\u30FF]/g),
    han: countMatches(visibleText, /[\u4E00-\u9FFF]/g),
    hangul: countMatches(visibleText, /[\uAC00-\uD7AF]/g),
  };

  const jaKana = scriptCounts.hiragana + scriptCounts.katakana;
  let pass = false;
  let reason = "";

  switch (language) {
    case "ja":
      pass = jaKana >= 10 || (jaKana >= 3 && scriptCounts.han >= 5);
      reason = pass ? "Japanese kana detected throughout the prose." : "Japanese kana was scarce.";
      break;
    case "en":
      pass = jaKana + scriptCounts.hangul + scriptCounts.han <= 5 && scriptCounts.latin >= 40;
      reason = pass
        ? "Latin script dominates and CJK characters are negligible."
        : "CJK script remained in the prose.";
      break;
    case "zh":
      pass = scriptCounts.han >= 20 && jaKana === 0 && scriptCounts.hangul === 0;
      reason = pass
        ? "Han characters dominate without Japanese kana or Hangul."
        : "Japanese kana or Hangul appeared, or Han usage was too low.";
      break;
    case "ko":
      pass = scriptCounts.hangul >= 20;
      reason = pass ? "Hangul dominates the prose." : "Hangul usage was too low.";
      break;
    default:
      reason = "Unknown language.";
  }

  return { pass, reason, scriptCounts };
}

function collectHeuristics({ style, draft, output }) {
  const cleanOutput = stripCodeBlocks(output);
  const lines = cleanOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulletLines = lines.filter((line) => line.startsWith("- "));
  const headingLines = lines.filter((line) => line.startsWith("#"));
  const nonBulletLines = lines.filter((line) => !line.startsWith("- "));
  const draftUrls = extractUrls(draft);
  const outputUrls = extractUrls(output);
  const hallucinatedUrls = outputUrls.filter((url) => !draftUrls.includes(url));

  return {
    outputChars: output.length,
    bulletCount: bulletLines.length,
    headingCount: headingLines.length,
    nonBulletLineCount: nonBulletLines.length,
    outputUrlCount: outputUrls.length,
    hallucinatedUrls,
    quickFormatPass:
      style !== "quick"
        ? null
        : bulletLines.length >= 3 &&
          bulletLines.length <= 5 &&
          headingLines.length === 0 &&
          nonBulletLines.length === 0,
  };
}

async function fetchWithTiming(url, options) {
  const start = performance.now();
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const headersMs = performance.now() - start;
  const bodyText = await response.text();
  const totalMs = performance.now() - start;
  return { response, headersMs, totalMs, bodyText };
}

function parseGeminiText(payload) {
  const candidate = payload?.candidates?.[0];
  if (!candidate) {
    return "";
  }
  return (candidate.content?.parts || [])
    .map((part) => part.text || "")
    .join("")
    .trim();
}

function parseOpenAIText(payload) {
  if (typeof payload?.output_text === "string") {
    return payload.output_text.trim();
  }

  const texts = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") {
        texts.push(content.text);
      }
    }
  }
  return texts.join("\n").trim();
}

async function callGemini({ system, prompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(process.env.GOOGLE_API_KEY)}`;
  const body = {
    systemInstruction: {
      role: "system",
      parts: [{ text: system }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const { response, headersMs, totalMs, bodyText } = await fetchWithTiming(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch (error) {
    throw new Error(`Gemini returned non-JSON response: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}: ${bodyText}`);
  }

  return {
    model: GEMINI_MODEL,
    provider: "gemini",
    headersMs,
    totalMs,
    raw: payload,
    output: parseGeminiText(payload),
    finishReason: payload?.candidates?.[0]?.finishReason ?? null,
  };
}

async function callOpenAI({ model, system, prompt }) {
  const body = {
    model,
    reasoning: {
      effort: OPENAI_REASONING_EFFORT,
    },
    instructions: system,
    input: prompt,
  };

  const { response, headersMs, totalMs, bodyText } = await fetchWithTiming(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    },
  );

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch (error) {
    throw new Error(`OpenAI returned non-JSON response: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}: ${bodyText}`);
  }

  return {
    model,
    provider: "openai",
    headersMs,
    totalMs,
    raw: payload,
    output: parseOpenAIText(payload),
    finishReason: payload?.status ?? null,
  };
}

function extractJsonObject(text) {
  const trimmed = text.trim();
  const direct = tryParseJson(trimmed);
  if (direct) {
    return direct;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    return tryParseJson(match[0]);
  }
  return null;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function judgeOutput({ benchmarkCase, run }) {
  const heuristics = collectHeuristics({
    style: benchmarkCase.style,
    draft: benchmarkCase.post.rawContent,
    output: run.output,
  });
  const languageCheck = detectLanguageByScript(benchmarkCase.language, run.output);

  const system =
    "You are a strict evaluator for source-grounded content generation. Return JSON only.";
  const prompt = `Evaluate the generated blog post against the source draft and instructions.

Return minified JSON with this exact shape:
{"accuracy_score":1,"instruction_fit_score":1,"language_pass":true,"language_notes":"...","accuracy_notes":["..."],"instruction_notes":["..."]}

Scoring rubric:
- accuracy_score: 1-5. Judge factual faithfulness to the draft, omission of important points, and whether any unsupported claims/examples/URLs were added.
- instruction_fit_score: 1-5. Judge fit to style instructions (quick vs detailed), markdown/body-only constraint, and overall compliance.
- language_pass: true only if the prose is entirely in the requested target language, ignoring code blocks, URLs, and product names.
- language_notes: one short sentence.
- accuracy_notes and instruction_notes: short bullet-style findings.

Target language: ${benchmarkCase.language}
Style: ${benchmarkCase.style}
Known heuristic signals:
- hallucinated_urls: ${JSON.stringify(heuristics.hallucinatedUrls)}
- bullet_count: ${heuristics.bulletCount}
- heading_count: ${heuristics.headingCount}
- non_bullet_line_count: ${heuristics.nonBulletLineCount}
- quick_format_pass: ${JSON.stringify(heuristics.quickFormatPass)}

Source draft:
${benchmarkCase.post.rawContent}

Generated output:
${run.output}`;

  const judged = await callOpenAI({
    model: OPENAI_JUDGE_MODEL,
    system,
    prompt,
  });
  const parsed = extractJsonObject(judged.output);
  if (!parsed) {
    throw new Error(`Judge output was not valid JSON: ${judged.output}`);
  }
  return {
    judgeModel: OPENAI_JUDGE_MODEL,
    judgeLatencyMs: judged.totalMs,
    ...parsed,
    script_language_pass: languageCheck.pass,
    script_language_reason: languageCheck.reason,
    heuristics,
    script_counts: languageCheck.scriptCounts,
  };
}

function average(numbers) {
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function round(value) {
  return Number(value.toFixed(1));
}

function summarizeRuns(results) {
  const rows = [];
  for (const benchmarkCase of results.cases) {
    for (const modelResult of benchmarkCase.runsByModel) {
      const completedRuns = modelResult.runs.filter((run) => run.status === "ok");
      if (completedRuns.length === 0) {
        rows.push({
          caseId: benchmarkCase.id,
          model: modelResult.model,
          status: "failed",
          error: modelResult.runs[0]?.error || "unknown error",
        });
        continue;
      }

      const firstRun = completedRuns[0];
      rows.push({
        caseId: benchmarkCase.id,
        model: modelResult.model,
        status: "ok",
        accuracy: firstRun.evaluation.accuracy_score,
        instructionFit: firstRun.evaluation.instruction_fit_score,
        languagePass: firstRun.evaluation.script_language_pass,
        totalMsAvg: round(average(completedRuns.map((run) => run.totalMs))),
        headersMsAvg: round(average(completedRuns.map((run) => run.headersMs))),
        hallucinatedUrls: firstRun.evaluation.heuristics.hallucinatedUrls.length,
        quickFormatPass: firstRun.evaluation.heuristics.quickFormatPass,
      });
    }
  }
  return rows;
}

function toMarkdown(results, rows) {
  const lines = [];
  lines.push("# Model benchmark");
  lines.push("");
  lines.push(`Generated at: ${results.generatedAt}`);
  lines.push("");
  lines.push("## Cases");
  lines.push("");
  for (const benchmarkCase of results.cases) {
    lines.push(
      `- ${benchmarkCase.id}: slug=${benchmarkCase.slug}, style=${benchmarkCase.style}, language=${benchmarkCase.language}`,
    );
  }
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(
    "| case | model | accuracy | instruction_fit | language_pass | total_ms_avg | headers_ms_avg | hallucinated_urls | quick_format_pass |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    if (row.status !== "ok") {
      lines.push(`| ${row.caseId} | ${row.model} | fail | fail | fail | - | - | - | - |`);
      continue;
    }
    lines.push(
      `| ${row.caseId} | ${row.model} | ${row.accuracy} | ${row.instructionFit} | ${row.languagePass} | ${row.totalMsAvg} | ${row.headersMsAvg} | ${row.hallucinatedUrls} | ${row.quickFormatPass ?? "-"} |`,
    );
  }

  lines.push("");
  lines.push("## Notes");
  lines.push("");
  for (const benchmarkCase of results.cases) {
    lines.push(`### ${benchmarkCase.id}`);
    lines.push("");
    for (const modelResult of benchmarkCase.runsByModel) {
      const run = modelResult.runs.find((item) => item.status === "ok");
      if (!run) {
        lines.push(
          `- ${modelResult.model}: failed (${modelResult.runs[0]?.error || "unknown error"})`,
        );
        continue;
      }
      lines.push(
        `- ${modelResult.model}: accuracy=${run.evaluation.accuracy_score}, instruction_fit=${run.evaluation.instruction_fit_score}, language_pass=${run.evaluation.script_language_pass}, total_ms=${round(run.totalMs)}, notes=${run.evaluation.script_language_reason}`,
      );
      lines.push(`  accuracy_notes: ${run.evaluation.accuracy_notes.join(" / ")}`);
      lines.push(`  instruction_notes: ${run.evaluation.instruction_notes.join(" / ")}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

const results = {
  generatedAt: new Date().toISOString(),
  geminiModel: GEMINI_MODEL,
  openaiModels: OPENAI_MODELS,
  openaiReasoningEffort: OPENAI_REASONING_EFFORT,
  judgeModel: OPENAI_JUDGE_MODEL,
  runsPerCase: RUNS_PER_CASE,
  cases: [],
};

for (const benchmarkCase of cases) {
  const system = buildGenerateSystemPrompt(benchmarkCase.language);
  const prompt = buildGenerateUserPrompt(benchmarkCase.post, benchmarkCase.style);
  const caseResult = {
    id: benchmarkCase.id,
    slug: benchmarkCase.slug,
    style: benchmarkCase.style,
    language: benchmarkCase.language,
    runsByModel: [],
  };

  const modelRunners = [
    { label: GEMINI_MODEL, fn: () => callGemini({ system, prompt }) },
    ...OPENAI_MODELS.map((model) => ({
      label: model,
      fn: () => callOpenAI({ model, system, prompt }),
    })),
  ];

  for (const runner of modelRunners) {
    const modelResult = {
      model: runner.label,
      runs: [],
    };

    for (let attempt = 0; attempt < RUNS_PER_CASE; attempt += 1) {
      console.error(
        `[run] case=${benchmarkCase.id} model=${runner.label} attempt=${attempt + 1} phase=generation`,
      );
      try {
        const run = await runner.fn();
        console.error(
          `[run] case=${benchmarkCase.id} model=${runner.label} attempt=${attempt + 1} phase=judging`,
        );
        const evaluation = await judgeOutput({ benchmarkCase, run });
        modelResult.runs.push({
          status: "ok",
          attempt: attempt + 1,
          headersMs: round(run.headersMs),
          totalMs: round(run.totalMs),
          finishReason: run.finishReason,
          output: run.output,
          evaluation,
        });
      } catch (error) {
        console.error(
          `[run] case=${benchmarkCase.id} model=${runner.label} attempt=${attempt + 1} phase=error error=${error instanceof Error ? error.message : String(error)}`,
        );
        modelResult.runs.push({
          status: "error",
          attempt: attempt + 1,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    caseResult.runsByModel.push(modelResult);
  }

  results.cases.push(caseResult);
}

const rows = summarizeRuns(results);
const outputDir = path.resolve("tmp/model-benchmarks");
await mkdir(outputDir, { recursive: true });
const timestamp = results.generatedAt.replaceAll(":", "-");
const jsonPath = path.join(outputDir, `${timestamp}.json`);
const markdownPath = path.join(outputDir, `${timestamp}.md`);
await writeFile(jsonPath, `${JSON.stringify({ ...results, summaryRows: rows }, null, 2)}\n`);
await writeFile(markdownPath, toMarkdown(results, rows));

console.log(JSON.stringify({ jsonPath, markdownPath, summaryRows: rows }, null, 2));

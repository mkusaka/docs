export function getOutputLanguageName(language) {
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

export function buildGenerateSystemPrompt(language) {
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

export function getGenerateStyleInstruction(style) {
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

export function buildGenerateUserPrompt(draft, style) {
  return `Write a blog post based on the following notes/draft.
IMPORTANT: Do NOT add facts or examples not in the draft. Content must stay within the scope of the draft.
${getGenerateStyleInstruction(style)}

Draft:
${draft}`;
}

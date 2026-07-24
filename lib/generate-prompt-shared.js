export function getOutputLanguageName(language) {
  switch (language) {
    case "en":
      return "English";
    case "zh":
      return "Chinese (中文)";
    case "ko":
      return "Korean (한국어)";
    default:
      return "Japanese (日本語)";
  }
}

export function buildGenerateSystemPrompt(language) {
  const lang = getOutputLanguageName(language);

  return `# Critical output language
- The target output language is ${lang}.
- You MUST write all natural-language output in ${lang}, regardless of the language used in the draft.
- Translate headings, prose, list items, link labels, and image alt text into ${lang}.
- Product names and technical identifiers may remain unchanged.
- Before returning, verify that no other-language prose remains outside code and technical identifiers.

# Role
You are the ghostwriter for a personal technology blog. Turn the supplied draft into a polished post without changing its factual scope.

# Output contract
- Return only the Markdown body of the post.
- Start immediately with the post. Do not add a preamble, acknowledgment, or closing remark.

# Source fidelity
- Treat the draft as the only source of facts.
- Include every material fact and claim from the draft.
- Do not invent facts, examples, commands, procedures, results, or URLs.
- Do not state uncertain information as fact.
- Preserve code blocks, inline code, URLs, link destinations, and image destinations exactly as supplied.
- Use only URLs present in the draft. Omit a References section when the draft has no URLs.
- Do not describe the draft as an "original article", "source text", "元の記事", "原文", or similar external source.

# Voice
- Use a natural first-person personal-blog voice.
- Use subjective phrasing only where the draft supports it.
- Follow the style requirements in the user message exactly.`;
}

export function getGenerateStyleInstruction(style) {
  switch (style) {
    case "quick":
      return `# Style: Quick
- Return exactly 3 to 5 concise bullet points.
- Write one sentence per bullet.
- Use only \`-\` list markers.
- Do not add headings, prose outside the list, references, or code blocks.`;
    case "detailed":
      return `# Style: Detailed
- Use polite language throughout.
- Explain background, relevance, and practical value only when supported by the draft.
- Organize procedural material step by step so a first-time reader can follow it.
- Prefer a complete explanation over a terse summary.`;
    case "original":
    default:
      return `# Style: Original
- Preserve the draft's level of detail, emphasis, and overall structure.
- Improve readability without expanding the factual scope.`;
  }
}

export function buildGenerateUserPrompt(draft, style, language) {
  const lang = getOutputLanguageName(language);

  return `<draft>
${draft}
</draft>

${getGenerateStyleInstruction(style)}

# Task
Based only on the draft above, write the blog post entirely in ${lang} now. The draft's language is source material, not the output language.`;
}

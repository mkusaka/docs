# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal tech blog and docs site with AI-assisted rendering, digest, search, and recommendations. Built with Astro static pages and a Cloudflare Worker API. Blog posts are dynamically transformed by LLM with configurable language, tone, and detail level.

## Key Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Build and start local Worker dev server
pnpm dev:astro            # Page-only Astro dev server
pnpm build                # Production build
pnpm preview              # Build + preview on Workers
pnpm deploy               # Build + deploy to Cloudflare
pnpm upload               # Upload a Worker version for Cloudflare preview builds
pnpm build:content-index  # Rebuild content index from MDX
pnpm format               # Format code with oxfmt
pnpm format:check         # Check formatting with oxfmt
pnpm lint                 # Lint with oxlint
```

## Architecture

- **Runtime**: Cloudflare Workers with Static Assets
- **Framework**: Astro static pages + React islands
- **AI**: Vercel AI SDK v6 (`streamText`) + OpenAI or Google Generative AI
- **Styling**: Tailwind CSS v4, Design 7 (OpenAI-inspired dark UI)
- **Markdown rendering**: Streamdown (streaming-optimized)

### Key Routes

- `/` — Blog listing (AI-generated digest hero + featured grid + all posts)
- `/YYYY/MM/DD/slug` — Post page (AI-generated with style controls)
- `/docs` — Local markdown docs page
- `/tags` — All tags listing
- `/tags/[tag]` — Tag-filtered posts
- `/api/generate` — POST: Article AI generation (streamText)
- `/api/digest` — POST: Weekly digest generation
- `/api/search` — POST: Agentic search (full context + LLM)
- `/api/not-found` — POST: AI-powered 404 recommendations
- `/api/raw/[slug]` — GET: Raw markdown (content negotiation target)
- `/feed.xml` — RSS feed
- `/atom.xml` — Atom feed

### Content

- **`/content/blog/*.mdx`**: MDX posts (YYYY-MM-DD-slug.mdx)
- **`/lib/generated/content-index.json`**: Build-time generated index (run `pnpm build:content-index` after adding/editing posts)
- Frontmatter: title, date, description, categories, tags

### Content Negotiation

`Accept: text/markdown` on post URLs returns raw markdown from the Worker, matching `/api/raw/[slug]`.

## Important Technical Details

- **Node**: ^24.13.1
- **Package Manager**: pnpm
- **Pre-commit**: Lefthook (oxfmt + oxlint)
- **Env**: `OPENAI_API_KEY` and/or `GOOGLE_GENERATIVE_AI_API_KEY` in `.dev.vars` (local) or Cloudflare Secrets (production)

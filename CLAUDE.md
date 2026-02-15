# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog with AI-powered content generation. Built with Next.js 16 (App Router) on Cloudflare Workers via OpenNext. Blog posts are dynamically transformed by LLM with configurable language, tone, and detail level.

## Key Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (Turbopack)
pnpm build                # Production build
pnpm preview              # Build + preview on Workers
pnpm deploy               # Build + deploy to Cloudflare
pnpm build:content-index  # Rebuild content index from MDX
pnpm format               # Format code with Prettier
```

## Architecture

- **Runtime**: Cloudflare Workers via @opennextjs/cloudflare
- **Framework**: Next.js 16 App Router (Turbopack)
- **AI**: Vercel AI SDK v6 (`streamText`) + OpenAI API
- **Styling**: Tailwind CSS v4, Design 7 (OpenAI-inspired dark UI)
- **Markdown rendering**: Streamdown (streaming-optimized)

### Key Routes
- `/` — Blog listing (AI-generated digest hero + featured grid + all posts)
- `/YYYY/MM/DD/slug` — Post page (AI-generated with style controls)
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
`Accept: text/markdown` on post URLs returns raw markdown via middleware rewrite to `/api/raw/[slug]`.

## Important Technical Details
- **Node**: Managed by Volta (24.13.0)
- **Package Manager**: pnpm
- **Pre-commit**: Husky + lint-staged (Prettier)
- **Env**: `OPENAI_API_KEY` in `.dev.vars` (local) or Cloudflare Secrets (production)

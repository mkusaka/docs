# docs

Personal tech blog and docs site built with Astro static pages and a Cloudflare Worker API. Posts can be rendered, summarized, searched, and recommended with LLM-powered endpoints.

## Features

- AI-powered article rendering (configurable language, tone, detail level)
- Agentic search and smart 404 recommendations
- Docs page generated from local markdown
- Streaming markdown rendering with Streamdown
- Dark UI (Design 7 - OpenAI-inspired)
- Content negotiation for raw markdown access

## Prerequisites

- Node.js ^24.13.1
- pnpm
- Google Generative AI API key

## Installation

```bash
pnpm install
```

## Environment Setup

Create `.dev.vars` for local development:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

## Development

```bash
pnpm dev              # Build and start local Worker dev server
pnpm dev:astro        # Page-only Astro dev server
```

## Build & Deploy

```bash
pnpm build            # Production build
pnpm preview          # Build + preview on Workers locally
pnpm deploy           # Build + deploy to Cloudflare
pnpm upload           # Upload a Worker version for Cloudflare preview builds
```

## Content Management

Blog posts are stored in `/content/blog/*.mdx` with frontmatter:

```yaml
title: Post Title
date: YYYY-MM-DD
description: Brief description
categories: [category]
tags: [tag1, tag2]
```

After adding/editing posts:

```bash
pnpm build:content-index  # Rebuild content index
```

## Key Routes

- `/` — Blog listing with AI-generated digest
- `/YYYY/MM/DD/slug` — Post page with AI style controls
- `/docs` — Local markdown docs page
- `/tags` — All tags listing
- `/tags/[tag]` — Tag-filtered posts
- `/api/generate` — POST: Article AI generation (streaming)
- `/api/digest` — POST: Weekly digest generation
- `/api/search` — POST: Agentic search endpoint
- `/api/not-found` — POST: AI-powered 404 recommendations
- `/api/raw/[slug]` — GET: Raw markdown (content negotiation target)
- `/feed.xml` — RSS feed
- `/atom.xml` — Atom feed

### Smart 404 Page

404 errors trigger LLM-powered recommendations based on similar posts.

## Code Formatting

```bash
pnpm format           # Format with oxfmt
pnpm format:check     # Check formatting with oxfmt
pnpm lint             # Lint with oxlint
```

Pre-commit hooks (Lefthook) run oxfmt and oxlint automatically on commit.

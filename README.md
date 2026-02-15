# Personal Blog

AI-powered content generation blog. Built with Next.js 16 (App Router) on Cloudflare Workers via OpenNext.

## Features

- AI-powered article transformation (configurable language, tone, detail level)
- Streaming markdown rendering with Streamdown
- Dark UI (Design 7 - OpenAI-inspired)
- Content negotiation for raw markdown access

## Prerequisites

- Node.js ^24.13.1 (managed by Volta)
- pnpm
- OpenAI API key

## Installation

```bash
pnpm install
```

## Environment Setup

Create `.dev.vars` for local development:

```
OPENAI_API_KEY=your_key_here
```

## Development

```bash
pnpm dev              # Start dev server (Turbopack)
```

## Build & Deploy

```bash
pnpm build            # Production build
pnpm preview          # Build + preview on Workers locally
pnpm deploy           # Build + deploy to Cloudflare
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
pnpm format           # Format with Prettier
```

Pre-commit hooks (Lefthook) run automatically on commit.

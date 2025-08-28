# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal documentation website built with Docusaurus 2. The site serves as a blog and documentation platform, with blog posts as the primary content at the root path.

## Key Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build

# Serve production build locally
pnpm serve

# Format code
pnpm format
```

## Architecture & Structure

### Core Configuration
- **`docusaurus.config.js`**: Main configuration file controlling site behavior, theme, and routing
- **Blog as Homepage**: The blog is configured to serve from the root path (`routeBasePath: "/"`)
- **Docusaurus v4**: Using experimental features including `experimental_faster` mode

### Content Organization
- **`/blog/`**: Primary content directory containing MDX posts with dates in filenames (YYYY-MM-DD format)
- **`/docs/`**: Documentation section (accessible via `/docs` route)
- **`/src/css/custom.css`**: Custom styling
- **`/static/`**: Static assets including fonts (Geist) and images

### Important Technical Details
- **MDX Support**: Blog posts use `.mdx` extension for enhanced markdown with React components
- **Pre-commit Hooks**: Husky + lint-staged automatically format code on commit
- **Node Version**: Managed by Volta (Node 22.18.0)
- **Package Manager**: Uses pnpm for dependency management
- **Dark Mode Default**: Site defaults to dark color scheme
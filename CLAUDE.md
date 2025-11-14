# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Next.js 16 application with TypeScript, React 19, and Tailwind CSS v4. Uses App Router architecture.

## Development Commands
- **Dev server**: `npm run dev` (port 3000)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint` (ESLint)

## Architecture

### App Router Structure
- `src/app/page.tsx` - Home page (client component with state)
- `src/app/about/page.tsx` - About page (client component)
- `src/app/blog/page.tsx` - Blog list (client component, SPA pattern)
- `src/app/blog/[id]/page.tsx` - Blog detail (client component, SPA pattern)
- `src/app/layout.tsx` - Root layout with Geist fonts

### Components
- `src/components/nav.tsx` - Shared navigation component
- `src/components/counter.tsx` - Counter component example

### Import Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Styling
- Tailwind CSS v4 with PostCSS
- Dark mode via `dark:` prefix
- Custom fonts: Geist Sans + Geist Mono (next/font/google)

### Component Patterns
- All pages use `"use client"` directive (SPA architecture)
- Data fetching via useEffect + fetch (client-side)
- Loading states embedded in components (no loading.tsx files)
- Blog pages fetch from JSONPlaceholder API with artificial delays for demo

## Important Notes
- Kill existing dev server before starting new one
- Pages with useState/event handlers require `"use client"`
- TypeScript strict mode enabled

## MCP Servers

### Serena (Semantic Code Retrieval & Editing)
Install via Claude Code CLI:
```bash
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)
```

**Note**: Serena uses Python/uv, NOT npm. Configuration stored in `~/.claude.json` (global).
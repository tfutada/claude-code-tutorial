# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Next.js 16 application with TypeScript, React 19, and Tailwind CSS v4. Uses App Router architecture.

**Educational Purpose**: This project contains intentionally bad code patterns and anti-patterns for demonstration purposes. Some examples deliberately show blocking operations, inefficient algorithms, and suboptimal approaches to illustrate performance issues and best practices.

**Language**: Use English for all UI text, comments, and documentation. Target audience is English speakers.

**Topics Covered**:
- **React Hooks**: useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer
- **Custom Hooks**: useLocalStorage, useFetch, useDebounce, useToggle, useWindowSize
- **Async/Await Patterns**: I/O vs CPU tasks, Web Workers, chunking, performance optimization
- **Closures & setState**: Stale closures, functional updates, async callbacks
- **RSC vs SPA Architecture**: React Server Components vs Single Page Application patterns
  - Server Components (default in App Router)
  - Client Components ("use client" directive)
  - Component composition patterns
  - Performance tradeoffs
- **CPU Load Demos**: Intentionally blocking Fibonacci calculations to demonstrate server bottlenecks

## Development Commands
- **Dev server**: `npm run dev` (port 3000)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Lint**: `npm run lint` (ESLint)

## Architecture

### App Router Structure

**Core Pages:**
- `src/app/page.tsx` - Home page with tutorial links (server component)
- `src/app/about/page.tsx` - About page (client component)
- `src/app/layout.tsx` - Root layout with Geist fonts

**Blog Examples (SPA pattern):**
- `src/app/blog/page.tsx` - Blog list (client component, SPA pattern)
- `src/app/blog/[id]/page.tsx` - Blog detail (client component, SPA pattern)

**React Hooks Tutorials:**
- `src/app/hooks/use-state-example/page.tsx` - useState examples
- `src/app/hooks/use-effect-example/page.tsx` - useEffect examples
- `src/app/hooks/use-context-example/page.tsx` - useContext examples
- `src/app/hooks/advanced-hooks/page.tsx` - useRef, useMemo, useCallback, useReducer
- `src/app/hooks/custom-hooks-example/page.tsx` - Custom hooks patterns
- `src/app/hooks/closure-demo/page.tsx` - Closures & setState patterns

**Async/Performance Examples:**
- `src/app/async-examples/page.tsx` - Async/await, I/O vs CPU, Web Workers

**RSC Demo (Educational - Intentionally Bad Patterns):**
- `src/app/rsc-demo/page.tsx` - Main demo page explaining blocking
- `src/app/rsc-demo/slow/page.tsx` - CPU-intensive Fibonacci (blocks server)
- `src/app/rsc-demo/fast/page.tsx` - Fast page (demonstrates blocking effect)

### Components
- `src/components/nav.tsx` - Shared navigation component
- `src/components/counter.tsx` - Counter component example

### Import Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Styling
- Tailwind CSS v4 with PostCSS
- Dark mode via `dark:` prefix
- Custom fonts: Geist Sans + Geist Mono (next/font/google)
- Shadcn UI component library (`src/components/ui/`)
  - Pre-built accessible components (Card, Button, Badge, etc.)
  - Fully customizable with Tailwind
  - Components are copied into project (not installed as dependency)

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
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
- `src/app/layout.tsx` - Root layout with Geist fonts

### Import Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Styling
- Tailwind CSS v4 with PostCSS
- Dark mode via `dark:` prefix
- Custom fonts: Geist Sans + Geist Mono (next/font/google)

### Component Patterns
- Client components use `"use client"` directive
- Pages that need interactivity (useState, onClick, etc.) must be client components
- Shared navigation duplicated in page.tsx and about/page.tsx (no shared component yet)

## Important Notes
- Kill existing dev server before starting new one
- Pages with useState/event handlers require `"use client"`
- TypeScript strict mode enabled

## Claude Skills

Skills are reusable task templates that extend Claude Code's capabilities for project-specific workflows.

### Creating a Skill
1. Create `.claude/skills/` directory in project root
2. Add a markdown file: `.claude/skills/{skill-name}.md`
3. Write task instructions in the file

### Skill File Structure
```markdown
---
name: skill-name
description: Brief description of what this skill does
tags: [tag1, tag2]
---

# Skill Name

Detailed explanation of the skill.

## Instructions
- Step-by-step instructions
- Can include code examples
- Reference project-specific patterns
```

**YAML Frontmatter Fields:**
- `name` - Skill identifier (required)
- `description` - Brief summary shown in skill list (required)
- `tags` - Array of categorization tags (optional)

### Using Skills
Invoke with: `@{skill-name}` in conversation or via Skill tool

### Example Skill
`.claude/skills/check-newsapi.md`:
```markdown
# Check NewsAPI Connectivity

Test NewsAPI.org authentication and connectivity.

## Steps
1. Check for NEXT_PUBLIC_NEWS_API_KEY in .env.local
2. Make test API request to NewsAPI
3. Report connection status and any errors
```

## Slash Commands

Custom commands for common workflows in this project.

### Creating a Slash Command
1. Create `.claude/commands/` directory in project root
2. Add a markdown file: `.claude/commands/{command-name}.md`
3. Write instructions for Claude to execute

### Command File Structure
```markdown
---
description: Brief description shown in command list
---

# Command Title

Detailed instructions for Claude to follow when this command is invoked.

## Steps
1. First step
2. Second step
```

### Using Commands
Invoke with: `/{command-name}` in conversation

### Available Commands
- `/commit` - Commit current changes following git best practices

## MCP Servers

### Serena (Semantic Code Retrieval & Editing)
Install via Claude Code CLI:
```bash
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)
```

**Note**: Serena uses Python/uv, NOT npm. Configuration stored in `~/.claude.json` (global).
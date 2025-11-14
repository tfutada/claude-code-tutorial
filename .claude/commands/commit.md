---
description: Commit current changes to git
---

# Git Commit Changes

Follow the standard git commit workflow:

1. Run `git status` to see all untracked files
2. Run `git diff` to see both staged and unstaged changes
3. Run `git log -5 --oneline` to see recent commit message style
4. Analyze the changes and draft a concise commit message that:
   - Summarizes the nature of changes (feature, fix, refactor, etc.)
   - Focuses on "why" rather than "what"
   - Follows the repository's commit message style
5. Add relevant untracked files with `git add`
6. Create the commit with message ending with:
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
7. Run `git status` after commit to verify success

**Important:**
- Use HEREDOC format for commit messages
- Do NOT commit files with secrets (.env, credentials.json, etc.)
- Run these commands in parallel where possible (status, diff, log)
- Sequential: add files THEN commit THEN verify
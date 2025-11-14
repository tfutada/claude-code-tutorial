---
description: Start Next.js development server
---

# Start Next.js Development Server

Follow these steps to restart the Next.js dev server:

1. Check and kill any existing processes on port 3000:
   ```bash
   lsof -ti:3000 | xargs kill
   ```
   (If no processes found, this will error - that's OK)

2. Start the dev server in background:
   ```bash
   npm run dev
   ```
   Use `run_in_background: true` parameter

3. Wait 1-2 seconds, then check the output to confirm successful start:
   - Look for "Ready in Xms" message
   - Confirm URL: http://localhost:3000

4. Report to user:
   - Server status (running/failed)
   - Local URL
   - Any errors if present

**Important:**
- Always kill existing server before starting new one
- Run in background to avoid blocking
- Verify successful startup before confirming to user

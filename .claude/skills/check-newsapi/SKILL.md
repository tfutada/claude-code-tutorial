---
name: check-newsapi
description: Check connectivity and authentication to NewsAPI.org
---

# Check NewsAPI Connectivity

Run the TypeScript connectivity checker:

```bash
npx tsx .claude/skills/check-newsapi/check-newsapi.ts
```

This script will:
1. Read `NEWS_API_KEY` from `.env.local`
2. Test API authentication with a sample request
3. Display article count and sample headline
4. Show rate limit status (if available)

If the API key is missing or invalid, get a new one at https://newsapi.org/register
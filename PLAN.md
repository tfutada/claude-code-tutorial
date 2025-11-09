# News Page Implementation Plan

## Overview
Create a `/news` page that fetches top headlines from NewsAPI.org using server-side rendering in Next.js 16.

## Files to Create

### 1. `src/app/news/page.tsx` (Server Component)
- **NO** `"use client"` directive (first SSR page in app)
- Fetch top headlines from NewsAPI.org using `fetch()` with API key
- Define TypeScript types for NewsAPI response:
  - `Article`: { title, description, url, urlToImage, publishedAt, source, author }
  - `NewsAPIResponse`: { articles, status, totalResults }
- Display articles in a card grid layout
- Follow existing Tailwind patterns (zinc colors, same layout structure)
- Include navigation with all 4 links: Home, About, News (active), Contact

### 2. `src/app/news/loading.tsx`
- Skeleton UI with loading placeholders
- Match news page layout (grid of cards)
- Use zinc color palette for shimmer effect

### 3. `src/app/news/error.tsx`
- Client component (`"use client"`)
- Display error message with reset button
- Handle API errors, rate limits, network failures

### 4. `.env.local` (Update)
- Add `NEWS_API_KEY=your_actual_key_here`
- Environment variable for NewsAPI authentication

## Files to Modify

### 5. `src/app/page.tsx` (Home)
- Update navigation: add News link between About and Contact
- Mark News link with inactive styles

### 6. `src/app/about/page.tsx` (About)
- Update navigation: add News link between About and Contact
- Mark News link with inactive styles

## Technical Details

**NewsAPI Endpoint:**
```
https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}
```

**Data Flow:**
1. Server Component fetches data during render (async page component)
2. Next.js caches response (default behavior)
3. No client-side JavaScript for data fetching
4. API key stays server-side (secure)

**Navigation Pattern:**
```tsx
// Active state
<a href="/news" className="text-zinc-900 dark:text-zinc-50">News</a>

// Inactive state
<a href="/news" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">News</a>
```

**Article Card Layout:**
- Grid layout: responsive columns (1 on mobile, 2 on tablet, 3 on desktop)
- Each card: image, title, description, source, published date
- Click to open article in new tab

## API Response Structure

```typescript
interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}
```

## Future Enhancements (Not in v1)
- Pagination or infinite scroll
- Client-side filtering by category
- Search functionality
- Country/language selection
- Bookmark/save articles

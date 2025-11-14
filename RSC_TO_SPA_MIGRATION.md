# RSC to SPA Migration Guide

This document explains the migration of the blog feature from **React Server Components (RSC)** to **Single Page Application (SPA)** architecture for educational purposes.

## Overview

The blog was converted from server-side data fetching (running on Node.js) to client-side data fetching (running in the browser). This demonstrates the fundamental differences between Next.js App Router's default RSC pattern and traditional SPA patterns.

## Files Modified

### 1. Blog List Page (`src/app/blog/page.tsx`)

**Before: RSC Pattern**
```tsx
// No "use client" directive
type Post = { userId: number; id: number; title: string; body: string };

async function getPosts(): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <div>{posts.slice(0, 10).map(...)}</div>;
}
```

**After: SPA Pattern**
```tsx
"use client";

import { useState, useEffect } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: Post[] = await res.json();
      setPosts(data.slice(0, 10));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <LoadingSkeleton />;
  return <div>{posts.map(...)}</div>;
}
```

### 2. Blog Detail Page (`src/app/blog/[id]/page.tsx`)

**Before: RSC Pattern**
```tsx
type PageProps = { params: Promise<{ id: string }> };

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id),
  ]);

  return <div>...</div>;
}
```

**After: SPA Pattern**
```tsx
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const [postRes, commentsRes] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { cache: "no-store" }),
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, { cache: "no-store" }),
      ]);
      if (!postRes.ok || !commentsRes.ok) throw new Error("Failed to fetch data");

      setPost(await postRes.json());
      setComments(await commentsRes.json());
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (!post) return null;
  return <div>...</div>;
}
```

### 3. Deleted Files

Loading states were inlined into the components:
- ❌ `src/app/blog/loading.tsx`
- ❌ `src/app/blog/[id]/loading.tsx`

## Key Differences

### Execution Environment

| Aspect | RSC | SPA |
|--------|-----|-----|
| **Runs on** | Node.js server | Browser |
| **When** | On request (server render) | After page load (client render) |
| **Network** | Server → API → Server → Browser | Browser → API |
| **Initial HTML** | Contains rendered content | Empty, populated by JS |

### Code Patterns

| Feature | RSC | SPA |
|---------|-----|-----|
| **Directive** | None (default) | `"use client"` required |
| **Function type** | `async function` | Regular function |
| **Data fetching** | Top-level `await` | `useEffect` hook |
| **Route params** | `await params` (Next.js 16) | `useParams()` hook |
| **State management** | Props/server state | `useState` hook |
| **Loading UI** | `loading.tsx` file | Inline conditional render |

### Data Flow

**RSC Flow:**
```
User requests /blog
  ↓
Next.js server receives request
  ↓
Server executes async BlogPage()
  ↓
Server fetches from API (5s delay)
  ↓
Server renders HTML with data
  ↓
Browser receives complete HTML
  ↓
Page displays immediately
```

**SPA Flow:**
```
User requests /blog
  ↓
Next.js serves static HTML + JS bundle
  ↓
Browser loads empty component
  ↓
useEffect triggers on mount
  ↓
Browser fetches from API (5s delay)
  ↓
setState updates component
  ↓
Page displays with data
```

## Loading States

### RSC Approach
- Separate `loading.tsx` file per route
- Automatically shown by Next.js during server render
- No client-side state needed

### SPA Approach
- `loading` state variable (`useState(true)`)
- Conditional rendering: `if (loading) return <Skeleton />`
- Manual state management required

## Network Behavior

### RSC
- **Initial request**: Full HTML with content
- **Browser DevTools**: No fetch visible (happens server-side)
- **View Source**: Contains actual post data
- **SEO**: Fully crawlable immediately

### SPA
- **Initial request**: HTML shell without content
- **Browser DevTools**: Fetch requests visible in Network tab
- **View Source**: Empty divs, no content
- **SEO**: Requires client JS execution (or SSG)

## Educational Value

This migration demonstrates:

1. **Data fetching paradigms**: Server vs Client
2. **State management**: Props flow vs React hooks
3. **Loading patterns**: Framework-managed vs Manual
4. **Network waterfalls**: Single server request vs Client chain
5. **SEO implications**: Pre-rendered vs Client-rendered

## Preserved Features

Both implementations maintain:
- ✅ Artificial delays (5s list, 1.5s detail) for educational demonstration
- ✅ Parallel fetching (`Promise.all` for post + comments)
- ✅ Same UI/UX and styling
- ✅ Same data source (JSONPlaceholder API)
- ✅ Dynamic rendering (`cache: "no-store"`)

## When to Use Each Pattern

### Use RSC (Server Components) when:
- SEO is critical
- Data is only needed server-side
- Reducing client bundle size matters
- Working with sensitive data (API keys, DB access)

### Use SPA (Client Components) when:
- Need interactivity (onClick, onChange, etc.)
- Client-side state management required
- Building dashboard/admin tools
- Real-time updates needed (polling, WebSockets)

## Testing the Migration

1. Start dev server: `npm run dev`
2. Navigate to `/blog`
3. Open browser DevTools → Network tab
4. Observe fetch requests appearing (SPA behavior)
5. View page source → notice empty content divs
6. Compare with loading states during 5s delay

## References

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
- [Next.js useParams Hook](https://nextjs.org/docs/app/api-reference/functions/use-params)

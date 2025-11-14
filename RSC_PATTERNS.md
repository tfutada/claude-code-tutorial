# React Server Components Patterns

This document explains the React Server Components (RSC) patterns implemented in this project for educational purposes.

## Overview

This project demonstrates key RSC concepts using Next.js 16 App Router with real-world examples fetching data from JSONPlaceholder API.

## Implemented Patterns

### 1. Server vs Client Component Boundaries

#### Server Components (Default)
- `src/app/page.tsx` - Home page
- `src/app/about/page.tsx` - About page
- `src/app/blog/page.tsx` - Blog list with async data
- `src/app/blog/[id]/page.tsx` - Blog detail with async data
- `src/components/nav.tsx` - Shared navigation

**Benefits:**
- Zero JavaScript sent to browser for static content
- Direct data fetching without API routes
- Automatic code splitting

#### Client Components
- `src/components/counter.tsx` - Interactive counter button

**When to use:**
- Needs `useState`, `useEffect`, or browser APIs
- Event handlers (onClick, onChange, etc.)
- Interactive UI elements

### 2. Component Composition Pattern

**Before (entire page was client):**
```tsx
"use client";
export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <nav>...</nav>
      <button onClick={() => setCount(count + 1)}>
        Counter: {count}
      </button>
    </div>
  );
}
```

**After (server with client child):**
```tsx
// src/app/page.tsx - Server Component
import Counter from "@/components/counter";

export default function Home() {
  return (
    <div>
      <Nav /> {/* Server */}
      <Counter /> {/* Client */}
    </div>
  );
}
```

**Key principle:** Server components can import and render client components as children, but client components cannot import server components.

### 3. Async Data Fetching in Server Components

#### Blog List Page (`src/app/blog/page.tsx`)

```tsx
async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store", // Dynamic rendering
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts(); // ✅ Async/await directly in component
  return <div>{posts.map(...)}</div>;
}
```

**No need for:**
- `getServerSideProps` or `getStaticProps`
- Separate API routes
- Client-side data fetching libraries (for server data)

### 4. Streaming with Suspense

#### How Loading States Work

When you navigate to `/blog`:

1. **Instant Navigation** - Next.js shows `src/app/blog/loading.tsx` immediately
2. **Background Fetch** - Server fetches data from API
3. **Stream Content** - Once resolved, real page replaces loading UI

#### File Structure
```
src/app/blog/
├── page.tsx           # Main page (async server component)
├── loading.tsx        # Loading skeleton (shown during fetch)
└── [id]/
    ├── page.tsx       # Detail page (async)
    └── loading.tsx    # Detail loading skeleton
```

#### Loading Component Example
```tsx
// src/app/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div>
      {/* Skeleton UI with animate-pulse */}
      <div className="animate-pulse bg-zinc-200" />
    </div>
  );
}
```

**Automatically wraps page in:**
```tsx
<Suspense fallback={<BlogLoading />}>
  <BlogPage />
</Suspense>
```

### 5. Dynamic Routes with Async Params

#### Blog Detail Page (`src/app/blog/[id]/page.tsx`)

```tsx
type PageProps = {
  params: Promise<{ id: string }>; // ✅ Params are now async in Next.js 16
};

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;

  // Parallel data fetching
  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id),
  ]);

  return <article>{post.title}</article>;
}
```

**Key points:**
- Dynamic route segments use `[id]` folder naming
- Params are async (Next.js 16+)
- Can fetch multiple data sources in parallel

### 6. Cache Configuration

#### Dynamic Rendering (Fresh Data)
```tsx
fetch(url, { cache: "no-store" }); // Always fetch fresh
```

#### Static Rendering (Build Time)
```tsx
fetch(url); // Default - cached at build time
```

#### Revalidation (Incremental Static Regeneration)
```tsx
fetch(url, { next: { revalidate: 10 } }); // Revalidate every 10 seconds
```

## Testing the Implementation

### 1. Test Loading States
Visit `/blog` and watch for loading skeleton (brief due to fast API).

**To see loading more clearly, add artificial delay:**
```tsx
async function getPosts() {
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
  const res = await fetch(...);
  return res.json();
}
```

### 2. Test Dynamic Routes
- Visit `/blog/1` - Shows post #1 with comments
- Visit `/blog/5` - Shows post #5 with comments
- Each route fetches data server-side

### 3. Test Client Interactivity
- Home page Counter button (`src/components/counter.tsx`)
- State persists within component
- Only this component has client-side JavaScript

### 4. Network Tab Inspection
Open browser DevTools Network tab:
- **Server components:** No JavaScript payload for static content
- **Client components:** Only Counter component code sent
- **Data:** No API calls from browser (fetched server-side)

## Performance Benefits

### Before (All Client)
- Large JavaScript bundle
- API calls from browser
- Slower initial render
- All pages need hydration

### After (RSC)
- **Home/About:** ~90% less JavaScript
- **Blog pages:** Zero client-side API calls
- **Faster TTI:** Interactive elements load independently
- **SEO:** Full HTML rendered server-side

## Common Pitfalls

### ❌ Cannot Import Server Component in Client Component
```tsx
"use client";
import ServerComponent from "./server"; // ❌ Error!
```

### ✅ Pass Server Component as Children
```tsx
// ClientWrapper.tsx
"use client";
export default function ClientWrapper({ children }) {
  return <div>{children}</div>;
}

// page.tsx (Server)
import ClientWrapper from "./ClientWrapper";
import ServerComponent from "./ServerComponent";

export default function Page() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* ✅ Works! */}
    </ClientWrapper>
  );
}
```

### ❌ Using Hooks in Server Components
```tsx
// page.tsx (Server Component)
import { useState } from "react"; // ❌ Error!

export default function Page() {
  const [count, setCount] = useState(0); // ❌ Cannot use hooks
}
```

### ✅ Extract to Client Component
```tsx
// Counter.tsx
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0); // ✅ Works!
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Resources

- [Next.js RSC Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)
- [Original Blog Article](https://zenn.dev/tfutada/articles/36ad71ab598019)

## Next Steps

To extend this educational project:

1. **Add Server Actions** - Form mutations without API routes
2. **Add Search Functionality** - URL-based search with searchParams
3. **Add Authentication** - Server-side auth checks
4. **Add Database** - Replace JSONPlaceholder with real DB (Postgres, etc.)
5. **Add Error Boundaries** - Custom error.tsx for error handling
6. **Add Metadata API** - Dynamic meta tags for SEO

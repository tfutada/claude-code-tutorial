"use client";

import Nav from "@/components/nav";
import { useState, useEffect } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      // Artificial delay to demonstrate loading state (educational purpose)
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        cache: "no-store", // Dynamic rendering - fresh data on each request
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data: Post[] = await res.json();
      setPosts(data.slice(0, 10));
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Nav />
        <div className="flex flex-1 items-center justify-center">
          <main className="flex w-full max-w-4xl flex-col gap-8 py-16 px-6">
            <div className="flex flex-col gap-4">
              <div className="h-10 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-6 w-96 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="grid gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="h-7 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Nav />
      <div className="flex flex-1 items-center justify-center">
        <main className="flex w-full max-w-4xl flex-col gap-8 py-16 px-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Blog Posts
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Fetched from JSONPlaceholder API using browser-side fetch (SPA)
            </p>
          </div>

          <div className="grid gap-6">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.id}`}
                className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {post.title}
                </h2>
                <p className="line-clamp-2 text-zinc-600 dark:text-zinc-400">
                  {post.body}
                </p>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Read more →
                </span>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import Nav from "@/components/nav";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Artificial delay to demonstrate loading state (educational purpose)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fetch post and comments in parallel
      const [postRes, commentsRes] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          cache: "no-store",
        }),
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, {
          cache: "no-store",
        }),
      ]);

      if (!postRes.ok || !commentsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const postData: Post = await postRes.json();
      const commentsData: Comment[] = await commentsRes.json();

      setPost(postData);
      setComments(commentsData);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Nav />
        <div className="flex flex-1 items-center justify-center">
          <main className="flex w-full max-w-3xl flex-col gap-8 py-16 px-6">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

            <article className="flex flex-col gap-6">
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-3">
                <div className="h-5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </article>

            <div className="flex flex-col gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />

              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Nav />
      <div className="flex flex-1 items-center justify-center">
        <main className="flex w-full max-w-3xl flex-col gap-8 py-16 px-6">
          <a
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Blog
          </a>

          <article className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              {post.title}
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {post.body}
            </p>
          </article>

          <div className="flex flex-col gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Comments ({comments.length})
            </h2>

            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {comment.name}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-500">
                      {comment.email}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {comment.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

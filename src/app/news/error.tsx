"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("News page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Logo
          </div>
          <div className="flex gap-6">
            <a href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Home
            </a>
            <a href="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              About
            </a>
            <a href="/news" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              News
            </a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 text-6xl">⚠️</div>

          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Failed to Load News
          </h2>

          <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
            {error.message || "Something went wrong while fetching the latest news."}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Try Again
            </button>

            <a
              href="/"
              className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Go Home
            </a>
          </div>

          <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
            Common issues: API key not configured, rate limit exceeded, or network error
          </p>
        </div>
      </div>
    </div>
  );
}

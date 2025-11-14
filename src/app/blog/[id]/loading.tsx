import Nav from "@/components/nav";

export default function BlogPostLoading() {
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

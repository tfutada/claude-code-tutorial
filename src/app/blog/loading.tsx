import Nav from "@/components/nav";

export default function BlogLoading() {
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

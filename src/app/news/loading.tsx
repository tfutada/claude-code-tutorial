export default function Loading() {
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

      <div className="flex flex-1 justify-center">
        <main className="w-full max-w-7xl px-6 py-12">
          <div className="mb-8">
            <div className="h-10 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="mt-2 h-6 w-96 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-48 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800"></div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-3 w-3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-3 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>

                  <div className="mb-2 h-6 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>

                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="h-3 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

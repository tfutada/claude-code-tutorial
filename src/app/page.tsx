import Image from "next/image";
import Counter from "@/components/counter";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Nav />
      <div className="flex flex-1 items-center justify-center">
        <main className="flex w-full max-w-3xl flex-col items-center justify-between gap-16 py-32 px-16 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-red-600">
            React Hooks Tutorial
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Learn React Hooks deeply with interactive examples and explanations.
          </p>

          {/* Hooks Examples Grid */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <a
              href="/hooks/use-state-example"
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-1">useState</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Basic state management, counters, forms, arrays, objects
              </p>
            </a>

            <a
              href="/hooks/use-effect-example"
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-1">useEffect</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Side effects, data fetching, subscriptions, cleanup
              </p>
            </a>

            <a
              href="/hooks/use-context-example"
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-1">useContext</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Global state, avoid prop drilling, theme & auth examples
              </p>
            </a>

            <a
              href="/hooks/advanced-hooks"
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-1">Advanced Hooks</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                useRef, useMemo, useCallback, useReducer
              </p>
            </a>

            <a
              href="/hooks/custom-hooks-example"
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-1">Custom Hooks</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                useLocalStorage, useFetch, useDebounce, useToggle, useWindowSize
              </p>
            </a>

            <a
              href="/async-examples"
              className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-1">Async/Await Examples</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                I/O vs CPU tasks, Web Workers, chunking, performance
              </p>
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <Counter />
        </div>
      </main>
      </div>
    </div>
  );
}

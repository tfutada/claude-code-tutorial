"use client"

import MultiRequestTrigger from "@/components/multi-request-trigger"

export default function RSCDemoPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          RSC CPU Load Demo - Server Blocking
        </h1>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
            ⚠️ Educational Demo - Intentionally Bad Code
          </p>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            This demo shows how synchronous CPU-intensive operations in React Server Components
            can block Node.js's single thread, causing all requests to queue up sequentially.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              The Problem
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Node.js runs on a <strong>single thread</strong>. When a Server Component executes
              heavy synchronous CPU processing, the entire event loop is blocked.
              All other HTTP requests must wait in queue.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Blocking Server Code (Server Component)
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`// NO "use client" directive - runs on server
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

export default function SlowPage() {
  const result = fibonacci(43) // ~5-10 seconds, BLOCKS event loop
  return <div>{result}</div>
}`}
              </pre>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time complexity: O(2^n) - Exponentially slow by design
              </p>
            </div>
          </div>

          <MultiRequestTrigger />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Manual Testing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You can also manually test by opening multiple tabs:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-4">
              <li>Click "Open Slow Page" below in a new tab (starts blocking calculation)</li>
              <li>Immediately open it again in another new tab</li>
              <li>Open a third tab</li>
              <li>Observe: Each tab waits for the previous one to finish (~5-10s each)</li>
            </ol>

            <a
              href="/rsc-demo/slow"
              target="_blank"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              🐌 Open Slow Page (in new tab)
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Related Demos
            </h2>
            <a
              href="/rsc-demo/pure-function"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
            >
              🔄 Pure Functions & Double Render Demo
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learn about pure functions and React's StrictMode double render behavior
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 Solutions for Production Apps
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>
                <strong>Worker Threads:</strong> Offload CPU-intensive tasks to separate threads
              </li>
              <li>
                <strong>Caching:</strong> Use "use cache" directive to avoid re-computation
              </li>
              <li>
                <strong>External Services:</strong> Delegate heavy processing to microservices/APIs
              </li>
              <li>
                <strong>Streaming & Suspense:</strong> Send partial responses while processing
              </li>
              <li>
                <strong>Client Components:</strong> Move CPU work to browser (uses user's CPU)
              </li>
              <li>
                <strong>Async I/O:</strong> I/O operations don't block (database queries, API calls, file reads)
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Key Takeaway
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>CPU-bound synchronous code</strong> (like this Fibonacci example) blocks Node.js.
              <strong> I/O-bound async code</strong> (like <code>await fetch()</code> or database queries) does NOT block
              because Node.js can handle other requests while waiting for I/O.
            </p>
          </div>

          <div className="mt-6">
            <a
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

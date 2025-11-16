// Force dynamic rendering - disable all caching
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// Add headers to prevent caching
export async function generateMetadata() {
  return {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  }
}

// Intentionally slow Fibonacci calculation (recursive, no memoization)
// This demonstrates how CPU-intensive work blocks the Node.js event loop
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

export default function SlowPage() {
  const startTime = Date.now()

  // Execute CPU-intensive calculation (blocking the server)
  const n = 43 // Takes approximately 5-10 seconds
  const result = fibonacci(n)

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-red-50 to-red-100 dark:from-red-950 dark:to-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🐌</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Server Blocked for {duration}s
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Server Component with blocking CPU calculation
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
              Calculation Result
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-mono font-semibold">fibonacci({n})</span> = {' '}
                <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                  {result.toLocaleString()}
                </span>
              </p>
              <p>
                Server processing time: {' '}
                <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                  {duration}s
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Completed at: {new Date().toISOString()}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>What happened:</strong> During this {duration}s calculation, Node.js's main thread was completely blocked.
              All other HTTP requests to this server had to wait in queue.
              This simulates what happens when multiple users hit a slow endpoint.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Server-Side Code (Server Component)
            </h3>
            <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`// NO "use client" - this runs on the server
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

export default function SlowPage() {
  // Synchronous execution blocks Node.js event loop
  const result = fibonacci(43) // ~5-10 seconds
  return <div>{result}</div>
}`}
            </pre>
          </div>

          <div className="flex gap-3">
            <a
              href="/rsc-demo"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
            >
              ← Back to Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

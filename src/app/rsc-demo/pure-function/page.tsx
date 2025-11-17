'use client'

import { useState, useEffect } from 'react'

// Track render count outside component (survives re-renders)
let renderCount = 0

// PURE FUNCTION - Always returns same output for same input
// No side effects, doesn't modify external state
function add(a: number, b: number): number {
  return a + b
}

// IMPURE FUNCTION - Modifies external state (side effect)
function addAndLog(a: number, b: number): number {
  renderCount++ // Side effect: modifies external variable
  console.log(`[Render #${renderCount}] addAndLog called with ${a} + ${b}`)
  return a + b
}

export default function PureFunctionDemo() {
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  // This runs during render (not in useEffect)
  // In StrictMode (dev), React renders components TWICE to detect impure code
  const pureResult = add(5, 3) // Always 8, no side effects
  const impureResult = addAndLog(10, 20) // Side effect: increments renderCount

  useEffect(() => {
    const log = `Component mounted/updated. Render count: ${renderCount}`
    console.log(log)
    setLogs(prev => [...prev, log])
  }, [count]) // Runs after render completes

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-purple-50 to-blue-100 dark:from-purple-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔄</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Pure Functions & Double Render
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              React StrictMode renders components twice in development
            </p>
          </div>

          {/* Current Results */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">
              Current Results
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-mono font-semibold">add(5, 3)</span> ={' '}
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {pureResult}
                </span>
                <span className="ml-2 text-sm text-green-600 dark:text-green-400">✓ Pure</span>
              </p>
              <p>
                <span className="font-mono font-semibold">addAndLog(10, 20)</span> ={' '}
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                  {impureResult}
                </span>
                <span className="ml-2 text-sm text-red-600 dark:text-red-400">✗ Impure</span>
              </p>
              <p className="pt-2 border-t border-blue-200 dark:border-blue-700">
                Total render count:{' '}
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {renderCount}
                </span>
              </p>
            </div>
          </div>

          {/* Interactive Counter */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Interactive Counter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Click to trigger re-render and watch the render count increase
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCount(c => c + 1)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Increment: {count}
              </button>
              <button
                onClick={() => {
                  setCount(0)
                  setLogs([])
                  renderCount = 0
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Console Logs */}
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-300 mb-2">Console Logs</h3>
            <div className="text-sm text-green-400 font-mono space-y-1 max-h-48 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Click increment to see logs...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i}>$ {log}</p>
                ))
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Why 4× Renders Per Click?
            </h3>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc list-inside">
              <li>Click → <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">setCount()</code> triggers render (×2 in StrictMode)</li>
              <li>Then <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">useEffect</code> runs → <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">setLogs()</code> triggers another render (×2 in StrictMode)</li>
              <li><strong>Total: 4 renders per click</strong> (2 + 2)</li>
              <li>StrictMode intentionally renders twice to detect impure code</li>
              <li>Pure functions: same output, no side effects</li>
              <li>Impure functions: modify external state (renderCount++)</li>
              <li>Production build: only 2 renders per click (no StrictMode)</li>
            </ul>
          </div>

          {/* Code Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                <span>✓</span> Pure Function
              </h3>
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
{`function add(a: number, b: number) {
  return a + b // No side effects
}

// Always returns 8
const result = add(5, 3)`}
              </pre>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                <span>✗</span> Impure Function
              </h3>
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
{`let count = 0 // External state

function addAndLog(a: number, b: number) {
  count++ // Side effect!
  console.log(\`Called \${count} times\`)
  return a + b
}`}
              </pre>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Best Practices
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Keep render logic pure (no side effects)</li>
              <li>Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">useEffect</code> for side effects (API calls, logging)</li>
              <li>Don't modify external variables during render</li>
              <li>Embrace StrictMode's double render (it's your friend!)</li>
              <li>Remember: production build renders only once</li>
            </ul>
          </div>

          {/* Navigation */}
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

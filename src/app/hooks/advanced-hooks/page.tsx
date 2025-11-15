"use client"

import { useState, useRef, useMemo, useCallback, useReducer, useEffect } from "react"
import Link from "next/link"

export default function AdvancedHooksExample() {
  // =========================
  // useRef Examples
  // =========================
  const [refCount, setRefCount] = useState(0)
  const renderCountRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousCountRef = useRef(0)

  // Track renders without causing re-render (must be in useEffect to avoid hydration mismatch)
  useEffect(() => {
    renderCountRef.current++
  })

  useEffect(() => {
    previousCountRef.current = refCount
  }, [refCount])

  // =========================
  // useMemo Examples
  // =========================
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3, 4, 5])
  const [multiplier, setMultiplier] = useState(2)
  const [memoRenderCount, setMemoRenderCount] = useState(0)

  // Expensive calculation (memoized)
  const sum = useMemo(() => {
    console.log("🔄 Calculating sum... (expensive operation)")
    return numbers.reduce((acc, n) => acc + n, 0)
  }, [numbers])

  // Another expensive calculation
  const multipliedSum = useMemo(() => {
    console.log("🔄 Calculating multiplied sum...")
    return sum * multiplier
  }, [sum, multiplier])

  // =========================
  // useCallback Examples
  // =========================
  const [callbackCount, setCallbackCount] = useState(0)
  const [items, setItems] = useState<string[]>(["Item 1", "Item 2"])

  // Without useCallback - new function on every render
  const handleClickUnmemoized = () => {
    console.log("Unmemoized function called")
  }

  // With useCallback - same function reference
  const handleClickMemoized = useCallback(() => {
    console.log("Memoized function called")
    setCallbackCount(prev => prev + 1)
  }, [])

  const addItem = useCallback(() => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`])
  }, [])

  // =========================
  // useReducer Example
  // =========================
  type CounterState = { count: number; history: number[] }
  type CounterAction =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "reset" }
    | { type: "set"; payload: number }

  const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
    switch (action.type) {
      case "increment":
        return {
          count: state.count + 1,
          history: [...state.history, state.count + 1]
        }
      case "decrement":
        return {
          count: state.count - 1,
          history: [...state.history, state.count - 1]
        }
      case "reset":
        return { count: 0, history: [0] }
      case "set":
        return {
          count: action.payload,
          history: [...state.history, action.payload]
        }
      default:
        return state
    }
  }

  const [reducerState, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [0]
  })

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-8">Advanced Hooks</h1>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-semibold">💡 Open Browser Console</p>
        <p className="text-sm">Press F12 to see memoization logs and understand when computations run.</p>
      </div>

      {/* useRef Section */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">useRef - Mutable Values & DOM Access</h2>
        <p className="text-gray-600 mb-4">
          useRef stores mutable values that persist across renders WITHOUT triggering re-render.
        </p>

        <div className="space-y-6">
          {/* Example 1: DOM Access */}
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-3">1. DOM Element Access</h3>
            <div className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Focus me with button"
                className="flex-1 px-4 py-2 border rounded"
              />
              <button
                onClick={() => inputRef.current?.focus()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Focus Input
              </button>
            </div>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
{`const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} />
inputRef.current?.focus()`}
            </pre>
          </div>

          {/* Example 2: Track Renders */}
          <div className="p-4 bg-green-50 rounded">
            <h3 className="font-semibold mb-3">2. Track Renders (No Re-render)</h3>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => setRefCount(refCount + 1)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Trigger Re-render
              </button>
              <span>State count: {refCount}</span>
              <span className="text-purple-600 font-semibold">
                Render count: {renderCountRef.current}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Ref updates don't cause re-renders! Render count increases but doesn't trigger new render.
            </p>
            <pre className="mt-3 p-3 bg-white rounded text-xs">
{`const renderCountRef = useRef(0)
renderCountRef.current++  // No re-render!`}
            </pre>
          </div>

          {/* Example 3: Previous Value */}
          <div className="p-4 bg-purple-50 rounded">
            <h3 className="font-semibold mb-3">3. Store Previous Value</h3>
            <div className="space-y-2">
              <p>Current: <strong>{refCount}</strong></p>
              <p>Previous: <strong>{previousCountRef.current}</strong></p>
            </div>
            <pre className="mt-3 p-3 bg-white rounded text-xs overflow-x-auto">
{`const previousRef = useRef(0)
useEffect(() => {
  previousRef.current = count  // Store after render
}, [count])`}
            </pre>
          </div>
        </div>
      </section>

      {/* useMemo Section */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">useMemo - Memoize Expensive Calculations</h2>
        <p className="text-gray-600 mb-4">
          Avoid recalculating expensive computations on every render. Only recomputes when dependencies change.
        </p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setNumbers([...numbers, numbers.length + 1])}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Number
            </button>
            <button
              onClick={() => setMultiplier(multiplier + 1)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Increase Multiplier
            </button>
            <button
              onClick={() => setMemoRenderCount(memoRenderCount + 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Force Re-render (No Recalc)
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Numbers:</p>
              <p className="font-mono">[{numbers.join(", ")}]</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Results:</p>
              <p>Sum: <strong>{sum}</strong></p>
              <p>Multiplier: <strong>{multiplier}</strong></p>
              <p>Sum × Multiplier: <strong>{multipliedSum}</strong></p>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="font-semibold">💡 Check console!</p>
            <p>Click "Force Re-render" - no recalculation happens because deps didn't change.</p>
          </div>

          <pre className="p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// Only recalculates when 'numbers' changes
const sum = useMemo(() => {
  return numbers.reduce((acc, n) => acc + n, 0)
}, [numbers])

// Only recalculates when 'sum' or 'multiplier' changes
const multipliedSum = useMemo(() => {
  return sum * multiplier
}, [sum, multiplier])`}
          </pre>
        </div>
      </section>

      {/* useCallback Section */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">useCallback - Memoize Functions</h2>
        <p className="text-gray-600 mb-4">
          Return same function reference across renders. Useful for passing callbacks to memoized child components.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="mb-3">Callback called <strong>{callbackCount}</strong> times</p>
            <div className="flex gap-2">
              <button
                onClick={handleClickMemoized}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Call Memoized Function
              </button>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Item
              </button>
            </div>
            <div className="mt-3 space-y-1">
              {items.map((item, i) => (
                <div key={i} className="p-2 bg-white rounded text-sm">{item}</div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="font-semibold">💡 When to use useCallback?</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Passing callbacks to React.memo() components</li>
              <li>Callbacks in useEffect dependencies</li>
              <li>Context values with functions</li>
              <li>Don't overuse - has slight overhead</li>
            </ul>
          </div>

          <pre className="p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// Without useCallback - new function every render
const handleClick = () => console.log("clicked")

// With useCallback - same function reference
const handleClick = useCallback(() => {
  console.log("clicked")
}, [])  // Dependencies

// With dependencies
const handleAdd = useCallback(() => {
  doSomething(value)
}, [value])  // Recreate when 'value' changes`}
          </pre>
        </div>
      </section>

      {/* useReducer Section */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">useReducer - Complex State Logic</h2>
        <p className="text-gray-600 mb-4">
          Alternative to useState for complex state logic. Inspired by Redux pattern.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => dispatch({ type: "decrement" })}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -1
              </button>
              <span className="text-3xl font-mono font-bold">{reducerState.count}</span>
              <button
                onClick={() => dispatch({ type: "increment" })}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +1
              </button>
              <button
                onClick={() => dispatch({ type: "reset" })}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                onClick={() => dispatch({ type: "set", payload: 100 })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Set to 100
              </button>
            </div>
            <div className="p-3 bg-white rounded">
              <p className="text-sm font-semibold mb-1">History:</p>
              <p className="font-mono text-sm">[{reducerState.history.join(", ")}]</p>
            </div>
          </div>

          <pre className="p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`type State = { count: number; history: number[] }
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1, history: [...state.history, state.count + 1] }
    case "decrement":
      return { count: state.count - 1, history: [...state.history, state.count - 1] }
    case "set":
      return { count: action.payload, history: [...state.history, action.payload] }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, history: [0] })

// Dispatch actions
dispatch({ type: "increment" })
dispatch({ type: "set", payload: 100 })`}
          </pre>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="font-semibold">✅ Use useReducer when:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Complex state logic with multiple sub-values</li>
              <li>Next state depends on previous state</li>
              <li>Multiple ways to update the same state</li>
              <li>Want to keep update logic separate from component</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="p-6 bg-gray-50 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">📊 Hook Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-2">Hook</th>
                <th className="text-left p-2">Purpose</th>
                <th className="text-left p-2">Triggers Re-render?</th>
                <th className="text-left p-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono">useRef</td>
                <td className="p-2">Store mutable value</td>
                <td className="p-2">❌ No</td>
                <td className="p-2">DOM access, store previous value</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono">useMemo</td>
                <td className="p-2">Memoize calculation</td>
                <td className="p-2">Only if result changes</td>
                <td className="p-2">Expensive computations</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono">useCallback</td>
                <td className="p-2">Memoize function</td>
                <td className="p-2">Only if recreated</td>
                <td className="p-2">Pass to memo'd components</td>
              </tr>
              <tr>
                <td className="p-2 font-mono">useReducer</td>
                <td className="p-2">Complex state logic</td>
                <td className="p-2">✅ Yes</td>
                <td className="p-2">Complex state updates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

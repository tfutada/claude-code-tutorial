"use client"

import { useState } from "react"
import Link from "next/link"

export default function UseStateExample() {
  // 1. Basic counter
  const [count, setCount] = useState(0)

  // 2. String state
  const [name, setName] = useState("")

  // 3. Boolean state
  const [isVisible, setIsVisible] = useState(true)

  // 4. Array state
  const [items, setItems] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  // 5. Object state
  const [user, setUser] = useState({
    name: "Taro",
    age: 25,
    email: "taro@example.com"
  })

  // 6. Functional update (important for async operations)
  const [asyncCount, setAsyncCount] = useState(0)

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue])
      setInputValue("")
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateUser = (field: string, value: string | number) => {
    setUser(prev => ({ ...prev, [field]: value }))
  }

  // Demonstrates why functional update is important
  const handleMultipleUpdates = () => {
    // ❌ Wrong: All three will use the same initial value
    // setAsyncCount(asyncCount + 1)
    // setAsyncCount(asyncCount + 1)
    // setAsyncCount(asyncCount + 1)
    // Result: +1 only

    // ✅ Correct: Each uses the previous state
    setAsyncCount(prev => prev + 1)
    setAsyncCount(prev => prev + 1)
    setAsyncCount(prev => prev + 1)
    // Result: +3
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-8">useState Examples</h1>

      {/* Example 1: Basic Counter */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">1. Basic Counter</h2>
        <p className="text-gray-600 mb-4">
          Most basic useState example. Click buttons to increment/decrement.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -1
          </button>
          <span className="text-2xl font-mono">{count}</span>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +1
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
{`const [count, setCount] = useState(0)
setCount(count + 1)  // Update state`}
        </pre>
      </section>

      {/* Example 2: String State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">2. String State (Form Input)</h2>
        <p className="text-gray-600 mb-4">
          Controlled input with useState. Value is always in sync with state.
        </p>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded"
          />
          <p>Your name: <strong>{name || "(empty)"}</strong></p>
          <p className="text-sm text-gray-500">Character count: {name.length}</p>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
{`const [name, setName] = useState("")
<input value={name} onChange={(e) => setName(e.target.value)} />`}
        </pre>
      </section>

      {/* Example 3: Boolean State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">3. Boolean State (Toggle)</h2>
        <p className="text-gray-600 mb-4">
          Toggle visibility with boolean state. Common pattern for modals, menus.
        </p>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          {isVisible ? "Hide" : "Show"} Content
        </button>
        {isVisible && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <p>🎉 This content is conditionally rendered based on state!</p>
          </div>
        )}
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
{`const [isVisible, setIsVisible] = useState(true)
setIsVisible(!isVisible)  // Toggle
{isVisible && <div>Content</div>}`}
        </pre>
      </section>

      {/* Example 4: Array State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">4. Array State (Todo List)</h2>
        <p className="text-gray-600 mb-4">
          Managing arrays: add, remove items. Always create new array (immutability).
        </p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder="Add item..."
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              onClick={addItem}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{item}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {items.length === 0 && (
            <p className="text-gray-400 italic">No items yet. Add some!</p>
          )}
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`const [items, setItems] = useState<string[]>([])

// Add item (create new array)
setItems([...items, newItem])

// Remove item (filter creates new array)
setItems(items.filter((_, i) => i !== index))`}
        </pre>
      </section>

      {/* Example 5: Object State */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">5. Object State (Form)</h2>
        <p className="text-gray-600 mb-4">
          Update specific fields while preserving others using spread operator.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser("name", e.target.value)}
              placeholder="Name"
              className="px-4 py-2 border rounded"
            />
            <input
              type="number"
              value={user.age}
              onChange={(e) => updateUser("age", parseInt(e.target.value) || 0)}
              placeholder="Age"
              className="px-4 py-2 border rounded"
            />
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateUser("email", e.target.value)}
              placeholder="Email"
              className="col-span-2 px-4 py-2 border rounded"
            />
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">User Object:</h3>
            <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`const [user, setUser] = useState({ name: "", age: 0, email: "" })

// Update single field (preserve others with spread)
setUser(prev => ({ ...prev, name: "New Name" }))`}
        </pre>
      </section>

      {/* Example 6: Functional Update */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">6. Functional Update (Important!)</h2>
        <p className="text-gray-600 mb-4">
          When updating based on previous state, always use functional form.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-mono">{asyncCount}</span>
          <button
            onClick={handleMultipleUpdates}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add 3 at once
          </button>
          <button
            onClick={() => setAsyncCount(0)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold">💡 Why functional update?</p>
          <p className="text-sm mt-2">
            State updates are batched. Multiple setCount(count + 1) in same function
            all use the same initial count value. Use setCount(prev =&gt; prev + 1) instead!
          </p>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// ❌ Wrong: All use same initial value
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)  // Result: +1 only

// ✅ Correct: Each uses previous state
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)  // Result: +3`}
        </pre>
      </section>

      {/* Key Concepts Summary */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🎯 Key Concepts</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>State is immutable</strong>: Never mutate directly, always create new value</li>
          <li><strong>Functional updates</strong>: Use when new state depends on previous state</li>
          <li><strong>Batching</strong>: React batches multiple setState calls for performance</li>
          <li><strong>Re-renders</strong>: setState triggers component re-render</li>
          <li><strong>Arrays/Objects</strong>: Use spread operator to preserve immutability</li>
        </ul>
      </section>
    </div>
  )
}

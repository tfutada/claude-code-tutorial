"use client"

import { useState } from "react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useFetch } from "@/hooks/useFetch"
import { useDebounce } from "@/hooks/useDebounce"
import { useToggle } from "@/hooks/useToggle"
import { useWindowSize } from "@/hooks/useWindowSize"

interface Post {
  id: number
  title: string
  body: string
}

export default function CustomHooksExample() {
  // Example 1: useLocalStorage
  const [name, setName] = useLocalStorage("user-name", "")
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light")

  // Example 2: useFetch
  const { data: posts, loading, error } = useFetch<Post[]>(
    "https://jsonplaceholder.typicode.com/posts?_limit=3"
  )

  // Example 3: useDebounce
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 800)

  // Example 4: useToggle
  const modal = useToggle(false)
  const sidebar = useToggle(false)

  // Example 5: useWindowSize
  const { width, height } = useWindowSize()

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-8">Custom Hooks Examples</h1>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-semibold">💡 What are Custom Hooks?</p>
        <p className="text-sm mt-1">
          Custom hooks are JavaScript functions that start with "use" and can call other hooks.
          They let you extract component logic into reusable functions.
        </p>
      </div>

      {/* Example 1: useLocalStorage */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">1. useLocalStorage</h2>
        <p className="text-gray-600 mb-4">
          Persist state in localStorage. Try refreshing the page - values persist!
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded"
            />
            <p className="mt-2 text-sm text-gray-600">
              Stored in localStorage as: <code className="bg-gray-100 px-1">user-name</code>
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Theme:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`px-4 py-2 rounded ${
                  theme === "light"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-4 py-2 rounded ${
                  theme === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Dark
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Selected: <strong>{theme}</strong>
            </p>
          </div>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue))
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}

// Usage
const [name, setName] = useLocalStorage("user-name", "")`}
        </pre>
      </section>

      {/* Example 2: useFetch */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">2. useFetch</h2>
        <p className="text-gray-600 mb-4">
          Reusable data fetching with loading and error states built-in.
        </p>
        <div className="space-y-3">
          {loading && (
            <div className="p-4 bg-blue-50 rounded">Loading posts...</div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              Error: {error.message}
            </div>
          )}
          {posts && posts.map((post) => (
            <div key={post.id} className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {post.body.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// hooks/useFetch.ts
export function useFetch<T>(url: string) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }))
  }, [url])

  return state
}

// Usage
const { data, loading, error } = useFetch<Post[]>(url)`}
        </pre>
      </section>

      {/* Example 3: useDebounce */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">3. useDebounce</h2>
        <p className="text-gray-600 mb-4">
          Delay updating a value until user stops typing. Great for search/API calls!
        </p>
        <div className="space-y-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search... (800ms delay)"
            className="w-full px-4 py-2 border rounded"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Immediate value (updates on every keystroke):</p>
              <p className="font-mono text-sm break-all">
                "{searchTerm}" <span className="text-gray-400">({searchTerm.length} chars)</span>
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Debounced value (updates after 800ms pause):</p>
              <p className="font-mono text-sm break-all">
                "{debouncedSearchTerm}" <span className="text-gray-400">({debouncedSearchTerm.length} chars)</span>
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            💡 In real app, you'd make API call with debounced value to avoid calling API on every keystroke!
          </p>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Usage
const searchTerm = useDebounce(inputValue, 500)`}
        </pre>
      </section>

      {/* Example 4: useToggle */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">4. useToggle</h2>
        <p className="text-gray-600 mb-4">
          Boolean state with convenient helper functions. No more writing toggle logic!
        </p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={modal.toggle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Toggle Modal
            </button>
            <button
              onClick={modal.setTrue}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Show Modal
            </button>
            <button
              onClick={modal.setFalse}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Hide Modal
            </button>
          </div>
          {modal.value && (
            <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded">
              <p className="font-semibold">🎉 Modal is visible!</p>
              <p className="text-sm mt-1">This could be a modal, toast, sidebar, etc.</p>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              onClick={sidebar.toggle}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Toggle Sidebar
            </button>
          </div>
          {sidebar.value && (
            <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded">
              <p className="font-semibold">📂 Sidebar is open!</p>
            </div>
          )}
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// hooks/useToggle.ts
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse, setValue }
}

// Usage
const modal = useToggle(false)
modal.toggle()
modal.setTrue()
modal.setFalse()`}
        </pre>
      </section>

      {/* Example 5: useWindowSize */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">5. useWindowSize</h2>
        <p className="text-gray-600 mb-4">
          Track window dimensions. Updates automatically on resize!
        </p>
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Width</p>
              <p className="text-4xl font-bold text-blue-600">{width}px</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Height</p>
              <p className="text-4xl font-bold text-purple-600">{height}px</p>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-gray-500">
            Try resizing your browser window!
          </p>
          {width < 768 && (
            <p className="mt-3 p-3 bg-yellow-100 rounded text-sm text-center">
              📱 Mobile view detected
            </p>
          )}
          {width >= 768 && width < 1024 && (
            <p className="mt-3 p-3 bg-blue-100 rounded text-sm text-center">
              💻 Tablet view detected
            </p>
          )}
          {width >= 1024 && (
            <p className="mt-3 p-3 bg-green-100 rounded text-sm text-center">
              🖥️ Desktop view detected
            </p>
          )}
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// hooks/useWindowSize.ts
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

// Usage
const { width, height } = useWindowSize()`}
        </pre>
      </section>

      {/* Key Concepts */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🎯 Custom Hook Rules</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Naming</strong>: Must start with "use" (e.g., useCounter, useFetch)</li>
          <li><strong>Composition</strong>: Can call other hooks (useState, useEffect, etc.)</li>
          <li><strong>Reusability</strong>: Extract common logic used in multiple components</li>
          <li><strong>Return values</strong>: Can return anything (values, functions, objects, arrays)</li>
          <li><strong>Rules of Hooks apply</strong>: Only call at top level, only in React functions</li>
        </ul>
      </section>

      {/* Benefits */}
      <section className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">✅ Benefits</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>DRY</strong>: Don't Repeat Yourself - write logic once, use everywhere</li>
          <li><strong>Testability</strong>: Test logic separately from components</li>
          <li><strong>Organization</strong>: Keep components clean and focused</li>
          <li><strong>Composition</strong>: Combine hooks to create powerful abstractions</li>
          <li><strong>Sharing</strong>: Easy to share across projects or with team</li>
        </ul>
      </section>
    </div>
  )
}

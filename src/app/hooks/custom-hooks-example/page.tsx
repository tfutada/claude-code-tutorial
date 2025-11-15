"use client"

import { useState } from "react"
import Nav from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">Custom Hooks <span className="text-primary">Examples</span></h1>

        <div className="mb-6 p-4 bg-muted border rounded-lg">
          <p className="font-semibold">💡 What are Custom Hooks?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Custom hooks are JavaScript functions that start with "use" and can call other hooks.
            They let you extract component logic into reusable functions.
          </p>
        </div>

        {/* Example 1: useLocalStorage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. useLocalStorage</CardTitle>
            <CardDescription>
              Persist state in localStorage. Try refreshing the page - values persist!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Name:</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Stored in localStorage as: <code className="bg-muted px-1 rounded">user-name</code>
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Theme:</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setTheme("light")}
                    variant={theme === "light" ? "default" : "outline"}
                  >
                    Light
                  </Button>
                  <Button
                    onClick={() => setTheme("dark")}
                    variant={theme === "dark" ? "default" : "outline"}
                  >
                    Dark
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected: <strong>{theme}</strong>
                </p>
              </div>
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
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
          </CardContent>
        </Card>

        {/* Example 2: useFetch */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. useFetch</CardTitle>
            <CardDescription>
              Reusable data fetching with loading and error states built-in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading && (
                <div className="p-4 bg-muted rounded-lg">Loading posts...</div>
              )}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  Error: {error.message}
                </div>
              )}
              {posts && posts.map((post) => (
                <div key={post.id} className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.body.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
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
          </CardContent>
        </Card>

        {/* Example 3: useDebounce */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. useDebounce</CardTitle>
            <CardDescription>
              Delay updating a value until user stops typing. Great for search/API calls!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search... (800ms delay)"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Immediate value (updates on every keystroke):</p>
                  <p className="font-mono text-sm break-all">
                    "{searchTerm}" <span className="text-muted-foreground">({searchTerm.length} chars)</span>
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Debounced value (updates after 800ms pause):</p>
                  <p className="font-mono text-sm break-all">
                    "{debouncedSearchTerm}" <span className="text-muted-foreground">({debouncedSearchTerm.length} chars)</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                💡 In real app, you'd make API call with debounced value to avoid calling API on every keystroke!
              </p>
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
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
          </CardContent>
        </Card>

        {/* Example 4: useToggle */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. useToggle</CardTitle>
            <CardDescription>
              Boolean state with convenient helper functions. No more writing toggle logic!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={modal.toggle}>
                  Toggle Modal
                </Button>
                <Button onClick={modal.setTrue} variant="secondary">
                  Show Modal
                </Button>
                <Button onClick={modal.setFalse} variant="destructive">
                  Hide Modal
                </Button>
              </div>
              {modal.value && (
                <div className="p-4 bg-muted border-2 rounded-lg">
                  <p className="font-semibold">🎉 Modal is visible!</p>
                  <p className="text-sm text-muted-foreground mt-1">This could be a modal, toast, sidebar, etc.</p>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <Button onClick={sidebar.toggle} variant="outline">
                  Toggle Sidebar
                </Button>
              </div>
              {sidebar.value && (
                <div className="p-4 bg-muted border-2 rounded-lg">
                  <p className="font-semibold">📂 Sidebar is open!</p>
                </div>
              )}
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
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
          </CardContent>
        </Card>

        {/* Example 5: useWindowSize */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. useWindowSize</CardTitle>
            <CardDescription>
              Track window dimensions. Updates automatically on resize!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-muted rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Width</p>
                  <p className="text-4xl font-bold text-primary">{width}px</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-4xl font-bold text-primary">{height}px</p>
                </div>
              </div>
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Try resizing your browser window!
              </p>
              {width < 768 && (
                <div className="mt-3 p-3 bg-background rounded-lg text-sm text-center border">
                  📱 Mobile view detected
                </div>
              )}
              {width >= 768 && width < 1024 && (
                <div className="mt-3 p-3 bg-background rounded-lg text-sm text-center border">
                  💻 Tablet view detected
                </div>
              )}
              {width >= 1024 && (
                <div className="mt-3 p-3 bg-background rounded-lg text-sm text-center border">
                  🖥️ Desktop view detected
                </div>
              )}
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
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
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎯 Custom Hook Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Naming</strong>: Must start with "use" (e.g., useCounter, useFetch)</li>
              <li><strong>Composition</strong>: Can call other hooks (useState, useEffect, etc.)</li>
              <li><strong>Reusability</strong>: Extract common logic used in multiple components</li>
              <li><strong>Return values</strong>: Can return anything (values, functions, objects, arrays)</li>
              <li><strong>Rules of Hooks apply</strong>: Only call at top level, only in React functions</li>
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>DRY</strong>: Don't Repeat Yourself - write logic once, use everywhere</li>
              <li><strong>Testability</strong>: Test logic separately from components</li>
              <li><strong>Organization</strong>: Keep components clean and focused</li>
              <li><strong>Composition</strong>: Combine hooks to create powerful abstractions</li>
              <li><strong>Sharing</strong>: Easy to share across projects or with team</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Nav from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

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
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">useState <span className="text-primary">Examples</span></h1>

      {/* Example 1: Basic Counter */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. Basic Counter</CardTitle>
          <CardDescription>
            Most basic useState example. Click buttons to increment/decrement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCount(count - 1)}
              variant="destructive"
            >
              -1
            </Button>
            <span className="text-2xl font-mono">{count}</span>
            <Button
              onClick={() => setCount(count + 1)}
              variant="default"
            >
              +1
            </Button>
            <Button
              onClick={() => setCount(0)}
              variant="secondary"
            >
              Reset
            </Button>
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const [count, setCount] = useState(0)
setCount(count + 1)  // Update state`}
          </pre>
        </CardContent>
      </Card>

      {/* Example 2: String State */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2. String State (Form Input)</CardTitle>
          <CardDescription>
            Controlled input with useState. Value is always in sync with state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <p>Your name: <strong>{name || "(empty)"}</strong></p>
            <p className="text-sm text-muted-foreground">Character count: {name.length}</p>
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const [name, setName] = useState("")
<input value={name} onChange={(e) => setName(e.target.value)} />`}
          </pre>
        </CardContent>
      </Card>

      {/* Example 3: Boolean State */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. Boolean State (Toggle)</CardTitle>
          <CardDescription>
            Toggle visibility with boolean state. Common pattern for modals, menus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsVisible(!isVisible)}
            className="mb-4"
          >
            {isVisible ? "Hide" : "Show"} Content
          </Button>
          {isVisible && (
            <div className="p-4 bg-muted border rounded-lg">
              <p>🎉 This content is conditionally rendered based on state!</p>
            </div>
          )}
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const [isVisible, setIsVisible] = useState(true)
setIsVisible(!isVisible)  // Toggle
{isVisible && <div>Content</div>}`}
          </pre>
        </CardContent>
      </Card>

      {/* Example 4: Array State */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>4. Array State (Todo List)</CardTitle>
          <CardDescription>
            Managing arrays: add, remove items. Always create new array (immutability).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder="Add item..."
                className="flex-1"
              />
              <Button onClick={addItem}>
                Add
              </Button>
            </div>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>{item}</span>
                  <Button
                    onClick={() => removeItem(index)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            {items.length === 0 && (
              <p className="text-muted-foreground italic">No items yet. Add some!</p>
            )}
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const [items, setItems] = useState<string[]>([])

// Add item (create new array)
setItems([...items, newItem])

// Remove item (filter creates new array)
setItems(items.filter((_, i) => i !== index))`}
          </pre>
        </CardContent>
      </Card>

      {/* Example 5: Object State */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>5. Object State (Form)</CardTitle>
          <CardDescription>
            Update specific fields while preserving others using spread operator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                value={user.name}
                onChange={(e) => updateUser("name", e.target.value)}
                placeholder="Name"
              />
              <Input
                type="number"
                value={user.age}
                onChange={(e) => updateUser("age", parseInt(e.target.value) || 0)}
                placeholder="Age"
              />
              <Input
                type="email"
                value={user.email}
                onChange={(e) => updateUser("email", e.target.value)}
                placeholder="Email"
                className="col-span-2"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">User Object:</h3>
              <pre className="text-sm font-mono">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const [user, setUser] = useState({ name: "", age: 0, email: "" })

// Update single field (preserve others with spread)
setUser(prev => ({ ...prev, name: "New Name" }))`}
          </pre>
        </CardContent>
      </Card>

      {/* Example 6: Functional Update */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>6. Functional Update (Important!)</CardTitle>
          <CardDescription>
            When updating based on previous state, always use functional form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-mono">{asyncCount}</span>
            <Button
              onClick={handleMultipleUpdates}
              variant="default"
            >
              Add 3 at once
            </Button>
            <Button
              onClick={() => setAsyncCount(0)}
              variant="secondary"
            >
              Reset
            </Button>
          </div>
          <div className="mt-4 p-4 bg-muted border rounded-lg">
            <p className="font-semibold">💡 Why functional update?</p>
            <p className="text-sm text-muted-foreground mt-2">
              State updates are batched. Multiple setCount(count + 1) in same function
              all use the same initial count value. Use setCount(prev =&gt; prev + 1) instead!
            </p>
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`// ❌ Wrong: All use same initial value
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)  // Result: +1 only

// ✅ Correct: Each uses previous state
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)  // Result: +3`}
          </pre>
        </CardContent>
      </Card>

      {/* Key Concepts Summary */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Key Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>State is immutable</strong>: Never mutate directly, always create new value</li>
            <li><strong>Functional updates</strong>: Use when new state depends on previous state</li>
            <li><strong>Batching</strong>: React batches multiple setState calls for performance</li>
            <li><strong>Re-renders</strong>: setState triggers component re-render</li>
            <li><strong>Arrays/Objects</strong>: Use spread operator to preserve immutability</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Nav from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ClosureDemo() {
  const [count, setCount] = useState(0)

  // Example 1: Closure capturing stale value
  const handleClickStale = () => {
    setTimeout(() => {
      // This captures 'count' at the time handleClickStale was created
      console.log("Stale count:", count)
      setCount(count + 1) // ❌ Uses stale value!
    }, 3000)
  }

  // Example 2: Using functional update to avoid stale closure
  const handleClickFresh = () => {
    setTimeout(() => {
      // prevCount is always the latest value
      setCount(prevCount => {
        console.log("Fresh count:", prevCount)
        return prevCount + 1 // ✅ Always uses latest value!
      })
    }, 3000)
  }

  // Example 3: Multiple setState calls - stale closure problem
  const incrementThreeTimes = () => {
    setCount(count + 1) // All three use the SAME count value
    setCount(count + 1) // Because they capture count at this moment
    setCount(count + 1) // Result: only increments by 1, not 3!
    console.log("Called setCount 3 times with count:", count)
  }

  // Example 4: Multiple setState with functional updates
  const incrementThreeTimesFresh = () => {
    setCount(prev => prev + 1) // Each uses the latest value
    setCount(prev => prev + 1) // from the previous setState
    setCount(prev => prev + 1) // Result: increments by 3!
    console.log("Called setCount 3 times with functional updates")
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">
          setState & <span className="text-primary">Closures</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Counter */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 p-6 bg-muted border rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Current Count</p>
              <p className="text-6xl font-bold text-primary">{count}</p>
            </div>
          </div>

          {/* Right side - Examples */}
          <div className="lg:col-span-3 space-y-8">

        {/* Example 1: Stale Closure */}
        <Card>
          <CardHeader>
            <CardTitle>1. Stale Closure Problem</CardTitle>
            <CardDescription>
              setTimeout captures count value at the time of function creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleClickStale} variant="destructive">
                Increment after 3s (Stale)
              </Button>
              <p className="text-sm text-muted-foreground">
                Click this button multiple times quickly. After 3 seconds, count only increases by 1
                because all callbacks captured the same count value!
              </p>
              <pre className="p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const handleClick = () => {
  setTimeout(() => {
    setCount(count + 1) // ❌ Captures stale 'count'
  }, 3000)
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Example 2: Fresh Value with Functional Update */}
        <Card>
          <CardHeader>
            <CardTitle>2. Functional Update Solution</CardTitle>
            <CardDescription>
              Using prevCount ensures you always get the latest value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleClickFresh}>
                Increment after 3s (Fresh)
              </Button>
              <p className="text-sm text-muted-foreground">
                Click multiple times quickly. After 3 seconds, each click increments properly
                because the functional update gets the latest value!
              </p>
              <pre className="p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`const handleClick = () => {
  setTimeout(() => {
    setCount(prevCount => prevCount + 1) // ✅ Always fresh
  }, 3000)
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Example 3: Multiple setState - Stale */}
        <Card>
          <CardHeader>
            <CardTitle>3. Multiple setState Calls (Stale)</CardTitle>
            <CardDescription>
              All setState calls capture the same count value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={incrementThreeTimes} variant="destructive">
                Increment 3 Times (Stale)
              </Button>
              <p className="text-sm text-muted-foreground">
                Expected: +3, Actual: +1. All three setCount calls use the same captured count!
              </p>
              <pre className="p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`setCount(count + 1) // count = 0
setCount(count + 1) // count = 0 (same!)
setCount(count + 1) // count = 0 (same!)
// Result: 0 + 1 = 1`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Example 4: Multiple setState - Fresh */}
        <Card>
          <CardHeader>
            <CardTitle>4. Multiple setState (Functional)</CardTitle>
            <CardDescription>
              Each setState gets the latest value from the previous update
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={incrementThreeTimesFresh}>
                Increment 3 Times (Fresh)
              </Button>
              <p className="text-sm text-muted-foreground">
                Expected: +3, Actual: +3. Each functional update uses the latest value!
              </p>
              <pre className="p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`setCount(prev => prev + 1) // 0 => 1
setCount(prev => prev + 1) // 1 => 2
setCount(prev => prev + 1) // 2 => 3
// Result: 3`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Key Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Closure</strong>: Functions capture variables from their creation scope</li>
              <li><strong>Stale closure</strong>: Captured variables don&apos;t update when state changes</li>
              <li><strong>Functional updates</strong>: Use <code className="bg-muted px-1 rounded">prev =&gt; prev + 1</code> to get latest value</li>
              <li><strong>When to use functional</strong>: async callbacks, multiple setState calls, or when new state depends on old state</li>
              <li><strong>React batches</strong>: Multiple setState calls in same event handler are batched into one render</li>
            </ul>
          </CardContent>
        </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

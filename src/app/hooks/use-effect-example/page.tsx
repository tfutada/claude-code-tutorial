"use client"

import { useState, useEffect } from "react"
import Nav from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function UseEffectExample() {
  // Example 1: Run on every render
  const [count, setCount] = useState(0)

  // Example 2: Run once on mount
  const [mountTime, setMountTime] = useState("")

  // Example 3: Run when dependency changes
  const [userId, setUserId] = useState(1)
  const [userData, setUserData] = useState<any>(null)

  // Example 4: Cleanup function
  const [seconds, setSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Example 5: Multiple effects
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  // Example 6: Async data fetching
  const [posts, setPosts] = useState<any[]>([])

  // Effect 1: Runs on EVERY render (no dependency array)
  // No state update to avoid infinite loop - just logs to demonstrate
  useEffect(() => {
    console.log("Effect 1: Runs on every render - count is", count)
  })

  // Effect 2: Runs ONCE on mount (empty dependency array)
  useEffect(() => {
    const time = new Date().toLocaleTimeString("ja-JP")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMountTime(time)
    console.log("Effect 2: Runs only once on mount at", time)
  }, [])

  // Effect 3: Runs when userId changes
  useEffect(() => {
    if (!userId) return

    console.log(`Effect 3: Re-running because userId changed to ${userId}`)

    let cancelled = false

    // Start loading by clearing userData first (loading derived from !userData)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserData(null)

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setUserData(data)
          console.log(`Effect 3: Fetched data for user ${userId}`)
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error(err)
        }
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  // Derive loading state instead of storing it
  const loading = userData === null

  // Effect 4: Cleanup with setInterval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      console.log("Effect 4: Timer started - setInterval created")
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }

    // Cleanup function: runs before next effect and on unmount
    return () => {
      if (interval) {
        console.log("Effect 4: Cleanup - clearInterval called")
        clearInterval(interval)
      }
    }
  }, [isTimerRunning])

  // Effect 5: Window resize listener with cleanup
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      console.log(`Effect 5: Window resized to ${window.innerWidth}px`)
    }

    console.log("Effect 5: Event listener added on mount")
    window.addEventListener("resize", handleResize)

    // Cleanup: remove event listener
    return () => {
      console.log("Effect 5: Cleanup - Event listener removed")
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Effect 6: Fetch posts on mount
  useEffect(() => {
    console.log("Effect 6: Starting async data fetch")
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=3")
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        console.log("Effect 6: Posts fetched successfully")
      })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">useEffect <span className="text-primary">Examples</span></h1>

        <div className="mb-6 p-4 bg-muted border rounded-lg">
          <p className="font-semibold">💡 Open Browser Console</p>
          <p className="text-sm text-muted-foreground">Press F12 to see console logs showing when each effect runs.</p>
        </div>

        {/* Example 1: Every Render */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Run on Every Render</CardTitle>
            <CardDescription>
              No dependency array = runs after every render. Usually avoid this pattern!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={() => setCount(count + 1)}>
                  Increment Count: {count}
                </Button>
                <span className="text-sm text-muted-foreground">
                  Check console - effect logs on every click!
                </span>
              </div>
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`useEffect(() => {
  console.log("Runs on every render")
  // No dependency array!
})`}
            </pre>
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
              ⚠️ Warning: Without dependencies, this effect runs on EVERY render.
              If you update state inside, it causes infinite loop!
            </div>
          </CardContent>
        </Card>

        {/* Example 2: Mount Only */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Run Once on Mount</CardTitle>
            <CardDescription>
              Empty dependency array [] = runs only once after initial render.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold">Component mounted at:</p>
              <p className="text-2xl font-mono mt-2">{mountTime}</p>
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`useEffect(() => {
  console.log("Runs only once on mount")
  // Initialize, fetch data, setup subscriptions
}, [])  // Empty dependency array`}
            </pre>
            <div className="mt-4 p-3 bg-muted border rounded-lg text-sm">
              💡 Common use: Initial data fetching, setting up subscriptions
            </div>
          </CardContent>
        </Card>

        {/* Example 3: Dependency Changes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Run When Dependency Changes</CardTitle>
            <CardDescription>
              Dependencies [dep] = runs when dep changes. Most common pattern!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(id => (
                  <Button
                    key={id}
                    onClick={() => setUserId(id)}
                    variant={userId === id ? "default" : "outline"}
                  >
                    User {id}
                  </Button>
                ))}
              </div>
              {loading ? (
                <div className="p-4 bg-muted rounded-lg">Loading...</div>
              ) : userData ? (
                <div className="p-4 bg-muted border rounded-lg">
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">{userData.phone}</p>
                </div>
              ) : null}
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`useEffect(() => {
  fetch(\`/api/users/\${userId}\`)
    .then(res => res.json())
    .then(data => setUserData(data))
}, [userId])  // Re-run when userId changes`}
            </pre>
          </CardContent>
        </Card>

        {/* Example 4: Cleanup Function */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Cleanup Function (Timer)</CardTitle>
            <CardDescription>
              Return cleanup function to clear timers, cancel requests, remove listeners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-mono">{seconds}s</span>
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  variant={isTimerRunning ? "destructive" : "default"}
                >
                  {isTimerRunning ? "Stop" : "Start"} Timer
                </Button>
                <Button
                  onClick={() => setSeconds(0)}
                  variant="secondary"
                >
                  Reset
                </Button>
              </div>
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`useEffect(() => {
  const interval = setInterval(() => {
    setSeconds(prev => prev + 1)
  }, 1000)

  // Cleanup: runs before next effect and on unmount
  return () => {
    clearInterval(interval)
  }
}, [isTimerRunning])`}
            </pre>
            <div className="mt-4 p-3 bg-muted border rounded-lg text-sm">
              💡 Cleanup prevents memory leaks. Always clean up timers, subscriptions, listeners!
            </div>
          </CardContent>
        </Card>

        {/* Example 5: Event Listener */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Event Listener with Cleanup</CardTitle>
            <CardDescription>
              Setup event listener on mount, remove on unmount.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current window width:</p>
              <p className="text-2xl font-mono">{windowWidth}px</p>
              <p className="text-sm text-muted-foreground mt-2">Try resizing your browser window!</p>
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth)

  window.addEventListener("resize", handleResize)

  // Cleanup: remove listener on unmount
  return () => {
    window.removeEventListener("resize", handleResize)
  }
}, [])`}
            </pre>
          </CardContent>
        </Card>

        {/* Example 6: Async Data Fetching */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Async Data Fetching Pattern</CardTitle>
            <CardDescription>
              Fetch data on mount. Common pattern for client-side data loading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {posts.length === 0 ? (
                <p className="text-muted-foreground">Loading posts...</p>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{post.body.substring(0, 100)}...</p>
                  </div>
                ))
              )}
            </div>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`useEffect(() => {
  fetch("https://api.example.com/posts")
    .then(res => res.json())
    .then(data => setPosts(data))
}, [])

// Or with async/await:
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch("https://api.example.com/posts")
    const data = await res.json()
    setPosts(data)
  }
  fetchData()
}, [])`}
            </pre>
          </CardContent>
        </Card>

        {/* Key Concepts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎯 Key Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Timing</strong>: useEffect runs AFTER render (non-blocking)</li>
              <li><strong>Dependencies</strong>: Only include values used inside the effect</li>
              <li><strong>Cleanup</strong>: Return function to cleanup subscriptions/timers/listeners</li>
              <li><strong>Infinite loops</strong>: Be careful with state updates inside effects</li>
              <li><strong>Multiple effects</strong>: Split different concerns into separate useEffect calls</li>
              <li><strong>Async</strong>: Can&apos;t make useEffect callback async directly, use inner async function</li>
            </ul>
          </CardContent>
        </Card>

        {/* Common Pitfalls */}
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Common Pitfalls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">❌ Missing dependencies:</p>
                <pre className="mt-1 p-2 bg-muted rounded-lg font-mono">useEffect(() =&gt; doSomething(userId), [])  // userId is missing!</pre>
              </div>
              <div>
                <p className="font-semibold">❌ Infinite loop:</p>
                <pre className="mt-1 p-2 bg-muted rounded-lg font-mono">useEffect(() =&gt; setCount(count + 1), [count])  // Loops forever!</pre>
              </div>
              <div>
                <p className="font-semibold">❌ Forgetting cleanup:</p>
                <pre className="mt-1 p-2 bg-muted rounded-lg font-mono">useEffect(() =&gt; setInterval(fn, 1000), [])  // Memory leak!</pre>
              </div>
              <div>
                <p className="font-semibold">❌ Async callback directly:</p>
                <pre className="mt-1 p-2 bg-muted rounded-lg font-mono">useEffect(async () =&gt; await fetch(...), [])  // Wrong!</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

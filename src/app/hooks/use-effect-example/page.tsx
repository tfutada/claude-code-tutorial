"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function UseEffectExample() {
  // Example 1: Run on every render
  const [count, setCount] = useState(0)
  const [renderCount, setRenderCount] = useState(0)

  // Example 2: Run once on mount
  const [mountTime, setMountTime] = useState("")

  // Example 3: Run when dependency changes
  const [userId, setUserId] = useState(1)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Example 4: Cleanup function
  const [seconds, setSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Example 5: Multiple effects
  const [windowWidth, setWindowWidth] = useState(0)

  // Example 6: Async data fetching
  const [posts, setPosts] = useState<any[]>([])

  // Effect 1: Runs on EVERY render (no dependency array)
  // Safety limit to prevent infinite loop while still demonstrating the concept
  useEffect(() => {
    if (renderCount < 5) {
      setRenderCount(prev => prev + 1)
      console.log("Effect 1: Component rendered")
    }
  })

  // Effect 2: Runs ONCE on mount (empty dependency array)
  useEffect(() => {
    const time = new Date().toLocaleTimeString("ja-JP")
    setMountTime(time)
    console.log("Effect 2: Component mounted at", time)
  }, [])

  // Effect 3: Runs when userId changes
  useEffect(() => {
    if (userId) {
      setLoading(true)
      console.log("Effect 3: Fetching user", userId)

      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          setUserData(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [userId])

  // Effect 4: Cleanup with setInterval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      console.log("Effect 4: Starting timer")
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }

    // Cleanup function: runs before next effect and on unmount
    return () => {
      if (interval) {
        console.log("Effect 4: Cleaning up timer")
        clearInterval(interval)
      }
    }
  }, [isTimerRunning])

  // Effect 5: Window resize listener with cleanup
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    console.log("Effect 5: Adding resize listener")
    window.addEventListener("resize", handleResize)

    // Cleanup: remove event listener
    return () => {
      console.log("Effect 5: Removing resize listener")
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Effect 6: Fetch posts on mount
  useEffect(() => {
    console.log("Effect 6: Fetching posts")
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=3")
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-8">useEffect Examples</h1>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-semibold">💡 Open Browser Console</p>
        <p className="text-sm">Press F12 to see console logs showing when each effect runs.</p>
      </div>

      {/* Example 1: Every Render */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">1. Run on Every Render</h2>
        <p className="text-gray-600 mb-4">
          No dependency array = runs after every render. Usually avoid this pattern!
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Increment Count: {count}
            </button>
            <span className="text-sm text-gray-500">
              This component has rendered {renderCount} times (capped at 5 to prevent crash)
            </span>
          </div>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
{`useEffect(() => {
  console.log("Runs on every render")
  // No dependency array!
})`}
        </pre>
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
          ⚠️ Warning: Without dependencies, this effect runs on EVERY render.
          If you update state inside, it causes infinite loop! (capped at 5 for demo safety)
        </div>
      </section>

      {/* Example 2: Mount Only */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">2. Run Once on Mount</h2>
        <p className="text-gray-600 mb-4">
          Empty dependency array [] = runs only once after initial render.
        </p>
        <div className="p-4 bg-green-50 rounded">
          <p className="font-semibold">Component mounted at:</p>
          <p className="text-2xl font-mono mt-2">{mountTime}</p>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
{`useEffect(() => {
  console.log("Runs only once on mount")
  // Initialize, fetch data, setup subscriptions
}, [])  // Empty dependency array`}
        </pre>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          💡 Common use: Initial data fetching, setting up subscriptions
        </div>
      </section>

      {/* Example 3: Dependency Changes */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">3. Run When Dependency Changes</h2>
        <p className="text-gray-600 mb-4">
          Dependencies [dep] = runs when dep changes. Most common pattern!
        </p>
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(id => (
              <button
                key={id}
                onClick={() => setUserId(id)}
                className={`px-4 py-2 rounded ${
                  userId === id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                User {id}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="p-4 bg-gray-100 rounded">Loading...</div>
          ) : userData ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-lg">{userData.name}</h3>
              <p className="text-sm text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-600">{userData.phone}</p>
            </div>
          ) : null}
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`useEffect(() => {
  fetch(\`/api/users/\${userId}\`)
    .then(res => res.json())
    .then(data => setUserData(data))
}, [userId])  // Re-run when userId changes`}
        </pre>
      </section>

      {/* Example 4: Cleanup Function */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">4. Cleanup Function (Timer)</h2>
        <p className="text-gray-600 mb-4">
          Return cleanup function to clear timers, cancel requests, remove listeners.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono">{seconds}s</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-4 py-2 rounded text-white ${
                isTimerRunning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isTimerRunning ? "Stop" : "Start"} Timer
            </button>
            <button
              onClick={() => setSeconds(0)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
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
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          💡 Cleanup prevents memory leaks. Always clean up timers, subscriptions, listeners!
        </div>
      </section>

      {/* Example 5: Event Listener */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">5. Event Listener with Cleanup</h2>
        <p className="text-gray-600 mb-4">
          Setup event listener on mount, remove on unmount.
        </p>
        <div className="p-4 bg-purple-50 rounded">
          <p className="text-sm text-gray-600">Current window width:</p>
          <p className="text-2xl font-mono">{windowWidth}px</p>
          <p className="text-sm text-gray-500 mt-2">Try resizing your browser window!</p>
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth)

  window.addEventListener("resize", handleResize)

  // Cleanup: remove listener on unmount
  return () => {
    window.removeEventListener("resize", handleResize)
  }
}, [])`}
        </pre>
      </section>

      {/* Example 6: Async Data Fetching */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">6. Async Data Fetching Pattern</h2>
        <p className="text-gray-600 mb-4">
          Fetch data on mount. Common pattern for client-side data loading.
        </p>
        <div className="space-y-2">
          {posts.length === 0 ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{post.body.substring(0, 100)}...</p>
              </div>
            ))
          )}
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
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
      </section>

      {/* Key Concepts */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🎯 Key Concepts</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Timing</strong>: useEffect runs AFTER render (non-blocking)</li>
          <li><strong>Dependencies</strong>: Only include values used inside the effect</li>
          <li><strong>Cleanup</strong>: Return function to cleanup subscriptions/timers/listeners</li>
          <li><strong>Infinite loops</strong>: Be careful with state updates inside effects</li>
          <li><strong>Multiple effects</strong>: Split different concerns into separate useEffect calls</li>
          <li><strong>Async</strong>: Can't make useEffect callback async directly, use inner async function</li>
        </ul>
      </section>

      {/* Common Pitfalls */}
      <section className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">⚠️ Common Pitfalls</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">❌ Missing dependencies:</p>
            <pre className="mt-1 p-2 bg-white rounded">useEffect(() =&gt; doSomething(userId), [])  // userId is missing!</pre>
          </div>
          <div>
            <p className="font-semibold">❌ Infinite loop:</p>
            <pre className="mt-1 p-2 bg-white rounded">useEffect(() =&gt; setCount(count + 1), [count])  // Loops forever!</pre>
          </div>
          <div>
            <p className="font-semibold">❌ Forgetting cleanup:</p>
            <pre className="mt-1 p-2 bg-white rounded">useEffect(() =&gt; setInterval(fn, 1000), [])  // Memory leak!</pre>
          </div>
          <div>
            <p className="font-semibold">❌ Async callback directly:</p>
            <pre className="mt-1 p-2 bg-white rounded">useEffect(async () =&gt; await fetch(...), [])  // Wrong!</pre>
          </div>
        </div>
      </section>
    </div>
  )
}

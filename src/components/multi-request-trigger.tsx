"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface RequestLog {
  id: number
  status: "pending" | "loading" | "success" | "error"
  startTime: number
  endTime?: number
  duration?: number
}

export default function MultiRequestTrigger() {
  const [requests, setRequests] = useState<RequestLog[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const triggerRequest = async (id: number) => {
    const startTime = Date.now()

    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "loading" as const, startTime } : req))
    )

    try {
      // Fetch the slow RSC page with cache-busting
      const cacheBuster = `?t=${Date.now()}&req=${id}`
      const response = await fetch(`/rsc-demo/slow${cacheBuster}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000

      if (response.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "success" as const, endTime, duration } : req
          )
        )
      } else {
        throw new Error("Request failed")
      }
    } catch (error) {
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "error" as const, endTime, duration } : req
        )
      )
    }
  }

  const simulateMultipleUsers = async (count: number) => {
    setIsRunning(true)

    // Initialize request logs
    const initialRequests = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      status: "pending" as const,
      startTime: 0,
    }))
    setRequests(initialRequests)

    // Trigger all requests simultaneously
    await Promise.all(initialRequests.map((req) => triggerRequest(req.id)))

    setIsRunning(false)
  }

  const reset = () => {
    setRequests([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulate Multiple Users</CardTitle>
        <CardDescription>
          Trigger multiple concurrent requests to the slow RSC endpoint.
          Watch how they queue up due to Node.js single-threading.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => simulateMultipleUsers(3)}
            disabled={isRunning}
            variant="default"
          >
            Simulate 3 Users
          </Button>
          <Button
            onClick={() => simulateMultipleUsers(5)}
            disabled={isRunning}
            variant="default"
          >
            Simulate 5 Users
          </Button>
          <Button
            onClick={() => simulateMultipleUsers(10)}
            disabled={isRunning}
            variant="destructive"
          >
            Simulate 10 Users (!)
          </Button>
          <Button onClick={reset} variant="outline" disabled={isRunning}>
            Reset
          </Button>
        </div>

        {requests.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Request Timeline:</h3>
            <div className="space-y-1">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    req.status === "pending"
                      ? "bg-gray-100 dark:bg-gray-800"
                      : req.status === "loading"
                      ? "bg-blue-100 dark:bg-blue-900/20 animate-pulse"
                      : req.status === "success"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-red-100 dark:bg-red-900/20"
                  }`}
                >
                  <span className="font-mono">
                    User {req.id}
                    {req.status === "loading" && " - Loading..."}
                    {req.status === "success" && " - ✓"}
                    {req.status === "error" && " - ✗"}
                  </span>
                  {req.duration && (
                    <span className="font-mono text-xs">
                      {req.duration.toFixed(2)}s
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!isRunning && requests.every((r) => r.status === "success" || r.status === "error") && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 mt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Notice:</strong> Each request took ~5-10 seconds. If they ran in parallel on separate servers,
                  total time would be ~5-10s. But with single-threaded Node.js blocking, they queued up sequentially.
                  Total time ≈ {Math.max(...requests.map(r => r.duration || 0)).toFixed(2)}s
                  (requests processed one after another).
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

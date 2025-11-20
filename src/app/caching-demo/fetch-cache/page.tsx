import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Demo: Different fetch cache options in the same page
// Using httpbin.org for reliable responses

async function getCachedData() {
  // Force cache - always use cached data
  try {
    const res = await fetch('https://httpbin.org/uuid', {
      cache: 'force-cache'
    })
    const data = await res.json()
    return {
      type: 'force-cache',
      timestamp: new Date().toISOString(),
      uuid: data.uuid,
      note: 'Cached until revalidation',
    }
  } catch {
    return {
      type: 'force-cache',
      timestamp: new Date().toISOString(),
      uuid: 'fetch-failed',
      note: 'Cached until revalidation',
    }
  }
}

async function getFreshData() {
  // No store - always fetch fresh
  try {
    const res = await fetch('https://httpbin.org/uuid', {
      cache: 'no-store'
    })
    const data = await res.json()
    return {
      type: 'no-store',
      timestamp: new Date().toISOString(),
      uuid: data.uuid,
      note: 'Fresh on every request',
    }
  } catch {
    return {
      type: 'no-store',
      timestamp: new Date().toISOString(),
      uuid: 'fetch-failed',
      note: 'Fresh on every request',
    }
  }
}

async function getRevalidatedData() {
  // Revalidate after 10 seconds for demo purposes
  try {
    const res = await fetch('https://httpbin.org/uuid', {
      next: { revalidate: 10 }
    })
    const data = await res.json()
    return {
      type: 'revalidate: 10',
      timestamp: new Date().toISOString(),
      uuid: data.uuid,
      note: 'Stale-while-revalidate after 10s',
    }
  } catch {
    return {
      type: 'revalidate: 10',
      timestamp: new Date().toISOString(),
      uuid: 'fetch-failed',
      note: 'Stale-while-revalidate after 10s',
    }
  }
}

export default async function FetchCachePage() {
  const [cached, fresh, revalidated] = await Promise.all([
    getCachedData(),
    getFreshData(),
    getRevalidatedData(),
  ])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/caching-demo" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Caching Demo
      </Link>

      <h1 className="text-3xl font-bold mb-4">Fetch Cache Options</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>fetch() Cache Options</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Option 1: Force cache (default in static rendering)
fetch(url, { cache: 'force-cache' })

// Option 2: No cache - always fresh
fetch(url, { cache: 'no-store' })

// Option 3: Time-based revalidation
fetch(url, { next: { revalidate: 10 } })

// Option 4: Tag-based for on-demand revalidation
fetch(url, { next: { tags: ['products'] } })`}
            </pre>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                force-cache
                <Badge variant="secondary">Cached</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <p className="font-mono break-all">{cached.timestamp}</p>
              <p className="font-mono break-all text-gray-400 mt-1">UUID: {cached.uuid}</p>
              <p className="text-gray-500 mt-2">{cached.note}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                no-store
                <Badge variant="destructive">Fresh</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <p className="font-mono break-all">{fresh.timestamp}</p>
              <p className="font-mono break-all text-gray-400 mt-1">UUID: {fresh.uuid}</p>
              <p className="text-gray-500 mt-2">{fresh.note}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                revalidate: 10
                <Badge>ISR</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <p className="font-mono break-all">{revalidated.timestamp}</p>
              <p className="font-mono break-all text-gray-400 mt-1">UUID: {revalidated.uuid}</p>
              <p className="text-gray-500 mt-2">{revalidated.note}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>fetchCache Route Config</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Override ALL fetch calls in this route
export const fetchCache = 'force-no-store'

// Options:
// 'auto'            - default behavior
// 'default-cache'   - cache by default
// 'only-cache'      - error if any uses no-store
// 'force-cache'     - force all to cache
// 'default-no-store' - no-store by default
// 'only-no-store'   - error if any uses cache
// 'force-no-store'  - force all to no-store`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important: Cache Behavior by Rendering Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-green-500 pl-4">
                <strong>Static Rendering (default)</strong>
                <p className="text-gray-600">fetch() with no options → cached in Data Cache</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <strong>Dynamic Rendering</strong>
                <p className="text-gray-600">fetch() with no options → NOT cached (always fresh)</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded mt-4">
                <strong>Note:</strong> Using Dynamic APIs (cookies, headers, searchParams)
                automatically opts the route into dynamic rendering.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

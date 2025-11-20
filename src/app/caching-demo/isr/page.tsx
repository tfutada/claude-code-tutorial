import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ISR - Incremental Static Regeneration
// Revalidate every 10 seconds
export const revalidate = 10

async function getData() {
  const timestamp = new Date().toISOString()

  return {
    timestamp,
    message: 'This data revalidates every 10 seconds',
  }
}

export default async function ISRPage() {
  const data = await getData()

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/caching-demo" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Caching Demo
      </Link>

      <h1 className="text-3xl font-bold mb-4">ISR - Incremental Static Regeneration</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configuration
              <Badge>Revalidate: 10s</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Revalidate every 10 seconds
export const revalidate = 10

// Options:
// false  - cache forever (default)
// 0      - always dynamic
// number - revalidate after N seconds

export default async function Page() {
  const data = await getData()
  return <div>{data.message}</div>
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Render Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Timestamp:</strong> {data.timestamp}</p>
              <p><strong>Message:</strong> {data.message}</p>
              <p className="text-sm text-gray-500 mt-4">
                Wait 10+ seconds and refresh - the timestamp will update.
                During the 10s window, you get cached data instantly.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How Stale-While-Revalidate Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>First request: fetch data, cache result</li>
              <li>Within 10s: serve cached data instantly</li>
              <li>After 10s: serve stale data, trigger background revalidation</li>
              <li>Next request: serve fresh data</li>
            </ol>

            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded text-sm">
              <strong>Key insight:</strong> Users always get fast responses.
              Revalidation happens in the background.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fetch-level Revalidation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Per-fetch revalidation (overrides page-level)
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // 1 hour
})

// The lowest revalidate value in a route wins
// Page: 60s, Fetch: 30s → Route revalidates at 30s`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Blog posts with occasional updates</li>
              <li>E-commerce product pages</li>
              <li>News sites with periodic refresh</li>
              <li>Any content that can be slightly stale</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

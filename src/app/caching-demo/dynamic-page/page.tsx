import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Force dynamic rendering - render on every request
export const dynamic = 'force-dynamic'

async function getData() {
  const timestamp = new Date().toISOString()

  return {
    timestamp,
    message: 'This data is fetched on every request',
  }
}

export default async function DynamicPage() {
  const data = await getData()

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/caching-demo" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Caching Demo
      </Link>

      <h1 className="text-3xl font-bold mb-4">Force Dynamic Rendering</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configuration
              <Badge variant="destructive">No Cache</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Force dynamic - render every request
export const dynamic = 'force-dynamic'

// This is equivalent to:
// export const fetchCache = 'force-no-store'
// + setting every fetch to { cache: 'no-store' }

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
                Refresh the page - the timestamp changes every time!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>dynamic Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <code className="font-bold">&apos;auto&apos;</code> (default)
                <p className="text-sm text-gray-600">Cache as much as possible, allow dynamic when needed</p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <code className="font-bold">&apos;force-dynamic&apos;</code>
                <p className="text-sm text-gray-600">Always render at request time, skip all caches</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <code className="font-bold">&apos;force-static&apos;</code>
                <p className="text-sm text-gray-600">Force static, cookies/headers return empty</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <code className="font-bold">&apos;error&apos;</code>
                <p className="text-sm text-gray-600">Error if any dynamic API is used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Real-time data (stock prices, live scores)</li>
              <li>User-specific content (dashboards)</li>
              <li>Pages using cookies, headers, searchParams</li>
              <li>Data that must always be fresh</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

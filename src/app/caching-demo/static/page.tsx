import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// No config = static by default
// This page is rendered at build time and cached

async function getData() {
  // This fetch is cached by default (static rendering)
  const res = await fetch('https://httpbin.org/uuid')
  const data = await res.json()

  return {
    uuid: data.uuid,
    message: 'This UUID was fetched at build time',
  }
}

export default async function StaticPage() {
  const data = await getData()

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/caching-demo" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Caching Demo
      </Link>

      <h1 className="text-3xl font-bold mb-4">Static Rendering (Default)</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configuration
              <Badge variant="secondary">No config needed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// page.tsx - No exports needed for static
// Next.js defaults to static rendering

async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

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
              <p><strong>UUID:</strong> {data.uuid}</p>
              <p><strong>Message:</strong> {data.message}</p>
              <p className="text-sm text-gray-500 mt-4">
                Refresh the page - the UUID stays the same because this page is cached.
                (In dev mode, pages always render fresh)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Page is rendered at <strong>build time</strong></li>
              <li>HTML and RSC payload are cached in <strong>Full Route Cache</strong></li>
              <li>All fetch calls are cached in <strong>Data Cache</strong></li>
              <li>Served instantly to all users without server computation</li>
            </ul>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded text-sm">
              <strong>Note:</strong> In development mode, pages always render on each request.
              Build with <code>npm run build</code> and <code>npm start</code> to see caching behavior.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Marketing pages, blog posts, documentation</li>
              <li>Content that rarely changes</li>
              <li>Pages without user-specific data</li>
              <li>Maximum performance requirements</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

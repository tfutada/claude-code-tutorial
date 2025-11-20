import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CachingDemoPage() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Next.js Caching Mechanisms</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Understanding the 4 cache layers and route segment config options
      </p>

      {/* Cache Layers Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4 Cache Layers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-900">
                <th className="text-left p-3 font-semibold">Cache</th>
                <th className="text-left p-3 font-semibold">Location</th>
                <th className="text-left p-3 font-semibold">Duration</th>
                <th className="text-left p-3 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Request Memoization</td>
                <td className="p-3"><Badge variant="secondary">Server</Badge></td>
                <td className="p-3 text-gray-600 dark:text-gray-400">Per-request</td>
                <td className="p-3">Deduplicates identical fetch calls within a render pass</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Data Cache</td>
                <td className="p-3"><Badge variant="secondary">Server</Badge></td>
                <td className="p-3 text-gray-600 dark:text-gray-400">Persistent</td>
                <td className="p-3">Stores fetch results across requests and deployments</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Full Route Cache</td>
                <td className="p-3"><Badge variant="secondary">Server</Badge></td>
                <td className="p-3 text-gray-600 dark:text-gray-400">Persistent</td>
                <td className="p-3">Caches rendered HTML + RSC payload at build time</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Router Cache</td>
                <td className="p-3"><Badge variant="outline">Client</Badge></td>
                <td className="p-3 text-gray-600 dark:text-gray-400">Session</td>
                <td className="p-3">In-memory cache for instant navigation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Demo Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Interactive Demos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/caching-demo/static" className="block">
            <Card className="hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <CardTitle>Static (Default)</CardTitle>
                <CardDescription>Cached at build time</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`// No config needed
// Cached by default`}
                </code>
              </CardContent>
            </Card>
          </Link>

          <Link href="/caching-demo/dynamic-page" className="block">
            <Card className="hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <CardTitle>Force Dynamic</CardTitle>
                <CardDescription>Render every request</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`export const dynamic =
  'force-dynamic'`}
                </code>
              </CardContent>
            </Card>
          </Link>

          <Link href="/caching-demo/isr" className="block">
            <Card className="hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <CardTitle>ISR (Revalidate)</CardTitle>
                <CardDescription>Time-based revalidation</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`export const revalidate = 10
// Revalidate every 10s`}
                </code>
              </CardContent>
            </Card>
          </Link>

          <Link href="/caching-demo/fetch-cache" className="block">
            <Card className="hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <CardTitle>Fetch Options</CardTitle>
                <CardDescription>Per-request caching</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`fetch(url, {
  cache: 'no-store'
})`}
                </code>
              </CardContent>
            </Card>
          </Link>

          <Link href="/caching-demo/tags" className="block">
            <Card className="hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <CardTitle>Cache Tags</CardTitle>
                <CardDescription>On-demand revalidation</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`fetch(url, {
  next: { tags: ['posts'] }
})`}
                </code>
              </CardContent>
            </Card>
          </Link>

          <Link href="/caching-demo/no-cache" className="block">
            <Card className="hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <CardTitle>Full Opt-Out</CardTitle>
                <CardDescription>Disable all caching</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`export const dynamic =
  'force-dynamic'
export const revalidate = 0`}
                </code>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Route Segment Config Reference */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Route Segment Config Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Option</th>
                <th className="text-left p-2">Values</th>
                <th className="text-left p-2">Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">dynamic</td>
                <td className="p-2 font-mono text-xs">&apos;auto&apos; | &apos;force-dynamic&apos; | &apos;force-static&apos; | &apos;error&apos;</td>
                <td className="p-2 text-xs">Controls rendering strategy</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">revalidate</td>
                <td className="p-2 font-mono text-xs">false | 0 | number</td>
                <td className="p-2 text-xs">Sets revalidation interval (seconds)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">fetchCache</td>
                <td className="p-2 font-mono text-xs">&apos;auto&apos; | &apos;force-cache&apos; | &apos;force-no-store&apos; | ...</td>
                <td className="p-2 text-xs">Override fetch cache behavior</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">runtime</td>
                <td className="p-2 font-mono text-xs">&apos;nodejs&apos; | &apos;edge&apos;</td>
                <td className="p-2 text-xs">Select runtime environment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

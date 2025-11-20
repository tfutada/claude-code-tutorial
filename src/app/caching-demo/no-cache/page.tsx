import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// FULL OPT-OUT - Disable ALL caching
// This is what the RSC demo uses
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

async function getData() {
  const timestamp = new Date().toISOString()

  return {
    timestamp,
    message: 'All caching disabled - maximum freshness',
  }
}

export default async function NoCachePage() {
  const data = await getData()

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/caching-demo" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Caching Demo
      </Link>

      <h1 className="text-3xl font-bold mb-4">Full Cache Opt-Out</h1>

      <div className="space-y-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configuration
              <Badge variant="destructive">Maximum Opt-Out</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Disable ALL caching mechanisms
export const dynamic = 'force-dynamic'    // Always server render
export const revalidate = 0               // Never cache route
export const fetchCache = 'force-no-store' // Never cache fetches

// This combination:
// ❌ No Full Route Cache
// ❌ No Data Cache
// ❌ All fetches are fresh
// ✅ Only Request Memoization remains (per-request)`}
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
                Every refresh shows a new timestamp - nothing is cached.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Use All Three?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-red-500 pl-4">
                <code className="font-bold">dynamic = &apos;force-dynamic&apos;</code>
                <p className="text-gray-600">
                  Ensures the page renders on every request.
                  Opts out of Full Route Cache.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <code className="font-bold">revalidate = 0</code>
                <p className="text-gray-600">
                  Sets default fetch behavior to not cache.
                  Explicit signal: &quot;always fetch fresh&quot;.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <code className="font-bold">fetchCache = &apos;force-no-store&apos;</code>
                <p className="text-gray-600">
                  Overrides ANY fetch cache option.
                  Even <code>cache: &apos;force-cache&apos;</code> becomes <code>no-store</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redundancy Explained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded text-sm">
              <p className="mb-2">
                <strong>Q: Isn&apos;t this redundant?</strong>
              </p>
              <p>
                <strong>A: Partially.</strong> <code>dynamic = &apos;force-dynamic&apos;</code> alone
                sets <code>fetchCache = &apos;force-no-store&apos;</code> implicitly.
                But being explicit helps with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Code clarity - intent is obvious</li>
                <li>Future-proofing - behavior won&apos;t change</li>
                <li>Documentation - teaches all options</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚠️ When to Use (Rarely!)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Debugging caching issues</li>
              <li>Real-time critical data (trading, auctions)</li>
              <li>Highly personalized content</li>
              <li>Demo/educational purposes (like this!)</li>
            </ul>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded mt-4 text-sm">
              <strong>Warning:</strong> Full opt-out means every user request
              triggers server computation. This is expensive and slow at scale.
              Prefer ISR or cache tags for most use cases.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Better Alternatives</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// Instead of full opt-out, consider:

// 1. Short revalidation
export const revalidate = 5  // Fresh every 5 seconds

// 2. Cache tags with on-demand revalidation
fetch(url, { next: { tags: ['data'] } })
// Then: revalidateTag('data') when data changes

// 3. Partial dynamic
// Keep layout static, only page dynamic
export const dynamic = 'force-dynamic'
// (without fetchCache = 'force-no-store')`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

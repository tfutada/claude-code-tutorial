import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { revalidateTag } from 'next/cache'

// Tag-based caching demo
async function getPostsData() {
  // In real app:
  // const res = await fetch('https://api.example.com/posts', {
  //   next: { tags: ['posts'] }
  // })
  // return res.json()

  return {
    timestamp: new Date().toISOString(),
    posts: [
      { id: 1, title: 'First Post' },
      { id: 2, title: 'Second Post' },
    ],
  }
}

async function getUserData() {
  // In real app:
  // const res = await fetch('https://api.example.com/user', {
  //   next: { tags: ['user', 'profile'] }
  // })
  // return res.json()

  return {
    timestamp: new Date().toISOString(),
    user: { name: 'John Doe', email: 'john@example.com' },
  }
}

// Server Action to revalidate
async function revalidatePosts() {
  'use server'
  revalidateTag('posts', 'max')
}

async function revalidateUser() {
  'use server'
  revalidateTag('user', 'max')
}

export default async function TagsPage() {
  const [postsData, userData] = await Promise.all([
    getPostsData(),
    getUserData(),
  ])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/caching-demo" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Caching Demo
      </Link>

      <h1 className="text-3xl font-bold mb-4">Cache Tags & On-Demand Revalidation</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>How Cache Tags Work</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
{`// 1. Tag your fetch requests
const posts = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

const user = await fetch('https://api.example.com/user', {
  next: { tags: ['user', 'profile'] }
})

// 2. Revalidate by tag (in Server Action or Route Handler)
import { revalidateTag } from 'next/cache'

async function updatePost() {
  'use server'
  await db.post.update(...)
  revalidateTag('posts', 'max')  // Invalidate all 'posts' tagged fetches
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Demo Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Posts Data
                <Badge variant="secondary">tag: posts</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono mb-2">{postsData.timestamp}</p>
              <ul className="text-sm space-y-1">
                {postsData.posts.map(post => (
                  <li key={post.id}>• {post.title}</li>
                ))}
              </ul>
              <form action={revalidatePosts} className="mt-4">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Revalidate Posts
                </button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                User Data
                <Badge variant="secondary">tags: user, profile</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono mb-2">{userData.timestamp}</p>
              <div className="text-sm">
                <p>Name: {userData.user.name}</p>
                <p>Email: {userData.user.email}</p>
              </div>
              <form action={revalidateUser} className="mt-4">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Revalidate User
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>revalidatePath vs revalidateTag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-blue-500 pl-4">
                <code className="font-bold">revalidateTag(&apos;posts&apos;, &apos;max&apos;)</code>
                <p className="text-gray-600">
                  Invalidates all fetches tagged with &apos;posts&apos; across ALL routes.
                  Fine-grained control.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <code className="font-bold">revalidatePath(&apos;/blog&apos;)</code>
                <p className="text-gray-600">
                  Invalidates the entire route. Re-renders all components.
                  Broader invalidation.
                </p>
              </div>
            </div>

            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm mt-4 overflow-x-auto">
{`// In Server Action
import { revalidatePath, revalidateTag } from 'next/cache'

async function createPost() {
  'use server'
  await db.post.create(...)

  // Option 1: Revalidate specific tagged data (stale-while-revalidate)
  revalidateTag('posts', 'max')

  // Option 2: Revalidate entire path
  revalidatePath('/blog')

  // Option 3: Revalidate with layout
  revalidatePath('/blog', 'layout')
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to Use Cache Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>CMS content updates (webhook triggers revalidation)</li>
              <li>After form submissions that affect cached data</li>
              <li>E-commerce: revalidate &apos;products&apos; when inventory changes</li>
              <li>Social: revalidate &apos;user-123&apos; when profile updates</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import Nav from "@/components/nav";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

async function getPost(id: string): Promise<Post> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch post and comments in parallel
  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Nav />
      <div className="flex flex-1 items-center justify-center">
        <main className="flex w-full max-w-3xl flex-col gap-8 py-16 px-6">
          <a
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Blog
          </a>

          <article className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              {post.title}
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {post.body}
            </p>
          </article>

          <div className="flex flex-col gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Comments ({comments.length})
            </h2>

            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {comment.name}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-500">
                      {comment.email}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {comment.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import Image from "next/image";

// TypeScript types for NewsAPI response
interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

async function getTopHeadlines(): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not configured");
  }

  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`,
    {
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  );

  if (!res.ok) {
    throw new Error(`NewsAPI error: ${res.status} ${res.statusText}`);
  }

  const data: NewsAPIResponse = await res.json();

  if (data.status !== "ok") {
    throw new Error("NewsAPI returned error status");
  }

  return data.articles;
}

export default async function NewsPage() {
  const articles = await getTopHeadlines();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Logo
          </div>
          <div className="flex gap-6">
            <a href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Home
            </a>
            <a href="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              About
            </a>
            <a href="/news" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              News
            </a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 justify-center">
        <main className="w-full max-w-7xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Top Headlines
            </h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
              Latest news from around the United States
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <a
                key={`${article.url}-${index}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                {article.urlToImage && (
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                    <span className="font-medium">{article.source.name}</span>
                    <span>•</span>
                    <time>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </time>
                  </div>

                  <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {article.title}
                  </h2>

                  {article.description && (
                    <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {article.description}
                    </p>
                  )}

                  {article.author && (
                    <p className="mt-auto pt-3 text-xs text-zinc-500 dark:text-zinc-500">
                      By {article.author}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

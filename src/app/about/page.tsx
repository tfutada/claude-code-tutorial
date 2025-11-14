import Image from "next/image";
import Nav from "@/components/nav";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Nav />
      <div className="flex flex-1 items-center justify-center">
        <main className="flex w-full max-w-3xl flex-col gap-8 py-32 px-16">
          <div className="flex items-center gap-4">
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logo"
              width={120}
              height={24}
              priority
            />
          </div>

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            About Vercel
          </h1>

          <div className="flex flex-col gap-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <p>
              Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.
            </p>

            <p>
              Founded in 2015 and headquartered in San Francisco, Vercel has become the go-to platform for deploying and hosting web applications, particularly those built with modern JavaScript frameworks.
            </p>

            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-4">
              Key Features
            </h2>

            <ul className="list-disc list-inside space-y-2">
              <li>Instant deployments with Git integration</li>
              <li>Global edge network for optimal performance</li>
              <li>Automatic HTTPS and custom domains</li>
              <li>Serverless functions support</li>
              <li>Built-in analytics and monitoring</li>
              <li>Seamless Next.js integration</li>
            </ul>

            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-4">
              Next.js Framework
            </h2>

            <p>
              Vercel is also the creator of Next.js, the React framework for production. Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.
            </p>

            <div className="flex gap-4 mt-8">
              <a
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Vercel
              </a>
              <a
                className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

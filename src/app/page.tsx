import Image from "next/image";
import Counter from "@/components/counter";
import Nav from "@/components/nav";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <main className="w-full max-w-5xl py-16 sm:py-24">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-16 space-y-6">
            <Image
              className="dark:invert mb-4"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                React Hooks <span className="text-primary">Tutorial</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn React Hooks deeply with interactive examples and explanations.
                Master state management, side effects, and advanced patterns.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Interactive</Badge>
              <Badge variant="secondary">Hands-on</Badge>
              <Badge variant="secondary">Next.js 16</Badge>
              <Badge variant="secondary">React 19</Badge>
            </div>
          </div>

          {/* Hooks Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            <a href="/hooks/use-state-example" className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="space-y-3">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    useState
                  </CardTitle>
                  <CardDescription>
                    Basic state management, counters, forms, arrays, objects
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/hooks/use-effect-example" className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="space-y-3">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    useEffect
                  </CardTitle>
                  <CardDescription>
                    Side effects, data fetching, subscriptions, cleanup
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/hooks/use-context-example" className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="space-y-3">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    useContext
                  </CardTitle>
                  <CardDescription>
                    Global state, avoid prop drilling, theme & auth examples
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/hooks/advanced-hooks" className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="space-y-3">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Advanced Hooks
                  </CardTitle>
                  <CardDescription>
                    useRef, useMemo, useCallback, useReducer
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/hooks/custom-hooks-example" className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="space-y-3">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Custom Hooks
                  </CardTitle>
                  <CardDescription>
                    useLocalStorage, useFetch, useDebounce, useToggle, useWindowSize
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/async-examples" className="group">
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="space-y-3">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Async/Await Examples
                  </CardTitle>
                  <CardDescription>
                    I/O vs CPU tasks, Web Workers, chunking, performance
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <a
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={16}
                  height={16}
                />
                Deploy Now
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
            <Counter />
          </div>
        </main>
      </div>
    </div>
  );
}

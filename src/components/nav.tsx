import { ThemeToggle } from "./theme-toggle";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-foreground">
          React Hooks
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="/async-examples" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Async Examples
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

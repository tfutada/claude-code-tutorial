"use client"

import Nav from '@/components/nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ThemeProvider, useTheme } from "./theme-context"
import { UserProvider, useUser } from "./user-context"

// Child components that consume context
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-lg">Current theme: <strong>{theme}</strong></span>
        <Button onClick={toggleTheme}>
          Toggle Theme
        </Button>
      </div>
    </div>
  )
}

function ThemedBox() {
  const { theme } = useTheme()

  return (
    <div className={`p-6 rounded-lg border-2 ${
      theme === "light"
        ? "bg-background border-border"
        : "bg-muted border-border"
    }`}>
      <p className="font-semibold">This box changes based on theme!</p>
      <p className="text-sm text-muted-foreground mt-2">Theme: {theme}</p>
    </div>
  )
}

function NestedThemedComponent() {
  const { theme } = useTheme()

  return (
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-sm">
        🎨 Even deeply nested components can access theme: <strong>{theme}</strong>
      </p>
      <p className="text-xs mt-1 text-muted-foreground">
        No prop drilling needed!
      </p>
    </div>
  )
}

function UserProfile() {
  const { user, login, logout } = useUser()

  const handleLogin = () => {
    login({
      id: 1,
      name: "山田太郎",
      email: "taro@example.com",
      role: "admin"
    })
  }

  if (!user) {
    return (
      <div className="p-6 bg-muted rounded-lg">
        <p className="mb-4">Not logged in</p>
        <Button onClick={handleLogin} variant="default">
          Login
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-muted border-2 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Welcome, {user.name}!</h3>
      <p className="text-sm text-muted-foreground">Email: {user.email}</p>
      <p className="text-sm text-muted-foreground">Role: {user.role}</p>
      <Button onClick={logout} variant="destructive" className="mt-4">
        Logout
      </Button>
    </div>
  )
}

function UserSettings() {
  const { user, updateUser } = useUser()

  if (!user) {
    return <p className="text-muted-foreground italic">Login to see settings</p>
  }

  return (
    <div className="space-y-3">
      <Input
        type="text"
        value={user.name}
        onChange={(e) => updateUser({ name: e.target.value })}
        placeholder="Name"
      />
      <Input
        type="email"
        value={user.email}
        onChange={(e) => updateUser({ email: e.target.value })}
        placeholder="Email"
      />
      <p className="text-sm text-muted-foreground">
        Changes update immediately across all components!
      </p>
    </div>
  )
}

function UserBadge() {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm border">
      <span className="font-semibold">{user.name}</span>
      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
        {user.role}
      </Badge>
    </div>
  )
}

// Main component wrapped in providers
function UseContextContent() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-center">useContext <span className="text-primary">Examples</span></h1>

        <div className="mb-6 p-4 bg-muted border rounded-lg">
          <p className="font-semibold">💡 What is Context?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Context provides a way to pass data through the component tree without
            having to pass props down manually at every level (prop drilling).
          </p>
        </div>

      {/* Example 1: Theme Context */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. Theme Context (Simple)</CardTitle>
          <CardDescription>
            Share theme across components without prop drilling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ThemeToggle />
            <ThemedBox />
            <NestedThemedComponent />
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`// 1. Create context
const ThemeContext = createContext()

// 2. Wrap with provider
<ThemeProvider>
  <App />
</ThemeProvider>

// 3. Use in any child component
const { theme, toggleTheme } = useTheme()`}
          </pre>
        </CardContent>
      </Card>

      {/* Example 2: User Context */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2. User Context (Complex State)</CardTitle>
          <CardDescription>
            Manage user authentication state globally. All components see updates instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Profile Component:</h3>
              <UserProfile />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Settings Component:</h3>
              <UserSettings />
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">User Badge (from nested component):</p>
            <UserBadge />
          </div>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`// Define context type
interface UserContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

// Create provider with state
export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  // ... methods
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Context Creation Pattern */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. Context Creation Pattern</CardTitle>
          <CardDescription>
            Standard 4-step pattern for creating context with TypeScript.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`// Step 1: Define context type
interface MyContextType {
  value: string
  setValue: (v: string) => void
}

// Step 2: Create context
const MyContext = createContext<MyContextType | undefined>(undefined)

// Step 3: Create provider component
export function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState("")
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  )
}

// Step 4: Create custom hook with error handling
export function useMyContext() {
  const context = useContext(MyContext)
  if (context === undefined) {
    throw new Error("useMyContext must be used within MyProvider")
  }
  return context
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Multiple Contexts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>4. Multiple Contexts (Composition)</CardTitle>
          <CardDescription>
            You can nest multiple providers. This page uses both ThemeProvider and UserProvider!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono border overflow-x-auto">
{`// Nest providers
<ThemeProvider>
  <UserProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </UserProvider>
</ThemeProvider>

// Or use composition helper
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  )
}`}
          </pre>
        </CardContent>
      </Card>

      {/* When to Use Context */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>✅ When to Use Context</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li>Theme (dark/light mode)</li>
            <li>User authentication and profile</li>
            <li>Language/locale settings (i18n)</li>
            <li>Shopping cart in e-commerce</li>
            <li>Global UI state (modal, toast, sidebar)</li>
            <li>Data that many components need to access</li>
          </ul>
        </CardContent>
      </Card>

      {/* When NOT to Use Context */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>⚠️ When NOT to Use Context</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-sm">
            <li><strong>Frequently changing data</strong>: Context re-renders all consumers. Use state management lib instead (Redux, Zustand)</li>
            <li><strong>Passing props 1-2 levels down</strong>: Just use props! Context is for deeply nested components</li>
            <li><strong>Performance-critical data</strong>: Context doesn't optimize re-renders automatically</li>
            <li><strong>Everything</strong>: Don't make everything global. Keep state as local as possible</li>
          </ul>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Key Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Provider</strong>: Wraps components that need access to context</li>
            <li><strong>Consumer</strong>: Any component that calls useContext()</li>
            <li><strong>Re-renders</strong>: All consumers re-render when context value changes</li>
            <li><strong>Default value</strong>: Used only when no Provider is found above in tree</li>
            <li><strong>Custom hook</strong>: Wrap useContext in custom hook for better error messages</li>
            <li><strong>Composition</strong>: Multiple contexts can be nested/composed</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

// Export wrapped in providers
export default function UseContextExample() {
  return (
    <ThemeProvider>
      <UserProvider>
        <UseContextContent />
      </UserProvider>
    </ThemeProvider>
  )
}

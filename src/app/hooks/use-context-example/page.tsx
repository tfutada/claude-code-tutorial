"use client"

import Link from "next/link"
import { ThemeProvider, useTheme } from "./theme-context"
import { UserProvider, useUser } from "./user-context"

// Child components that consume context
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-lg">Current theme: <strong>{theme}</strong></span>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  )
}

function ThemedBox() {
  const { theme } = useTheme()

  return (
    <div className={`p-6 rounded-lg ${
      theme === "light"
        ? "bg-white border-2 border-gray-300 text-black"
        : "bg-gray-800 border-2 border-gray-600 text-white"
    }`}>
      <p className="font-semibold">This box changes based on theme!</p>
      <p className="text-sm mt-2">Theme: {theme}</p>
    </div>
  )
}

function NestedThemedComponent() {
  const { theme } = useTheme()

  return (
    <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded">
      <p className="text-sm">
        🎨 Even deeply nested components can access theme: <strong>{theme}</strong>
      </p>
      <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
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
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="mb-4">Not logged in</p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Welcome, {user.name}!</h3>
      <p className="text-sm text-gray-600">Email: {user.email}</p>
      <p className="text-sm text-gray-600">Role: {user.role}</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}

function UserSettings() {
  const { user, updateUser } = useUser()

  if (!user) {
    return <p className="text-gray-500 italic">Login to see settings</p>
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={user.name}
        onChange={(e) => updateUser({ name: e.target.value })}
        className="w-full px-4 py-2 border rounded"
        placeholder="Name"
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => updateUser({ email: e.target.value })}
        className="w-full px-4 py-2 border rounded"
        placeholder="Email"
      />
      <p className="text-sm text-gray-600">
        Changes update immediately across all components!
      </p>
    </div>
  )
}

function UserBadge() {
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-sm">
      <span className="font-semibold">{user.name}</span>
      <span className={`px-2 py-0.5 rounded text-xs ${
        user.role === "admin" ? "bg-red-500 text-white" : "bg-gray-300"
      }`}>
        {user.role}
      </span>
    </div>
  )
}

// Main component wrapped in providers
function UseContextContent() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← ホームに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-8">useContext Examples</h1>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-semibold">💡 What is Context?</p>
        <p className="text-sm mt-1">
          Context provides a way to pass data through the component tree without
          having to pass props down manually at every level (prop drilling).
        </p>
      </div>

      {/* Example 1: Theme Context */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">1. Theme Context (Simple)</h2>
        <p className="text-gray-600 mb-4">
          Share theme across components without prop drilling.
        </p>
        <div className="space-y-4">
          <ThemeToggle />
          <ThemedBox />
          <NestedThemedComponent />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`// 1. Create context
const ThemeContext = createContext()

// 2. Wrap with provider
<ThemeProvider>
  <App />
</ThemeProvider>

// 3. Use in any child component
const { theme, toggleTheme } = useTheme()`}
        </pre>
      </section>

      {/* Example 2: User Context */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">2. User Context (Complex State)</h2>
        <p className="text-gray-600 mb-4">
          Manage user authentication state globally. All components see updates instantly.
        </p>
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
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm font-semibold mb-2">User Badge (from nested component):</p>
          <UserBadge />
        </div>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
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
      </section>

      {/* Context Creation Pattern */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">3. Context Creation Pattern</h2>
        <p className="text-gray-600 mb-4">
          Standard 4-step pattern for creating context with TypeScript.
        </p>
        <pre className="p-4 bg-gray-100 rounded text-sm overflow-x-auto">
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
      </section>

      {/* Multiple Contexts */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">4. Multiple Contexts (Composition)</h2>
        <p className="text-gray-600 mb-4">
          You can nest multiple providers. This page uses both ThemeProvider and UserProvider!
        </p>
        <pre className="p-4 bg-gray-100 rounded text-sm overflow-x-auto">
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
      </section>

      {/* When to Use Context */}
      <section className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">✅ When to Use Context</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Theme (dark/light mode)</li>
          <li>User authentication and profile</li>
          <li>Language/locale settings (i18n)</li>
          <li>Shopping cart in e-commerce</li>
          <li>Global UI state (modal, toast, sidebar)</li>
          <li>Data that many components need to access</li>
        </ul>
      </section>

      {/* When NOT to Use Context */}
      <section className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">⚠️ When NOT to Use Context</h2>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li><strong>Frequently changing data</strong>: Context re-renders all consumers. Use state management lib instead (Redux, Zustand)</li>
          <li><strong>Passing props 1-2 levels down</strong>: Just use props! Context is for deeply nested components</li>
          <li><strong>Performance-critical data</strong>: Context doesn't optimize re-renders automatically</li>
          <li><strong>Everything</strong>: Don't make everything global. Keep state as local as possible</li>
        </ul>
      </section>

      {/* Key Concepts */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🎯 Key Concepts</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Provider</strong>: Wraps components that need access to context</li>
          <li><strong>Consumer</strong>: Any component that calls useContext()</li>
          <li><strong>Re-renders</strong>: All consumers re-render when context value changes</li>
          <li><strong>Default value</strong>: Used only when no Provider is found above in tree</li>
          <li><strong>Custom hook</strong>: Wrap useContext in custom hook for better error messages</li>
          <li><strong>Composition</strong>: Multiple contexts can be nested/composed</li>
        </ul>
      </section>
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

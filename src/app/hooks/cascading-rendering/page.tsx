"use client";

import { useState } from "react";

function GrandChild() {
  console.log("GrandChild re-rendered");
  return (
    <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded">
      <p className="text-purple-800 dark:text-purple-200">Grandchild (no props)</p>
      <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
        Check console: I re-render even though I have no props!
      </p>
    </div>
  );
}

function Child({ value }: { value: number }) {
  console.log("Child re-rendered with value:", value);
  return (
    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded space-y-4">
      <p className="text-blue-800 dark:text-blue-200">Child value: {value}</p>
      <GrandChild />
    </div>
  );
}

function Parent() {
  const [count, setCount] = useState(0);
  console.log("Parent re-rendered with count:", count);

  return (
    <div className="p-4 bg-green-100 dark:bg-green-900 rounded space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Increment
        </button>
        <span className="text-green-800 dark:text-green-200 font-bold">
          Count: {count}
        </span>
      </div>

      {/* Child and Grandchild will re-render when count changes */}
      <Child value={count} />
    </div>
  );
}

export default function CascadingRenderingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Cascading Rendering in React</h1>

      <div className="space-y-6">
        {/* Explanation */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              When a parent component re-renders, <strong>all its children re-render</strong> by default,
              even if their props haven&apos;t changed.
            </p>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Key Insight: GrandChild has no props, but still re-renders when Parent&apos;s count changes!
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Parent&apos;s <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">count</code> state changes</li>
              <li>Parent re-renders</li>
              <li>Child re-renders (receives new <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">value</code> prop)</li>
              <li>GrandChild re-renders (even though it has no props!)</li>
            </ul>
          </div>
        </section>

        {/* Optimization Hint */}
        <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-300">
            Optimization Options
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">React.memo()</code> - Prevents re-render if props unchanged
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">useMemo()</code> - Memoize child component
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">useCallback()</code> - Prevent function prop recreation
            </li>
          </ul>
          <p className="mt-3 text-sm text-yellow-700 dark:text-yellow-400">
            Note: Only optimize when you have performance issues. Premature optimization can make code harder to maintain.
          </p>
        </section>

        {/* Interactive Demo */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Interactive Demo</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Open browser console (F12) to see render logs, then click Increment.
          </p>

          <button
            onClick={() => setShowDemo(!showDemo)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showDemo ? "Hide Demo" : "Show Demo"}
          </button>

          {showDemo && <Parent />}
        </section>

        {/* Code Example */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Code Example</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-sm">
            <code>{`function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>

      {/* Child and Grandchild will re-render when count changes */}
      <Child value={count} />
    </div>
  );
}

function Child({ value }) {
  return (
    <div>
      <p>Child value: {value}</p>
      <GrandChild />
    </div>
  );
}

function GrandChild() {
  console.log("GrandChild re-rendered");
  return <p>Grandchild</p>;
}`}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}

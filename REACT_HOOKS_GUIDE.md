# React Hooks Deep Dive

Complete guide with practical examples to understand React Hooks deeply.

## Table of Contents
1. [useState](#1-usestate)
2. [useEffect](#2-useeffect)
3. [useContext](#3-usecontext)
4. [useRef](#4-useref)
5. [useMemo](#5-usememo)
6. [useCallback](#6-usecallback)
7. [useReducer](#7-usereducer)
8. [Custom Hooks](#8-custom-hooks)

---

## 1. useState

**Purpose**: Manage component state

### Basic Usage
```tsx
const [count, setCount] = useState(0);
```

### Examples in this project
- `src/app/page.tsx:12` - Counter state
- `src/components/counter.tsx:6` - Component-level state

---

## 2. useEffect

**Purpose**: Handle side effects (data fetching, subscriptions, DOM updates)

### Dependency Array Behavior
- `useEffect(() => {})` - Runs after every render
- `useEffect(() => {}, [])` - Runs once after mount
- `useEffect(() => {}, [dep])` - Runs when dep changes

### Examples in this project
- `src/app/blog/page.tsx:13-20` - Data fetching with empty deps
- `src/app/blog/[id]/page.tsx:17-38` - Fetch when ID changes

---

## 3. useContext

**Purpose**: Share data without prop drilling

### Examples
See `src/app/hooks/context-example` for implementation.

---

## 4. useRef

**Purpose**:
- Access DOM elements
- Store mutable values that don't trigger re-render

### Examples
See `src/app/hooks/ref-example` for implementation.

---

## 5. useMemo

**Purpose**: Memoize expensive calculations

### Examples
See `src/app/hooks/memo-example` for implementation.

---

## 6. useCallback

**Purpose**: Memoize functions to prevent unnecessary re-renders

### Examples
See `src/app/hooks/callback-example` for implementation.

---

## 7. useReducer

**Purpose**: Complex state logic (alternative to useState)

### Examples
See `src/app/hooks/reducer-example` for implementation.

---

## 8. Custom Hooks

**Purpose**: Extract and reuse stateful logic

### Examples
See `src/hooks/` directory for custom hook implementations.

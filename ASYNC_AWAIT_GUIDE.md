# Async/Await Guide: I/O-Bound vs CPU-Intensive Tasks

## Core Principle

**Async/await is designed for I/O-bound operations, NOT CPU-intensive tasks.**

```
✅ I/O-bound: Network, file system, timers (waiting for external resources)
❌ CPU-intensive: Heavy calculations, loops, data processing (using CPU cycles)
```

## Why This Matters

### What Async Actually Does

```typescript
// Async does NOT magically parallelize code
async function misleading() {
  await heavyCalculation(); // Still blocks main thread!
  return result;
}
```

**Key insight**: `async/await` yields control during **waiting**, not during **computing**.

---

## ✅ CORRECT: I/O-Bound Tasks

### Example 1: Network Requests

```typescript
async function fetchUserData(userId: string) {
  // Yields to event loop while waiting for network response
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}
```

**Why it works**: CPU is idle during network roundtrip.

### Example 2: Timers

```typescript
async function delayedAction() {
  console.log('Start');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Non-blocking wait
  console.log('After 1 second');
}
```

**Why it works**: Timer handled by browser's event loop, main thread free.

### Example 3: File Operations (Node.js)

```typescript
import { readFile } from 'fs/promises';

async function loadConfig() {
  // Yields while OS reads file from disk
  const content = await readFile('./config.json', 'utf-8');
  return JSON.parse(content);
}
```

---

## ❌ WRONG: CPU-Intensive Tasks with Async

### Anti-Pattern: Heavy Loop

```typescript
// ⚠️ BAD: This BLOCKS the UI despite being async!
async function calculatePrimes(max: number) {
  const primes: number[] = [];

  for (let num = 2; num <= max; num++) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(num);
  }

  return primes; // No await = no yielding = UI frozen
}

// Using it:
async function badExample() {
  setLoading(true);
  const result = await calculatePrimes(1000000); // UI FREEZES HERE
  setLoading(false);
}
```

**Problem**: No `await` inside the loop means no yielding. Main thread blocked for seconds.

### Anti-Pattern: Array Processing

```typescript
// ⚠️ BAD: forEach/map doesn't yield
async function processImages(images: File[]) {
  const processed = await Promise.all(
    images.map(async (img) => {
      // Heavy synchronous processing still blocks!
      return resizeImageSync(img); // CPU-bound operation
    })
  );
  return processed;
}
```

---

## ✅ SOLUTIONS: Handling CPU-Intensive Tasks

### Solution 1: Web Workers (Best for Browser)

**Main Thread** (`async-examples/page.tsx`):
```typescript
function useCPUWorker() {
  const [result, setResult] = useState<number[] | null>(null);

  const calculatePrimes = (max: number) => {
    const worker = new Worker('/cpu-worker.js');

    worker.postMessage({ type: 'primes', max });

    worker.onmessage = (e) => {
      setResult(e.data.result);
      worker.terminate();
    };
  };

  return { result, calculatePrimes };
}
```

**Worker Thread** (`public/cpu-worker.js`):
```javascript
self.onmessage = function(e) {
  if (e.data.type === 'primes') {
    const primes = [];
    const max = e.data.max;

    for (let num = 2; num <= max; num++) {
      let isPrime = true;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) primes.push(num);
    }

    self.postMessage({ result: primes });
  }
};
```

**Benefits**:
- Truly parallel execution
- UI stays responsive
- No blocking

### Solution 2: Chunking with setTimeout

```typescript
async function calculatePrimesChunked(max: number): Promise<number[]> {
  const primes: number[] = [];
  const chunkSize = 1000;

  for (let start = 2; start <= max; start += chunkSize) {
    const end = Math.min(start + chunkSize, max);

    // Process chunk synchronously
    for (let num = start; num <= end; num++) {
      let isPrime = true;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) primes.push(num);
    }

    // Yield to event loop after each chunk
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return primes;
}
```

**Benefits**:
- No Web Worker needed
- Allows UI updates between chunks
- Slower than Worker but simple

### Solution 3: requestIdleCallback (Low Priority)

```typescript
function processWhenIdle(data: any[]) {
  return new Promise((resolve) => {
    const results: any[] = [];
    let index = 0;

    function processChunk(deadline: IdleDeadline) {
      while (deadline.timeRemaining() > 0 && index < data.length) {
        results.push(expensiveOperation(data[index]));
        index++;
      }

      if (index < data.length) {
        requestIdleCallback(processChunk);
      } else {
        resolve(results);
      }
    }

    requestIdleCallback(processChunk);
  });
}
```

**Use case**: Background processing that shouldn't interfere with user interactions.

---

## Comparison Table

| Task Type | Use Async? | Reason | Solution |
|-----------|-----------|--------|----------|
| `fetch()` | ✅ Yes | I/O-bound, waits for network | Native async |
| `setTimeout()` | ✅ Yes | I/O-bound, waits for timer | Native async |
| File read | ✅ Yes | I/O-bound, waits for disk | `fs/promises` |
| Prime calculation | ❌ No | CPU-bound, pure computation | Web Worker |
| Image processing | ❌ No | CPU-bound, pixel manipulation | Web Worker |
| Large array map | ❌ No | CPU-bound, synchronous loop | Worker/chunking |
| Fibonacci(50) | ❌ No | CPU-bound, recursive calc | Web Worker |

---

## Quick Decision Guide

```
Is the task waiting for something external? (network, disk, timer)
├─ YES → Use async/await ✅
└─ NO  → Is it doing heavy calculations?
    ├─ YES → Use Web Worker or chunking ✅
    └─ NO  → Regular synchronous code ✅
```

---

## Common Mistakes

### ❌ Mistake 1: Thinking `async` = Parallel

```typescript
// This does NOT run in parallel!
async function wrong() {
  const result = await cpuIntensiveTask(); // Blocks main thread
}
```

### ❌ Mistake 2: Awaiting Non-Async Operations

```typescript
// Pointless await
async function useless() {
  const result = await (2 + 2); // Synchronous, await does nothing
  return result;
}
```

### ❌ Mistake 3: Forgetting Worker Overhead

```typescript
// Don't use Worker for tiny tasks
const result = await workerCalculate(2 + 2); // Worker spawn > calculation time
```

---

## Best Practices

1. **Profile first**: Use DevTools Performance tab to identify bottlenecks
2. **Chunk smartly**: Balance chunk size vs UI responsiveness
3. **Worker pool**: Reuse workers for multiple tasks
4. **Progressive rendering**: Show partial results during chunked processing
5. **Cancel support**: Allow users to abort long operations

---

## See Also

- [Demo Page](/async-examples) - Interactive examples
- [MDN: Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Jake Archibald: Tasks, microtasks, queues](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

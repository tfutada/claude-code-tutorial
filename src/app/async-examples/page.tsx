'use client';

import { useState, useRef } from 'react';

export default function AsyncExamples() {
  // I/O-bound example state
  const [ioResult, setIoResult] = useState<string>('');
  const [ioLoading, setIoLoading] = useState(false);

  // CPU-bound (blocking) example state
  const [cpuBlockingResult, setCpuBlockingResult] = useState<string>('');
  const [cpuBlockingLoading, setCpuBlockingLoading] = useState(false);

  // CPU-bound (Web Worker) example state
  const [workerResult, setWorkerResult] = useState<string>('');
  const [workerLoading, setWorkerLoading] = useState(false);

  // Chunked processing example state
  const [chunkResult, setChunkResult] = useState<string>('');
  const [chunkLoading, setChunkLoading] = useState(false);
  const [chunkProgress, setChunkProgress] = useState(0);

  // Counter to show UI responsiveness
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fibonacci number inputs
  const [blockingFibN, setBlockingFibN] = useState(40);
  const [workerFibN, setWorkerFibN] = useState(42);
  const [chunkFibN, setChunkFibN] = useState(40);

  // Start counter to demonstrate UI blocking
  const startCounter = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCounter(c => c + 1);
    }, 100);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetCounter = () => {
    stopCounter();
    setCounter(0);
  };

  // ✅ CORRECT: I/O-bound async operation
  const handleIoExample = async () => {
    setIoLoading(true);
    setIoResult('');
    startCounter();

    try {
      const startTime = performance.now();

      // Simulated network request
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      setIoResult(`✅ Fetch successful!\nTitle: ${data.title}\nDuration: ${duration}ms\n\n💡 UI is responsive during I/O wait!`);
    } catch (error) {
      setIoResult(`❌ Error: ${error}`);
    } finally {
      setIoLoading(false);
      // Counter keeps running
    }
  };

  // ❌ WRONG: CPU-intensive task blocking main thread
  const handleCpuBlockingExample = async () => {
    setCpuBlockingLoading(true);
    setCpuBlockingResult('');
    startCounter();

    try {
      const startTime = performance.now();

      // Heavy CPU work using inefficient recursive Fibonacci (NO yielding!)
      function fibonacci(n: number): number {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }

      const result = fibonacci(blockingFibN);

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      setCpuBlockingResult(`❌ Calculation complete\nFibonacci(${blockingFibN}) = ${result}\nDuration: ${duration}ms\n\n⚠️ UI FROZEN! Counter stopped!`);
    } finally {
      setCpuBlockingLoading(false);
      // Counter keeps running (but was frozen during calculation)
    }
  };

  // ✅ CORRECT: CPU-intensive task with Web Worker
  const handleWorkerExample = () => {
    setWorkerLoading(true);
    setWorkerResult('');
    startCounter();

    const worker = new Worker('/cpu-worker.js');

    worker.postMessage({ type: 'fibonacci', n: workerFibN });

    worker.onmessage = (e) => {
      const { result, duration } = e.data;
      setWorkerResult(`✅ Calculation complete (Web Worker)\nFibonacci(${workerFibN}) = ${result}\nDuration: ${duration}ms\n\n💡 UI stayed responsive! Counter kept running!`);
      setWorkerLoading(false);
      // Counter keeps running
      worker.terminate();
    };

    worker.onerror = (error) => {
      setWorkerResult(`❌ Error: ${error.message}`);
      setWorkerLoading(false);
      // Counter keeps running
      worker.terminate();
    };
  };

  // ✅ CORRECT: CPU-intensive task with chunking
  const handleChunkedExample = async () => {
    setChunkLoading(true);
    setChunkResult('');
    setChunkProgress(0);
    startCounter();

    try {
      const startTime = performance.now();

      // Fibonacci with yielding
      function fibonacci(n: number): number {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }

      const results: number[] = [];
      const startN = Math.max(1, chunkFibN - 5);
      const calculations = Array.from({ length: 6 }, (_, i) => startN + i);

      for (let i = 0; i < calculations.length; i++) {
        // Calculate Fibonacci for one value
        results.push(fibonacci(calculations[i]));

        // Update progress
        const progress = Math.round(((i + 1) / calculations.length) * 100);
        setChunkProgress(progress);

        // Yield to event loop (allows UI updates)
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      setChunkResult(`✅ Calculation complete (Chunked)\nFibonacci(${startN}-${chunkFibN}): ${results[results.length - 1]} (last)\nDuration: ${duration}ms\n\n💡 UI partially responsive! Counter slowed but didn't freeze!`);
    } finally {
      setChunkLoading(false);
      setChunkProgress(0);
      // Counter keeps running
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Async/Await Examples</h1>

        {/* Two-column layout: Counter (sticky) + Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left column: Sticky counter */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold mb-2">UI Responsiveness Test</h2>
              <p className="text-sm mb-4">Watch this counter to detect UI blocking</p>
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl font-mono font-bold text-blue-600 dark:text-blue-400">{counter}</div>
                <div className="flex flex-col w-full gap-2">
                  <button
                    onClick={startCounter}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Start
                  </button>
                  <button
                    onClick={stopCounter}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Stop
                  </button>
                  <button
                    onClick={resetCounter}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 Start the counter, then click examples. If the counter freezes, the UI is blocked!
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Examples */}
          <div className="space-y-8">
            {/* ✅ I/O-bound example */}
            <section className="p-6 border border-green-500 rounded-lg bg-green-50 dark:bg-green-950">
              <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
                ✅ Correct: I/O-Bound Async
              </h2>
              <p className="mb-4">Network requests are perfect for async/await</p>
              <button
                onClick={handleIoExample}
                disabled={ioLoading}
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {ioLoading ? 'Loading...' : 'Fetch Data (I/O)'}
              </button>
              {ioResult && (
                <pre className="mt-4 p-4 bg-white dark:bg-gray-800 rounded whitespace-pre-wrap">
                  {ioResult}
                </pre>
              )}
            </section>

            {/* ❌ CPU-intensive blocking */}
            <section className="p-6 border border-red-500 rounded-lg bg-red-50 dark:bg-red-950">
              <h2 className="text-2xl font-semibold mb-4 text-red-800 dark:text-red-200">
                ❌ Wrong: CPU-Intensive with Async (Blocks UI)
              </h2>
              <p className="mb-4">Heavy computation in async function → UI freezes!</p>
              <div className="mb-4 flex items-center gap-3">
                <label htmlFor="blocking-fib" className="text-sm font-medium">
                  Fibonacci(n):
                </label>
                <input
                  id="blocking-fib"
                  type="number"
                  min="1"
                  max="50"
                  value={blockingFibN}
                  onChange={(e) => setBlockingFibN(Number(e.target.value))}
                  disabled={cpuBlockingLoading}
                  className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 disabled:opacity-50"
                />
                <span className="text-xs text-gray-500">(try 38-42 for visible freeze)</span>
              </div>
              <button
                onClick={handleCpuBlockingExample}
                disabled={cpuBlockingLoading}
                className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {cpuBlockingLoading ? 'Computing... (UI Frozen)' : 'Calculate Fibonacci (Blocking)'}
              </button>
              {cpuBlockingResult && (
                <pre className="mt-4 p-4 bg-white dark:bg-gray-800 rounded whitespace-pre-wrap">
                  {cpuBlockingResult}
                </pre>
              )}
            </section>

            {/* ✅ Web Worker solution */}
            <section className="p-6 border border-green-500 rounded-lg bg-green-50 dark:bg-green-950">
              <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
                ✅ Correct: Web Worker (Off Main Thread)
              </h2>
              <p className="mb-4">Computation in separate thread → UI stays responsive!</p>
              <div className="mb-4 flex items-center gap-3">
                <label htmlFor="worker-fib" className="text-sm font-medium">
                  Fibonacci(n):
                </label>
                <input
                  id="worker-fib"
                  type="number"
                  min="1"
                  max="50"
                  value={workerFibN}
                  onChange={(e) => setWorkerFibN(Number(e.target.value))}
                  disabled={workerLoading}
                  className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 disabled:opacity-50"
                />
                <span className="text-xs text-gray-500">(same computation, no freeze)</span>
              </div>
              <button
                onClick={handleWorkerExample}
                disabled={workerLoading}
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {workerLoading ? 'Computing... (UI Responsive)' : 'Calculate Fibonacci (Web Worker)'}
              </button>
              {workerResult && (
                <pre className="mt-4 p-4 bg-white dark:bg-gray-800 rounded whitespace-pre-wrap">
                  {workerResult}
                </pre>
              )}
            </section>

            {/* ✅ Chunked processing solution */}
            <section className="p-6 border border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
                ✅ Alternative: Chunked Processing
              </h2>
              <p className="mb-4">Split into chunks → UI doesn't completely freeze</p>
              <div className="mb-4 flex items-center gap-3">
                <label htmlFor="chunk-fib" className="text-sm font-medium">
                  Fibonacci(n):
                </label>
                <input
                  id="chunk-fib"
                  type="number"
                  min="1"
                  max="50"
                  value={chunkFibN}
                  onChange={(e) => setChunkFibN(Number(e.target.value))}
                  disabled={chunkLoading}
                  className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 disabled:opacity-50"
                />
                <span className="text-xs text-gray-500">(calculates n-5 to n)</span>
              </div>
              <button
                onClick={handleChunkedExample}
                disabled={chunkLoading}
                className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {chunkLoading ? `Computing... ${chunkProgress}%` : 'Calculate Fibonacci (Chunked)'}
              </button>
              {chunkLoading && (
                <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-yellow-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${chunkProgress}%` }}
                  />
                </div>
              )}
              {chunkResult && (
                <pre className="mt-4 p-4 bg-white dark:bg-gray-800 rounded whitespace-pre-wrap">
                  {chunkResult}
                </pre>
              )}
            </section>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Key Takeaways</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>async/await</strong> is perfect for I/O waiting (fetch, setTimeout, etc.)</li>
            <li>DO NOT use for CPU-intensive tasks (blocks main thread)</li>
            <li>Use <strong>Web Workers</strong> for heavy computations (true parallelization)</li>
            <li>Alternative: <strong>Chunked processing</strong> (split with setTimeout(0))</li>
            <li>The counter visually shows UI blocking</li>
          </ul>
          <div className="mt-4">
            <a
              href="/ASYNC_AWAIT_GUIDE.md"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              📖 Read detailed guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

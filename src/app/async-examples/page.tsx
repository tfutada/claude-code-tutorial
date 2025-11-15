'use client';

import { useState, useRef } from 'react';
import Nav from '@/components/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Async/Await <span className="text-primary">Examples</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn the difference between I/O-bound and CPU-bound operations, and when to use async/await effectively
          </p>
        </div>

        {/* Two-column layout: Counter (sticky) + Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Left column: Sticky counter */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  UI Responsiveness Test
                </CardTitle>
                <CardDescription>
                  Watch this counter to detect UI blocking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-6xl font-mono font-bold text-primary tabular-nums">{counter}</div>
                  <div className="flex flex-col w-full gap-2">
                    <Button onClick={startCounter} variant="default" className="w-full">
                      Start Counter
                    </Button>
                    <Button onClick={stopCounter} variant="destructive" className="w-full">
                      Stop Counter
                    </Button>
                    <Button onClick={resetCounter} variant="outline" className="w-full">
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>How to test:</strong>
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Start the counter</li>
                    <li>Run an example</li>
                    <li>Watch if counter freezes</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Examples */}
          <div className="space-y-6">
            {/* ✅ I/O-bound example */}
            <Card className="border-green-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    Correct: I/O-Bound Async
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Best Practice
                  </Badge>
                </div>
                <CardDescription>
                  Network requests are perfect for async/await - UI stays responsive while waiting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleIoExample}
                  disabled={ioLoading}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  {ioLoading ? 'Loading...' : 'Fetch Data (I/O)'}
                </Button>
                {ioResult && (
                  <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap font-mono border">
                    {ioResult}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* ❌ CPU-intensive blocking */}
            <Card className="border-destructive/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-destructive">❌</span>
                    Wrong: CPU-Intensive with Async
                  </CardTitle>
                  <Badge variant="destructive">Anti-Pattern</Badge>
                </div>
                <CardDescription>
                  Heavy computation in async function still blocks the main thread → UI freezes!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="blocking-fib" className="text-sm font-medium">
                    Fibonacci(n):
                  </label>
                  <Input
                    id="blocking-fib"
                    type="number"
                    min="1"
                    max="50"
                    value={blockingFibN}
                    onChange={(e) => setBlockingFibN(Number(e.target.value))}
                    disabled={cpuBlockingLoading}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">(try 38-42 for visible freeze)</span>
                </div>
                <Button
                  onClick={handleCpuBlockingExample}
                  disabled={cpuBlockingLoading}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  {cpuBlockingLoading ? 'Computing... (UI Frozen)' : 'Calculate Fibonacci (Blocking)'}
                </Button>
                {cpuBlockingResult && (
                  <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap font-mono border border-destructive/20">
                    {cpuBlockingResult}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* ✅ Web Worker solution */}
            <Card className="border-green-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    Correct: Web Worker
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Recommended
                  </Badge>
                </div>
                <CardDescription>
                  Computation runs in separate thread → main thread stays responsive!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="worker-fib" className="text-sm font-medium">
                    Fibonacci(n):
                  </label>
                  <Input
                    id="worker-fib"
                    type="number"
                    min="1"
                    max="50"
                    value={workerFibN}
                    onChange={(e) => setWorkerFibN(Number(e.target.value))}
                    disabled={workerLoading}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">(same computation, no freeze)</span>
                </div>
                <Button
                  onClick={handleWorkerExample}
                  disabled={workerLoading}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  {workerLoading ? 'Computing... (UI Responsive)' : 'Calculate Fibonacci (Web Worker)'}
                </Button>
                {workerResult && (
                  <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap font-mono border border-green-500/20">
                    {workerResult}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* ✅ Chunked processing solution */}
            <Card className="border-yellow-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="text-yellow-500">⚡</span>
                    Alternative: Chunked Processing
                  </CardTitle>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Alternative
                  </Badge>
                </div>
                <CardDescription>
                  Split work into chunks with yields → UI doesn't completely freeze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label htmlFor="chunk-fib" className="text-sm font-medium">
                    Fibonacci(n):
                  </label>
                  <Input
                    id="chunk-fib"
                    type="number"
                    min="1"
                    max="50"
                    value={chunkFibN}
                    onChange={(e) => setChunkFibN(Number(e.target.value))}
                    disabled={chunkLoading}
                    className="w-24"
                  />
                  <span className="text-xs text-muted-foreground">(calculates n-5 to n)</span>
                </div>
                <Button
                  onClick={handleChunkedExample}
                  disabled={chunkLoading}
                  className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
                >
                  {chunkLoading ? `Computing... ${chunkProgress}%` : 'Calculate Fibonacci (Chunked)'}
                </Button>
                {chunkLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{chunkProgress}%</span>
                    </div>
                    <Progress value={chunkProgress} className="h-2" />
                  </div>
                )}
                {chunkResult && (
                  <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap font-mono border border-yellow-500/20">
                    {chunkResult}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Takeaways */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">💡 Key Takeaways</CardTitle>
            <CardDescription>
              Understanding when and how to use async/await effectively
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-500 mt-0.5">✅</span>
                <span><strong>async/await</strong> is perfect for I/O-bound operations (fetch, setTimeout, file reads)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 mt-0.5">❌</span>
                <span><strong>DO NOT</strong> use async/await alone for CPU-intensive tasks (still blocks main thread)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 mt-0.5">✅</span>
                <span>Use <strong>Web Workers</strong> for heavy computations (true parallelization, recommended)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-500 mt-0.5">⚡</span>
                <span>Alternative: <strong>Chunked processing</strong> with <code className="px-1.5 py-0.5 bg-muted rounded text-sm">setTimeout(0)</code> (yields to event loop)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-0.5">⏱️</span>
                <span>The counter demonstrates UI responsiveness - if it freezes, the main thread is blocked</span>
              </li>
            </ul>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro tip:</strong> Always profile your application to identify whether bottlenecks are I/O-bound or CPU-bound before choosing an optimization strategy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

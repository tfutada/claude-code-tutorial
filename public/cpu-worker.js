// CPU-intensive Web Worker
// Handles heavy calculations off the main thread

self.onmessage = function(e) {
  const { type, max, n } = e.data;

  if (type === 'primes') {
    // Calculate prime numbers up to max
    const primes = [];
    const startTime = performance.now();

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

    const endTime = performance.now();
    const duration = endTime - startTime;

    self.postMessage({
      result: primes,
      count: primes.length,
      duration: duration.toFixed(2)
    });
  }

  if (type === 'fibonacci') {
    // Calculate Fibonacci number (inefficient recursive version for demo)
    const startTime = performance.now();

    function fib(n) {
      if (n <= 1) return n;
      return fib(n - 1) + fib(n - 2);
    }

    const result = fib(n);
    const endTime = performance.now();
    const duration = endTime - startTime;

    self.postMessage({
      result,
      duration: duration.toFixed(2)
    });
  }

  if (type === 'heavyLoop') {
    // Simulate heavy computation
    const startTime = performance.now();
    let sum = 0;

    for (let i = 0; i < max; i++) {
      sum += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    self.postMessage({
      result: sum,
      duration: duration.toFixed(2)
    });
  }
};

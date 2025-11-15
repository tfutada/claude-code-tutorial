import { useState, useEffect } from "react"

interface WindowSize {
  width: number
  height: number
}

/**
 * Custom hook to track window size
 * Updates on window resize
 */
export function useWindowSize(): WindowSize {
  // Initialize with undefined to avoid hydration mismatch
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    // Only runs on client after hydration
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

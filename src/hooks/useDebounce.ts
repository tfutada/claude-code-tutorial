import { useState, useEffect } from "react"

/**
 * Custom hook to debounce a value
 * Useful for search inputs, API calls on user input, etc.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel timeout if value changes before delay finishes
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

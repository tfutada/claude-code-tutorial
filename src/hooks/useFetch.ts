import { useState, useEffect } from "react"

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Custom hook for data fetching with loading and error states
 */
export function useFetch<T>(url: string) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null })

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()

        if (!cancelled) {
          setState({ data: json, loading: false, error: null })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error("Unknown error"),
          })
        }
      }
    }

    fetchData()

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      cancelled = true
    }
  }, [url])

  return state
}

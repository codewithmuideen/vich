import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Fetches from Supabase and exposes {data, loading, error, refetch}. If
 * `fallback` is provided, it is used while the backend is unreachable
 * (development before configuration, or a transient outage) so the UI still
 * renders — the `isFallback` flag lets pages disclose that state instead of
 * pretending it's live data.
 */
export function useApiData(fetcher, { fallback, deps = [] } = {}) {
  const [state, setState] = useState({ data: fallback ?? null, loading: true, error: null, isFallback: false })
  const [tick, setTick] = useState(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))

    fetcherRef
      .current()
      .then((data) => {
        if (cancelled) return
        setState({ data, loading: false, error: null, isFallback: false })
      })
      .catch((error) => {
        if (cancelled) return
        if (fallback !== undefined) {
          setState({ data: fallback, loading: false, error, isFallback: true })
        } else {
          setState({ data: null, loading: false, error, isFallback: false })
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { ...state, refetch }
}

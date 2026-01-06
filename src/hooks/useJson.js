import { useEffect, useRef, useState } from "react";
import { fetchJson } from "./dataClient";

/**
 * useJson - fetch JSON with caching, timeout, retries.
 * @param {string} url relative or absolute URL
 * @param {{ttlMs?:number, retries?:number, timeoutMs?:number, cacheBust?:boolean}} options
 */
export function useJson(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const optsRef = useRef(options);
  optsRef.current = options;

  // A simple reload token
  const [tick, setTick] = useState(0);
  const reload = () => setTick((x) => x + 1);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(new Error("useJson: url is required"));
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);

    // Use AbortController to cancel on unmount
    const ac = new AbortController();
    fetchJson(url, { signal: ac.signal, ...optsRef.current })
      .then((d) => {
        if (!alive) return;
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e);
        setLoading(false);
      });

    return () => {
      alive = false;
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tick]);

  return { data, error, loading, reload };
}
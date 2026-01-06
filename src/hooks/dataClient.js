// Lightweight JSON client with in-memory cache, timeout, retries, and correlation IDs.

const cache = new Map(); // key -> { ts, data, promise }
const DEFAULT_TTL = 30_000;
const DEFAULT_TIMEOUT = 8_000;
const DEFAULT_RETRIES = 2;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout(signal, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("TimeoutError", "AbortError")), ms);
  // If upstream cancels, propagate
  const cleanup = () => clearTimeout(timer);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return { signal: controller.signal, cleanup };
}

function buildUrl(url, cacheBust) {
  try {
    const u = new URL(url, window.location.origin);
    if (cacheBust) u.searchParams.set("_", String(Date.now()));
    return u.toString();
  } catch {
    // If url is relative and URL() fails with base, fallback
    if (cacheBust) {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}_=${Date.now()}`;
    }
    return url;
  }
}

export function clearCache(url) {
  if (!url) cache.clear();
  else cache.delete(url);
}

export async function fetchJson(url, opts = {}) {
  const {
    ttlMs = DEFAULT_TTL,
    retries = DEFAULT_RETRIES,
    timeoutMs = DEFAULT_TIMEOUT,
    cacheBust = false,
    signal
  } = opts;

  if (typeof url !== "string" || !url) {
    throw new Error("fetchJson: url must be a non-empty string");
  }

  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.data && now - cached.ts < ttlMs) {
    return cached.data;
  }
  if (cached && cached.promise) {
    return cached.promise; // de-dup concurrent callers
  }

  const requestId = crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const finalUrl = buildUrl(url, cacheBust);

  const doFetch = async () => {
    const { signal: timeoutSignal, cleanup } = withTimeout(signal, timeoutMs);
    try {
      const res = await fetch(finalUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-Correlation-Id": requestId
        },
        signal: timeoutSignal,
        // mode, credentials defaults are fine for same-origin public assets
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(`HTTP ${res.status} ${res.statusText}` + (text ? `: ${text.slice(0, 200)}` : ""));
        err.status = res.status;
        throw err;
      }
      const data = await res.json();
      return data;
    } finally {
      cleanup();
    }
  };

  let attempt = 0;
  const jitter = () => Math.floor(100 + Math.random() * 150);
  const task = (async () => {
    // Retry only on network/timeout/5xx; not on 4xx or JSON parse errors
    while (true) {
      try {
        const data = await doFetch();
        cache.set(url, { ts: Date.now(), data });
        return data;
      } catch (e) {
        attempt += 1;
        const retryable =
          e?.name === "AbortError" ||
          e?.message?.includes("NetworkError") ||
          e?.message?.includes("Failed to fetch") ||
          (typeof e?.status === "number" && e.status >= 500);
        if (!retryable || attempt > retries) {
          console.error("[dataClient] fetch failed", { url, requestId, attempt, error: String(e) });
          cache.delete(url);
          throw e;
        }
        const backoff = Math.min(500 * 2 ** (attempt - 1) + jitter(), 3000);
        await sleep(backoff);
      }
    }
  })();

  cache.set(url, { ts: now, data: cached?.data, promise: task });
  try {
    const data = await task;
    return data;
  } finally {
    const c = cache.get(url);
    if (c?.promise === task) {
      // retain data, drop promise
      cache.set(url, { ts: Date.now(), data: c.data });
    }
  }
}
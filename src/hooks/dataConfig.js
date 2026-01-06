// Resolves the base URL for dataset JSON files.
// Supports absolute http(s) URLs or app-relative paths. Falls back to "/data/".
// Note: Browsers cannot fetch directly from Windows file paths (e.g., C:\...).
export function getDataBaseUrl() {
  const raw =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_DATA_BASE_URL) ||
    (typeof process !== "undefined" && process.env && process.env.REACT_APP_DATA_BASE_URL) ||
    "/data/";

  // Reject raw Windows filesystem paths; instruct to serve over HTTP.
  if (/^[a-zA-Z]:\\/.test(raw)) {
    console.error(
      "[dataConfig] Detected Windows file path. Serve this folder over HTTP and set VITE_DATA_BASE_URL to that URL (e.g., http://localhost:5050/). Falling back to /data/."
    );
    return "/data/";
  }

  // Absolute http(s) URL
  if (/^https?:\/\//i.test(raw)) {
    return raw.endsWith("/") ? raw : raw + "/";
  }

  // App-relative path
  const normalized = raw.startsWith("/") ? raw : "/" + raw;
  return normalized.endsWith("/") ? normalized : normalized + "/";
}

export function resolveDataUrl(fileName) {
  return `${getDataBaseUrl()}${fileName}`;
}
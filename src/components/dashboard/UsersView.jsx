import React, { useMemo } from "react";
import { useJson } from "../../hooks/useJson";
import { resolveDataUrl } from "../../hooks/dataConfig";

/**
 * Renders user.json data as a table (robust to schema variations).
 * - Uses useJson for timeout/retries/caching.
 * - Detects columns dynamically (prefers id/fullName/name/email/status).
 */
export default function UsersView() {
  const { data, loading, error, reload } = useJson(resolveDataUrl("users.json"), {
    ttlMs: 60_000,
    retries: 2,
    timeoutMs: 8_000
  });

  // Normalize: array if possible; otherwise wrap single object; support { users: [...] }
  const items = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.users)) return data.users;
    if (data && typeof data === "object") return [data];
    return [];
  }, [data]);

  const columns = useMemo(() => {
    const preferred = ["id", "fullName", "name", "email", "status"];
    const seen = new Set();
    items.slice(0, 50).forEach((row) => {
      Object.keys(row || {}).forEach((k) => seen.add(k));
    });
    const discovered = Array.from(seen);
    const ordered = [
      ...preferred.filter((k) => seen.has(k)),
      ...discovered.filter((k) => !preferred.includes(k))
    ];
    // Cap columns to keep UI readable
    return ordered.slice(0, 8);
  }, [items]);

  return (
    <section aria-labelledby="users-heading">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 id="users-heading">Users</h2>
        <div role="group" aria-label="Users actions" style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={reload} disabled={loading} aria-disabled={loading}>
            Reload
          </button>
        </div>
      </div>

      {loading && (
        <div role="status" aria-live="polite">
          Loading users…
        </div>
      )}

      {!loading && error && (
        <div role="alert" aria-live="assertive">
          Could not load users. Please try again.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p aria-live="polite">No users to display.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table aria-label="Users table">
            <caption className="sr-only">Users</caption>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={row.id ?? idx}>
                  {columns.map((c) => (
                    <td key={c}>
                      {String(
                        row[c] === null || row[c] === undefined
                          ? ""
                          : typeof row[c] === "object"
                          ? JSON.stringify(row[c])
                          : row[c]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
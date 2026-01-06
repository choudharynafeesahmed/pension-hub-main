import React, { useMemo, useState } from "react";
import { usePensionData } from "../hooks/usePensionData";
import { useSelectedUser } from "../hooks/SelectedUserContext";

/**
 * Pre-app page: forces selecting a user before entering the hub.
 * onDone is optional; the RootGate uses conditional rendering so we don't navigate.
 */
export default function UserSelectPage({ onDone }) {
  const { data, loading, error } = usePensionData({ ttlMs: 60_000, retries: 2, timeoutMs: 8_000 });
  const { selectedUserId, setSelectedUserId } = useSelectedUser();

  const users = data?.users ?? [];
  const [localUserId, setLocalUserId] = useState(selectedUserId || "");

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => String(a.fullName || "").localeCompare(String(b.fullName || "")));
  }, [users]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!localUserId) return;
    setSelectedUserId(localUserId);
    onDone?.(localUserId);
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f8fa" }}>
      <form
        onSubmit={handleContinue}
        style={{
          width: "min(92vw, 480px)",
          background: "#fff",
          border: "1px solid #d0d7de",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
        }}
        aria-labelledby="select-user-heading"
      >
        <h1 id="select-user-heading" style={{ marginTop: 0, marginBottom: 16 }}>Select Customer</h1>

        {loading && (
          <div role="status" aria-live="polite" style={{ marginBottom: 12 }}>
            Loading customers…
          </div>
        )}

        {!loading && error && (
          <div role="alert" aria-live="assertive" style={{ marginBottom: 12 }}>
            Could not load customers. Check your data source and try again.
          </div>
        )}

        <label htmlFor="select-user" id="select-user-label">Customer</label>
        <select
          id="select-user"
          name="customer"
          aria-labelledby="select-user-label"
          value={localUserId}
          onChange={(e) => setLocalUserId(String(e.target.value || ""))}
          disabled={loading || !!error || users.length === 0}
          style={{ display: "block", width: "100%", marginTop: 6, marginBottom: 16 }}
        >
          <option value="">Select a customer…</option>
          {sortedUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!localUserId || loading || !!error}
          aria-disabled={!localUserId || loading || !!error}
          style={{ width: "100%" }}
        >
          Continue
        </button>
      </form>
    </main>
  );
}
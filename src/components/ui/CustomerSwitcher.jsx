import React, { useMemo } from "react";
import { usePensionData } from "../../hooks/usePensionData";
import CustomerSwitcher from "../ui/CustomerSwitcher";
import { useSelectedUser } from "../../hooks/SelectedUserContext";

export default function DataPreview() {
  const { data, loading, error } = usePensionData({
    ttlMs: 60_000,
    retries: 2,
    timeoutMs: 8_000
  });

  const { selectedUserId, setSelectedUserId } = useSelectedUser();

  const filteredSummaries = useMemo(() => {
    if (!data) return [];
    if (!selectedUserId) return data.accountSummaries;
    return data.accountSummaries.filter((a) => a.userId === selectedUserId);
  }, [data, selectedUserId]);

  return (
    <>
      <CustomerSwitcher
        users={data?.users || []}
        value={selectedUserId || ""}
        onChange={setSelectedUserId}
        disabled={loading || !!error}
      />

      {loading && (
        <div role="status" aria-live="polite" style={{ paddingTop: 56 }}>
          Loading pension dataset…
        </div>
      )}

      {!loading && error && (
        <div role="alert" aria-live="assertive" style={{ paddingTop: 56 }}>
          Could not load dataset. Please try again.
        </div>
      )}

      {!loading && !error && data && (
        <section aria-labelledby="dataset-summary" style={{ paddingTop: 56 }}>
          <h2 id="dataset-summary">Dataset summary</h2>

          <ul aria-label="Overall dataset counts">
            <li>Users: {data.users.length}</li>
            <li>Providers: {data.providers.length}</li>
            <li>Accounts: {data.accounts.length}</li>
            <li>Funds: {data.funds.length}</li>
            <li>Holdings: {data.holdings.length}</li>
            <li>Contributions: {data.contributions.length}</li>
            <li>Transactions: {data.transactions.length}</li>
          </ul>

          <h3>Accounts</h3>
          <p aria-live="polite">
            Showing {filteredSummaries.length} of {data.accountSummaries.length} accounts
            {selectedUserId ? ` for ${data.usersById[selectedUserId]?.fullName || selectedUserId}` : ""}.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table aria-label="Accounts overview">
              <thead>
                <tr>
                  <th scope="col">Account</th>
                  <th scope="col">User</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Balance (GBP)</th>
                  <th scope="col">Holdings Value</th>
                  <th scope="col">Delta</th>
                  <th scope="col">Holdings</th>
                  <th scope="col">Contrib</th>
                  <th scope="col">Txns</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummaries.map((a) => (
                  <tr key={a.id}>
                    <td>{a.accountNumber}</td>
                    <td>{a.userName}</td>
                    <td>{a.provider}</td>
                    <td>{Number(a.balance).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</td>
                    <td>{Number(a.holdingsValue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: a.balanceDelta === 0 ? "inherit" : "crimson" }}>
                      {a.balanceDelta.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </td>
                    <td>{a.holdingsCount}</td>
                    <td>{a.contributionCount}</td>
                    <td>{a.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Note: Delta highlights any mismatch between recorded balance and sum of holdings for quick diagnostics.
          </p>
        </section>
      )}
    </>
  );
}import React from "react";

/**
 * CustomerSwitcher - fixed top-left dropdown to select a customer (user).
 * Props:
 *  - users: Array<{ id: string, fullName: string }>
 *  - value: string (selected userId or "")
 *  - onChange: (userId: string) => void
 *  - disabled?: boolean
 */
export default function CustomerSwitcher({ users = [], value = "", onChange, disabled = false }) {
  const handleChange = (e) => {
    const next = String(e?.target?.value ?? "");
    onChange?.(next);
  };

  // Keep this above typical app headers; ensure visibility/clickability.
  const containerStyle = {
    position: "fixed",
    top: 8,
    left: 8,
    zIndex: 2000,
    background: "#ffffff",
    border: "1px solid #d0d7de",
    borderRadius: 6,
    padding: "8px 10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  };

  const labelId = "customer-switcher-label";

  return (
    <div style={containerStyle}>
      <label id={labelId} htmlFor="customer-switcher">
        Customer
      </label>
      <select
        id="customer-switcher"
        name="customer"
        aria-labelledby={labelId}
        value={value}
        onChange={handleChange}
        title="Filter accounts by customer"
        disabled={disabled || users.length === 0}
      >
        <option value="">All customers</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.fullName}
          </option>
        ))}
      </select>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { usePensionData } from "../../hooks/usePensionData";
import CustomerSwitcher from "../ui/CustomerSwitcher";

// Hoisted styles to avoid re-creation each render
const FIXED_OFFSET_STYLE = { paddingTop: 56 };
const TABLE_WRAP_STYLE = { overflowX: "auto" };

export default function DataPreview() {
  const { data, loading, error } = usePensionData({
    ttlMs: 60_000,
    retries: 2,
    timeoutMs: 8_000
  });

  // Local selection state (no global context)
  const [selectedUserId, setSelectedUserId] = useState("");

  const filteredSummaries = useMemo(() => {
    if (!data) return [];
    if (!selectedUserId) return data.accountSummaries;
    return data.accountSummaries.filter((a) => a.userId === selectedUserId);
  }, [data, selectedUserId]);

  // Stable number formatter
  const nf = useMemo(
    () => new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    []
  );

  return (
    <>
      {/* Top-left customer filter, always rendered; disabled while loading/error */}
      <CustomerSwitcher
        users={data?.users || []}
        value={selectedUserId}
        onChange={setSelectedUserId}
        disabled={loading || !!error}
      />

      {loading && (
        <div role="status" aria-live="polite" style={FIXED_OFFSET_STYLE}>
          Loading pension dataset…
        </div>
      )}

      {!loading && error && (
        <div role="alert" aria-live="assertive" style={FIXED_OFFSET_STYLE}>
          Could not load dataset. Please try again.
        </div>
      )}

      {!loading && !error && data && (
        <section aria-labelledby="dataset-summary" style={FIXED_OFFSET_STYLE}>
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

          <div style={TABLE_WRAP_STYLE}>
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
                    <td>{nf.format(Number(a.balance))}</td>
                    <td>{nf.format(Number(a.holdingsValue))}</td>
                    <td style={{ color: a.balanceDelta === 0 ? "inherit" : "crimson" }}>
                      {nf.format(Number(a.balanceDelta))}
                    </td>
                    <td>{a.holdingsCount}</td>
                    <td>{a.contributionCount}</td>
                    <td>{a.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Note: Delta highlights any mismatch between recorded balance and sum of holdings for quick diagnostics.</p>
        </section>
      )}
    </>
  );
}
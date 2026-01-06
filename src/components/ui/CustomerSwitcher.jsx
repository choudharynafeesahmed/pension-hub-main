import React from "react";

/**
 * CustomerSwitcher - fixed top-left dropdown to select a customer (user).
 * Props:
 *  - users: Array<{ id: string, fullName: string }>
 *  - value: string (selected userId or "")
 *  - onChange: (userId: string) => void
 */
export default function CustomerSwitcher({ users = [], value = "", onChange }) {
  const handleChange = (e) => {
    const next = String(e?.target?.value ?? "");
    onChange?.(next);
  };

  // Inline styles keep this independent of app CSS.
  const containerStyle = {
    position: "fixed",
    top: 8,
    left: 8,
    zIndex: 1000,
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
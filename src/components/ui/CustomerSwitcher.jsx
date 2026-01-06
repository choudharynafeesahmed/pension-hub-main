import React, { memo, useCallback, useId } from "react";
import PropTypes from "prop-types";

// CHANGE: Hoist styles to module scope to avoid recreating objects on every render.
const CONTAINER_STYLE = {
  position: "fixed",
  top: 8,
  left: 8,
  zIndex: 2000, // CHANGE: Ensure above common headers
  background: "#ffffff",
  border: "1px solid #d0d7de",
  borderRadius: 6,
  padding: "8px 10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

/**
 * CustomerSwitcher - fixed top-left dropdown to select a customer (user).
 * CHANGE: Memoized component + stable handlers and unique ids for a11y.
 */
function CustomerSwitcher({ users = [], value = "", onChange, disabled = false }) {
  // CHANGE: Use React 18 useId to avoid duplicate ids if multiple instances mount.
  const baseId = useId();
  const selectId = `${baseId}-customer-switcher`;
  const labelId = `${baseId}-customer-switcher-label`;

  // CHANGE: Stabilize onChange to reduce re-renders in parents/children.
  const handleChange = useCallback(
    (e) => {
      const next = String(e?.target?.value ?? "");
      onChange?.(next);
    },
    [onChange]
  );

  return (
    <div style={CONTAINER_STYLE}>
      <label id={labelId} htmlFor={selectId}>
        Customer
      </label>
      <select
        id={selectId}
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

// CHANGE: Add runtime prop validation for robustness.
CustomerSwitcher.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fullName: PropTypes.string
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

// CHANGE: Memoize to prevent unnecessary re-renders when props are stable.
export default memo(CustomerSwitcher);
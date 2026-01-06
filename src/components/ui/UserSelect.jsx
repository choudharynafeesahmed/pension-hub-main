import React from "react";

/**
 * Accessible user selection dropdown.
 * Props:
 *  - users: [{ id, fullName }]
 *  - value: string ("", or userId)
 *  - onChange: (userId: string) => void
 */
export default function UserSelect({ users, value, onChange }) {
  const handleChange = (e) => {
    const next = String(e?.target?.value ?? "");
    onChange(next);
  };

  return (
    <div>
      <label htmlFor="user-select" id="user-select-label">
        User
      </label>
      <select
        id="user-select"
        name="user"
        aria-labelledby="user-select-label"
        value={value}
        onChange={handleChange}
        title="Filter accounts by user"
      >
        <option value="">All users</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.fullName}
          </option>
        ))}
      </select>
    </div>
  );
}
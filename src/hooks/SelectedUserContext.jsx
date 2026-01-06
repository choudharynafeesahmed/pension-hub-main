import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SelectedUserContext = createContext(null);

export function SelectedUserProvider({ children }) {
  // Load persisted selection once
  const [selectedUserId, setSelectedUserId] = useState(() => {
    try {
      return window.localStorage.getItem("selectedUserId") || "";
    } catch {
      return "";
    }
  });

  // Persist on change
  useEffect(() => {
    try {
      if (selectedUserId) {
        window.localStorage.setItem("selectedUserId", selectedUserId);
      } else {
        window.localStorage.removeItem("selectedUserId");
      }
    } catch {
      // Ignore storage errors silently for safety
    }
  }, [selectedUserId]);

  const clearSelectedUser = () => setSelectedUserId("");

  const value = useMemo(
    () => ({ selectedUserId, setSelectedUserId, clearSelectedUser }),
    [selectedUserId]
  );

  return <SelectedUserContext.Provider value={value}>{children}</SelectedUserContext.Provider>;
}

export function useSelectedUser() {
  const ctx = useContext(SelectedUserContext);
  if (!ctx) {
    throw new Error("useSelectedUser must be used within SelectedUserProvider");
  }
  return ctx;
}
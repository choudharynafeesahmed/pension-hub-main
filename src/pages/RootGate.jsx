import React from "react";
import { useSelectedUser } from "../hooks/SelectedUserContext";
import UserSelectPage from "./UserSelectPage";

/**
 * RootGate conditionally renders the user selection page BEFORE the hub.
 * Wrap your app with <SelectedUserProvider><RootGate>{your hub}</RootGate></SelectedUserProvider>
 */
export default function RootGate({ children }) {
  const { selectedUserId } = useSelectedUser();

  if (!selectedUserId) {
    return <UserSelectPage />;
  }

  return <>{children}</>;
}
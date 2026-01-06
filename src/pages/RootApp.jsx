import React from "react";
import { SelectedUserProvider } from "../hooks/SelectedUserContext";
import RootGate from "./RootGate";
import DataPreview from "../components/dashboard/DataPreview";

// Root of the app: shows UserSelectPage (via RootGate) before the hub (DataPreview)
export default function RootApp() {
  return (
    <SelectedUserProvider>
      <RootGate>
        <DataPreview />
      </RootGate>
    </SelectedUserProvider>
  );
}
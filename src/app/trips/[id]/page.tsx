import React from "react";
import { TripWorkspaceClient } from "@/components/workspace/TripWorkspaceClient";

export function generateStaticParams() {
  return [
    { id: "trip-coorg-demo" },
    { id: "trip-coorg-demo-001" },
  ];
}

export default function TripWorkspacePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
          <div className="h-8 w-8 rounded-full border-3 border-emerald-800 border-t-transparent animate-spin" />
        </div>
      }
    >
      <TripWorkspaceClient />
    </React.Suspense>
  );
}

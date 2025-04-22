"use client";

import AuthGuard from "@/components/AuthGuard";
import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <HistoryList />
        </div>
      </main>
    </AuthGuard>
  );
}

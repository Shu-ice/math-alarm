"use client";

import AuthGuard from "@/components/AuthGuard";
import DailyRanking from "@/components/DailyRanking";

export default function RankingPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <DailyRanking />
        </div>
      </main>
    </AuthGuard>
  );
}

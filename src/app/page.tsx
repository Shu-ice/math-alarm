"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 flex flex-col items-center justify-center p-8 text-center space-y-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 drop-shadow">
        🌅 おはようチャレンジ
      </h1>

      <div className="space-y-4 w-full max-w-sm">
        <Link
          href="/quiz"
          className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow transition text-center"
        >
          🔥 今日のチャレンジへ
        </Link>

        <Link
          href="/ranking"
          className="block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg shadow transition text-center"
        >
          🏆 ランキングを見る
        </Link>

        <Link
          href="/history"
          className="block bg-gray-700 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg shadow transition text-center"
        >
          📜 履歴を見る
        </Link>
      </div>
    </main>
  );
}

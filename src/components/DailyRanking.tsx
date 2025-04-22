"use client";

import { useEffect, useState } from "react";
import { fetchDailyRanking } from "@/lib/fetchDailyRanking";
import { format } from "date-fns";

type RankingEntry = {
  userName: string;
  score: number;
  timeMs: number;
};

export default function DailyRanking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    fetchDailyRanking(today).then((data) => {
      setRanking(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white/80 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        🏆 {format(new Date(), "yyyy.MM.dd")} のランキング
      </h2>
      {loading ? (
        <p className="text-center">読み込み中...</p>
      ) : ranking.length === 0 ? (
        <p className="text-center text-gray-600">まだ誰も挑戦していません！</p>
      ) : (
        <ul className="space-y-2">
          {ranking.map((entry, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm"
            >
              <span className="font-semibold">
                {i + 1}位. {entry.userName}
              </span>
              <span className="text-sm text-gray-700">
                {entry.score}点 / {(entry.timeMs / 1000).toFixed(2)}秒
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Entry = {
  date: string;
  score: number;
  timeMs: number;
};

export default function HistoryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError("ログインが必要です");
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);

        const history: Entry[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          const date = data.createdAt?.toDate
            ? format(data.createdAt.toDate(), "yyyy.MM.dd")
            : "不明";
          history.push({
            date,
            score: data.score ?? 0,
            timeMs: data.timeMs ?? 0,
          });
        });

        setEntries(history);
      } catch (error) {
        console.error("🚨 Firestore 取得エラー:", error);
        setError("データの取得に失敗しました。もう一度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-white/80 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">📘 履歴</h2>
      
      {loading ? (
        <div className="py-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>読み込み中...</p>
        </div>
      ) : error ? (
        <div className="py-4 text-center text-red-500">
          <p>{error}</p>
          <Link href="/login">
            <Button className="mt-2">ログインする</Button>
          </Link>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-8 text-center text-gray-600">
          <p className="mb-4">まだ記録がありません。</p>
          <Link href="/quiz">
            <Button>チャレンジしてみる</Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm"
            >
              <span className="font-semibold">{entry.date}</span>
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

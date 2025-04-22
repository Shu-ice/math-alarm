"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { format } from "date-fns";

type Entry = {
  date: string;
  score: number;
  timeMs: number;
};

export default function HistoryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      console.log("📡 currentUser:", user);

      if (!user) {
        console.warn("❗ 未ログイン状態です（履歴は取得されません）");
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
        console.log("📄 履歴ドキュメント件数:", snap.docs.length);

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
        <p className="text-center">読み込み中...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-gray-600">まだ記録がありません。</p>
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

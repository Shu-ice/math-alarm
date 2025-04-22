import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function fetchDailyRanking(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, "quizResults"),
    where("createdAt", ">=", Timestamp.fromDate(start)),
    where("createdAt", "<=", Timestamp.fromDate(end))
  );

  const snapshot = await getDocs(q);

  const results = snapshot.docs.map(doc => doc.data() as {
    userId: string;
    userName: string;
    score: number;
    timeMs: number;
  });

  // スコア降順、同点の場合は timeMs 昇順（速い方が上）
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeMs - b.timeMs;
  });

  // 上位10件を返す
  return results.slice(0, 10);
}

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Question = {
  id: number;
  left: number;
  right: number;
  answer: number;
};

export const getTodayQuiz = async (): Promise<Question[]> => {
  const today = new Date().toISOString().split("T")[0]; // 例: "2025-04-22"
  const ref = doc(db, "dailyQuizzes", today);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    return data.questions ?? [];
  } else {
    throw new Error("今日のクイズが存在しません");
  }
};

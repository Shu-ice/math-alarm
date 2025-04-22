"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { getTodayQuiz, Question } from "@/lib/getTodayQuiz";

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(10).fill(""));
  const [results, setResults] = useState<any[] | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleStart = async () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCountdown(null);
          setStarted(true);
          loadQuiz();
          return null;
        }
        return (prev ?? 0) - 1;
      });
    }, 1000);
  };

  const loadQuiz = async () => {
    try {
      const data = await getTodayQuiz();
      setQuestions(data);
      setUserAnswers(Array(10).fill(""));
      setResults(null);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 10), 10);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err) {
      alert("クイズの取得に失敗しました");
    }
  };

  const handleChange = (i: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[i] = value;
    setUserAnswers(newAnswers);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key;
    if (["ArrowUp", "ArrowLeft"].includes(key) && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (["ArrowDown", "ArrowRight", "Enter"].includes(key)) {
      e.preventDefault();
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        document.getElementById("submit-button")?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newResults = questions.map((q, i) => ({
      question: `${q.left} × ${q.right}`,
      correct: q.answer,
      user: userAnswers[i],
      isCorrect: Number(userAnswers[i]) === q.answer,
    }));
    setResults(newResults);
    const score = newResults.filter((r) => r.isCorrect).length;
    const user = auth.currentUser;
    if (!user) {
      alert("ログインしていません");
      return;
    }
    try {
      await addDoc(collection(db, "quizResults"), {
        userId: user.uid,
        userName: user.displayName ?? "匿名",
        score,
        timeMs: elapsed,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      alert("データ保存失敗");
    }
  };

  const formatTime = (ms: number): string => {
    const sec = Math.floor(ms / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${sec}.${hundredths.toString().padStart(2, "0")}秒`;
  };

  const score = results?.filter((r) => r.isCorrect).length ?? -1;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6 flex items-center justify-center">
        {score === 10 && <Confetti numberOfPieces={250} recycle={false} />}
        <Card className="w-full max-w-3xl rounded-2xl shadow-2xl backdrop-blur-md">
          <CardContent className="p-8 space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 drop-shadow-md">
              チャレンジ {new Date().toLocaleDateString("ja-JP").replaceAll("/", ".")}
            </h1>

            {!started && countdown === null && (
              <Button onClick={handleStart} className="w-full text-lg py-6">
                スタート！
              </Button>
            )}

            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl font-extrabold text-center text-blue-500 drop-shadow-lg"
                >
                  {countdown === 0 ? "スタート！" : countdown}
                </motion.div>
              )}
            </AnimatePresence>

            {started && (
              <>
                <p className="text-center text-blue-700 text-lg font-semibold">
                  ⏱ 経過時間：{formatTime(elapsed)}
                </p>

                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex justify-center items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {q.left} × {q.right} =
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={userAnswers[i]}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        ref={(el) => (inputRefs.current[i] = el)}
                        disabled={!!results}
                        className="w-24 text-center text-2xl sm:text-3xl font-bold tracking-wide shadow-inner"
                      />
                      {results && results[i] && (
                        <span className="text-xl font-extrabold ml-2 text-red-600">
                          {results[i].isCorrect ? "⭕️" : `❌（正: ${results[i].correct}）`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  id="submit-button"
                  onClick={handleSubmit}
                  disabled={!!results}
                  className="w-full text-lg mt-6"
                >
                  採点する
                </Button>

                {results && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mt-6 bg-white/70 p-6 rounded-xl shadow-inner"
                  >
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">結果発表</h2>
                    <p className="text-xl font-semibold mb-1">
                      正解数：{score} / 10（{score * 10}点）
                    </p>
                    <p className="text-gray-600">所要時間：{formatTime(elapsed)}</p>
                  </motion.div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}

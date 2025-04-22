"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: userName });
      router.push("/");
    } catch (error) {
      alert("登録に失敗しました");
    }
  };

  return (
  <main className="min-h-screen flex items-center justify-center p-6 bg-white">
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold text-center">ユーザー登録</h1>
        <input
          type="text"
          placeholder="表示名"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow"
        >
          登録する
        </button>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="text-blue-600 hover:underline">
            こちら
          </Link>
          からログイン
        </p>
      </div>
    </div>
  </main>
);
}

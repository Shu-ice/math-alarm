"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // ✅ ログイン成功後トップページへ
    } catch (error) {
      alert("ログインに失敗しました");
    }
  };

return (
  <main className="min-h-screen bg-white flex items-center justify-center p-8">
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">ログイン</h1>
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
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow"
        >
          ログイン
        </button>
            <div className="mt-4 text-center">
        <p className="text-gray-600">
          アカウントをお持ちでない方は
          <Link href="/register" className="text-blue-600 hover:underline">
            こちら
          </Link>
          から登録
        </p>
       </div>
      </div>
    </main>
  );
}

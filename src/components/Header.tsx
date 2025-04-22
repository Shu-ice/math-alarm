// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserName(user?.displayName || null);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  if (isLoading) return null;

  // ログインページとレジストレーションページではヘッダーを表示しない
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🌅 おはようチャレンジ
        </Link>

        <div className="flex items-center gap-4">
          {pathname !== "/" && (
            <Button variant="ghost" onClick={() => router.back()}>
              ← 戻る
            </Button>
          )}
          
          <nav className="flex items-center gap-4">
            <Link 
              href="/quiz" 
              className={`hover:text-blue-600 ${pathname === '/quiz' ? 'font-bold text-blue-600' : ''}`}
            >
              クイズ
            </Link>
            <Link 
              href="/ranking" 
              className={`hover:text-blue-600 ${pathname === '/ranking' ? 'font-bold text-blue-600' : ''}`}
            >
              ランキング
            </Link>
            <Link 
              href="/history" 
              className={`hover:text-blue-600 ${pathname === '/history' ? 'font-bold text-blue-600' : ''}`}
            >
              履歴
            </Link>
          </nav>

          {userName ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 hover:text-blue-600">
                👤 {userName}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                ログアウト
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                ログイン
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

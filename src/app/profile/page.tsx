"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setName(auth.currentUser.displayName);
    }
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) {
      setStatus("error");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center text-indigo-800">プロフィール設定</h1>
          <Input
            type="text"
            placeholder="ユーザー名を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg"
          />
          <Button onClick={handleSave} disabled={loading || name.length === 0} className="w-full text-lg">
            保存する
          </Button>
          {status === "success" && <p className="text-green-600 text-center">✅ 保存しました！</p>}
          {status === "error" && <p className="text-red-600 text-center">❌ エラーが発生しました</p>}
        </CardContent>
      </Card>
    </div>
  );
}

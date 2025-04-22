// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase コンソールの「構成」から取得した値をここに貼ってください
const firebaseConfig = {
  apiKey: "AIzaSyC9lUFP73T-6HvvtUoWpdxlu0RS_np-IuI",
  authDomain: "math-alarm-fcf9c.firebaseapp.com",
  projectId: "math-alarm-fcf9c",
  storageBucket: "math-alarm-fcf9c.appspot.com",
  messagingSenderId: "959256784840",
  appId: "1:959256784840:web:3319aab26131d84a401afd"
};

// アプリを初期化
const app = initializeApp(firebaseConfig);

// 認証とデータベースのインスタンスをエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);

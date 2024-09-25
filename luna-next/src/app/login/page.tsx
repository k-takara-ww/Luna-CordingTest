'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // リダイレクト用
import { auth } from '../lib/firebase'; // Firebase認証
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/login.css';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Firebaseでログインを試行
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ログイン成功後、ホームページにリダイレクト
      router.push('/home');
    } catch (err: any) {
      // 認証エラー時のメッセージ
      setError("メールアドレスかパスワードが間違っています");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <h1 className="form-title">ログイン</h1>

        {/* エラーメッセージをタイトルとメールアドレス入力フォームの間に表示 */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
        />

        <button type="submit">ログイン</button>

        {/* パスワードリセットページへのリンク */}
        <p onClick={() => router.push('/reset-password')} className="forgot-password-link">
          パスワードを忘れた場合はこちら
        </p>

        {/* 新規登録ページへのリンク */}
        <p onClick={() => router.push('/signup')} className="signup-link">
          新規登録はこちら
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

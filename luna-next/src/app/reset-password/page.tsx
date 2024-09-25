'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // リダイレクト用
import { auth } from '../lib/firebase'; // Firebase認証
import { sendPasswordResetEmail } from 'firebase/auth';
//import '../styles/reset-password.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // パスワードリセット処理
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("パスワードリセットのメールが送信されました。");
    } catch (err: any) {
      setError("有効なメールアドレスを入力してください。");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handlePasswordReset}>
        <h1 className="form-title">パスワードをリセット</h1>

        {/* メール送信メッセージ */}
        {message && <p className="message">{message}</p>}

        {/* エラーメッセージ */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
        />

        <button type="submit">リセットリンクを送信</button>

        {/* ログインに戻るリンク */}
        <p onClick={() => router.push('/login')} className="forgot-password-link">
          ログインに戻る
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

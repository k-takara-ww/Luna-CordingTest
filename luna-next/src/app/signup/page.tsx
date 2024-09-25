// app/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorMessages } from '../lib/errorMessages'; 
import '../styles/signup.css';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        email,
        birthday,
        gender,
        termsAccepted,
      });

      console.log("ユーザー登録成功:", user);
    } catch (err: any) {
      const errorMessage = errorMessages[err.code] || "不明なエラーが発生しました。";
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
        <form onSubmit={handleSignUp}>
        <h1 className="form-title">ユーザー登録</h1>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ユーザー名" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" required />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="パスワードを再入力" required />
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">性別を選択</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
            </select>
            <div className="checkbox-container">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                <a href="https://www.notion.so/a714620bbd8740d1ac98f2326fbd0bbc?pvs=21" target="_blank" rel="noopener noreferrer">利用規約</a>に同意
                </label>
            </div>
            <button type="submit">登録</button>
            {error && <p>{error}</p>}
        </form>
    </div>
);
};

export default SignUpPage;

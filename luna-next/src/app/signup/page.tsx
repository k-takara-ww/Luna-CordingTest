'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // リダイレクト用
import { auth, storage } from '../lib/firebase'; // Firebase認証とStorageの初期化
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // 画像アップロード用
import { errorMessages } from '../lib/errorMessages'; 
import '../styles/signup.css';

const SignUpPage = () => {
  const router = useRouter(); // ページ遷移用
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null); // プロフィール画像の状態管理
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null); // プレビュー用のURL
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ユーザー名バリデーション
  const validateUsername = (value: string) => {
    if (value.length < 3 || value.length > 10) {
      return 'ユーザー名は3文字以上10文字以下で入力してください。';
    }
    return '';
  };

  // メールアドレスバリデーション
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '有効なメールアドレスを入力してください。';
    }
    return '';
  };

  // パスワードバリデーション
  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return 'パスワードは6文字以上で入力してください。';
    }
    return '';
  };

  // パスワード確認バリデーション
  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      return 'パスワードが一致しません。';
    }
    return '';
  };

  // 各フォームのフォーカスが外れたときにバリデーションを実行
  const handleUsernameBlur = () => {
    setValidationErrors((prev) => ({
      ...prev,
      username: validateUsername(username),
    }));
  };

  const handleEmailBlur = () => {
    setValidationErrors((prev) => ({
      ...prev,
      email: validateEmail(email),
    }));
  };

  const handlePasswordBlur = () => {
    setValidationErrors((prev) => ({
      ...prev,
      password: validatePassword(password),
    }));
  };

  const handleConfirmPasswordBlur = () => {
    setValidationErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(),
    }));
  };

  // プロフィール画像の選択時の処理
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file)); // 選択した画像をプレビュー用に表示
    }
  };

  // サインアップ処理
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーションエラーがある場合は処理を中断
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      // Firebase Authenticationでユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // プロフィール画像をアップロードする（存在する場合のみ）
      let profileImageUrl = '';
      if (profileImage) {
        const profileImageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(profileImageRef, profileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      // Firestoreにユーザー情報とUIDを保存
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        username,
        email,
        birthday,
        gender,
        profileImageUrl, // プロフィール画像のURLをFirestoreに保存
        termsAccepted,
      });

      // 成功後に/homeへリダイレクト
      router.push('/home');
    } catch (err: any) {
      console.error("Firestoreの書き込みでエラー発生:", err);
      const errorMessage = errorMessages[err.code] || "不明なエラーが発生しました。";
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignUp}>
        <h1 className="form-title">ユーザー登録</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={handleUsernameBlur}
          placeholder="ユーザー名"
          required
        />
        {validationErrors.username && <p className="error-message">{validationErrors.username}</p>}
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          placeholder="メールアドレス"
          required
        />
        {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={handlePasswordBlur}
          placeholder="パスワード"
          required
        />
        {validationErrors.password && <p className="error-message">{validationErrors.password}</p>}
        
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={handleConfirmPasswordBlur}
          placeholder="パスワードを再入力"
          required
        />
        {validationErrors.confirmPassword && <p className="error-message">{validationErrors.confirmPassword}</p>}
        
        <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
        
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">性別を選択</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>

        {/* プロフィールアイコンは任意 */}
        <label htmlFor="profileImage" className="profile-image-label">プロフィールアイコンを選択（任意）</label>
        <input type="file" id="profileImage" accept="image/*" onChange={handleProfileImageChange} />
        
        {profileImagePreview && <img src={profileImagePreview} alt="プロフィールアイコンのプレビュー" className="profile-image-preview" />}

        <div className="checkbox-container">
          <input type="checkbox" id="terms" onChange={() => setTermsAccepted(!termsAccepted)} required /> {/* チェックボックスの状態を管理 */}
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

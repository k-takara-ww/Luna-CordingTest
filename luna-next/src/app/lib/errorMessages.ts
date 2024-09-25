// src/lib/errorMessages.ts
// firebase認証のエラーを日本語に訳す

export const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'このメールアドレスはすでに使用されています。',
    'auth/invalid-email': '無効なメールアドレスです。',
    'auth/operation-not-allowed': 'この操作は許可されていません。',
    'auth/weak-password': 'パスワードは6文字以上にする必要があります。',
    // 他のエラーコードも必要に応じて追加
  };
  
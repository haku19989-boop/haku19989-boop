/**
 * Japanese Learning App - Authentication & Cloud Sync Client
 * Designed for privacy-first, zero-PII architecture.
 * Ready for seamless Supabase / Firebase integration in Step 2.
 */
(function() {
  const STORAGE_KEY_CURRENT_USER = 'jlpt_current_user';
  const STORAGE_KEY_USERS_DB = 'jlpt_users_mock_db';

  class AuthManager {
    constructor() {
      this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT_USER) || 'null');
      this.listeners = [];
    }

    onAuthStateChanged(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
        callback(this.currentUser);
      }
    }

    notify() {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(this.currentUser));
      this.listeners.forEach(cb => cb(this.currentUser));
    }

    getCurrentUser() {
      return this.currentUser;
    }

    isLoggedIn() {
      return !!this.currentUser;
    }

    // Step 1: Local Mock Database (Step 2 will connect to Supabase Cloud)
    getUsersDB() {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    }

    saveUsersDB(users) {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    }

    async register(name, email, password) {
      const trimmedName = (name || '').trim();
      const trimmedEmail = (email || '').trim().toLowerCase();
      
      if (!trimmedName) throw new Error('ニックネームを入力してください。');
      if (!trimmedEmail || !trimmedEmail.includes('@')) throw new Error('正しいメールアドレスを入力してください。');
      if (!password || password.length < 6) throw new Error('パスワードは6文字以上で設定してください。');

      const users = this.getUsersDB();
      const existing = users.find(u => u.email === trimmedEmail);
      if (existing) {
        throw new Error('このメールアドレスは既に登録されています。ログインをお試しください。');
      }

      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: trimmedName,
        email: trimmedEmail,
        createdAt: new Date().toISOString()
      };

      users.push({ ...newUser, password: password }); // Step 1 mock (In step 2, password is encrypted in Supabase Auth)
      this.saveUsersDB(users);

      this.currentUser = newUser;
      this.notify();
      return newUser;
    }

    async login(email, password) {
      const trimmedEmail = (email || '').trim().toLowerCase();
      if (!trimmedEmail || !trimmedEmail.includes('@')) throw new Error('メールアドレスを入力してください。');
      if (!password) throw new Error('パスワードを入力してください。');

      const users = this.getUsersDB();
      const user = users.find(u => u.email === trimmedEmail && u.password === password);

      if (!user) {
        throw new Error('メールアドレスまたはパスワードが正しくありません。');
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };

      this.currentUser = safeUser;
      this.notify();
      return safeUser;
    }

    logout() {
      this.currentUser = null;
      this.notify();
    }
  }

  window.AppAuth = new AuthManager();
})();

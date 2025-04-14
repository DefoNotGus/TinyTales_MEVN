import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => state.token !== null && state.user !== null,
    isGuest: (state) =>
      state.user !== null &&
      state.token === null &&
      state.user.authortype === 'guest',
  },
  actions: {
    login(newToken, userData) {
      try {
        this.token = newToken;
        this.user = userData;
        this.error = null;
      } catch (e) {
        this.error = 'Login failed. Please try again.';
        console.error(e);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
    },
    setToken(newToken) {
      this.token = newToken;
    },
    setUser(userData) {
      this.user = userData;
    },
  },
  persist: true, // 🔐 Persists token + user across refresh
});

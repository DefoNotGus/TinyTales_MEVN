import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const error = ref(null);

  const isLoggedIn = () => token.value !== null;

  const login = (newToken, userData) => {
    try {
      token.value = newToken;
      user.value = userData;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      error.value = null; // Clear error on success
    } catch (e) {
      error.value = 'Login failed. Please try again.';
      console.error(e);
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
    error,
  };
});

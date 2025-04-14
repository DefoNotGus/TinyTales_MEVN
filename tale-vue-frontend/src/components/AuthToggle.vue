<template>
  <div class="auth-toggle">
    <button :class="{ active: isLoginPage }" @click="goTo('/login')">Sign in</button>
    <button :class="{ active: !isLoginPage }" @click="goTo('/register')">Register</button>
  </div>

  <div class="guest-login">
    <button @click="loginAsGuest">👻 Continue as Guest</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const isLoginPage = computed(() => route.path === '/login');

const goTo = (path) => {
  if (route.path !== path) {
    router.push(path);
  }
};

const loginAsGuest = async () => {
  try {
    const { data } = await axios.post('/api/guest/login');
    const token = data.token;

    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    auth.setToken(token);
    auth.setUser(decoded);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    router.push('/home');
  } catch (err) {
    console.error("Guest login failed:", err);
  }
};
</script>

<style scoped>
.auth-toggle {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2.5rem auto 1.5rem;
  max-width: 600px;
}

.auth-toggle button {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1.25rem;
  background: linear-gradient(to right, #38b2ac, #319795);
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.auth-toggle button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.auth-toggle button.active {
  background: linear-gradient(to right, #a7f3d0, #81e6d9);
  color: #1a202c;
  cursor: default;
  opacity: 0.95;
  box-shadow: none;
}

/* Guest Login Button */
.guest-login {
  text-align: center;
  margin-top: 1rem;
}

.guest-login button {
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: #f1f5f9;
  border: 2px dashed #888;
  border-radius: 10px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.guest-login button:hover {
  background-color: #e6fffa;
  transform: translateY(-2px);
}
</style>


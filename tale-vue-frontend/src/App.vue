<!-- App.vue -->
<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token && token !== 'undefined' && token !== 'null') {
    try {
      // Check if Pinia already restored it
      if (!auth.token || !auth.user) {
        const decoded = jwtDecode(token);

        if (decoded && decoded.username) {
          auth.setToken(token);
          auth.setUser(decoded);
        } else {
          console.warn("Decoded token is invalid or missing username.");
          auth.logout();
        }
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error("Invalid token", err);
      auth.logout();
    }
  } else if (auth.user && !auth.token) {
    // Guest case
    auth.logout();
  }
});

</script>




<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.top-bar {
  background-color: #f4f4f4;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar span {
  font-size: 0.95rem;
}

.top-bar button {
  background-color: #eee;
  border: 1px solid #aaa;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.top-bar button:hover {
  background-color: #ccc;
}
</style>

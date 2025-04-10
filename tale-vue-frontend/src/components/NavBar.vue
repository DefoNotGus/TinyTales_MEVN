<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="navbar">
    <!-- Logo (left) -->
    <div class="nav-logo">
      <img src="/src/assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Links (center) -->
    <div class="nav-center">
    <button @click="router.push('/')">Home</button>
    <button v-if="auth.isLoggedIn()" @click="router.push('/create')">Create</button>
    <button v-if="auth.isLoggedIn()" @click="router.push('/profile')">{{ auth.user.username }}'s </button>
    <button v-if="auth.isLoggedIn()" @click="router.push('/settings')">Settings</button>
    </div>

    <!-- Logout (right) -->
    <div class="nav-right">
      <button v-if="auth.isLoggedIn()" @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #006A6A, #A9A9F5);
  color: white;
  flex-wrap: wrap;
}

.nav-logo img.logo {
  height: auto;
  width: 50px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.nav-right {
  display: flex;
  align-items: center;
}

router-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

router-link:hover {
  text-decoration: underline;
}

button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.nav-center button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  margin: 0 0.3rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.nav-center button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #f0f0f0;
}

</style>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const isGuest = () => auth.user?.role === 'guest';
const isUser = () => auth.user && auth.user.role !== 'guest';


const handleLogoutOrJoin = () => {
  if (auth.isGuest || auth.isLoggedIn) {
    auth.logout();
    router.push('/login');
  } else {
    router.push('/login');
  }
};


</script>

<template>
  <nav class="navbar">
    <!-- Logo (left) -->
    <div class="nav-logo">
      <img src="/src/assets/logo.png" alt="Logo" class="logo" />
    </div>

    <!-- Navigation Links -->
    <div class="nav-center">
      <button @click="router.push('/home')">Home</button>

      <!-- Guest-only links -->
      <template v-if="isGuest()">
        <button @click="router.push('/create')">Create</button>
      </template>

      <!-- Real user links -->
      <template v-if="isUser()">
        <button @click="router.push('/create')">Create</button>
        <button @click="router.push('/profile')">{{ auth.user.username }}'s</button>
        <button @click="router.push('/settings')">Settings</button>
        <button @click="router.push('/ranks')">Ranks</button>
      </template>
    </div>

    <!-- Right-side button -->
    <div class="nav-right">
      <button @click="handleLogoutOrJoin">
        {{ isGuest() ? 'Log in | Join in' : 'Logout' }}
      </button>
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
  flex-wrap: wrap;
}

.nav-right {
  display: flex;
  align-items: center;
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

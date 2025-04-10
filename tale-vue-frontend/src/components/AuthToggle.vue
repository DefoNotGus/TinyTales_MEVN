<template>
    <div class="auth-toggle">
      <button
        :class="{ active: isLoginPage }"
        @click="goTo('/login')"
      >
      Sign in
      </button>
      <button
        :class="{ active: !isLoginPage }"
        @click="goTo('/register')"
      >
      Register
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  const isLoginPage = computed(() => route.path === '/login');
  
  const goTo = (path) => {
    if (route.path !== path) {
      router.push(path);
    }
  };
  </script>
  
  <style scoped>
  .auth-toggle {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 2rem auto;
    max-width: 400px;
  }
  
  button {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    background-color: #f5f6f9; /* Subtle blue by default */
    color: #333;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background-color: #d0fcdf;
  }
  
  button.active {
    background-color: #e0e0e0; /* Soft grey */
    color: #000;
    border-color: #bbb;
    cursor: default;
    opacity: 0.7;
  }
  
  button.active:hover {
    background-color: #e0e0e0; /* No hover effect when active */
  }
  </style>
  
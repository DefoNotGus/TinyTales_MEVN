<!-- pages/HomePage.vue -->
<script setup>
import TalesList from '../components/TalesList.vue';
import NavBar from '../components/NavBar.vue'; // Import NavBar component
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isLoggedIn = ref(localStorage.getItem('token') !== null);

const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  router.push('/login');
};
</script>

<template>
  <div>
    <NavBar /> <!-- Add NavBar component -->
    <TalesList />
  </div>
</template>

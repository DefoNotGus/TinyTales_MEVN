<template>
    <div class="page-background">
      <div class="auth-container">
        <AuthToggle />
        <AuthForm
          title="Login"
          buttonLabel="Login"
          v-model:email="email"
          v-model:password="password"
          :error="error"
          :showUsername="false"
          @submit="handleLogin"
        />
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '../stores/auth';
  import AuthToggle from '../components/AuthToggle.vue';
  import AuthForm from '../components/AuthForm.vue';
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  const router = useRouter();
  const toast = useToast();
  const auth = useAuthStore();
  
  const handleLogin = async () => {
    error.value = '';
    try {
      const res = await axios.post('http://localhost:3000/api/users/login', {
        email: email.value.trim(),
        password: password.value,
      });
  
      auth.login(res.data.token, res.data.user);
      toast.success(`🎉 Welcome back, ${res.data.user.username}!`, {
        timeout: 3000,
        position: 'top-center',
        closeOnClick: true,
        });

      router.push('/home');
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed.';
    }
  };
  </script>
  
  <style scoped>
  .page-background {
  min-height: 100vh;
  background-image: url('../assets/welcome-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* ✅ Align content to the top */
  padding-top: 4rem;        /* ✅ Push content slightly down */
}

.auth-container {
  background-color: rgba(255, 255, 255, 0.2); /* ✅ See-through white */
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  padding: 0;                
  overflow: hidden;          
  width: 100%;
  max-width: 420px;
  height: auto;               
  min-height: 400px;          
  max-height: 90vh; 
}
  </style>
<template>
<div class="page-background">
<div class="auth-container">
    <AuthToggle />
    <AuthForm
      title="Register"
      buttonLabel="Sign Up"
      v-model:username="username"
      v-model:email="email"
      v-model:password="password"
      :error="error"
      :showUsername="true"
      @submit="handleRegister"
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
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  const router = useRouter();
  const toast = useToast();
  const auth = useAuthStore();
  
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };
  
  const handleRegister = async () => {
    error.value = '';
  
    // ✅ Validate password first
    if (!validatePassword(password.value)) {
      error.value =
        'Password must be at least 8 characters and include a number, uppercase, lowercase, and symbol.';
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:3000/api/users/signup', {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value,
      });
  
      // ✅ Login and greet
      auth.login(res.data.token, res.data.user);
      toast.success(`🎉 Welcome back, ${res.data.user.username}!`, {
        timeout: 3000,
        position: 'top-center',
        closeOnClick: true,
      });
  
      router.push('/home');
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed.';
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
  align-items: flex-start; 
  padding-top: 4rem;        
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

<template>
  <div class="page-background">
    <transition name="zoom-fade" mode="out-in">
      <div class="auth-layout" :key="$route.path">
        <!-- Left: Register Form -->
        <div class="auth-container">
          <AuthToggle class="toggle-top" />
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

        <!-- Right: Flippable Tale -->
        <BookTale :pages="pages" :height="formHeight" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';
import AuthToggle from '../components/AuthToggle.vue';
import AuthForm from '../components/AuthForm.vue';
import BookTale from '../components/BookTale.vue'; // ✅ NEW

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const pages = ref([
  "Once written in haste, the code wandered server to server, causing bugs and blessings.",
  "No one knew its author, only its echo through stack traces.",
  "One day it vanished into the void.",
  "Some say it lives in forgotten GitHub repos, waiting to be summoned again."
]);

const formHeight = ref(0);
onMounted(() => {
  nextTick(() => {
    const auth = document.querySelector('.auth-container');
    formHeight.value = auth?.offsetHeight || 450;
  });
});

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

onBeforeMount(() => {
  if (auth.user || auth.token) {
    console.log(auth.user);
    auth.logout();
    console.log(auth.user);
  }
});

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

const handleRegister = async () => {
  error.value = '';
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

    auth.login(res.data.token, res.data.user);
    toast.success(`🎉 Welcome, ${res.data.user.username}!`, {
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
  padding-top: 3rem;
}

.auth-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
}

.auth-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
}

.toggle-top {
  align-self: flex-end;
  margin-bottom: 1rem;
}

/* 🔄 Zoom Transition */
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: all 0.4s ease;
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* 📱 Mobile */
@media (max-width: 768px) {
  .auth-layout {
    flex-direction: column;
    align-items: center;
  }
}
</style>

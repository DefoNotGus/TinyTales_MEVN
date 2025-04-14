<template>
  <div class="page-background">
    <transition name="zoom-fade" mode="out-in">
      <div class="auth-layout" :key="$route.path">
        <!-- Left: Login Form -->
        <div class="auth-container">
          <AuthToggle class="toggle-top" />
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
import BookTale from '../components/BookTale.vue';

const email = ref('');
const password = ref('');
const error = ref('');

const formHeight = ref(0);
const pages = ref([
  "Every full moon, the lights flicker at the abandoned inn.",
  "Guests swear they hear footsteps and laughter—yet the door has been locked for decades.",
  "Locals believe a bride once vanished there, her veil drifting through the halls.",
  "No one stays past midnight..."
]);

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

onBeforeMount(() => {
  if (auth.user || auth.token) {
    console.log('Cleaning up:', auth.user);
    auth.logout();
    console.log('After logout:', auth.user);
  }
});

onMounted(() => {
  nextTick(() => {
    const auth = document.querySelector('.auth-container');
    formHeight.value = auth?.offsetHeight || 450;
  });
});

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

/* 📱 Responsive */
@media (max-width: 768px) {
  .auth-layout {
    flex-direction: column;
    align-items: center;
  }
}
</style>

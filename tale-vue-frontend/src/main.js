// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuthStore } from './stores/auth'; // 👈 ADD THIS

axios.defaults.baseURL = 'http://localhost:3000';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia); // 👈 Mount Pinia first so auth store can be used

// ✅ Manually restore auth store if needed (before interceptor)
const authStore = useAuthStore();


// ✅ Now safe to use token in axios headers
axios.interceptors.request.use((config) => {
  if (authStore?.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

app.use(router);
app.use(Toast);
app.mount('#app');

// File: src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../pages/Login.vue';
import RegisterView from '../pages/Register.vue';
import HomePage from '../pages/HomePage.vue';
import CreateView from '../pages/Create.vue';
import ProfileView from '../pages/Profile.vue';
import SettingsView from '../pages/Settings.vue';
import RankView from '../pages/Rank.vue';


const requireAuth = (to, from, next) => {
  const auth = useAuthStore();
  if (!auth.isLoggedIn) next('/login'); // ✅ fixed
  else next();
};

const rejectAuth = (to, from, next) => {
  const auth = useAuthStore();
  if (auth.isLoggedIn) next('/home'); // ✅ fixed
  else next();
};

const routes = [
  {
    path: '/login',
    component: LoginView,
    beforeEnter: rejectAuth,
  },
  {
    path: '/register',
    component: RegisterView,
    beforeEnter: rejectAuth,
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: HomePage,
    beforeEnter: requireAuth,
  },
  {
    path: '/create',
    component: CreateView,
    beforeEnter: requireAuth,
  },
  {
    path: '/profile',
    component: ProfileView,
    beforeEnter: requireAuth,
  },
  {
    path: '/ranks',
    component: RankView,
    beforeEnter: requireAuth,
  },
  {
    path: '/settings',
    component: SettingsView,
    beforeEnter: requireAuth,
  },
  {
    path: '/logout',
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) return next('/login'); // ✅ fixed
      auth.logout();
      next('/login');
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

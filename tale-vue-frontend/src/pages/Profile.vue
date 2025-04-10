<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import NavBar from '../components/NavBar.vue';

const auth = useAuthStore();
const allTales = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedFilter = ref('all'); // default view

const loadUserTales = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/tales');
    // Filter tales by current user
    allTales.value = response.data.data
      .filter(tale => tale.author === auth.user.username)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Error fetching user tales:', err);
    error.value = 'Failed to load your tales.';
  } finally {
    loading.value = false;
  }
};

// ✅ Clean separation with ghost priority
const ghostTales = computed(() =>
  allTales.value.filter(t => t.authortype === 'ghost')
);

const publicTales = computed(() =>
  allTales.value.filter(
    t => t.authortype !== 'ghost' && t.visibility === 'public'
  )
);

const privateTales = computed(() =>
  allTales.value.filter(
    t => t.authortype !== 'ghost' && t.visibility === 'private'
  )
);

const visibleTales = computed(() => {
  switch (selectedFilter.value) {
    case 'public': return publicTales.value;
    case 'private': return privateTales.value;
    case 'ghost': return ghostTales.value;
    default:
      return [
        ...ghostTales.value,
        ...publicTales.value,
        ...privateTales.value
      ];
  }
});

onMounted(loadUserTales);
</script>

<template>
  <div>
    <NavBar />
    <div class="profile-page">
      <h2>Your Tales</h2>

      <div class="filter-buttons">
        <button @click="selectedFilter = 'all'" :class="{ active: selectedFilter === 'all' }">📖 All</button>
        <button @click="selectedFilter = 'public'" :class="{ active: selectedFilter === 'public' }">🌍 Public</button>
        <button @click="selectedFilter = 'private'" :class="{ active: selectedFilter === 'private' }">🔒 Private</button>
        <button @click="selectedFilter = 'ghost'" :class="{ active: selectedFilter === 'ghost' }">👻 Ghost</button>
      </div>

      <div v-if="loading">Loading your tales...</div>
      <div v-else-if="error">{{ error }}</div>

      <ul v-else class="tale-list">
        <li v-for="tale in visibleTales" :key="tale._id" :class="['tale-card', { ghost: tale.authortype === 'ghost' }]">
          <h4>{{ tale.title }}</h4>
          <p>{{ tale.content }}</p>
          <p><strong>Visibility:</strong> {{ tale.visibility }}</p>
          <p><strong>Type:</strong> {{ tale.authortype }}</p>
        </li>
      </ul>

      <p v-if="!visibleTales.length && !loading" style="text-align: center; margin-top: 2rem;">
        No tales to show in this category.
      </p>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-buttons button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-buttons button.active,
.filter-buttons button:hover {
  background-color: #6c3483;
  color: white;
}

.tale-list {
  list-style: none;
  padding: 0;
}

.tale-card {
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #ddd;
}

.tale-card.ghost {
  background: linear-gradient(to right, #f5f8f4, #ece7f9);
  border: 2px dashed #b7a6e8;
}
</style>

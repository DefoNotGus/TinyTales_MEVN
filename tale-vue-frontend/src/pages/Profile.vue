<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';
import TaleFilters from '../components/TaleFilters.vue';
import TaleCard from '../components/TaleCard.vue';
import TaleChanger from '../components/TaleChanger.vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const allTales = ref([]);
const selectedFilter = ref('all');
const selectedTaleId = ref(null);
const showChanger = ref(false);

// 🧲 Load tales by the logged-in user
const loadUserTales = async () => {
  try {
    const response = await axios.get('/api/tales');
    allTales.value = response.data.data
      .filter(t => t.author === auth.user.username)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('❌ Failed to load tales:', err);
  }
};

// 🧼 Filter tales based on user-selected type
const filteredTales = () => {
  let tales = allTales.value;

  // 🎯 Apply filtering
  if (selectedFilter.value === 'ghost') {
    tales = tales.filter(t => t.authortype === 'ghost');
  } else if (selectedFilter.value === 'public' || selectedFilter.value === 'private') {
    tales = tales.filter(t => t.visibility === selectedFilter.value && t.authortype !== 'ghost');
  }
  // 'top' and 'all' don't filter anything

  // 🔢 Apply sorting
  if (selectedFilter.value === 'top') {
    const getRating = (roses) => {
      const rateMap = { tomato: 0, low: 1, 'mid-low': 2, mid: 3, 'mid-high': 4, high: 5 };
      let total = 0, count = 0;
      for (const key in roses || {}) {
        const value = rateMap[key] ?? 0;
        const votes = roses[key]?.length || 0;
        total += value * votes;
        count += votes;
      }
      return count === 0 ? 0 : total / count;
    };
    tales = tales.slice().sort((a, b) => getRating(b.roses) - getRating(a.roses));
  } else {
    tales = tales.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return tales;
};


// 🧙 Open/close tale editor
const openTale = (id) => {
  selectedTaleId.value = id;
  showChanger.value = true;
};

const closeTale = () => {
  selectedTaleId.value = null;
  showChanger.value = false;
  loadUserTales(); // 🔄 Refresh list after managing
};

onMounted(loadUserTales);
</script>

<template>
  <NavBar />
  <div class="profile-page">
    <h2>Your Tales</h2>
    <TaleFilters v-model="selectedFilter" />

    <ul v-if="!showChanger" class="tale-list">
      <TaleCard
        v-for="tale in filteredTales()"
        :key="tale._id"
        :tale="tale"
        @open="openTale"
      />
    </ul>

    <p v-if="!filteredTales().length && !showChanger">
      No tales to show in this category.
    </p>

    <TaleChanger
      v-show="showChanger"
      :taleId="selectedTaleId"
      :onClose="closeTale"
    />
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

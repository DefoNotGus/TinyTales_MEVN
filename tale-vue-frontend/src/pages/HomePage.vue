<script setup>
import TaleList from '../components/TalesList.vue';
import NavBar from '../components/NavBar.vue';
import FilterHP from '../components/FilterHP.vue';
import TaleReader from '../components/TaleReader.vue';
import { useAuthStore } from '../stores/auth';
import { ref, onMounted } from 'vue'; // ✅ Add onMounted here
import axios from 'axios'; // ✅ Add this



const selectedTaleId = ref(null);
const showReader = ref(false);

const handleReadTale = (id) => {
  openTale(id);
};


const openTale = (id) => {
  selectedTaleId.value = id;
  showReader.value = true;
};

const closeReader = () => {
  selectedTaleId.value = null;
  showReader.value = false;
};

const allTales = ref([]);
const filteredTales = ref([]);
const auth = useAuthStore();

const loadTales = async () => {
  const res = await axios.get('http://localhost:3000/api/tales');
  allTales.value = res.data.data.filter(t => t.visibility === 'public');
  filteredTales.value = [...allTales.value];
};

function applyFilter({ type, value }) {
  const now = new Date();
  if (type === 'all') {
  filteredTales.value = [...allTales.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  } else if (type === 'liked') {
    filteredTales.value = allTales.value.filter(t =>
      t.likes?.some(l => l.username === auth.user.username)
    );
  } else if (type === 'new') {
    filteredTales.value = allTales.value.filter(t =>
      !t.likes?.some(l => l.username === auth.user.username) &&
      Object.values(t.roses || {}).every(arr => !arr.includes(auth.user.username))
    );
  } else if (type === 'famehall') {
    filteredTales.value = allTales.value
      .filter(t => {
        const created = new Date(t.createdAt);
        return (now - created) / (1000 * 60 * 60 * 24) <= 7;
      })
      .sort((a, b) => calcRating(b.roses) - calcRating(a.roses));
  } else if (type === 'goldenpen') {
    const writerRatings = {};
    allTales.value.forEach(t => {
      const rating = calcRating(t.roses);
      if (!writerRatings[t.author]) writerRatings[t.author] = [];
      writerRatings[t.author].push(rating);
    });
    const bestWriter = Object.entries(writerRatings)
      .map(([author, ratings]) => ({ author, avg: ratings.reduce((a, b) => a + b, 0) / ratings.length }))
      .sort((a, b) => b.avg - a.avg)[0]?.author;
    filteredTales.value = allTales.value
      .filter(t => t.author === bestWriter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  } else if (type === 'genre') {
    filteredTales.value = allTales.value.filter(t => t.genre === value);
  } else if (type === 'search') {
    filteredTales.value = allTales.value.filter(t => t.author === value);
  }
}

function calcRating(roses) {
  const weights = { tomato: 0, low: 1, 'mid-low': 2, mid: 3, 'mid-high': 4, high: 5 };
  let total = 0, count = 0;
  Object.entries(roses || {}).forEach(([k, v]) => {
    total += weights[k] * v.length;
    count += v.length;
  });
  return count ? total / count : 0;
}

onMounted(loadTales);
</script>

<template>
  <div>
    <NavBar />
    <FilterHP @update-filter="applyFilter" />
    <TaleList :tales="filteredTales" @read-tale="handleReadTale" @reload="loadTales" />
    <TaleReader
      v-if="showReader"
      :taleId="selectedTaleId"
      :onClose="closeReader"
    />
  </div>
</template>

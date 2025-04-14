<template>
  <div class="filter-bar">
    <button @click="filter('all')" title="Show all public tales">🧾 All</button>
    <button @click="filter('liked')" title="Tales you cheered or liked">❤️ Liked</button>
    <button @click="filter('new')" title="Tales you haven’t read or rated yet">🆕 New</button>
    <button @click="filter('famehall')" title="Top-rated tales from the past week">🏆 Fame Hall</button>
    <button @click="filter('goldenpen')" title="Best recent tales by the top writer">✒️ Golden Pen</button>

    <select
      v-model="selectedGenre"
      @change="filter('genre', selectedGenre)"
      title="Filter tales by genre"
    >
      <option disabled value="">🎭 Genre</option>
      <option value="all">All Genres</option>
      <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
    </select>

    <input
      type="text"
      v-model="searchId"
      placeholder="🔍 Writer ID"
      @keyup.enter="filter('search', searchId)"
      title="Search for tales by writer's username"
    />
  </div>
</template>

  
  <script setup>
  import { ref, onMounted  } from 'vue';
  
  const emit = defineEmits(['update-filter']);
  const genres = ['horror', 'myth', 'joke', 'legend', 'conspiracy'];
  const selectedGenre = ref('');
  const searchId = ref('');
  
  function filter(type, value = null) {
    if (type === 'genre' && value === 'all') {
      emit('update-filter', { type: 'all' });
      selectedGenre.value = '';
      return;
    }
    emit('update-filter', { type, value });
  }
  onMounted(() => {
  filter('all');
});
  </script>
  
  <style scoped>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 10px;
    justify-content: center;
  }
  
  button, select, input {
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  
  button:hover, select:hover, input:focus {
    background-color: #e8e8e8;
    outline: none;
  }
  </style>
  
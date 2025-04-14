<script setup>
const modelValue = defineModel();
</script>

<template>
  <div class="filter-buttons">
    <button @click="modelValue = 'all'" :class="{ active: modelValue === 'all' }">📖 All</button>
    <button @click="modelValue = 'public'" :class="{ active: modelValue === 'public' }">🌍 Public</button>
    <button @click="modelValue = 'private'" :class="{ active: modelValue === 'private' }">🔒 Private</button>
    <button @click="modelValue = 'ghost'" :class="{ active: modelValue === 'ghost' }">👻 Ghost</button>
    <button @click="modelValue = 'top'" :class="{ active: modelValue === 'top' }">🏆 Top Rated</button>

  </div>
</template>

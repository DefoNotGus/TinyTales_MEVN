<script setup>
import { computed } from 'vue';

const props = defineProps({ tale: Object });
const emit = defineEmits(['open']);

// 🌹 Rating map including new "high"
const rateMap = {
  tomato: 0,
  low: 1,
  'mid-low': 2,
  mid: 3,
  'mid-high': 4,
  high: 5,
};

const calculatedRating = computed(() => {
  if (!props.tale.roses) return 0;

  let total = 0;
  let count = 0;

  for (const key in props.tale.roses) {
    const value = rateMap[key];
    const ratings = props.tale.roses[key];
    if (value !== undefined && Array.isArray(ratings)) {
      total += value * ratings.length;
      count += ratings.length;
    }
  }

  return count === 0 ? 0 : total / count;
});
</script>

<template>
  <li :class="['tale-card', { ghost: tale.authortype === 'ghost' }]">
    <h4>{{ tale.title }}</h4>
    <p>{{ tale.content.slice(0, 100) }}...</p>
    <p><strong>Visibility:</strong> {{ tale.visibility }}</p>
    <p><strong>Written as:</strong> {{ tale.authortype }}</p>
    <p><strong>Toasts:</strong> 🍻 {{ tale.likes?.length || 0 }}</p>
    <p><strong>Genre:</strong> {{ tale.genre || 'N/A' }}</p>

    <p>
      <strong>Rating:</strong>
      <span v-if="!calculatedRating || calculatedRating === 0">0.0 🍅</span>
      <span v-else>{{ calculatedRating.toFixed(1) }} 🌹</span>
    </p>

    <button @click="emit('open', tale._id)">Manage 🪶</button>
  </li>
</template>

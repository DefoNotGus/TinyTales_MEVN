<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(['update:modelValue']);

const rawText = ref(props.modelValue || '');
const method = ref('none'); // 'none', 'leet-easy', 'leet-hard'

// update rawText if parent changes modelValue
watch(() => props.modelValue, (val) => {
  rawText.value = val;
});

// watch only rawText — not method toggle
watch(rawText, () => {
  emit('update:modelValue', applyProtection(rawText.value));
});

// apply protection manually when method changes
watch(method, () => {
  emit('update:modelValue', applyProtection(rawText.value));
});

// transformation logic
const applyProtection = (text) => {
  if (method.value === 'leet-easy') return leetify(text, 'easy');
  if (method.value === 'leet-hard') return leetify(text, 'hard');
  return text;
};

const leetify = (text, level) => {
  const easyMap = { a: '4', e: '3', i: '1', o: '0', s: '$', t: '7' };
  const hardMap = {
    a: '@', b: '8', c: '(', d: '|)', e: '3', g: '9', h: '#', i: '!',
    l: '1', o: '0', s: '$', t: '+', z: '2'
  };
  const map = level === 'easy' ? easyMap : hardMap;
  return text.split('').map(char => map[char.toLowerCase()] ?? char).join('');
};

const toggleMethod = () => {
  if (method.value === 'none') method.value = 'leet-easy';
  else if (method.value === 'leet-easy') method.value = 'leet-hard';
  else method.value = 'none';
};

const lockIcon = () => {
  if (method.value === 'leet-easy') return '🔒';
  if (method.value === 'leet-hard') return '🔒➕';
  return '🔓';
};
</script>

<template>
  <div class="protector-box">
    <button class="emoji-toggle" type="button" @click="toggleMethod" :title="method.toUpperCase()">
      {{ lockIcon() }}
    </button>
    <span class="label-text">
      Text Protection:
      <strong v-if="method === 'leet-easy'">L337 Easy</strong>
      <strong v-else-if="method === 'leet-hard'">L337 Hard</strong>
      <strong v-else>None</strong>
    </span>
    <p class="info" v-if="method !== 'none'">
      🛡️ Your tale will be scrambled to deter AI scrapers. Users will see a decode option.
    </p>
  </div>
</template>

<style scoped>
.protector-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fdf9ff;
  flex-wrap: wrap;
}

.emoji-toggle {
  font-size: 1.8rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}
.emoji-toggle:hover {
  transform: scale(1.2);
}

.label-text {
  font-size: 1rem;
}

.info {
  font-size: 0.85rem;
  color: #555;
  width: 100%;
}
</style>

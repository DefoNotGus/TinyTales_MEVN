<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  encrypted: String,
});

const method = ref('none'); // 'none', 'leet-easy', 'leet-hard'

// Cycle through decoding modes
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

// Decryption (de-leet)
const deleetify = (text, level) => {
  const reverseEasy = { '4': 'a', '3': 'e', '1': 'i', '0': 'o', '$': 's', '7': 't' };
  const reverseHard = {
    '@': 'a', '8': 'b', '(': 'c', '|)': 'd', '3': 'e', '9': 'g',
    '#': 'h', '!': 'i', '1': 'l', '0': 'o', '$': 's', '+': 't', '2': 'z'
  };
  const map = level === 'easy' ? reverseEasy : reverseHard;
  let result = text;

  // Replace longer tokens like '|)' first to avoid partial replacements
  const sorted = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const leet of sorted) {
    const regex = new RegExp(leet.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g');
    result = result.replace(regex, map[leet]);
  }

  return result;
};

// Compute displayed output
const output = computed(() => {
  if (method.value === 'leet-easy') return deleetify(props.encrypted, 'easy');
  if (method.value === 'leet-hard') return deleetify(props.encrypted, 'hard');
  return props.encrypted;
});
</script>

<template>
  <div class="protector-reader-box">
    <button class="emoji-toggle" @click="toggleMethod" :title="method.toUpperCase()">
      {{ lockIcon() }}
    </button>
    <span class="label-text">
      Decryption:
      <strong v-if="method === 'leet-easy'">L337 Easy</strong>
      <strong v-else-if="method === 'leet-hard'">L337 Hard</strong>
      <strong v-else>None</strong>
    </span>

    <div class="decrypted-preview mt-2">
      <p v-for="(paragraph, idx) in output.split('\n')" :key="idx" class="decrypted-text">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.protector-reader-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  background: #fefeff;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.emoji-toggle {
  font-size: 1.8rem;
  background: transparent;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  transition: transform 0.2s;
}
.emoji-toggle:hover {
  transform: scale(1.2);
}

.label-text {
  font-size: 1rem;
}

.decrypted-preview {
  background: #f9fbff;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.decrypted-text {
  margin-bottom: 0.8rem;
  line-height: 1.6;
}
</style>

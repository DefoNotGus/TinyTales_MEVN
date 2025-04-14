<script setup>
defineProps(['title', 'content', 'author', 'authortype']);
</script>

<template>
  <div class="tale-content">
    <h3 class="title">{{ title }}</h3>
    <p>{{ content }}</p>
    <div class="author">
      <strong>Author:</strong>
      <span v-if="authortype === 'ghost'">👻 ghosty (ghost)</span>
      <span v-else>{{ author }} ({{ authortype }})</span>
    </div>
  </div>
</template>

<style scoped>
.tale-content {
  background-color: rgba(255, 255, 255, 0.6);
  padding: 1rem;
  border-radius: 8px;
}

.title {
  text-align: left;
  margin-top: 0;
}

.author {
  text-align: right;
  color: #333;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>

<script setup>
import { useAuthStore } from '../stores/auth';
import RoseRating from './RoseRating.vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  taleId: String,
  likes: Array,
  comments: Array
});

const emit = defineEmits(['like-tale']);

const auth = useAuthStore();

const tryLike = () => {
  if (!auth.user || !auth.user.username) {
    alert("Please log in to cheer!");
    return;
  }
  emit('like-tale', props.taleId);
};
</script>

<template>
  <div class="stats">
    <div class="likes">
      <button 
        @click="tryLike" 
        :disabled="!auth.user || !auth.user.username"
        title="Login to cheer"
      >
        🍻 Cheers!
      </button>
      <span>{{ likes?.length || 0 }} Toasts</span>
    </div>

    <div class="rating">
      <RoseRating :taleId="taleId" />
    </div>

    <div class="comment-count">
      💬 {{ comments?.length || 0 }} Comments
    </div>
  </div>
</template>


<style scoped>
.stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f9f1ff, #ece8ff);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  font-weight: 600;
  margin-top: 1rem;
}

.likes,
.comment-count,
.rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
  color: #4c3b6e;
}

.likes button {
  background-color: #8e44ad;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.likes button:hover:not(:disabled) {
  background-color: #732d91;
}

.likes button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
  opacity: 0.7;
}

.rating {
  justify-content: center;
}

.comment-count {
  justify-content: flex-end;
}
</style>
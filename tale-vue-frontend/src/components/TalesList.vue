<template>
  <div>
    <h2>Tales Dashboard</h2>

    <div v-if="!tales || tales.length === 0" class="loading-message">
      No tales to show.
    </div>

    <ul v-else class="tale-list">
      <TaleCardHP
        v-for="tale in tales"
        :key="tale._id"
        :tale="tale"
        @read-tale="handleReadTale"
        @like-tale="likeTale"
        @comment-posted="$emit('reload')"
      />
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';
import TaleCardHP from '../components/TaleCardHP.vue';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';

const props = defineProps({
  tales: Array
});

const emit = defineEmits(['read-tale', 'reload']);

const toast = useToast();
const auth = useAuthStore();

const handleReadTale = (id) => {
  emit('read-tale', id);
};

const likeTale = async (id) => {
  if (!auth.isLoggedIn) {
    toast.error("Please log in to cheer.");
    return;
  }

  try {
    await axios.patch(`http://localhost:3000/api/tales/${id}/like`, {
      username: auth.user.username,
    }, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });
    emit('reload'); // Let HomePage.vue reload tales
  } catch (err) {
    console.error('Like error:', err.response?.data || err.message);
    toast.error('Failed to like the tale.');
  }
};
</script>




<style scoped>
/* Container for the full tale list */
.tale-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Tale card design */
.tale-card {
  width: 95%;
  max-width: 700px;
  margin-bottom: 2rem;
  padding: 2rem;
  border-radius: 16px;
  background: linear-gradient(to bottom right, #fffafc, #d3dfde);
  border: 2px solid #e5d0f2;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tale-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Ghost styling */
.tale-card.ghost {
  background: linear-gradient(to bottom right, #d8dadc, #c2c3bc);
  border: 2px dashed #d6b9ff;
  color: #311524;
}

/* Header */
h2 {
  text-align: center;
  padding-bottom: 2rem;
  font-size: 2rem;
  color: #5e2e6e;
}
.author-likes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 1.2rem;
}

.author {
  font-size: 0.95rem;
  font-weight: 500;
  color: #4a4a4a;
}
/* Likes section */
.likes {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.likes button {
  background-color: #be357e;
  color: white;
  font-weight: bold;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.likes button:hover {
  background-color: #a32667;
}

/* Comments section */
.comments {
  margin-top: 1.5rem;
  text-align: left;
}

.comments h4 {
  font-size: 1.1rem;
  color: #5c3b6e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-list {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0 1rem;
}

.comment-list li {
  padding: 0.3rem 0;
  border-bottom: 1px dashed #ddd;
  font-size: 0.95rem;
  color: #444;
}

/* Comment form */
.comment-form {
  display: flex;
  gap: 0.5rem;
}

.comment-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.comment-button {
  background-color: #5e2e6e;
  color: white;
  font-weight: bold;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.comment-button:hover {
  background-color: #4a2157;
}

/* Toggle button for comments */
.toggle-btn {
  background: none;
  border: none;
  color: #8b5fbf;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toggle-btn:hover {
  color: #5e2e6e;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #5e2e6e;
  margin-top: 2rem;
}

.read-more-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f3e6ff;
  border: 2px solid #7d3c98;
  border-radius: 6px;
  font-weight: bold;
  color: #5e2e6e;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.read-more-btn:hover {
  background-color: #ecd6ff;
}

</style>

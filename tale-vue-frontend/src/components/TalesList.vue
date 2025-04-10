<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';

const toast = useToast();
const auth = useAuthStore();

const tales = ref([]);
const loading = ref(true);
const error = ref(null);
const commentText = ref({});
const expandedTales = ref(new Set());

const loadTales = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/tales');
    tales.value = response.data.data
      .filter(t => t.visibility === 'public')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  } catch (err) {
    console.error('Error fetching tales:', err);
    error.value = 'Failed to load tales.';
  } finally {
    loading.value = false;
  }
};

const likeTale = async (id) => {
  try {
    await axios.patch(`http://localhost:3000/api/tales/${id}/like`, {
      username: auth.user.username,
    });
    await loadTales();
  } catch (err) {
    console.error('Like error:', err.response?.data || err.message);
    toast.error('Failed to like the tale.');
  }
};

const submitComment = async (taleId) => {
  const text = commentText.value[taleId];
  if (!text || !text.trim()) return;

  try {
    await axios.post(`http://localhost:3000/api/tales/${taleId}/comments`, {
      commenter: auth.user.username,
      text: text.trim(),
    });

    commentText.value[taleId] = '';
    toast.success('Comment added!');
    await loadTales();
  } catch (err) {
    console.error('Comment error:', err.response?.data || err.message);
    toast.error('Failed to post comment.');
  }
};

const toggleComments = (id) => {
  if (expandedTales.value.has(id)) {
    expandedTales.value.delete(id);
  } else {
    expandedTales.value.add(id);
  }
};

onMounted(loadTales);
</script>

<template>
  <div>
    <h2>Public Tales</h2>

    <div v-if="loading" class="loading-message">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <ul v-else class="tale-list">
      <li
        v-for="tale in tales"
        :key="tale._id"
        :class="['tale-card', { ghost: tale.authortype === 'ghost' }]"
      >
        <h3>{{ tale.title }}</h3>
        <p>{{ tale.content }}</p>
        <div class="author-likes">
            <div class="author">
                <strong>Author:</strong>
                <span v-if="tale.authortype === 'ghost'">👻 ghosty (ghost)</span>
                <span v-else>{{ tale.author }} ({{ tale.authortype }})</span>
            </div>

            <!-- Likes -->
            <div class="likes">
            <button @click="likeTale(tale._id)">🍻 Cheers!</button>
            <span>{{ tale.likes?.length || 0 }} Toasts </span>
            </div>
        </div>

        <!-- Comments -->
        <div class="comments">
          <h4>
            Comments
            <button @click="toggleComments(tale._id)">
              {{ expandedTales.has(tale._id) ? '▲ Hide' : '▼ Show All' }}
            </button>
          </h4>

          <ul class="comment-list">
            <!-- Show only last comment unless expanded -->
            <template v-if="!expandedTales.has(tale._id)">
              <li v-if="tale.comments.length > 0">
                <strong>{{ tale.comments.at(-1).commenter }}</strong>:
                {{ tale.comments.at(-1).text }}
              </li>
            </template>
            <template v-else>
              <li v-for="(comment, index) in tale.comments" :key="index">
                <strong>{{ comment.commenter }}</strong>: {{ comment.text }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="submitComment(tale._id)" class="comment-form">
            <input
              v-model="commentText[tale._id]"
              type="text"
              placeholder="Add a comment..."
              class="comment-input"
            />
            <button type="submit" class="comment-button">💬</button>
          </form>
        </div>

        <hr />
      </li>
    </ul>
  </div>
</template>

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
</style>

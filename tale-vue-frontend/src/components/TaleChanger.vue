<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const props = defineProps({ taleId: String, onClose: Function });
const tale = ref(null);
const loading = ref(true);
const editing = ref(false);
const auth = useAuthStore();

const fetchTale = async (id) => {
  if (!id) return;
  loading.value = true;
  try {
    const { data } = await axios.get(`/api/tales/${id}`);
    tale.value = data.data;
  } catch (err) {
    console.error('❌ Error loading tale:', err);
  } finally {
    loading.value = false;
  }
};

const updateTale = async () => {
  try {
    await axios.put(`/api/tales/${props.taleId}`, {
      title: tale.value.title,
      content: tale.value.content,
      authortype: tale.value.authortype,
      visibility: tale.value.visibility,
      genre: tale.value.genre,
    });
    editing.value = false;
    await fetchTale(props.taleId); // refresh tale after save
  } catch (err) {
    console.error('Update failed:', err);
  }
};

const toggleVisibility = () => {
  tale.value.visibility = tale.value.visibility === 'public' ? 'private' : 'public';
};

const deleteTale = async () => {
  if (!confirm('Are you sure you want to permanently delete this tale?')) return;
  try {
    await axios.delete(`/api/tales/${props.taleId}`);
    props.onClose();
  } catch (err) {
    console.error('❌ Delete failed:', err);
    alert('Failed to delete tale. Try again.');
  }
};

const deleteComment = async (commentId) => {
  try {
    await axios.delete(`/api/tales/${props.taleId}/comments/${commentId}`);
    await fetchTale(props.taleId);
  } catch (err) {
    console.error('Delete comment failed:', err);
  }
};

const deleteGuestComment = async (commentId) => {
  try {
    await axios.delete(`/api/tales/${props.taleId}/guestcomments/${commentId}`);
    await fetchTale(props.taleId);
  } catch (err) {
    console.error('Delete guest comment failed:', err);
  }
};

const convertGuestComment = async (guestComment) => {
  try {
    const guestToken = `${guestComment.guestId}${guestComment.emoji}`;
    const payload = {
      text: guestComment.text,
      commenter: guestComment.commenter || '👻Ghost',
      guestauthor: guestComment.commenter ? null : guestToken,
    };
    await axios.post(`/api/tales/${props.taleId}/comments`, payload, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    await deleteGuestComment(guestComment._id);
  } catch (err) {
    console.error('❌ Conversion failed:', err);
  }
};

// Re-fetch when taleId changes
watch(() => props.taleId, fetchTale);
onMounted(() => fetchTale(props.taleId));

// Rating calculation
const computeRating = (roses) => {
  const rateMap = { tomato: 0, low: 1, 'mid-low': 2, mid: 3, 'mid-high': 4, high: 5 };
  let total = 0, count = 0;
  for (const key in roses || {}) {
    const value = rateMap[key] ?? 0;
    const votes = roses[key]?.length || 0;
    total += value * votes;
    count += votes;
  }
  return count === 0 ? '0.0' : (total / count).toFixed(1);
};
</script>


<template>
  <div class="overlay">
    <div class="changer-box">
      <button class="close-btn" @click="props.onClose">✖</button>

      <div v-if="loading">Loading tale...</div>

      <div v-else-if="tale">
        <div class="changer-content">
          <div class="meta-bar">
            <span>🍻 {{ tale.likes?.length || 0 }}</span>
            <span>🌹 {{ computeRating(tale.roses) }}</span>
            <button @click="toggleVisibility">
              {{ tale.visibility === 'public' ? '🌍 Public' : '🔒 Private' }}
            </button>
          </div>

          <div v-if="editing">
            <input v-model="tale.title" class="edit-input" />
            <textarea v-model="tale.content" rows="6" class="edit-input" />

            <label><strong>Authortype:</strong></label>
            <select v-model="tale.authortype" class="edit-input">
              <option value="novice">Novice</option>
              <option value="lector">Lector</option>
              <option value="storyteller">Storyteller</option>
              <option value="ghost">Ghost</option>
            </select>

            <label><strong>Genre:</strong></label>
            <select v-model="tale.genre" class="edit-input">
              <option disabled value="">Select a genre</option>
              <option value="horror">Horror</option>
              <option value="myth">Myth</option>
              <option value="joke">Joke</option>
              <option value="legend">Legend</option>
              <option value="conspiracy">Conspiracy</option>
            </select>


            <button @click="updateTale">📜 Save</button>
            <button @click="editing = false">❌ Cancel</button>
          </div>

          <div v-else>
            <h2>{{ tale.title }}</h2>
            <p><strong>By:</strong> {{ tale.author }} ({{ tale.authortype }})</p>
            <div class="scrollable-tale-content">
              {{ tale.content }}
            </div>
            <button @click="editing = true">✏️ Edit</button>
          </div>

          <hr />

          <div class="comments-section">
            <h4>💬 Comments ({{ tale.comments.length }})</h4>
            <ul>
              <li v-for="comment in tale.comments" :key="comment._id">
                <strong>{{ comment.commenter }}</strong>: {{ comment.text }}
                <button
                  v-if="auth.user?.username === tale.author"
                  @click="deleteComment(comment._id)"
                >🗑️</button>
              </li>
            </ul>
          </div>

          <div class="comments-section">
            <h4>👻 Guest Comments ({{ tale.guestcomments.length }})</h4>
            <ul>
              <li v-for="guestComment in tale.guestcomments" :key="guestComment._id">
                <strong>👤 Guest</strong>: {{ guestComment.text }}
                <div>
                  <button @click="deleteGuestComment(guestComment._id)">🗑️</button>
                  <button @click="convertGuestComment(guestComment)">👤 Convert</button>
                </div>
              </li>
            </ul>
          </div>

          <hr />
          <div class="delete-section">
            <h4>🗑️ Delete Tale</h4>
            <button @click="deleteTale" class="btn btn-danger">Delete This Tale</button>
          </div>
        </div>
      </div>

      <div v-else>
        <p>⚠️ Tale not found.</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #2ecc71, #f39c12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: auto;
  opacity: 0.95;
}

.changer-box {
  background: #ffffffee;
  padding: 2rem;
  max-width: 900px;
  width: 95%;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: transparent;
  font-size: 20px;
  border: none;
  cursor: pointer;
}

.edit-input {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.changer-content {
    max-height: 70vh;
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 1rem;
  margin-bottom: 1rem;
}

.meta-bar {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 8px;
  margin-bottom: 12px;
}

.meta-bar > * {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
}

.comments-section {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.comments-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comments-section li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.comments-section button {
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 16px;
}

.comments-section button:hover {
  color: #c0392b;
}

.scrollable-tale-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #fefefe;
  border: 1px solid #ddd;
  border-radius: 8px;
  white-space: pre-wrap;
}

.delete-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #fff6f6;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.confirm-input {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
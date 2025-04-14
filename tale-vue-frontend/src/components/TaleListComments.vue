<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  taleId: String,
  comments: Array
});

const emit = defineEmits(['comment-posted']);
const auth = useAuthStore();
const toast = useToast();

const commentText = ref('');
const expanded = ref(false);
const showGuestPopup = ref(false);
const guestID = ref('');
const guestEmoji = ref('');

const emojis = [
  '👻', '🦊', '🦁', '🐶', '🦜', '🐺', '🦧', '🤠',
  '👹', '🐉', '🧙‍♂️', '🧛‍♀️', '🦄', '🐲', '🕷️', '💀',
  '🎃', '👺', '🐸', '🙈', '🦝', '🐵', '🐙', '👽',
  '👾', '🐻', '🧟‍♂️', '👮‍♂️', '🧞‍♂️', '🕵️‍♀️', '🐥', '🧌'
]
;

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const generateGuestInfo = () => {
  guestID.value = Math.floor(100000 + Math.random() * 900000).toString();
  guestEmoji.value = emojis[Math.floor(Math.random() * emojis.length)];
};

const submitComment = async () => {
  if (!commentText.value.trim()) return;

  // Logged-in user comment
  if (auth.user && auth.user.username) {
    try {
      await fetch(`http://localhost:3000/api/tales/${props.taleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          commenter: auth.user.username,
          text: commentText.value.trim(),
        }),
      });
      commentText.value = '';
      toast.success('Comment added!');
      emit('comment-posted');
    } catch (err) {
      toast.error('Failed to post comment.');
      console.error('Comment error:', err);
    }
  } else {
    // Guest comment
    showGuestPopup.value = true;
    generateGuestInfo();
  }
};

const confirmGuestComment = async () => {
  try {
    const guestToken = `${guestID.value}${guestEmoji.value}`;

    await fetch(`http://localhost:3000/api/tales/${props.taleId}/guestcomments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId: guestID.value,
        emoji: guestEmoji.value,
        text: commentText.value.trim(),
        commenter: guestToken, // 👈 this is the new part
        guestauthor: guestToken // 👈 optional, if you're using this field as the match token
      }),
    });

    toast.success(`Guest comment added! Keep your reference: ${guestToken}`);
    commentText.value = '';
    showGuestPopup.value = false;
    emit('comment-posted');
  } catch (err) {
    toast.error('Failed to post guest comment.');
    console.error('Guest comment error:', err);
  }
};

</script>

<template>
  <div class="comments">
    <h4>
      Comments
      <button class="toggle-btn" @click="toggleExpanded">
        {{ expanded ? '▲ Hide' : '▼ Show All' }}
      </button>
    </h4>

    <ul class="comment-list">
      <template v-if="!expanded">
        <li v-if="comments.length > 0">
          <strong>{{ comments.at(-1).commenter }}</strong>:
          {{ comments.at(-1).text }}
        </li>
      </template>
      <template v-else>
        <li v-for="(comment, index) in comments" :key="index">
          <strong>{{ comment.commenter }}</strong>: {{ comment.text }}
        </li>
      </template>
    </ul>

    <form @submit.prevent="submitComment" class="comment-form">
      <input
        v-model="commentText"
        type="text"
        placeholder="Add a comment..."
        class="comment-input"
      />
      <button type="submit" class="comment-button">💬</button>
    </form>

    <!-- Guest popup -->
    <div v-if="showGuestPopup" class="popup">
      <div class="popup-content">
        <p><strong>Guest Comment:</strong></p>
        <p>Your temporary guest ID is <code>{{ guestID + guestEmoji }}</code>.</p>
        <p>Please save this in case you want to delete your comment later!</p>
        <button @click="confirmGuestComment">Confirm & Post</button>
        <button @click="showGuestPopup = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.popup {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
</style>

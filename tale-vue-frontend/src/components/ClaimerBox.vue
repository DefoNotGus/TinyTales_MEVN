<template>
    <div class="claimer-box">
      <h3>🪄 Claim Your Guest Contributions</h3>
      <p class="claimer-description">
        Enter the 6-digit code and emoji you used when posting anonymously to claim your tales and comments.
      </p>
  
      <input
        v-model="digits"
        type="text"
        maxlength="6"
        placeholder="6-digit code"
        class="claimer-input"
      />
  
      <select v-model="selectedEmoji" class="claimer-input">
        <option disabled value="">Choose your emoji</option>
        <option v-for="emoji in emojiList" :key="emoji" :value="emoji">
          {{ emoji }}
        </option>
      </select>
  
      <button
        class="claimer-button"
        :disabled="!isFormValid"
        @click="claimContent"
      >
        Claim Contributions
      </button>
  
      <p v-if="statusMessage" class="claimer-status">{{ statusMessage }}</p>
    </div>
  </template>
  
  <script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const user = auth.user;

const digits = ref('');
const selectedEmoji = ref('');
const statusMessage = ref('');

const emojiList = [
  '👻', '🦊', '🦁', '🐶', '🦜', '🐺', '🦧', '🤠',
  '👹', '🐉', '🧙‍♂️', '🧛‍♀️', '🦄', '🐲', '🕷️', '💀',
  '🎃', '👺', '🐸', '🙈', '🦝', '🐵', '🐙', '👽',
  '👾', '🐻', '🧟‍♂️', '👮‍♂️', '🧞‍♂️', '🕵️‍♀️', '🐥', '🧌'
];

const isFormValid = computed(() => digits.value.length === 6 && selectedEmoji.value !== '');

const claimContent = async () => {
  const token = `${digits.value}${selectedEmoji.value}`;
  statusMessage.value = '🔍 Searching for matching comments and tales...';

  try {
    const res = await fetch('http://localhost:3000/api/tales');
    const response = await res.json();
    const tales = Array.isArray(response) ? response : response.data;

    let commentsClaimed = 0;
    let talesClaimed = 0;

    for (const tale of tales) {
      let modified = false;

      // 🧾 Claim tale if receipt matches
      const claimingTale = tale.receipt === token && tale.author === '👻Guest';
      if (claimingTale) {
        talesClaimed++;
        modified = true;
      }

      // 💬 Update guestcomments
      const updatedGuestComments = tale.guestcomments.map(comment => {
        const guestToken = `${comment.guestId}${comment.emoji}`;
        if (guestToken === token && (!comment.commenter || comment.commenter === '👻Ghost')) {
          commentsClaimed++;
          modified = true;
          return {
            ...comment,
            commenter: user.username,
            guestauthor: null
          };
        }
        return comment;
      });

      // 💬 Update regular comments
      const updatedComments = tale.comments.map(comment => {
        if (comment.guestauthor === token && (!comment.commenter || comment.commenter === '👻Ghost')) {
          commentsClaimed++;
          modified = true;
          return {
            ...comment,
            commenter: user.username,
            guestauthor: null
          };
        }
        return comment;
      });

      if (modified) {
        const payload = {
          title: tale.title,
          content: tale.content,
          author: claimingTale ? user.username : tale.author,
          authortype: claimingTale ? 'storyteller' : tale.authortype,
          visibility: tale.visibility,
          genre: tale.genre,
          comments: updatedComments,
          guestcomments: updatedGuestComments,
          receipt: claimingTale ? null : tale.receipt
        };

        const updateRes = await fetch(`http://localhost:3000/api/tales/${tale._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify(payload)
        });

        if (!updateRes.ok) {
          console.error(`❌ Failed to update tale ${tale._id}`);
        }
      }
    }

    const parts = [];
    if (commentsClaimed) parts.push(`💬 ${commentsClaimed} comment(s)`);
    if (talesClaimed) parts.push(`📖 ${talesClaimed} tale(s)`);

    statusMessage.value = parts.length
      ? `🎉 Successfully claimed ${parts.join(' and ')}!`
      : `😕 No matching contributions found.`;

  } catch (err) {
    console.error(err);
    statusMessage.value = '❌ An error occurred. Try again later.';
  }
};
</script>


  
  <style scoped>
  .claimer-box {
    margin-top: 2.5rem;
    padding: 1.5rem;
    border-radius: 16px;
    background: linear-gradient(to bottom right, #f9f4fc, #f3ecf9);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
    text-align: center;
  }
  
  .claimer-box h3 {
    color: #6c3483;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .claimer-description {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 1.2rem;
  }
  
  .claimer-input {
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .claimer-button {
    width: 100%;
    padding: 0.7rem;
    background-color: #6c3483;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .claimer-button:hover {
    background-color: #58296c;
  }
  
  .claimer-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  
  .claimer-status {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #444;
  }
  </style>
  
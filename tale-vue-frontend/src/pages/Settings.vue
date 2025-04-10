<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';

const auth = useAuthStore();
const toast = useToast();
const router = useRouter();

const userId = ref(auth.user?._id || '');
const email = ref(auth.user?.email || '');
const username = ref(auth.user?.username || '');
const usertype = ref(auth.user?.usertype || 'novice');
const password = ref('');

const updating = ref(false);
const deleting = ref(false);

onMounted(() => {
  if (!userId.value) {
    toast.error('User info missing. Please log in again.');
    router.push('/login');
  }
});

const suggestUsername = async () => {
  try {
    const response = await axios.get('https://random-word-api.herokuapp.com/word?number=1');
    const word = response.data[0];
    username.value = `Sir_${word}`;
  } catch (err) {
    toast.error('⚠️ Failed to fetch username suggestion.');
  }
};

const isUsernameUnique = async (newUsername) => {
  if (newUsername === auth.user?.username) return true; // unchanged, allow it

  try {
    const res = await axios.get('http://localhost:3000/api/users/');
    const allUsers = res.data.data; // ← THIS IS THE FIX
    const exists = allUsers.some(user => user.username === newUsername);
    return !exists;
  } catch (err) {
    console.error(err);
    toast.error('❌ Failed to check existing usernames.');
    return false;
  }
};


const handleUpdate = async () => {
  if (password.value && password.value.length < 8) {
    toast.error('🔒 Password must be at least 8 characters.');
    return;
  }

  if (!username.value) {
    toast.error('Username is required.');
    return;
  }

  const usernameAvailable = await isUsernameUnique(username.value);
  if (!usernameAvailable && username.value !== auth.user?.username) {
    toast.error('Username already taken.');
    return;
  }

  try {
    updating.value = true;

    const updates = {
      username: username.value,
      usertype: usertype.value,
    };

    if (password.value) {
      updates.password = password.value;
    }

    await axios.put(
      `http://localhost:3000/api/users/${auth.user._id}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    toast.success('✅ Account updated!');
    password.value = '';
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update account.');
  } finally {
    updating.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('⚠️ Are you sure you want to delete your account?')) return;

  try {
    deleting.value = true;
    await axios.delete(`http://localhost:3000/api/users/${auth.user._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    toast.success('👋 Account deleted.');
    auth.logout();
    router.push('/login');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete account.');
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
    <div>
      <NavBar />
      <div class="settings-page">
        <h2>Account Settings</h2>
  
        <form @submit.prevent="handleUpdate" class="settings-form">
          <label for="email">Email (not changeable)</label>
          <div class="non-editable">{{ email }}</div>
  
          <label for="username">Username</label>
          <div class="username-row">
            <input id="username" v-model="username" type="text" required />
            <button type="button" @click="suggestUsername">🎲 Suggest</button>
          </div>
  
          <label for="password">New Password (optional)</label>
          <input id="password" v-model="password" type="password" placeholder="At least 8 characters" />
  
          <label for="usertype">User Type</label>
          <select id="usertype" v-model="usertype">
            <option value="novice">🐣 Novice</option>
            <option value="lector">🧐 Lector</option>
            <option value="storyteller">📝 Storyteller</option>
            <option value="ghost">👻 Ghost</option>
          </select>
  
          <button type="submit" :disabled="updating">
            {{ updating ? 'Updating...' : 'Update Account' }}
          </button>
        </form>
  
        <div class="delete-section">
          <hr />
          <h4>Danger Zone</h4>
          <p>Deleting your account will remove all your tales and comments.</p>
          <button class="delete-button" @click="handleDelete" :disabled="deleting">
            {{ deleting ? 'Deleting...' : '🗑️ Delete My Account' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  

  <style scoped>
  .settings-page {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 16px;
    background: linear-gradient(to bottom right, #fefefe, #f4f0f9);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }
  
  h2 {
    text-align: center;
    color: #4b2d5c;
    margin-bottom: 2rem;
  }
  
  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .settings-form label {
    font-weight: 600;
    color: #555;
  }
  
  .settings-form input,
  .settings-form select {
    padding: 0.6rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    background-color: #fff;
  }
  
  .settings-form button {
    margin-top: 1rem;
    padding: 0.7rem;
    background-color: #6c3483;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .settings-form button:hover {
    background-color: #58296c;
  }
  
  .settings-form button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  
  .delete-section {
    text-align: center;
    margin-top: 3rem;
  }
  
  .delete-section p {
    margin: 0.5rem 0 1rem;
    color: #8c8c8c;
    font-size: 0.9rem;
  }
  
  .delete-button {
    padding: 0.6rem 1.2rem;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }
  
  .delete-button:disabled {
    background-color: #d2a6a3;
    cursor: not-allowed;
  }
  </style>
  

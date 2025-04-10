<!-- src/pages/Create.vue -->
<template>
    <div class="create-page">
      <NavBar />
  
      <div class="form-container">
        <h2>Submit a New Tale</h2>
        <form @submit.prevent="handleSubmit">
        <div class="form-group">
            <label for="title">Title</label>
            <input id="title" v-model="title" type="text" class="form-control" required />
        </div>

        <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" v-model="content" rows="6" class="form-control" required></textarea>
        </div>

        <div class="form-group">
            <label for="author">Author</label>
            <input id="author" v-model="author" type="text" class="form-control" readonly />
        </div>

        <div class="form-group">
            <label for="authortype">Author Type</label>
            <select id="authortype" v-model="authorType" class="form-control">
            <option value="novice">Novice</option>
            <option value="lector">Lector</option>
            <option value="storyteller">Storyteller</option>
            <option value="ghost">Ghost</option>
            </select>
        </div>

        <div class="form-group d-flex justify-content-between align-items-center">
            <label>Visibility</label>
            <button type="button" @click="toggleVisibility" class="visibility-toggle">
            <i :class="visibility === 'public' ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            {{ visibility }}
            </button>
        </div>

        <button type="submit" class="btn btn-teal w-100 mt-3">Submit Tale</button>
        </form>
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavBar from '../components/NavBar.vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const toast = useToast();
const auth = useAuthStore();
const router = useRouter();

const title = ref('');
const content = ref('');
const author = ref('');
const authorType = ref('novice');
const visibility = ref('public');

onMounted(() => {
  author.value = auth.user?.username || '';
});

const toggleVisibility = () => {
  visibility.value = visibility.value === 'public' ? 'private' : 'public';
};

const handleSubmit = async () => {
  const tale = {
    title: title.value.trim(),
    content: content.value.trim(),
    author: author.value.trim(),
    authortype: authorType.value,
    visibility: visibility.value,
  };

  try {
    const res = await axios.post('http://localhost:3000/api/tales', tale, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    toast.success('📖 Tale submitted successfully!');
    title.value = '';
    content.value = '';
    authorType.value = 'novice';
    visibility.value = 'public';

    // 🚀 Redirect to home page
    router.push('/home');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to submit tale.');
  }
};
</script>

  
  
  <style scoped>
.create-page {
  min-height: 100vh;
  user-select: none; /* 🔒 Prevents text highlighting */
}

.form-container {
  background: linear-gradient(175deg, #604b46, #56435f, #896a9c); /* brown → wine → purple */
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  color: #f5f5f5;
  font-family: 'Segoe UI', sans-serif;
  user-select: none;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #ffe6f7; /* Light wine */
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  background: #f9f0f5; /* very light wine-pink */
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  color: #2e2e2e;
}

input::placeholder,
textarea::placeholder {
  color: #9a4d7c;
  font-style: italic;
}

textarea {
  resize: vertical;
}

select {
  background-color: #f9f0f5;
}

.btn-teal {
  background-color: #006a6a;
  color: white;
  font-weight: bold;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-teal:hover {
  background-color: #005353;
}

.visibility-toggle {
  background: #fff;
  border: 2px solid #8e44ad;
  color: #6a1b9a;
  font-weight: bold;
  font-size: 1.25rem; /* ⬆️ Larger toggle */
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.visibility-toggle:hover {
  background: #fce4ec;
  color: #4a148c;
}

.visibility-toggle i {
  font-size: 1.5rem; /* ⬆️ Bigger icon */
}
  </style>
  
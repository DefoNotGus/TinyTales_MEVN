<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TextProtectorReader from './TextProtectorReader.vue'; // ✅ Import

const props = defineProps({
  taleId: String,
  onClose: Function,
});

const tale = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await axios.get(`/api/tales/${props.taleId}`);
    tale.value = data.data;
  } catch (err) {
    console.error('Error loading tale:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="overlay">
    <div class="reader-box">
      <button class="close-btn" @click="onClose">✖</button>

      <div v-if="loading" class="loading">📚 Loading tale...</div>

      <div v-else-if="tale">
        <h2 class="tale-title">{{ tale.title }}</h2>
        <p class="tale-author">
          <strong>By:</strong> {{ tale.author }} ({{ tale.authortype }})
        </p>

        <div class="tale-content">
          <!-- ✅ Always show the decryption UI -->
          <TextProtectorReader
            :encrypted="tale.content"
            :method="tale.protection?.method || 'none'"
            :difficulty="tale.protection?.difficulty || 'easy'"
            :shift="tale.protection?.shift || 3"
          />
        </div>
      </div>

      <div v-else class="not-found">
        ⚠️ Tale not found.
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
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.reader-box {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #000;
}

.loading {
  font-size: 1.3rem;
  text-align: center;
  color: #5e2e6e;
}

.tale-title {
  font-size: 2rem;
  margin-bottom: 0.8rem;
  color: #4a2157;
  text-align: center;
}

.tale-author {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.tale-content {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

.tale-content p {
  margin-bottom: 1.2rem;
}

.not-found {
  text-align: center;
  font-size: 1.3rem;
  color: #a00;
}
</style>

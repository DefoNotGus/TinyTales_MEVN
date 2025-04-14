<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';

const props = defineProps({
  taleId: String,
});

const auth = useAuthStore();
const toast = useToast();

const showBar = ref(false);
const average = ref(null);

const fetchRating = async () => {
  try {
    const { data } = await axios.get(`/api/tales/${props.taleId}/rose`);
    average.value = parseFloat(data.data.average || 0);
  } catch (err) {
    // silently fail
  }
};

const submitRating = async (rating) => {
  if (!auth.user || !auth.user.username) {
    toast.error("Please log in to rate this tale.");
    return;
  }

  const tiers = ['tomato', 'low', 'mid-low', 'mid', 'mid-high', 'high'];
  const index = rating === 0 ? 0 : rating;

  try {
    await axios.post(`/api/tales/${props.taleId}/rose`, {
      username: auth.user.username,
      rating: tiers[index],
    }, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });

    showBar.value = false;
    fetchRating();
  } catch (err) {
    toast.error("Rating failed.");
    console.error(err);
  }
};

const toggleBar = () => {
  if (!auth.user || !auth.user.username) {
    toast.info("Login to rate this tale.");
    return;
  }
  showBar.value = !showBar.value;
};

onMounted(fetchRating);
</script>

<template>
  <div class="rose-rating">
    <button class="icon-btn" @click="toggleBar" :disabled="!auth.user || !auth.user.username" title="Login to rate">
      <span v-if="average !== null">
        <span v-if="average === 0">🍅🌹</span>
        <span v-else-if="average < 1">🍅</span>
        <span v-else>🌹</span>
        {{ average }}
      </span>
      <span v-else>...</span>
    </button>

    <div v-if="showBar" class="rating-bar">
      <button @click="submitRating(0)">🍅</button>
      <button v-for="n in 5" :key="n" @click="submitRating(n)">🌹 {{ n }}</button>
    </div>
  </div>
</template>


<style scoped>
.rose-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  position: relative;
}

.icon-btn {
  background: #ffd1dc;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.rating-bar {
  display: flex;
  gap: 6px;
  background: #fff;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.rating-bar button {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.rating-bar button:hover {
  transform: scale(1.2);
}
</style>


<style scoped>
.rose-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  position: relative;
}

.icon-btn {
  background: #ffd1dc;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.rating-bar {
  display: flex;
  gap: 6px;
  background: #fff;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.rating-bar button {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.rating-bar button:hover {
  transform: scale(1.2);
}
</style>

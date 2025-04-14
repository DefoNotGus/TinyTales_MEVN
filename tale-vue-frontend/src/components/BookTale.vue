<template>
    <div
      v-if="height"
      class="book-wrapper"
      :style="{ height: height + 'px' }"
    >
      <div class="book" :style="{ height: height * 0.66 + 'px' }">
        <div class="book-page left-page">
          <p>{{ pages[currentPage] }}</p>
        </div>
        <div class="book-page right-page">
          <p>{{ pages[nextPageIndex] }}</p>
        </div>
      </div>
  
      <div class="book-nav">
        <button :disabled="currentPage <= 0" @click="prevPage">⬅ Prev</button>
        <button :disabled="currentPage >= pages.length - 2" @click="nextPage">Next ➡</button>
      </div>
  
      <div class="rose-rating" v-if="!ratingDeclined">
        <button
            class="icon-btn"
            @click="ratingAccepted ? (showBar = !showBar) : null"
            title="Rate this tale"
            :disabled="!ratingAccepted"
        >
            🌹 {{ averageRating !== null ? averageRating.toFixed(1) : '?' }}
        </button>

        <div v-if="showBar && ratingAccepted" class="rating-bar">
            <button v-for="n in 5" :key="n" @click="submitRating(n)">🌹 {{ n }}</button>
        </div>
        </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted, h } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const props = defineProps({
  height: {
    type: Number,
    required: true,
  },
});

const toast = useToast();
const ratingAccepted = ref(false);
const ratingDeclined = ref(false);
const showBar = ref(false);

const pages = ref([
  "On a riverbank, a scorpion approached a frog. ‘Please,’ said the scorpion, ‘carry me across the river.’ The frog shook his head. ‘No. You’ll sting me.’",
  "‘If I sting you,’ said the scorpion, ‘we’ll both drown. That would be foolish.’ The frog paused, thinking. ‘True… fine. Climb on.’",
  "Halfway across, the scorpion’s stinger sank into the frog’s back. As his limbs stiffened, the frog gasped, ‘Why? Now we’ll both die!’",
  "The scorpion, slipping beneath the waves, murmured..."
]);

const currentPage = ref(0);
const rating = ref(0);
const averageRating = ref(null);

const nextPageIndex = computed(() =>
  currentPage.value + 1 < pages.value.length ? currentPage.value + 1 : currentPage.value
);

const nextPage = () => {
  if (currentPage.value + 2 < pages.value.length) {
    currentPage.value += 2;
  }
};

const prevPage = () => {
  if (currentPage.value - 2 >= 0) {
    currentPage.value -= 2;
  }
};

const showDataPolicyNotice = () => {
  if (!ratingAccepted.value && !ratingDeclined.value) {
    const toastId = toast(
      {
        render() {
          return h(
            'div',
            { style: 'max-width: 300px' },
            [
              h('p', '🌹 To rate stories, you must accept our data policy.'),
              h('p', 'Your IP will be stored for 24h to prevent spam.'),
              h('div', {
                style: 'display: flex; justify-content: space-between; gap: 10px; margin-top: 10px;',
              }, [
                h('button', {
                  onClick: () => {
                    ratingAccepted.value = true;
                    showBar.value = true;
                    toast.dismiss(toastId);
                    toast.success('✅ You may now rate stories.', { position: 'bottom-right' });
                  },
                  style: 'background: #38b2ac; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;',
                }, 'Accept'),
                h('button', {
                  onClick: () => {
                    ratingDeclined.value = true;
                    toast.dismiss(toastId);
                    toast.info('❌ You declined rating access.', { position: 'bottom-right' });
                  },
                  style: 'border: 1px solid #aaa; padding: 6px 12px; border-radius: 6px; cursor: pointer;',
                }, 'Decline'),
              ])
            ]
          );
        }
      },
      {
        timeout: 5000,
        closeOnClick: false,
        draggable: false,
        position: 'bottom-right',
        hideProgressBar: false,
        closeButton: false,
      }
    );
  }
};

const submitRating = async (value) => {
  if (!ratingAccepted.value || ratingDeclined.value) return;

  rating.value = value;
  showBar.value = false;
  try {
    await axios.post('/api/ratings/intro', { rating: value });
    await fetchAverage();
  } catch (err) {
    console.error('Failed to submit rating:', err);
  }
};

const fetchAverage = async () => {
  try {
    const res = await axios.get('/api/ratings/intro/average');
    averageRating.value = res.data.average;
  } catch (err) {
    console.error('Failed to fetch average rating:', err);
  }
};

onMounted(() => {
  fetchAverage();
  showDataPolicyNotice();
});
</script>


  
  
  
  <style scoped>
  .book-wrapper {
    width: 100%;
    max-width: 700px;
    perspective: 2000px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: height 0.3s ease;
  }
  
  .book {
    display: flex;
    width: 100%;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;
    background-color: #faf4e3;
    font-size: 1.1rem;
    animation: slideInBook 0.9s ease-out;
  }
  
  .book-page {
    flex: 1;
    padding: 2rem;
    font-family: 'Georgia', serif;
    line-height: 1.7;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(to right, #fffaf3, #f0e7d5);
  }
  
  .left-page {
    border-right: 1px solid #ccc;
  }
  
  .right-page {
    background: linear-gradient(to left, #fffaf3, #f0e7d5);
  }
  
  .book-nav {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
  
  .book-nav button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 999px;
    background: linear-gradient(to right, #38b2ac, #319795);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .book-nav button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .rose-rating {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    position: relative;
    margin-top: 1rem;
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
    transition: transform 0.2s ease;
  }
  
  .rating-bar button:hover {
    transform: scale(1.2);
  }
  
  @keyframes slideInBook {
    from {
      transform: translateX(100px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
  </style>
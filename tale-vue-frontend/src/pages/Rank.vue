<template>
    <div>
      <NavBar />
      <div class="ranks-container">
        <h1 class="page-title">🏆 Top Ranks</h1>
        <div class="columns">
          <!-- Tales Column -->
          <div class="column">
            <h2>📖 Tales</h2>
  
            <section>
              <h3>✨ Most Cheered</h3>
              <ol>
                <li v-for="(tale, index) in topLikes" :key="tale._id" @click="openTale(tale)">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ tale.title }} ({{ tale.likes.length }} Cheers)
                </li>
              </ol>
            </section>
            <hr />
            <section>
              <h3>🌹 Best Rated</h3>
              <ol>
                <li v-for="(tale, index) in topRated" :key="tale._id" @click="openTale(tale)">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ tale.title }} ({{ tale.averageRating }} Rating)
                </li>
              </ol>
            </section>
            <hr />
            <section>
              <h3>🗣️ Most Comments</h3>
              <ol>
                <li v-for="(tale, index) in topCommented" :key="tale._id" @click="openTale(tale)">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ tale.title }} ({{ tale.comments.length }} Contributions)
                </li>
              </ol>
            </section>
          </div>
  
          <!-- Warriors Column -->
          <div class="column">
            <h2>🛡️ Warriors</h2>
  
            <section>
              <h3>✒️ Popular Writers</h3>
              <ol>
                <li v-for="(user, index) in popularWriters" :key="user.username">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ user.username }} ({{ user.totalLikes }} Cheers)
                </li>
              </ol>
            </section>
            <hr />
            <section>
              <h3>🌟 Best Writers</h3>
              <ol>
                <li v-for="(user, index) in bestWriters" :key="user.username">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ user.username }} (5/{{ user.averageRating }} 🌹)
                </li>
              </ol>
            </section>
            <hr />
            <section>
              <h3>🙌 Popular Helpers</h3>
              <ol>
                <li v-for="(user, index) in popularHelpers" :key="user.username">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ user.username }} ({{ user.commentsMade }} Contributions)
                </li>
              </ol>
            </section>
            <hr />
            <section>
              <h3>👓 Popular Readers</h3>
              <ol>
                <li v-for="(user, index) in popularReaders" :key="user.username">
                  <span>{{ getRankIcon(index) }}</span>
                  {{ user.username }} ({{ user.likesGiven }} Tales Read)
                </li>
              </ol>
            </section>
          </div>
        </div>
      </div>
  
      <!-- TaleReader Overlay -->
      <TaleReader v-if="selectedTaleId" :taleId="selectedTaleId" :onClose="closeTale" />
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import NavBar from '../components/NavBar.vue';
  import TaleReader from '../components/TaleReader.vue'; // 
  
  const topLikes = ref([]);
  const topRated = ref([]);
  const topCommented = ref([]);
  const popularWriters = ref([]);
  const bestWriters = ref([]);
  const popularHelpers = ref([]);
  const popularReaders = ref([]);
  

  const selectedTaleId = ref(null);

function openTale(tale) {
  selectedTaleId.value = tale._id;
}

function closeTale() {
  selectedTaleId.value = null;
}

  onMounted(async () => {
    const { data: { data: tales } } = await axios.get('/api/tales');
    const { data: { data: users } } = await axios.get('/api/users');
  
    topLikes.value = [...tales]
      .filter(t => Array.isArray(t.likes) && t.likes.length > 0)
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 5);
  
    topRated.value = [...tales]
      .filter(t => calculateAverageRating(t.roses) > 0)
      .sort((a, b) => calculateAverageRating(b.roses) - calculateAverageRating(a.roses))
      .slice(0, 5)
      .map(tale => ({
        ...tale,
        averageRating: calculateAverageRating(tale.roses).toFixed(2)
      }));
  
    topCommented.value = [...tales]
      .filter(t => Array.isArray(t.comments) && t.comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 5);
  
    popularWriters.value = users.map(user => {
      const totalLikes = tales
        .filter(t => t.author === user.username)
        .reduce((sum, t) => sum + (t.likes?.length || 0), 0);
      return { username: user.username, totalLikes };
    }).filter(user => user.totalLikes > 0)
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 5);
  
    bestWriters.value = users.map(user => {
      const userTales = tales.filter(t => t.author === user.username);
      const avgRating = userTales.reduce((sum, t) => sum + calculateAverageRating(t.roses), 0) / (userTales.length || 1);
      return { username: user.username, averageRating: parseFloat(avgRating.toFixed(2)) };
    }).filter(user => user.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
  
    popularHelpers.value = users.map(user => {
      const commentsMade = tales.reduce((sum, t) =>
        sum + (t.comments?.filter(c => c.commenter === user.username).length || 0), 0);
      return { username: user.username, commentsMade };
    }).filter(user => user.commentsMade > 0)
      .sort((a, b) => b.commentsMade - a.commentsMade)
      .slice(0, 5);
  
    popularReaders.value = users.map(user => {
      const likesGiven = tales.reduce((sum, t) =>
        sum + (t.likes?.filter(like => like.username === user.username).length || 0), 0);
      return { username: user.username, likesGiven };
    }).filter(user => user.likesGiven > 0)
      .sort((a, b) => b.likesGiven - a.likesGiven)
      .slice(0, 5);
  });
  
  function calculateAverageRating(roses) {
    const weights = { tomato: 0, low: 1, 'mid-low': 2, mid: 3, 'mid-high': 4, high: 5 };
    let total = 0, count = 0;
    Object.entries(roses || {}).forEach(([key, users]) => {
      total += weights[key] * users.length;
      count += users.length;
    });
    return count ? total / count : 0;
  }
  
  function getRankIcon(index) {
    return index === 0 ? '🥇'
         : index === 1 ? '🥈'
         : index === 2 ? '🥉'
         : '⭘';
  }
  </script>
  
  
  <style scoped>
.ranks-container {
  padding: 30px;
  max-width: 1200px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.columns {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.column {
  flex: 1 1 0;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #222;
  text-align: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.3rem;
}

h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1.2rem 0 0.6rem;
  color: #444;
  text-align: center;
  padding: 10px;
}

section {
  margin-bottom: 1.5rem;
}

ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.4rem 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-left: 4px solid transparent;
  border-radius: 6px;
  transition: background-color 0.2s;
}

li:hover {
    background-color: #f0f0f0;
    cursor: pointer;
}

li span {
  display: inline-block;
  width: 1.8rem;
  text-align: center;
  font-size: 1.3rem;
}
</style>

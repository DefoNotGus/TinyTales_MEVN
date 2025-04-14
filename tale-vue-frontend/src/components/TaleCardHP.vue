<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import TaleListContent from './TaleListContent.vue';
import TaleListStats from './TaleListStats.vue';
import TaleListComments from './TaleListComments.vue';

const props = defineProps({
  tale: Object,
});

const emit = defineEmits(['read-tale', 'like-tale', 'comment-posted']);

const showFull = ref(false);

const displayedContent = computed(() => {
  const limit = 300;
  if (showFull.value || props.tale.content.length <= limit) {
    return props.tale.content;
  } else {
    return props.tale.content.slice(0, limit) + '...';
  }
});

const toggleContent = () => {
  showFull.value = !showFull.value;
};

const emitLike = (id) => {
  emit('like-tale', id);
};
</script>

<template>
  <li :class="['tale-card', { ghost: tale.authortype === 'ghost' }]">
    <TaleListContent
      :title="tale.title"
      :content="displayedContent"
      :author="tale.author"
      :authortype="tale.authortype"
    />

    <div class="action-buttons">
      <button v-if="tale.content.length > 300" class="read-more-btn" @click="toggleContent">
        {{ showFull ? '🔼 Show Less' : '🔽 Show More' }}
      </button>

      <button class="read-more-btn" @click="emit('read-tale', tale._id)">
        👓 READ MODE
      </button>
    </div>

    <TaleListComments
      :taleId="tale._id"
      :comments="tale.comments"
      @comment-posted="emit('comment-posted')"
    />

    <TaleListStats
      :taleId="tale._id"
      :likes="tale.likes"
      :comments="tale.comments"
      @like-tale="emitLike"
    />

    <hr />
  </li>
</template>


<style scoped>
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

.tale-card.ghost {
  background: linear-gradient(to bottom right, #d8dadc, #c2c3bc);
  border: 2px dashed #d6b9ff;
  color: #311524;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin: 1rem 0;
}

.read-more-btn {
  padding: 0.3rem 0.7rem;
  background-color: #f3e6ff;
  border: 2px solid #7d3c98;
  border-radius: 6px;
  font-weight: bold;
  color: #5e2e6e;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.read-more-btn:hover {
  background-color: #ecd6ff;
}
</style>

<!-- 卡片展示页面组件 -->
<template>
  <MainLayout>
    <h1>{{ props.title }}</h1>
    <div v-if="props.customBlock" class="custom-block" :class="[props.customBlock.type]">
      <p class="custom-block-title">{{ props.customBlock.title }}</p>
      <p v-for="(text, index) in props.customBlock.content.split('\n')" :key="index">{{ text }}</p>
    </div>
    <div class="cards">
      <div v-for="(item, index) in props.cards"
           :key="index"
           @click="() => openUrl(item.link || '')"
           class="card">
        {{ item.text }}
      </div>
    </div>
  </MainLayout>
</template>
<script lang="ts" setup>
import MainLayout from '@/layout/MainLayout.vue';
import { openUrl } from '@/common/utils';

const props = defineProps<{
  title: string,
  customBlock?: { type: 'info' | 'tip' | 'warning' | 'danger', title: string, content: string },
  cards: { text?: string, link?: string }[]
}>();
</script>
<style lang="css" scoped>
h1 {
  font-size: 32px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 2em;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card {
  background-color: var(--vp-c-gray-soft);
  border: 1px solid var(--vp-c-default-soft);
  box-shadow: 0 0 10px var(--vp-c-default-soft);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;      /* 垂直居中 */
  justify-content: flex-start; /* 水平左对齐 */
  text-align: left;
}

.card:hover {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 10px var(--vp-c-brand-1);
}

.card h2 {
  font-size: 24px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
}

.card p {
  font-size: 16px;
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 0;
}
</style>

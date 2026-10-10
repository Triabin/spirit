<!-- 卡片展示页面组件 -->
<template>
  <MainLayout :bg-image="bgImage">
    <h1>{{ props.title }}</h1>
    <div v-if="slots['info']" class="custom-block info">
      <slot name="info"/>
      <!-- 样例 -->
      <!-- <p class="custom-block-title">标题</p> -->
      <!-- <p>……</p> -->
    </div>
    <div v-if="slots['tip']" class="custom-block tip">
      <slot name="tip"/>
    </div>
    <div v-if="slots['warning']" class="custom-block warning">
      <slot name="warning"/>
    </div>
    <div v-if="slots['danger']" class="custom-block danger">
      <slot name="danger"/>
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
import { ref, useSlots, toRef, watchEffect } from 'vue';
import { useData } from 'vitepress';

const props = defineProps<{
  title: string,
  cards: { text?: string, link?: string }[]
}>();
const slots = useSlots();
console.log('slots', slots);
const isDark = toRef(useData(), 'isDark');
const bgImage = ref<string>('');
watchEffect(() => bgImage.value = isDark.value ?
    'https://gitee.com/triabin/img_bed/raw/master/2026/10/10/e7556307b33a2c15d6ed3a3f08d183eb-sunlight-shining-single-mountain-top-sunset-with-dark-cloudy-sky.webp'
    : 'https://image.slidesdocs.com/responsive-images/background/line-art-congenital-malformation-abstract-clinical-case-simple-powerpoint-background_64f966f905__960_540.jpg'
    // : 'https://img.shetu66.com/2025/04/09/174412833539813346.png'
);
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

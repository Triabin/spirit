<!-- 卡片时钟组件 -->
<template>
  <div class="card-clock" @click="cardClick">
    <FlipCard v-for="(value, index) in values"
              :key="index"
              :size="40"
              :currValue="value"/>
  </div>
</template>
<script lang="ts" setup>
import { ref, onUnmounted, onMounted } from 'vue';
import FlipCard from './FlipCard.vue';

const values = ref<string[]>(['00', '00', '00']); // 时、分、秒

let timer: number | null = null;
const updateValues = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  values.value = [hours, minutes, seconds];
  if (timer) {
    cancelAnimationFrame(timer);
  }
  timer = requestAnimationFrame(updateValues);
}

const cardClick = () => window.open(
    'https://biaozhunshijian.bmcx.com/',
    '_blank',
    'width=400,height=400,left=800,top=400'
);

onMounted(() => updateValues());
onUnmounted(() => timer && cancelAnimationFrame(timer));
</script>
<style lang="css" scoped>
.card-clock {
  margin-right: 20px;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 4px;
}
</style>

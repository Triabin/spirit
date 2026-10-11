<!-- 工具箱页面组件 -->
<template>
  <CustomCards title="工具集" :cards="cards">
    <template #tip>
      <p class="custom-block-title">提示</p>
      <p>工具集包含了一些我开发的工具，用于方便地完成一些任务。工具只是页面工具，不涉及后端服务器相关功能。</p>
    </template>
  </CustomCards>
</template>
<script lang="ts" setup>
import CustomCards from '@/components/CustomCards.vue';

const cards = [
  { text: 'LRC歌词时间轴调整工具', link: '/tools/LyricAdjuster/' },
];
</script>

<!-- 前端页面组件 -->
<template>
  <CustomCards title="前端" :cards="cards">
    <template #tip>
      <p class="custom-block-title">提示</p>
      <p>关于HTML、CSS、JavaScript许多文档，可以直接访问
        <a href='https://developer.mozilla.org/en-US/' target="_blank">MDN</a>
        进行查询。
      </p>
    </template>
  </CustomCards>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import CustomCards from '@/components/CustomCards.vue';
import { getCardEntries } from '@/common/utils.ts';

const cards = getCardEntries(sidebar, '/coding/frontend/')
    .map(item => ({ text: item.text, link: item.link }))
    || [];
</script>

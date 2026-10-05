<!-- 通用技术重要技术栈页面组件 -->
<template>
  <CustomCards
      ref="cardsRef"
      title="重要技术栈"
      :cards="cards"/>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import CustomCards from '@/components/CustomCards.vue';
import { getCardEntries } from '@/common/utils.ts';

const cards = getCardEntries(sidebar, '/coding/common')
    .find(item => item.link === '/coding/common/important/')
    ?.items
    ?.map(item => ({ text: item.text, link: item.link }))
    || [];
</script>

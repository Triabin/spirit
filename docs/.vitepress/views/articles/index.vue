<!-- 文章笔记页面组件 -->
<template>
  <CustomCards title="文章笔记" :cards="cards"/>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import { getCardEntries } from '@/common/utils';
import CustomCards from '@/components/CustomCards.vue';

const cards = getCardEntries(sidebar, '/articles/')
    .map(item => ({ text: item.text, link: item.link })) || [];
</script>

<!-- Python页面组件 -->
<template>
  <CustomCards :cards="cards"/>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import CustomCards from '@/components/CustomCards.vue';
import { getCardEntries } from '@/common/utils.ts';

const cards = getCardEntries(sidebar, '/coding/python/')
    .map(item => ({ text: item.text, link: item.link }))
    || [];
</script>

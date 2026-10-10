<!-- 随记页面组件 -->
<template>
  <CustomCards title="随记" :cards="cards"/>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import { getCardEntries } from '@/common/utils';
import CustomCards from '@/components/CustomCards.vue';

const cards = getCardEntries(sidebar, '/essays/')
    .map(item => ({ text: item.text, link: item.link })) || [];
</script>

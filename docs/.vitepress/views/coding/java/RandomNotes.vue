<!-- Java随记页面组件 -->
<template>
  <CustomCards title="Java随记" :cards="cards"/>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import { getCardEntries } from '@/common/utils';
import CustomCards from '@/components/CustomCards.vue';

const cards = getCardEntries(sidebar, '/coding/java/')
        .find(item => item.link === '/coding/java/random-notes/')
        ?.items
        ?.map(item => ({ text: item.text, link: item.link })) || [];
</script>

<!-- C/C++页面组件 -->
<template>
  <CustomCards :cards="cards"/>
</template>
<script lang="ts" setup>
import CustomCards from '@/components/CustomCards.vue';
import { getCardEntries } from '@/common/utils';
import sidebar from '@/config/sidebar';

const cards = getCardEntries(sidebar, '/coding/c-cpp/')
        .map(item => ({ text: item.text, link: item.link }))
    || [];
</script>

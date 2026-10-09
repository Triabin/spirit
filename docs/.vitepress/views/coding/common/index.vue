<!-- 编程通用技术页面组件 -->
<template>
  <CustomCards title="编程通用技术" :cards="cards">
    <template #info>
      <p class="custom-block-title">说明</p>
      <p>无论学习使用哪一种编程语言，这些计算机/工程化知识都需要掌握或者了解。</p>
      <p>了解程度至少达到思考问题解决方案时可以为自己提供一个思路并且需要使用时知道如何搜索的地步。</p>
    </template>
  </CustomCards>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import CustomCards from '@/components/CustomCards.vue';
import { getCardEntries } from '@/common/utils.ts';

const cards = getCardEntries(sidebar, '/coding/common')
    .map(item => ({ text: item.text, link: item.link }));
</script>

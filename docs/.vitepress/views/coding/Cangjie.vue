<!-- 仓颉页面组件 -->
<template>
  <CustomCards title="仓颉" :cards="cards">
    <template #tip>
      <p class="custom-block-title">提示</p>
      <p>仓颉编程语言官网文档访问
        <a href='https://cangjie-lang.cn/docs' target="_blank">https://cangjie-lang.cn/docs</a>
      </p>
    </template>
  </CustomCards>
</template>
<script lang="ts" setup>
import sidebar from '@/config/sidebar';
import CustomCards from '@/components/CustomCards.vue';
import { getCardEntries } from '@/common/utils';

const cards = getCardEntries(sidebar, '/coding/cangjie/')
        .map(item => ({ text: item.text, link: item.link }))
    || [];
</script>

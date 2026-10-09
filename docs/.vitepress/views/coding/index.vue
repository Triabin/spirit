<!-- 编程相关页面组件 -->
<template>
  <CustomCards title="Coding" :cards="cards"/>
</template>
<script lang="ts" setup>
import CustomCards from '@/components/CustomCards.vue';

const cards = [
  { text: '通用编程技术', link: '/coding/common/' },
  { text: '编程语言：C/C++', link: '/coding/c-cpp/' },
  { text: '编程语言：Java', link: '/coding/java/' },
  { text: '编程语言：Python', link: '/coding/python/' },
  { text: '编程语言：仓颉', link: '/coding/cangjie/' },
  { text: '编程语言：前端', link: '/coding/frontend/' }
];
</script>

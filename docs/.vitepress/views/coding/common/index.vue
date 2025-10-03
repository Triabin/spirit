<!-- 编程通用技术页面组件 -->
<template>
  <MainLayout>
    <h1>编程通用技术</h1>
    <div class="info custom-block">
      <p class="custom-block-title">说明</p>
      <p>无论学习使用哪一种编程语言，这些计算机/工程化知识都需要掌握或者了解。</p>
      <p>了解程度至少达到思考问题解决方案时可以为自己提供一个思路并且需要使用时知道如何搜索的地步。</p>
    </div>
  </MainLayout>
</template>
<script lang="ts" setup>
import MainLayout from '@/layout/MainLayout.vue';
</script>
<style lang="css" scoped>
h1 {
  font-size: 32px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>

<!-- 编程通用技术页面组件 -->
<template>
  <MainLayout>
    <h1>编程通用技术</h1>
    <div class="info custom-block">
      <p class="custom-block-title">说明</p>
      <p>无论学习使用哪一种编程语言，这些计算机/工程化知识都需要掌握或者了解。</p>
      <p>了解程度至少达到思考问题解决方案时可以为自己提供一个思路并且需要使用时知道如何搜索的地步。</p>
    </div>
    <div class="cards">
      <div v-for="(item, index) in commons" :key="index"
          @click="() => openUrl(item.link || '')"
          class="card">
        {{ item.text }}
      </div>
    </div>
  </MainLayout>
</template>
<script lang="ts" setup>
import MainLayout from '@/layout/MainLayout.vue';
import sidebar from '@/config/sidebar';
import { DefaultTheme } from 'vitepress';
import { openUrl } from '@/common/utils';

const commons = getCommons(sidebar);
console.log('commons:', commons);

function getCommons(sidebar: DefaultTheme.Sidebar): DefaultTheme.SidebarItem[] {
  if (!sidebar) return [];
  const entries = Object.entries(sidebar);
  const commonEntry = entries.find(([key, _]) => key === '/coding/common');
  if (!commonEntry) return [];
  const [, commons] = commonEntry;
  return commons || [];
}
</script>
<style lang="css" scoped>
h1 {
  font-size: 32px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 20px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
}

.card h2 {
  font-size: 24px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
}

.card p {
  font-size: 16px;
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 0;
}

</style>

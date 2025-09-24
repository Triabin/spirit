<!-- 收藏网页页面组件 -->
<template>
  <div class="favorites-page">
    <div class="grid-container">
      <div v-for="(item, index) in props.items"
            :key="index"
            @click="() => openUrl(item.url)"
            class="card">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img v-if="item.icon"
              :src="item.icon"
              :alt="item.title"
              style="width: 24px; height: 24px;"/>
          <h1>{{ item.title }}</h1>
        </div>
        <p v-if="item.description">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  items: {
    icon?: string,
    title: string,
    url: string,
    description?: string
  } []
}>();

const openUrl = (url: string, target: string = '_blank') => {
  if (url.startsWith('/')) {
    target = '_self';
  }
  window.open(url, target);
}
</script>

<style lang="css" scoped>
.favorites-page {
  width: 100%;
  min-width: 480px;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
}
.grid-container {
  width: 60%;
  min-height: 100%;
  display: grid;
  gap: 20px;
  padding: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 10px;
  border: 1px solid var(--vp-c-default-soft);
  border-radius: 6px;
  padding: 24px;
  overflow: hidden;
  background-color: var(--vp-c-gray-soft);
  cursor: pointer;
  box-shadow: 0 0 10px var(--vp-c-default-soft);
  transition: all 0.2s ease-out;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 10px var(--vp-c-brand-1);
  transform: translateY(-5px);
}

h1 {
  font-size: 20px;
  font-weight: 600;
}

p {
  font-size: 16px;
  font-weight: 400;
}
</style>

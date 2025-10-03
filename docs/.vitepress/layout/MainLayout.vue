<template>
  <div class="main-layout" :style="{ backgroundImage: bgImageUrl }">
    <div class="content">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// 父组件传值
const props = defineProps<{
  bgImage?: string;
}>();

// 响应式数据
const bgImageUrl = computed(() => props.bgImage ? `url(${props.bgImage})` : '');
</script>

<style lang="css" scoped>
* {
  box-sizing: border-box;
  width: 100vw;
  height: 94vh;
}

.main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-position: center;
  background-size: cover;
  background-attachment: fixed; /* 背景图片固定 */
  background-blend-mode: lighten;
}
.content {
  width: 60%;
  padding: 2rem;
}

@media (min-width: 2560px) {
  .content {
    width: 60%;
  }
}

@media (width: 2560px) {
  .content {
    width: 1280px;
  }
}

@media (width: 1920px) {
  .content {
    width: 960px;
  }
}

@media (max-width: 1920px) {
  .content {
    max-width: 960px;
    width: 100%;
  }
}
</style>

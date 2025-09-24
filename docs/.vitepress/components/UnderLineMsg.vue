<!-- 行下提示信息 -->
<template>
  <div v-show="visible">
    <i :style="{ color: color, fontSize: props.fontSize }">{{ msg }}</i>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  fontSize: {
    type: String,
    default: '0.75em'
  }
});

const visible = ref(false);
const msg = ref('');
const color = ref('gray');
/**
 * 显示参数相关提示信息
 */
const showMsg = (_msg: string = '', type : 'success' | 'fail' | 'warning' | 'info' = 'info', ms: number = 0) => {
  msg.value = _msg;
  visible.value = !!_msg;
  if (type === 'success') {
    color.value = 'green';
  } else if (type === 'fail') {
    color.value = 'red';
  } else if (type === 'warning') {
    color.value = 'yellow';
  } else {
    color.value = 'gray';
  }
  if (ms > 0) {
    setTimeout(() => {
      msg.value = '';
      visible.value = false;
    }, ms);
  }
}

defineExpose({ showMsg });
</script>
<style lang="scss" scoped>

</style>

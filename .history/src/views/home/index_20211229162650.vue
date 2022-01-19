<template>
  <div class="container" :style="{ height: scrollerHeight + 'px' }">
    <h3 class="home-title">新型节能产品数据中心</h3>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
const scrollerHeight = computed(()=>{
  return window.innerHeight - 20;
})
</script>
<style lang="scss" scoped>
.container {
  background: url("./src/assets/home.png");
  background-size: 100% 100%;
}
</style>





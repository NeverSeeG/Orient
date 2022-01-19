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
.home-title {
  margin-top: 24px;
      font-size: 38px;
      text-align: center;
      letter-spacing: 0.25em;
      font-style: normal;
      font-weight: bold;
      color: transparent;
      background: linear-gradient(to top, #50B5FF, #FFFFFF);
      -webkit-background-clip: text;
      font-family: Microsoft YaHei;
}
</style>





<template>
  <div class="container" :style="{ height: scrollerHeight + 'px' }">
    
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
  background: url("~@/assets/home.png");
  background-size: 100% 100%;
}
</style>





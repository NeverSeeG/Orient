<template>
  <div class="container" :style="{ height: scrollerHeight + 'px' }">
    <!-- 头部项目标题 -->
    <div class="home-title"><span>新型节能产品数据中心</span></div>
    <!-- 头部基础信息 -->
    <div ></div>
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
  font-size:28px;
  height:60px;
  text-align: center;
  letter-spacing: 0.25em;
  font-style: normal;
  font-weight: bold;
  color: transparent;
  background: linear-gradient(to top, #50B5FF, #FFFFFF);
  -webkit-background-clip: text;
  font-family: Microsoft YaHei;
  margin:  0px;
  padding: 10px;

}
</style>





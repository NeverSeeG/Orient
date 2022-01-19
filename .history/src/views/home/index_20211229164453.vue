<template>
  <div class="container" :style="{ height: scrollerHeight + 'px' }">
    <div class="home-title">新型节能产品数据中心</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
const scrollerHeight = computed(()=>{
  return window.innerHeight - 20;
})
</script>
<style lang="scss" scoped>
@media (min-width:0px){
    .home-title{font-size:12px;}
}
@media (min-width: 320px){
    .home-title{font-size:12px;}
}
@media (min-width: 340px){
    .home-title{font-size:13px;}
}
@media (min-width: 360px){
    .home-title{font-size:14px;}
}
@media (min-width: 380px){
    .home-title{font-size:15px;}
}
@media (min-width: 400px){
    .home-title{font-size:15px;}
}
@media (min-width: 420px){
    .home-title{font-size:16px;}
}
.container {
  background: url("./src/assets/home.png");
  background-size: 100% 100%;
}
.home-title {
  text-align: center;
  letter-spacing: 0.25em;
  font-style: normal;
  font-weight: bold;
  color: transparent;
  background: linear-gradient(to top, #50B5FF, #FFFFFF);
  -webkit-background-clip: text;
  font-family: Microsoft YaHei;
  margin:  0px;
}
</style>





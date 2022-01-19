<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
 -->
<template>
  <div class="main">
    <div class="ribbon_container">
      <div class="search">
      船舶汇总
      </div>
      <div class="content">
        内容
      </div>
    </div>
     <div class="map">
      <iframe style="width:100%;height:100%;" src="https://map.baidu.com/@12959219.60000165,4825334.629995631,5z"></iframe>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style scoped lang="scss">
.main{
  height: 100%;
  width: 100%;
  color:#ffffff;
  .ribbon_container{
    height: 40%;
    width: 100%;

    .search{
      height: 20%;
      min-height: 100px;
      width:100%;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
    }

    .content{
      height: calc(80% - 16px);
      min-height: 128px;
      width:100%;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      margin-top:16px;
    }
  }



  .map{
    height: calc(60% - 16px);
    min-height: 128px;
    width:100%;
    background: #131E3C;
    opacity: 0.8;
    border: 1px solid #00BBFF;
    box-shadow: inset 1px -1px 25px #00CCFF;
    border-radius: 8px;
    margin-top:16px;
  }
}

</style>
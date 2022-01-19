<!--
 * @description: 能效分析
 * @author: 王磊
 * @date: 2022年1月5日
 -->
<template>
  <el-scrollbar style="height:100%">
    <div class="main">
       <div class="search">
        <div class=table_header>查询条件</div>
        <div class="query_form">
          <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船舶:</span>
          <el-input style="width:200px;margin-right: 8px;"> v-model="formInline.name" placeholder="请输入当前船舶名称"></el-input>
          <el-button type="primary" size="default" @click="query" :icon="Search">查询</el-button>
          <el-button type="primary" size="default" @click="queryAll" :icon="SetUp">查询全部</el-button>
        </div>
      </div> 
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.main{
  height: 100%;
  width: 100%;
  color:#ffffff;
}
</style>
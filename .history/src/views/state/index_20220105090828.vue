<!--
 * @description: 状态监测
 * @author: 王磊
 * @date: 2021/1/7
 -->
<template>
  <div class="main">
    <div class="search">
      <div class=table_header>查询条件</div>
      <div class="query_form">
        <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船东:</span>
        <el-input style="width:200px;margin-right: 8px;"> v-model="formInline.name" placeholder="请输入当前船舶名称"></el-input>
        <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船舶:</span>
        <el-button type="primary" size="default" @click="query" :icon="Search">查询</el-button>
        <el-button type="primary" size="default" @click="queryAll" :icon="SetUp">查询全部</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Search, SetUp } from '@element-plus/icons-vue';
</script>
<style lang="scss" scoped>
.main{
  height: 100%;
  width: 100%;
  color:#ffffff;
}
</style>
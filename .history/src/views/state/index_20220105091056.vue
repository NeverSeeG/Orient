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
        <el-input style="width:200px;margin-right: 8px;"> v-model="formInline.name" placeholder="请输入当前船东名称"></el-input>
        <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船舶:</span>
        <el-input style="width:200px;margin-right: 8px;"> v-model="formInline.name" placeholder="请输入当前船舶名称"></el-input>
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

    .search{
      height: 20%;
      min-height: 100px;
      width:100%;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      padding:16px;

      .table_header{
        height:32px;
        font-size: 16px;
        line-height: 32px;
        display: flex;
        font-weight: bold;
      }

      
      .query_form{
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
}
</style>
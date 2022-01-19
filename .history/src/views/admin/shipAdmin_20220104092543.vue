<!--
 * @description: 船舶管理
 * @author: 王磊
 * @date: 2022年1月4日
 -->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class=table_title>船舶列表</div>
        <div class="btn">
          <el-button type="primary" size="mini">新增</el-button>
          <el-button  type="danger" size="mini">批量删除</el-button>
        </div>
      </div>
      <div class="table_body"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.main{
  height: 100%;
  width: 100%;
  color:#ffffff;
}

.content{
  height: calc(100% - 35px);
  background: #131E3C;
  opacity: 0.8;
  border: 1px solid #00BBFF;
  box-shadow: inset 1px -1px 25px #00CCFF;
  border-radius: 8px;
  padding:16px;


  .operate_area{
    height: 100px;

    .table_title{
      height:32px;
      font-size: 16px;
      line-height: 32px;
      font-weight: bold;
      display: flex;
      margin-bottom:20px;
    }
    .btn{
      float: left;
    }
  }
  .table_body{
    height:calc(100% - 100px)
  }
}
</style>
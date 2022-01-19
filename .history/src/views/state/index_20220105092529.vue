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
    <div class="content" >
        <div class=table_header>船舶汇总（所有船只）</div>
        <div style="height:calc(100% - 40px);margin-top:8px" ref="tableBody">
          <el-table :data="tableData" border fit style="width: 100%" :height="tableMaxHeight"   :header-cell-style="{background:'#19346B',fontSize: '14px',color:'#FFFFFF'}" :row-style="{background: '#131E3C',fontSize: '14px',color:'#FFFFFF'}">
            <el-table-column type="index" width="50" fixed="left"/>
            <el-table-column prop="date" label="船舶名称" width="150" />
            <el-table-column prop="name" label="航线" />
            <el-table-column prop="address" label="航次" />
            <el-table-column fixed="left" label="操作" width="350">
              <template #default>
                <el-button type="text" size="small" :icon="View" @click="handleClick"
                  >查看实时数据</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
  import { View } from '@element-plus/icons-vue';

  let tableData = reactive([{
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },{
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          note: 'No. 189, Grove St, Los Angeles',
        }])
</script>
<style lang="scss" scoped>
.main{
  height: 100%;
  width: 100%;
  color:#ffffff;

    .search{
      height: 20%;
      min-height: 100px;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      padding:16px;

      
      .query_form{
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
    .content{
      height: calc(80% - 80px);
      min-height: 400px;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      margin-top:8px;
      padding:16px;
    }
}

.table_header{
  height:32px;
  font-size: 16px;
  line-height: 32px;
  display: flex;
  font-weight: bold;
}

::v-deep .el-table__body-wrapper {
  &::-webkit-scrollbar {
    width: 6px !important; /* 高宽分别对应横竖滚动条的尺寸 */
  }
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条 必写
  }
  // 滚动条的滑块
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }

::v-deep .el-scrollbar__view {
  height: 100%;
}
// ::v-deep .el-table__body-wrapper {
//     height: 200px; /* 滚动条整体高 必须项 */
//     border-right: none;
//     overflow-y: scroll;/* overflow-y为了不出现水平滚动条*/
// }

::v-deep.el-table {
    --el-table-bg-color: ;
    --el-table-border-color: #04a0ce;
    --el-table-border: 1px solid #04a0ce;
}

::v-deep .el-form-item__label {
    flex: 0 0 auto;
    text-align: right;
    font-size: 14px !important;
    color: #00CCFF;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}

::v-deep .el-input {
  --el-input-text-color: #ffffff;
  --el-input-bg-color: ;
  --el-input-border-color: ;
  --el-border-base: var(--el-border-width-base) var(--el-border-style-base) #00CCFF;
}
</style>
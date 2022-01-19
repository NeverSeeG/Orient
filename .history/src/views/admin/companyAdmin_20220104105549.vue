<!--
 * @description: 单位管理
 * @author: 王磊
 * @date: 2022年1月4日
 -->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class=table_title>单位列表</div>
        <div class="btn">
          <el-button type="primary" size="mini">新增</el-button>
          <el-button  type="danger" size="mini">批量删除</el-button>
        </div>
      </div>
      <div class="table_body" ref="tableBody">
        <el-table :data="tableData" border fit style="width: 100%" :height="tableMaxHeight"   :header-cell-style="{background:'#19346B',fontSize: '14px',color:'#FFFFFF'}" :row-style="{background: '#131E3C',fontSize: '14px',color:'#FFFFFF'}">
            <el-table-column type="selection" width="50" />
            <el-table-column prop="name" label="单位名称" width="150" />
            <el-table-column prop="note" label="备注" />
            <el-table-column fixed="left" label="操作" width="350">
              <template #default>
                <el-button type="text" size="small" :icon="Edit" @click="handleClick"
                  >编辑</el-button
                >
                <el-button type="text" size="small" >
                  <el-icon style="color: #c75b5f;vertical-align: middle;">
                    <delete/>
                  </el-icon><span style="color: #c75b5f;vertical-align: middle;">删除</span></el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit } from '@element-plus/icons-vue';
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref('100%')
const {proxy} =getCurrentInstance()
onMounted(()=>{
  rerenderTable();
  window.addEventListener('resize', rerenderTable);
})
const rerenderTable=()=>{
  if(proxy.$refs.tableBody){
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight",tableBodyHeight)
    tableMaxHeight.value = tableBodyHeight <= 0 ? '100%' : (tableBodyHeight-32) + 'px';
  }
}
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
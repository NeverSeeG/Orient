<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
 -->
<template>
 <el-scrollbar style="height:100%">
    <div class="main">
      <div class="search">
      船舶汇总
      </div>
      <div class="content" >
        <div style="height:100%" ref="tableBody">
          <el-table :data="tableData" fit style="width: 100%" :height="tableMaxHeight"  border :header-cell-style="{background:'#19346B',fontSize: '14px',color:'#FFFFFF'}" :row-style="{background: '#131E3C',fontSize: '14px',color:'#FFFFFF'}">
            <el-table-column prop="date" label="Date" width="150" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </div>
      </div>
     <div class="map">
      <iframe style="width:100%;height:100%;" src="https://map.baidu.com/@12959219.60000165,4825334.629995631,5z"></iframe>
    </div>
    </div>
</el-scrollbar>
</template>
<script lang="ts" setup>
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
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },{
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        }])
</script>
<style scoped lang="scss">
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
    }

    .content{
      height: calc(30% - 10px);
      min-height: 200px;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      margin-top:8px;
      padding:16px;
    }



    .map{
      height: calc(50% - 15px);
      min-height: 128px;
      width:100%;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      margin-top:8px;
    }
}

::v-deep .el-table__body-wrapper {
  &::-webkit-scrollbar {
    width: 6px !important; /* 高宽分别对应横竖滚动条的尺寸 */
  }
}

// ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//     width: 6px; // 横向滚动条
//     height: 6px; // 纵向滚动条 必写
//   }
//   // 滚动条的滑块
//   ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
//     background-color: #ddd;
//     border-radius: 3px;
//   }

::v-deep .el-scrollbar {
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    height: 100%;
}
   ::v-deep .el-table__body-wrapper {
            height: 200px; /* 滚动条整体高 必须项 */
            border-right: none;
            overflow-y: scroll;/* overflow-y为了不出现水平滚动条*/
        }
        
        ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
            width: 5px;/* 滚动条的宽高 必须项 */
            height: 5px;
        }

        ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
            background-color: #bfcbd9;/* 滚动条的宽 */
            border-radius: 3px;
        }

</style>
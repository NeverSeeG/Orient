<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
 -->
<template>
  <div class="main">
      <div class="search">
      船舶汇总
      </div>
      <div class="content" >
        <div style="height:100%" ref="tableBody">
          <el-table :data="tableData" :max-height="tableMaxHeight" border :header-cell-style="{background:'#19346B',fontSize: '14px',color:'#FFFFFF'}" :row-style="{background: '#131E3C',fontSize: '14px',color:'#FFFFFF'}">
            <el-table-column prop="date" label="Date"  />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </div>
      </div>
     <div class="map">
      <iframe style="width:100%;height:100%;" src="https://map.baidu.com/@12959219.60000165,4825334.629995631,5z"></iframe>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref('')
onMounted(()=>{
  rerenderTable();
  window.addEventListener('resize', rerenderTable);
})
const rerenderTable=()=>{
  // if(proxy.$refs.tableBody){
  //   let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
  //   console.log("tableBodyHeight",tableBodyHeight)
  //   tableMaxHeight.value = tableBodyHeight <= 0 ? '100%' : tableBodyHeight + 'px';
  // }
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

</style>
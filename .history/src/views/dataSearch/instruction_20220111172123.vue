
<template>
   <el-scrollbar style="height: 100%">
    <div class="main">
      <div class="search">
        <div class="table_header">查询条件</div>
        <div class="query_form">
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >当前船东:</span
          >
          <el-select
            v-model="queryForm.shipowner"
            clearable
            placeholder="请选择船东"
            style="width: 200px; margin-right: 8px"
            @change="shipOwnerChange"
            @clear="shipOwnerClear"
          >
            <el-option
              v-for="item in dataInfo.shipOwnerOptions"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="item.VALUE"
            >
            </el-option>
          </el-select>
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >当前船舶:</span
          >
          <el-select
            v-model="queryForm.no"
            clearable
            placeholder="请选择船舶"
            style="width: 200px; margin-right: 8px"
            @change="shipChange"
            @clear="shipClear"
          >
            <el-option
              v-for="item in dataInfo.shipOptions"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="item.VALUE"
            >
            </el-option>
          </el-select>

          <el-popover trigger="click" :width="200">
            <template #reference>
              <el-button type="primary" size="default" plain
                >选择设备<el-icon class="el-icon--right"><arrow-down /></el-icon
              ></el-button>
            </template>
            <el-tree
              style="height: 250px; overflow: auto"
              ref="tree"
              :data="dataInfo.equipMentData"
              node-key="VALUE"
              highlight-current
              check-on-click-node
              :props="dataInfo.props"
              :draggable="false"
              show-checkbox
            ></el-tree>
          </el-popover>
          <el-popover trigger="click" @show="paramsTreeShow">
            <template #reference>
              <el-button type="primary" size="default" plain
                >选择参数<el-icon class="el-icon--right"><arrow-down /></el-icon
              ></el-button>
            </template>
            <el-tree
              style="height: 250px; overflow: auto"
              highlight-current
              check-on-click-node
              ref="paramsTree"
              :data="dataInfo.equipmentParams"
              node-key="ID"
              :props="dataInfo.paramsProps"
              :draggable="false"
              show-checkbox
            ></el-tree>
          </el-popover>
        </div>
        <div class="query_form">
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >开始时间:</span
          >
          <el-date-picker
            style="width: 200px; margin-right: 8px"
            v-model="queryForm.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择开始日期时间"
          ></el-date-picker>
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >结束时间:</span
          >
          <el-date-picker
            style="width: 200px; margin-right: 8px"
            v-model="queryForm.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择结束日期时间"
          ></el-date-picker>
          <el-button type="primary" size="default" @click="query" :icon="Search"
            >查询</el-button
          >
          <el-button
            type="primary"
            size="default"
            :icon="Download"
            plain
            @click="exportData"
            >导出</el-button
          >
        </div>
      </div>
      <div class="table_body" ref="tableBody">
        <el-table highlight-current-row :data="tableData" border fit style="width: 100%" :height="tableMaxHeight"   :header-cell-style="{background:'#19346B',fontSize: '14px',color:'#FFFFFF'}" :row-style="{background: '#131E3C',fontSize: '14px',color:'#FFFFFF'}">
            <el-table-column type="index" width="50" fixed="left"/>
            <el-table-column type="selection" width="50" fixed="left"/>
            <el-table-column prop="name" label="单位名称" width="150" />
            <el-table-column prop="note" label="备注" />
          </el-table>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { api } from "@/axios/api";
import { User } from "@/utils/user";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref('100%')
const {proxy} =getCurrentInstance() as any
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
let userInfo = new User().userInfo;
let dataInfo = reactive({
  props: { label: "NAME", value: "VALUE" },
  paramsProps: { label: "NAME_4129", value: "ID" },
  // 表格数据

  // 船东下拉选择项
  shipOwnerOptions: [],
  // 筛选后的船舶
  shipOptions: [],
  // 设备树
  equipMentData: [],
  // 参数
  equipmentParams: [],
  tableData: [],
});
// 查询表单
const queryForm = reactive({
  shipowner: "",
  no: "",
  equipment: [],
  equipmentParams: [],
  startTime: "",
  endTime: "",
});
const getShipUnitCombo = () => {
  api.shipSummary
    .getShipUnitCombo({ userId: userInfo.userId })
    .then((data: any) => {
      if (data) {
        dataInfo.shipOwnerOptions = data;
      }
    });
};
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
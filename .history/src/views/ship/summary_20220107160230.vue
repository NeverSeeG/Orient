<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2022年1月5日
 -->
<template>
  <el-scrollbar style="height: 100%">
    <div class="main">
      <div class="search">
        <div class="table_header">查询条件</div>
        <div class="query_form">
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >当前船舶:</span
          >
          <el-input
            style="width: 200px; margin-right: 8px"
            v-model="no"
            placeholder="请输入当前船舶名称"
          ></el-input>

          <el-button type="primary" size="default" @click="query" :icon="Search"
            >查询</el-button
          >
          <el-button
            type="primary"
            size="default"
            @click="queryAll"
            :icon="SetUp"
            >查询全部</el-button
          >
        </div>
      </div>
      <div class="content">
        <div class="table_header">船舶汇总（该船东公司所有船只）</div>
        <div style="height: calc(100% - 40px); margin-top: 8px" ref="tableBody">
          <el-table
            highlight-current-row
            :data="dataInfo.tableData"
            border
            fit
            style="width: 100%"
            :height="tableMaxHeight"
            :header-cell-style="{
              background: '#19346B',
              fontSize: '14px',
              color: '#FFFFFF',
            }"
            :row-style="{
              background: '#131E3C',
              fontSize: '14px',
              color: '#FFFFFF',
            }"
          >
            <el-table-column prop="ShipNo" label="船舶代号" width="150" />
            <el-table-column prop="ShipName" label="船舶名称" />
            <el-table-column prop="ShipRoute" label="航线" />
            <el-table-column prop="VoyageNo" label="航次" />
            <el-table-column prop="State" label="状态" />
            <el-table-column prop="Draft" label="吃水" />
            <el-table-column prop="Speed" label="航速" />
            <el-table-column fixed="right" label="操作" width="200">
            <template #default>
              <el-button
                type="text"
                size="small"
                :icon="View"
                @click="detail"
                >详情</el-button
              >
            </template>
          </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="map">
        <iframe
          style="width: 100%; height: 100%"
          src="https://map.baidu.com/@12959219.60000165,4825334.629995631,5z"
        ></iframe>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { api } from "@/axios/api";
import { User } from "@/utils/user";
import { Search, SetUp, View } from "@element-plus/icons-vue";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
let userInfo = new User().userInfo
const { proxy } = getCurrentInstance();
const no = ref("");
let dataInfo = reactive({
  tableData:[]
});
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getList()
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
const query = () => {
  getList();
};
const queryAll = () => {
  no.value = "";
  getList();
};

// 获取列表
const getList = () => {
  let params = { no: no.value, userId: userInfo.userId };
  api.shipSummary.list(params).then((data:any) => {
    if (data) {
      dataInfo.tableData=data
    }else{
      dataInfo.tableData =[]
    }
  });
};

const detail =()=>{

}
</script>
<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  color: #ffffff;

  .search {
    height: 20%;
    min-height: 100px;
    width: 100%;
    background: #131e3c;
    opacity: 0.8;
    border: 1px solid #00bbff;
    box-shadow: inset 1px -1px 25px #00ccff;
    border-radius: 8px;
    padding: 16px;
  }

  .content {
    height: calc(30% - 10px);
    min-height: 200px;
    background: #131e3c;
    opacity: 0.8;
    border: 1px solid #00bbff;
    box-shadow: inset 1px -1px 25px #00ccff;
    border-radius: 8px;
    margin-top: 8px;
    padding: 16px;
  }

  .map {
    height: calc(50% - 15px);
    min-height: 128px;
    width: 100%;
    background: #131e3c;
    opacity: 0.8;
    border: 1px solid #00bbff;
    box-shadow: inset 1px -1px 25px #00ccff;
    border-radius: 8px;
    margin-top: 8px;
  }
}

.table_header {
  height: 32px;
  font-size: 16px;
  line-height: 32px;
  display: flex;
  font-weight: bold;
}

.query_form {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
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
  --el-table-row-hover-bg-color: ;
}

::v-deep .el-form-item__label {
  flex: 0 0 auto;
  text-align: right;
  font-size: 14px !important;
  color: #00ccff;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}

::v-deep .el-input {
  --el-input-text-color: #ffffff;
  --el-input-bg-color: ;
  --el-input-border-color: ;
  --el-border-base: var(--el-border-width-base) var(--el-border-style-base)
    #00ccff;
}

::v-deep .el-table__body tr.current-row > td.el-table__cell {
  background: linear-gradient(
    180deg,
    rgba(2, 153, 210, 0.6) 0%,
    rgba(2, 153, 210, 0) 100%
  );
}

::v-deep tbody tr:hover > td,
::v-deep tbody tr.hover-row > td {
  background: linear-gradient(
    180deg,
    rgba(2, 153, 210, 0.6) 0%,
    rgba(2, 153, 210, 0) 100%
  );
}
</style>

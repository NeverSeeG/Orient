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
              :data="dataInfo.params"
              node-key="NO_4129"
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
      <div class="content">
        <div style="height: 100%; margin-top: 8px" ref="tableBody">
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
          </el-table>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { api } from "@/axios/api";
import { User } from "@/utils/user";
import { ArrowDown, Download, Search } from "@element-plus/icons-vue";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getShipUnitCombo();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let userInfo = new User().userInfo;
let dataInfo = reactive({
  props: { label: "NAME", value: "VALUE" },
  paramsProps: { label: "NAME_4129", value: "NO_4129" },
  // 船东下拉选择项
  shipOwnerOptions: [],
  // 筛选后的船舶
  shipOptions: [],
  // 参数
  params: [],
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
// 船东选择后触发事件
const shipOwnerChange = (val: String) => {
  api.shipSummary
    .getShipNoCombo({ userId: userInfo.userId, shipUnit: val })
    .then((data: any) => {
      if (data) {
        dataInfo.shipOptions = data;
        if (data instanceof Array) {
          queryForm.no = data[0].VALUE;
          shipChange(queryForm.no);
        }
      }
    });
};

// 船舶选择后触发事件 加载参数
const shipChange = (val: String) => {
  api.shipSummary.getCommandParasCombo({ shipId: queryForm.no }).then((data: any) => {
    if (data) {
      dataInfo.params = data;
    } else {
      dataInfo.params = [];
    }
  });
};
// 船东清空事件
const shipOwnerClear = () => {
  queryForm.no = "";
};

// 船舶清空事件
const shipClear = () => {
};
const paramsTreeShow = () => {
  // 加载paramsTree数据
  api.shipSummary
    .getCommandParasCombo({ shipId: queryForm.no })
    .then((data: any) => {
      if (data) {
        dataInfo.equipmentParams = data;
      } else {
        dataInfo.equipmentParams = [];
      }
    });
};
const query = () => {
  let paramsTree = proxy.$refs.paramsTree.getCheckedNodes();
  console.log('paramsTree',paramsTree);
  console.log('queryForm',queryForm);
}

const exportData = () => {
  
}
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  color: #ffffff;

  .search {
    height: 20%;
    min-height: 100px;
    background: #131e3c;
    opacity: 0.8;
    border: 1px solid #00bbff;
    box-shadow: inset 1px -1px 25px #00ccff;
    border-radius: 8px;
    padding: 16px;
  }

  .content {
    margin-top: 16px;
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
.content {
  height: calc(80% - 90px);
  min-height: 400px;
  background: #131e3c;
  opacity: 0.8;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
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

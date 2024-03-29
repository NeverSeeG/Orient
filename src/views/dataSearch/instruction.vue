<!--
 * @description: 指令查询
 * @author: 王磊
 * @date: 2022年1月4日
-->
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
            :disabled="shipOwnerSelectStaus"
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
          <el-popover trigger="click" @show="paramsTreeShow" style="width:200px;overflow-y: auto;">
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
              default-expand-all
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
        <div style="height: calc(100% - 50px); margin-top: 8px" ref="tableBody">
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
            <el-table-column prop="OpTime" label="发送时间" />
            <el-table-column prop="OpName" label="指令名称" />
            <el-table-column prop="ExeData" label="指令值" />
            <el-table-column prop="SendResult" label="发送结果" />
            <el-table-column prop="TimeOut" label="执行结果" />
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="prev, pager, next,sizes"
            :page-sizes="[30, 60, 100, 200]"
            :current-page.sync="page"
            :page-size="limit"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { api } from "@/axios/api";
import { User } from "@/utils/user";
import { ArrowDown, Download, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
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
let userInfo = new User();
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
let shipOwnerSelectStaus = ref(false);
const getShipUnitCombo = () => {
  api.shipSummary
    .getShipUnitCombo({ userId: userInfo.userId })
    .then((data: any) => {
      if (data) {
        dataInfo.shipOwnerOptions = data;
        shipOwnerSelectStaus.value = false;
        if (data instanceof Array && data.length === 1) {
          shipOwnerSelectStaus.value = true;
          queryForm.shipowner = data[0].VALUE;
          shipOwnerChange(data[0].VALUE);
        }
      }
    });
};
let shipMap = new Map<string, string>();
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
          data.forEach((item: { LABEL: string; VALUE: string }) => {
            shipMap.set(item.VALUE, item.LABEL);
          });
        }
      }
    });
};

// 船舶选择后触发事件 加载参数
const shipChange = (val: String) => {
  api.shipSummary
    .getCommandParasCombo({ shipId: queryForm.no })
    .then((data: any) => {
      if (data) {
        let equipTreeData = [
          {
            NAME_4129: "全选",
            NO_4129: "-9999",
            children: data,
          },
        ];
        dataInfo.params = equipTreeData;
      } else {
        dataInfo.params = [];
      }
    });
};
// 船东清空事件
const shipOwnerClear = () => {
  queryForm.no = "";
  dataInfo.shipOptions = [];
  // 参数
  dataInfo.params = [];
};

// 船舶清空事件
const shipClear = () => {
  // 参数
  dataInfo.params = [];
};
let page = ref(1);
let limit = ref(30);
let total = ref(0);
class QueryParams {
  no: string = shipMap.get(queryForm.no) || "";
  opNo: string = "";
  startTime: string = queryForm.startTime;
  endTime: string = queryForm.endTime;
  page:Number =  page.value;
  limit:Number =  limit.value;
  constructor(opNo: string) {
    this.opNo = opNo;
  }
}

const query = (e: any) => {
     let target = e.target;
    // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
    // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
    if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
        target = e.target.parentNode;
    }
    target.blur();
  if (!queryForm.no) {
    ElMessage({
      message: "请先选择船舶进行查询",
      type: "warning",
    });
    return;
  }
  let paramsTree = proxy.$refs.paramsTree.getCheckedKeys();
  let params = new QueryParams(paramsTree.join(","));
  console.log("params", params);
  api.shipSummary.findCmdDataByMongo(params).then((data: any) => {
    if (data.success) {
      dataInfo.tableData = data.results;
      total.value = data.totalProperty
    }
  });
};
const exportData = () => {
  let paramsTree = proxy.$refs.paramsTree.getCheckedKeys();
  if (!queryForm.no) {
    ElMessage({
      message: "请先选择船舶",
      type: "warning",
    });
    return;
  }
  if (paramsTree.length === 0) {
    ElMessage({
      message: "请先选择参数",
      type: "warning",
    });
    return;
  }
  let params = new QueryParams(paramsTree.join(","));
  api.shipSummary.exportCommandData(params).then((data: any) => {
    if (data.success && data.results !== null) {
      let path = "/api/orientForm/download.rdm?fileId=" + data.results.fileid;
      window.location.href = path;
    }
  });
};

const sizeChange = (val: number) => {
  limit.value = val;
  query();
};

const currentChange = (val: number) => {
  page.value = val;
  query();
};
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
::v-deep .el-table .el-table__cell {
  padding: 0;
  min-width: 0;
  height:32px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
::v-deep .el-scrollbar__view {
  height: 100%;
}
::v-deep .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid var(--el-table-border-color);
}
::v-deep.el-table {
  --el-table-bg-color: ;
  --el-table-border-color: #04a0ce;
  --el-table-border: 1px solid #04a0ce;
  --el-table-row-hover-bg-color: ;
}
::v-deep .el-table__fixed::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px !important;
  background-color: #04a0ce;
  z-index: 4;
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

::v-deep .el-button--primary.is-plain {
  --el-button-text-color: #ffffff;
  --el-button-border-color: var(--el-color-primary);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: #131e3c;
  --el-button-hover-border-color: var(--el-color-primary);
  --el-button-active-text-color: var(--el-color-white);
  --el-button-active-border-color: var(--el-color-primary);
  background-color: #131e3c;
}

::v-deep .el-pagination {
  --el-pagination-font-size: 13px;
  --el-pagination-bg-color: ;
  --el-pagination-text-color: ;
  --el-pagination-border-radius: 3px;
  --el-pagination-button-color: #ffffff;
  --el-pagination-button-width: 35.5px;
  --el-pagination-button-height: 28px;
  --el-pagination-button-disabled-color: var(--el-color-primary);
  --el-pagination-button-disabled-bg-color: ;
  --el-pagination-hover-color: var(--el-color-primary);
  --el-pagination-height-extra-small: 22px;
  --el-pagination-line-height-extra-small: var(
    --el-pagination-height-extra-small
  );
  white-space: nowrap;
  padding: 2px 5px;
  color: white;
  font-weight: 700;
}

.pagination {
  border-radius: 0;
  padding: 0 6px;
  width: 100%;
  z-index: 1000;

  &.pageHeight {
    height: 51px;
    line-height: 51px;
  }

  .el-pagination {
    width: 100%;
    margin: 8px auto;
    display: flex;
    justify-content: flex-end;
  }
}

::v-deep .el-pager li.btn-quicknext,
.el-pager li.btn-quickprev {
  line-height: 32px;
  color: #ffffff !important;
}
</style>

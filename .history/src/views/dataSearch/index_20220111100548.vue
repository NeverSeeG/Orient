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
            placeholder="选择开始日期时间"
          ></el-date-picker>
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >结束时间:</span
          >
          <el-date-picker
            style="width: 200px; margin-right: 8px"
            v-model="queryForm.endTime"
            type="datetime"
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
            @click="queryAll"
            >导出</el-button
          >
        </div>
      </div>
      <div
        class="content"
        v-for="(table, index) in dataInfo.tableData"
        :key="index"
      >
        <div style="height: calc(100% - 52px)">
          <el-table
            highlight-current-row
            :data="table.tableData"
            border
            fit
            style="width: 100%"
            max-height="300px"
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
            <el-table-column type="index" width="50" fixed="left" />
            <el-table-column
              v-for="(column, index) in table.columns"
              :prop="column.prop"
              :label="column.label"
              :key="index"
            ></el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="sizeChange($event, index, table.params)"
            @current-change="currentChange($event, index, table.params)"
            layout="prev, pager, next"
            :total="table.total"
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
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
let userInfo = new User().userInfo;
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getShipUnitCombo();
  queryAll();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let shipMap = new Map();
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
      console.log("getShipUnitCombo", data);
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
          data.forEach((item) => {
            shipMap.set(item.VALUE, item.LABEL);
          });
          shipChange(queryForm.no);
        }
      }
    });
};

// 船舶选择后触发事件 加载设备
const shipChange = (val: String) => {
  api.shipSummary.getEquipmentForShipId({ shipId: val }).then((data: any) => {
    if (data) {
      dataInfo.equipMentData = data;
    } else {
      dataInfo.equipMentData = [];
    }
  });
};
// 船东清空事件
const shipOwnerClear = () => {
  queryForm.no = "";
  dataInfo.shipowner = "";
  queryForm.equipment = [];
  dataInfo.equipMentData = [];
  queryForm.equipmentParams = [];
  dataInfo.equipmentParams = [];
};

// 船舶清空事件
const shipClear = () => {
  queryForm.shipowner = "";
  queryForm.equipment = [];
  dataInfo.equipMentData = [];
  queryForm.equipmentParams = [];
  dataInfo.equipmentParams = [];
};
class QueryParams {
  no: string = shipMap.get(queryForm.no);
  equipId: string = "";
  paraIds: string = "";
  startTime: string = queryForm.startTime;
  endTime: string = queryForm.endTime;
  page: number = 1;
  limit: number = 25;
}
// 查询
const query = async () => {
  let data = [] as any;
  let equipIds = proxy.$refs.tree.getCheckedNodes();
  let paraIds = proxy.$refs.paramsTree.getCheckedNodes();
  let paraIdsMap = new Map<String, Array<String>>();
  class ParamsCombo {
    ID: any;
    NAME_4129: any;
  }
  let columnProps = new Map<String, Array<ParamsCombo>>();
  paraIds.forEach(
    (paraId: {
      GAS_EQUIPMENT_560_ID: String;
      ID: String;
      NAME_4129: String;
    }) => {
      if (paraIdsMap.get(paraId.GAS_EQUIPMENT_560_ID)?.length) {
        paraIdsMap.get(paraId.GAS_EQUIPMENT_560_ID)?.push(paraId.ID);
      } else {
        paraIdsMap.set(paraId.GAS_EQUIPMENT_560_ID, [paraId.ID]);
      }
      if (columnProps.get(paraId.GAS_EQUIPMENT_560_ID)?.length) {
        columnProps.get(paraId.GAS_EQUIPMENT_560_ID)?.push(paraId);
      } else {
        columnProps.set(paraId.GAS_EQUIPMENT_560_ID, [paraId]);
      }
    }
  );

  for (let equipId of equipIds) {
    let params = new QueryParams();
    let columns: { label: String | undefined; prop: string }[] = [];
    params.equipId = equipId.VALUE;
    params.paraIds = paraIdsMap.get(equipId.VALUE)?.join(";") || "";
    // 获取参数名称
    let paramsList = columnProps.get(equipId.VALUE) as Array<ParamsCombo>;
    let paramsName = new Map<String, String>();
    if (paramsList && paramsList.length) {
      paramsList.forEach((item) => {
        paramsName.set(item.ID, item.NAME_4129);
      });
    }
    const { results, total } = await findParasDataByMongo(params);
    if (results.length) {
      Object.keys(results[0]).forEach((item) => {
        let column = {
          label: paramsName.get(item),
          prop: item,
        };
        if (item === "Time") {
          column.label = "时间";
        }
        columns.push(column);
      });
    }
    let r = {
      columns: columns,
      tableData: results,
      total: total,
      params: params,
    };
    data.push(r);
  }
  dataInfo.tableData = data;
  console.log("tableData", dataInfo.tableData);
};
const queryAll = () => {
  findParasDataByMongo();
};
// 分页
const sizeChange = (val: any, index: number) => {
  let a = dataInfo.tableData[index];
  console.log("a: ", a);
};

const currentChange = (val: any, index: number) => {
  let  params:QueryParams  = dataInfo.tableData[index];
  params.page = val;
};
// 参数popover显示时触发
const paramsTreeShow = () => {
  let nodes = proxy.$refs.tree.getCheckedNodes();
  console.log("nodes", nodes);
  let equipId: any[] = [];

  nodes.forEach((item: any) => {
    equipId.push(item.VALUE);
  });
  // 加载paramsTree数据
  api.shipSummary
    .getParasCombo({ equipId: equipId.join(",") })
    .then((data: any) => {
      console.log("data-----", data);
      if (data) {
        dataInfo.equipmentParams = data;
      } else {
        dataInfo.equipmentParams = [];
      }
    });
};
// 列表查询
const findParasDataByMongo = async (params?: any) => {
  const result = await api.shipSummary
    .findParasDataByMongo(params)
    .then((data: any) => {
      let dataResults = {
        results: [],
        total: 0,
      };
      if (data.success) {
        dataResults.results = data.results;
        dataResults.total = data.totalProperty;
      }
      return dataResults;
    });
  return result;
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

.pagination {
  border-top: 1px solid #d2d7de;
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
  }
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

::v-deep .el-pager li.btn-quicknext,
.el-pager li.btn-quickprev {
  line-height: 32px;
  color: #ffffff !important;
}
</style>

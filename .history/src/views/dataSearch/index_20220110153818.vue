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
  tableData: [],
  // 船东下拉选择项
  shipOwnerOptions: [],
  // 筛选后的船舶
  shipOptions: [],
  // 设备树
  equipMentData: [],
  // 参数
  equipmentParams: [],
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

// 查询
const query = () => {
  let equipIds = proxy.$refs.tree.getCheckedNodes();
  let paraIds = proxy.$refs.paramsTree.getCheckedNodes();
  let paraIdsMap = new Map<String, Array<String>>();
  let columnProps = new Map<String, Array<Object>>();
  paraIds.forEach((paraId: { GAS_EQUIPMENT_560_ID: String; ID: String }) => {
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
  });
  let params = {
    no: shipMap.get(queryForm.no),
    equipId: "",
    paraIds: "",
    startTime: queryForm.startTime,
    endTime: queryForm.endTime,
    columnProps: [] as any,
    page: 1,
    limit: 25,
  };
  console.log('paraIdsMap',paraIdsMap);
  equipIds.forEach((equipId:{VALUE:string}) => {
    params.equipId = equipId.VALUE;
    params.paraIds = paraIdsMap.get(equipId.VALUE)?.join(";") || "";
    params.columnProps = columnProps.get(equipId.VALUE);
    findParasDataByMongo(params);
  });
};
const queryAll = () => {
  findParasDataByMongo();
};
// 获取选中的 设备ID

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
const findParasDataByMongo = (params?: any) => {
  api.shipSummary.findParasDataByMongo(params).then((data: any) => {
    console.log("data----", data);
  });
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
</style>

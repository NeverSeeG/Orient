<!--
 * @description: 数据查询
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
            :disabled="shipOwnerSelectStaus"
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
            @clear="shipClear"
            @change="shipChange"
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
              <el-button
                type="primary"
                size="default"
                plain
                @click="equipTreeShow"
                >选择设备<el-icon class="el-icon--right"><arrow-down /></el-icon
              ></el-button>
            </template>
            <el-tree
              style="height: 250px; overflow: auto"
              ref="tree"
              :data="dataInfo.equipMentData"
              node-key="VALUE"
              highlight-current
              default-expand-all
              @check-change="equipMentDataChange"
              :props="dataInfo.props"
              :draggable="false"
              :default-checked-keys="equipMentCheckedKeys"
              show-checkbox
            ></el-tree>
          </el-popover>
          <el-popover trigger="click" :width="250">
            <template #reference>
              <el-button
                type="primary"
                size="default"
                plain
                @click="paramsTreeShow"
                >选择参数<el-icon class="el-icon--right"><arrow-down /></el-icon
              ></el-button>
            </template>
            <el-tree
              style="height: 250px; overflow: auto"
              highlight-current
              ref="paramsTree"
              :data="dataInfo.equipmentParams"
              node-key="ID"
              :props="dataInfo.paramsProps"
              :draggable="false"
              default-expand-all
              :default-checked-keys="equipParamsCheckKeys"
              @check-change="equipMentParamsChange"
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
            @header-click="(column:any,event:any)=>{headerClick(column,event,index)}"
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
            layout="prev, pager, next,sizes"
            :page-sizes="[25, 50, 100, 200]"
            :current-page.sync="table.params.page"
            :page-size="table.params.limit"
            :total="table.total"
          ></el-pagination>
        </div>
      </div>
      <div class="statistics" id="statistics" v-if="statisticsStatus"></div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { api } from "@/axios/api";
import { User } from "@/utils/user";
import { ArrowDown, Download, Search } from "@element-plus/icons-vue";
import { ElMessage, ElLoading } from "element-plus";
import type { ElTree } from "element-plus";
import { includes, indexOf, slice } from "lodash";
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
let statisticsStatus = ref(false);
let userInfo = new User();
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getShipUnitCombo();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;

    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let shipOwnerSelectStaus = ref(false);
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
// 获取船东下拉

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
          // shipChange(queryForm.no);
        }
      }
    });
};

// 船舶选择后触发事件 加载设备
// const shipChange = (val: String) => {
//   // 如果存在 选中的回显
//   api.shipSummary.getEquipmentForShipId({ shipId: val }).then((data: any) => {
//     if (data) {
//       dataInfo.equipMentData = data;
//     } else {
//       dataInfo.equipMentData = [];
//     }
//   });
// };
let equipMentCheckedKeys = ref([]);
let equipParamsCheckKeys = ref([]);
const equipTreeShow = () => {
  api.shipSummary
    .getEquipmentForShipId({ shipId: queryForm.no })
    .then((data: any) => {
      if (data && data instanceof Array && data.length > 0) {
        let equipTreeData = [
          {
            NAME: "全选",
            VALUE: "-9999",
            children: data,
          },
        ];
        dataInfo.equipMentData = equipTreeData;
        proxy.$refs.tree.setCheckedKeys([], false);
        equipMentCheckedKeys.value = [...equipCheckNodeValue];
      } else {
        proxy.$refs.tree.setCheckedKeys([], false);
        dataInfo.equipMentData = [];
      }
    });
};
let equipCheckNodeValue = new Set<String>();
let paramsTreeCheckNodeValue = new Set<String>();
const equipMentDataChange = (node: any, checked: any) => {
  if (checked) {
    equipCheckNodeValue.add(node.VALUE);
  } else if (includes([...equipCheckNodeValue], node.VALUE)) {
    equipCheckNodeValue.delete(node.VALUE);
  }
};
const equipMentParamsChange = (node: any, checked: any) => {
  if (checked) {
    paramsTreeCheckNodeValue.add(node.ID);
  } else if (includes([...paramsTreeCheckNodeValue], node.ID)) {
    paramsTreeCheckNodeValue.delete(node.ID);
  }
};

// 船东清空事件
const shipOwnerClear = () => {
  queryForm.no = "";
  dataInfo.shipowner = "";
  queryForm.equipment = [];
  dataInfo.equipMentData = [];
  queryForm.equipmentParams = [];
  dataInfo.equipmentParams = [];
  equipMentCheckedKeys.value = [];
  equipParamsCheckKeys.value = [];
  equipCheckNodeValue = new Set();
  paramsTreeCheckNodeValue = new Set();
};

// 船舶清空事件
const shipClear = () => {
  queryForm.shipowner = "";
  queryForm.equipment = [];
  dataInfo.equipMentData = [];
  queryForm.equipmentParams = [];
  dataInfo.equipmentParams = [];
  equipMentCheckedKeys.value = [];
  equipParamsCheckKeys.value = [];
  equipCheckNodeValue = new Set();
  paramsTreeCheckNodeValue = new Set();
};
const shipChange = () => {
  equipCheckNodeValue = new Set();
  paramsTreeCheckNodeValue = new Set();
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
class ParamsCombo {
  ID: any;
  NAME_4129: any;
  constructor(id: any, name: any) {
    this.ID = id;
    this.NAME_4129 = name;
  }
}
// 查询
const query = async (e: any) => {
  let target = e.target;
  // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
  // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
  if (target.nodeName == "SPAN" || target.nodeName == "I") {
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

  // 同一表格数据标识
  flag = false;
  // 图标区域显示状态
  statisticsStatus.value = false;
  // 清空图表 缓存的 表格column
  chartColumns.clear();
  chartColumnProps.clear();
  let data = [] as any;
  let equipIds = proxy.$refs.tree.getCheckedNodes();
  let paraIds = proxy.$refs.paramsTree.getCheckedNodes();
  let paraIdsMap = new Map<String, Array<String>>();
  if (!equipIds || !paraIds) {
    ElMessage({
      message: "请先选择设备或参数进行查询",
      type: "warning",
    });
    return;
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
  const loading = ElLoading.service({
    lock: true,
    text: "数据查询中请稍候...",
    background: "rgba(0, 0, 0, 0.7)",
  });
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
        columns.unshift(column);
      });
    }
    let r = {
      columns: columns,
      tableData: results,
      total: total,
      params: params,
    };
    if (results.length > 0) {
      data.push(r);
    }
  }
  loading.close();
  dataInfo.tableData = data;
};
// 导出
const exportData = () => {
  let equips = proxy.$refs.tree.getCheckedNodes();

  let paraIds = proxy.$refs.paramsTree.getCheckedNodes();

  if (equips.length === 0) {
    ElMessage({
      message: "请先选择设备",
      type: "warning",
    });
    return;
  }
  if (paraIds.length === 0) {
    ElMessage({
      message: "请先选择设备",
      type: "warning",
    });
    return;
  }
  let equipName: string[] = [];
  let equipValue: string[] = [];

  let paramsMap = new Map<String, Array<String>>();
  paraIds.forEach(
    (paraId: {
      GAS_EQUIPMENT_560_ID: String;
      ID: String;
      NAME_4129: String;
    }) => {
      if (paramsMap.get(paraId.GAS_EQUIPMENT_560_ID + "_ID")?.length) {
        paramsMap.get(paraId.GAS_EQUIPMENT_560_ID + "_ID")?.push(paraId.ID);
      } else {
        paramsMap.set(paraId.GAS_EQUIPMENT_560_ID + "_ID", [paraId.ID]);
      }
      if (paramsMap.get(paraId.GAS_EQUIPMENT_560_ID + "_NAME")?.length) {
        paramsMap
          .get(paraId.GAS_EQUIPMENT_560_ID + "_NAME")
          ?.push(paraId.NAME_4129);
      } else {
        paramsMap.set(paraId.GAS_EQUIPMENT_560_ID + "_NAME", [
          paraId.NAME_4129,
        ]);
      }
    }
  );
  let paramsIds: string[] = [];
  let paramsNames: string[] = [];
  equips.forEach((equip: { NAME: string; VALUE: string }) => {
    equipName.push(equip.NAME);
    equipValue.push(equip.VALUE);
    if (
      paramsMap.has(equip.VALUE + "_ID") &&
      paramsMap.get(equip.VALUE + "_ID") !== undefined
    ) {
      paramsIds.push((paramsMap.get(equip.VALUE + "_ID") || []).join(","));
    } else if (!paramsMap.has(equip.VALUE + "_ID")) {
      paramsIds.push("empty");
    }
    if (
      paramsMap.has(equip.VALUE + "_NAME") &&
      paramsMap.get(equip.VALUE + "_NAME") !== undefined
    ) {
      paramsMap.get(equip.VALUE + "_NAME")?.unshift("Time");
      paramsNames.push((paramsMap.get(equip.VALUE + "_NAME") || []).join(","));
    } else if (!paramsMap.has(equip.VALUE + "_NAME")) {
      paramsNames.push("empty");
    }
  });
  let params = {
    no: shipMap.get(queryForm.no),
    equipNames: equipName.join(";"),
    equipIds: equipValue.join(";"),
    paraNames: paramsNames.join(";"),
    paraIds: paramsIds.join(";"),
    startTime: queryForm.startTime,
    endTime: queryForm.endTime,
  };

  api.shipSummary.exportParasData(params).then((data: any) => {
    if (data.success && data.results !== null) {
      let path = "/api/orientForm/download.rdm?fileId=" + data.results.fileid;
      window.location.href = path;
    }
  });
};
// 分页
const sizeChange = async (val: any, index: number) => {
  dataInfo.tableData[index].params.limit = val;
  const { results, total } = await findParasDataByMongo(
    dataInfo.tableData[index].params
  );
  dataInfo.tableData[index].tableData = results;
  dataInfo.tableData[index].total = total;
};
// 当前页数
const currentChange = async (val: any, index: number) => {
  dataInfo.tableData[index].params.page = val;
  const { results, total } = await findParasDataByMongo(
    dataInfo.tableData[index].params
  );
  dataInfo.tableData[index].tableData = results;
  dataInfo.tableData[index].total = total;
};
let equipMentParams = new Map<string, string>();
// 参数popover显示时触发
const paramsTreeShow = () => {
  let nodes = proxy.$refs.tree.getCheckedNodes();
  let equipId: any[] = [];
  nodes.forEach((item: any) => {
    equipId.push(item.VALUE);
  });
  // 加载paramsTree数据
  api.shipSummary
    .getParasCombo({ equipId: equipId.join(",") })
    .then((data: any) => {
      if (data && data instanceof Array && data.length > 0) {
        let equipParamsData = [
          {
            NAME_4129: "全选",
            ID: "-9999",
            children: data,
          },
        ];
        dataInfo.equipmentParams = equipParamsData;
        data.forEach((item: any) => {
          equipMentParams.set(item.ID, item.NAME_4129);
        });
        console.log("paramsTreeCheckNodeValue", paramsTreeCheckNodeValue);
        equipParamsCheckKeys.value = [...paramsTreeCheckNodeValue];
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
let chartColumns = new Set();
let chartColumnProps = new Set();

let flag: boolean = false;
let chartIndex: number = 0;
// 单击表头
const headerClick = (
  column: { label: string; property: string },
  event: any,
  index: number
) => {
  if (column.property === "Time") {
    ElMessage({
      showClose: true,
      message: "请选择其他参数进行统计",
      type: "error",
    });
    return;
  }
  once(index);
  if (chartIndex !== index) {
    ElMessage({
      showClose: true,
      message: "请选择同一表格参数进行统计",
      type: "error",
    });
    return;
  }
  // let columnsIndex = chartColumns.indexOf(column.label);
  // if (columnsIndex === -1) {
  //   chartColumns.push(column.label);
  //   chartColumnProps.push(column.property);
  // } else if (columnsIndex > -1) {
  //   chartColumns.splice(columnsIndex, 1);
  //   chartColumnProps.splice(columnsIndex, 1);
  // }

  chartColumns.add(column.label);
  chartColumnProps.add(column.property);
  // 获取table数据
  let dataForChart = dataInfo.tableData[index].tableData;
  let xData: string[] = [];
  let series: ChartSeries[] = [];
  class ChartSeries {
    name: string = "";
    type: string = "line";
    stack: string = "总量";
    data: string[] = [];
    smooth: boolean = true;
    constructor(id: string, data: string[]) {
      this.name = equipMentParams.get(id) || "";
      this.data = data;
    }
  }
  let chartKey = new Map<string, Array<string>>();

  dataForChart.forEach((item: any) => {
    Object.keys(item).forEach((key) => {
      if (chartKey.get(key)?.length) {
        if (item[key] === "开") {
          chartKey.get(key)?.push("1");
        } else if (item[key] === "关") {
          chartKey.get(key)?.push("0");
        } else {
          chartKey.get(key)?.push(item[key]);
        }
      } else {
        if (item[key] === "开") {
          chartKey.set(key, ["1"]);
        } else if (item[key] === "关") {
          chartKey.set(key, ["0"]);
        } else {
          chartKey.set(key, [item[key]]);
        }
      }
    });
  });
  chartKey.forEach((value, key) => {
    if (key === "Time") {
      xData = value;
    } else if (chartColumnProps.has(key)) {
      let chartSeries = new ChartSeries(key, value);
      series.push(chartSeries);
    }
  });
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [...chartColumns],
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xData,
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    series: series,
  };

  if (chartColumnProps.size > 0) {
    statisticsStatus.value = true;
  }
  nextTick(() => {
    const chartDom = <HTMLElement>document.getElementById("statistics");
    const chart = proxy.$echarts.init(chartDom);
    chart.setOption(option);
  });
};
const once = (index: number) => {
  if (!flag) {
    chartIndex = index;
    flag = true;
  }
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

.statistics {
  background: #131e3c;
  opacity: 0.8;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  min-height: 400px;
  margin-top: 16px;
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
::v-deep .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid var(--el-table-border-color);
}
::v-deep.el-table {
  --el-table-bg-color: #04a0ce;
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
::v-deep .el-table__fixed {
  height: 100% !important; //设置高优先，以覆盖内联样式
}
::v-deep .el-table__fixed-right {
  height: 100% !important; //设置高优先，以覆盖内联样式
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

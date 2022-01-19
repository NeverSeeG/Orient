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
            placeholder="请选择船舶"
            style="width: 200px; margin-right: 8px"
          >
            <el-option
              v-for="item in shipownerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span style="color: #00ccff; font-size: 14px; margin-right: 8px"
            >当前船舶:</span
          >
          <el-select
            v-model="queryForm.ship"
            clearable
            placeholder="请选择船舶"
            style="width: 200px; margin-right: 8px"
          >
            <el-option
              v-for="item in shipownerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
              :data="equipMentData"
              node-key="id"
              highlight-current
              check-on-click-node
              @check-change="equipMentChecked"
              props="{ label: 'label',value:'id'}"
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
              :data="paramsData"
              node-key="id"
              props="{ label: 'label',value:'id'}"
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
import { ArrowDown, Download, Search } from "@element-plus/icons-vue";
import { reactive } from "vue";
// 查询表单
const queryForm = reactive({
  shipowner: "",
  ship: "",
  equipment: [],
  equipmentParams: [],
  startTime: "",
  endTime: "",
});
// 船东选择器
const shipownerOptions = reactive([
  {
    label: "307KVLCC",
    value: "307KVLCC",
  },
]);
// 设备下拉树
const equipMentData = reactive([
  {
    label: "111",
    id: "1",
  },
  {
    label: "111",
    id: "2",
  },
  {
    label: "111",
    id: "3",
  },
  {
    label: "111",
    id: "4",
  },
  {
    label: "111",
    id: "5",
  },
  {
    label: "111",
    id: "6",
  },
  {
    label: "111",
    id: "7",
  },
  {
    label: "111",
    id: "8",
  },
  {
    label: "111",
    id: "9",
  },
  {
    label: "111",
    id: "10",
  },
  {
    label: "111",
    id: "11",
  },
  {
    label: "111",
    id: "12",
  },
]);
// 参数下拉树
const paramsData = reactive([]);
// 选择设备
const queryEquipMent = () => {
  console.log("设备选择");
};
// 查询
const query = () => {
  console.log("查询");
};
const queryAll = () => {
  console.log("查询全部");
};
// 获取选中的 设备ID
let checkIds: Array<String> = new Array<String>();
const equipMentChecked = (data: any, checked: Boolean) => {
  if (checked) {
    checkIds.push(data.id);
  } else if (checkIds.indexOf(data.id) !== -1) {
    checkIds = checkIds.slice(checkIds.indexOf(data.id), 1);
  }
  console.log('checkIds',checkIds);
};
// 参数popover显示时触发
const paramsTreeShow = () => {
  console.log("checkIds", checkIds);
  // 加载paramsTree数据
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

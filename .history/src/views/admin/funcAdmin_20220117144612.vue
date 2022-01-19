<!--
 * @description: 用户管理
 * @author: 王磊
 * @date: 2022年1月4日
 -->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class="table_title">功能点管理</div>
      </div>
      <div class="table_body" ref="tableBody">
        <div class="tree">
          <div class="operate">
            <el-input
              class="search"
              size="small"
              clearable
              placeholder="Search"
              v-model="filterText"
            >
            </el-input>
            <el-dropdown size="small" style="margin-left: 8px">
              <el-button type="primary" size="small">
                操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in toolButton"
                    :key="index"
                    @click.native="item.command"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-scrollbar style="height: 100%">
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              :expand-on-click-node="false"
              :default-expand-all="true"
              current-node-key="2"
              highlight-current
              :props="treeProps"
              :draggable="false"
            ></el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { ArrowDown } from "@element-plus/icons-vue";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getList();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let treeData = ref([]);
let filterText = ref("");
let toolButton = reactive([
  {
    command: "add",
    label: "新增",
  },
  {
    command: "delete",
    label: "删除",
  },
]);
let treeProps = reactive({
  children: "results",
  label: "text",
});

// 获取所有功能点
const getList = () => {
  let params = {
    node: "2",
  };
  api.common.getFuncById(params).then((data: any) => {
    if (data.success) {
      treeData.value = data.results;
    }
  });
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  color: #ffffff;
}

.content {
  height: calc(100% - 35px);
  background: #131e3c;
  opacity: 0.8;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  padding: 16px;

  .operate_area {
    height: 60px;

    .table_title {
      height: 32px;
      font-size: 16px;
      line-height: 32px;
      font-weight: bold;
      display: flex;
      margin-bottom: 20px;
    }
    .btn {
      float: left;
    }
  }
  .table_body {
    height: calc(100% - 100px);
  }
}

.tree {
  height: calc(100% - 40px);
  width: 250px;
}

.search {
  width: calc(100% - 102px);
}

.operate {
  position: sticky;
  top: 0;
  z-index: 1;
  margin-bottom: 10px;
  border-bottom: 1px solid #dcdfe6;
  padding: 8px;
}

::v-deep .el-table__body-wrapper {
  &::-webkit-scrollbar {
    width: 6px !important; /* 高宽分别对应横竖滚动条的尺寸 */
  }
}
::v-deep .el-tree {
  position: relative;
  cursor: default;
  background: #121d3a;
  color: var(--el-tree-text-color);
  --el-tree-node-hover-bg-color: linear-gradient(
    180deg,
    rgba(2, 153, 210, 0.6) 0%,
    rgba(2, 153, 210, 0) 100%
  );
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

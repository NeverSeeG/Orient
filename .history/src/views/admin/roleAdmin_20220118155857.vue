<!--
 * @description: 角色管理
 * @author: 王磊
 * @date: 2022年1月4日
 -->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class="table_title">角色列表</div>
        <div class="btn">
          <el-button type="primary" size="mini">新增</el-button>
          <el-button type="danger" size="mini">批量删除</el-button>
        </div>
      </div>
      <div class="table_body" ref="tableBody">
        <el-table
          highlight-current-row
          :data="tableData"
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
          @row-click="tableRowClick"
        >
          <el-table-column type="index" width="50" fixed="left" />
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="memo" label="备注" />
          <el-table-column fixed="left" label="操作" width="250">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                :icon="Edit"
                @click="handleClick"
                >编辑</el-button
              >
              <el-button type="text" size="small">
                <el-icon style="color: #c75b5f; vertical-align: middle">
                  <delete /> </el-icon
                ><span style="color: #c75b5f; vertical-align: middle"
                  >删除</span
                >
              </el-button>
              <el-button
                type="text"
                :icon="Filter"
                size="small"
                @click="assignUser(scope.row)"
                >分配用户</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          layout="prev, pager, next,sizes"
          :page-sizes="[25, 50, 100, 200]"
          :current-page.sync="page"
          :page-size="limit"
          :total="total"
        ></el-pagination>
      </div>
    </div>
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
        <el-button
          type="primary"
          size="small"
          :icon="Check"
          style="margin-left: 8px"
          @click="distributeFunc"
        >
          保存
        </el-button>
      </div>
      <el-scrollbar style="height: calc(100% - 60px)">
        <el-tree
          style="height: 100%"
          ref="tree"
          :data="treeData"
          node-key="id"
          :expand-on-click-node="false"
          :default-expand-all="true"
          current-node-key="2"
          highlight-current
          :props="treeProps"
          :draggable="false"
          show-checkbox
          check-on-click-node
          :filter-node-method="filterNode"
        ></el-tree>
      </el-scrollbar>
    </div>
  </div>
  <el-dialog title="分配用户" width="80%" v-model="dialogVisible" append-to-body> 
    <div class="dialogContent">
       <div class="leftTable"></div> 
       <div class="operate_area">
         <el-button type="primary" size="small" :icon="ArrowRight"></el-button>
         <el-button type="primary" size="small" :icon="ArrowLeft"></el-button>
       </div>
       <div class="rightTable"></div> 
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { ArrowLeft, ArrowRight, Check, Delete, Edit, Filter } from "@element-plus/icons-vue";
import type { ElTree } from "element-plus";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
const tree = ref<InstanceType<typeof ElTree>>();
// 定义功能点树形结构类型
interface Tree {
  id: number;
  text: string;
  results?: Tree[];
}
let page = ref(1);
let limit = ref(25);
let total = ref(0);
let tableData = ref([]);
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getRoleList();
  // 获取功能点树
  getTreeList();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let dialogVisible = ref(false);
// 查询输入框双向绑定字符串
let filterText = ref("");
// 功能点树结构数据
let treeData = ref([]);
let treeProps = reactive({
  children: "results",
  label: "name",
});

watch(filterText, (newValue, oldValue) => {
  //直接监听
  tree.value!.filter(newValue);
});
// 树结构过滤方法
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.text.indexOf(value) !== -1;
};
// 获取所有功能点
const getTreeList = () => {
  api.common.getFuncById({ node: "2" }).then((data: any) => {
    if (data.success) {
      treeData.value = data.results;
    }
  });
};

const sizeChange = (val: number) => {
  page.value = val;
};

const currentChange = (val: number) => {
  limit.value = val;
};

const handleClick = () => {};
const getRoleList = () => {
  let params = {
    page: page.value,
    limit: limit.value,
  };
  api.common.getRoles(params).then((data: any) => {
    if (data.success) {
      tableData.value = data.results;
      total.value = data.totalProperty;
    }
  });
};
// 分配功能点
const distributeFunc = () => {
  let functionIds: string[] = [];
  let getCheckedKeys = proxy.$refs.tree.getCheckedKeys();
  console.log("getCheckedKeys", getCheckedKeys);
  if (!currentRow) {
    ElMessage({
      type: "warning",
      message: "请先选择角色再进行功能点分配",
    });
    return;
  }
  api.common
    .saveAssignFunctions({ roleId: currentRow.id, functionIds: getCheckedKeys })
    .then((data: any) => {
      if (data.success) {
        console.log("data", data);
        ElMessage("功能点分配成功");
      }
    });
};
let currentRow = {};
const tableRowClick = (row: any) => {
  currentRow = row;
  api.common
    .treeRoleFunctions({
      node: "root",
      roleId: row.id,
    })
    .then((data: any) => {
      if (data.success) {
      }
    });
};
// 分配用户
let userStatus = reactive({
  assignUser: [],
  unassignUser: [],
});
const assignUser = async (row: any) => {
  let unassignerParams = {
    roleId: row.id,
    assigned: false,
    page: 1,
    limit: 25,
  };
  let unassignUserResults = await listUsers(unassignerParams);
  userStatus.unassignUser = unassignUserResults?.results;
  let assignerParams = cloneDeep(unassignUserResults);
  assignerParams.assigned = true;
  let assignUserResults = await listUsers(assignerParams);
  userStatus.assignUser = assignUserResults?.results;
  dialogVisible.value = true;
};

const listUsers = async (params: any) => {
  const results = await api.common.listUsers(params).then((data: any) => {
    return data;
  });
  return results;
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
  width: calc(100% - 350px);
  display: inline-block;
  float: left;
  .operate_area {
    height: 100px;

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
    height: calc(100% - 140px);
  }
}

.tree {
  height: calc(100% - 35px);
  background: #131e3c;
  opacity: 0.8;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  padding: 16px;
  width: 250px;
  margin-left: 16px;
  display: inline-block;
  float: left;

  .operate {
    position: sticky;
    top: 0;
    z-index: 1;
    margin-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
    padding: 8px;

    .search {
      width: calc(100% - 90px);
    }
  }
}
.dialogContent{
  height: 600px;
  width:100%;
  display: flex;

  .leftTable {
    width:calc(50% - 45px)
  }
  .operate_area{
    width:64px
  }
  .rightTable {
    width:calc(50% - 45px)
  }

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
::v-deep .el-pager li.btn-quicknext,
.el-pager li.btn-quickprev {
  line-height: 32px;
  color: #ffffff !important;
}

::v-deep .el-tree {
  position: relative;
  cursor: default;
  background: #121d3a;
  --el-tree-text-color: #ffffff;
  --el-tree-node-hover-bg-color: linear-gradient(
    180deg,
    rgba(2, 153, 210, 0.6) 0%,
    rgba(2, 153, 210, 0) 100%
  );
}

::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: linear-gradient(
    180deg,
    rgba(2, 153, 210, 0.6) 0%,
    rgba(2, 153, 210, 0) 100%
  );
}
</style>

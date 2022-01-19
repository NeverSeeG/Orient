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
        </div>
      </div>
      <div class="table_body" ref="tableBody">
        <el-table
          ref="roleTable"
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
          <el-table-column fixed="left" label="操作" width="200">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                :icon="Edit"
                @click="editHandle(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteRole(scope.row.id)"
              >
                <el-icon style="color: #c75b5f; vertical-align: middle">
                  <delete /> </el-icon
                ><span style="color: #c75b5f; vertical-align: middle"
                  >删除</span
                >
              </el-button>
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
      <div class="userContent">
        <div class="leftTable">
          <el-table
            ref="leftTable"
            highlight-current-row
            :data="userStatus.unassignUser"
            border
            fit
            style="width: 100%"
            height="100%"
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
            @row-click="leftRowClick"
            @selection-change="leftHandleSelectionChange"
          >
            <el-table-column type="index" width="50" fixed="left" />
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="userName" label="用户账号" />
            <el-table-column prop="allName" label="真实姓名" />
            <el-table-column prop="department" label="部门" />
          </el-table>
        </div>
        <div class="operate_area">
          <el-button
            type="primary"
            size="small"
            title="分配用户"
            @click="assignTable"
            :icon="ArrowRight"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            title="取消分配"
            @click="unassignTable"
            :icon="ArrowLeft"
          ></el-button>
        </div>
        <div class="leftTable">
          <el-table
            highlight-current-row
            :data="userStatus.assignUser"
            border
            fit
            ref="rightTable"
            style="width: 100%"
            height="100%"
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
            @row-click="rightRowClick"
            @selection-change="rightHandleSelectionChange"
          >
            <el-table-column type="index" width="50" fixed="left" />
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="userName" label="用户账号" />
            <el-table-column prop="allName" label="真实姓名" />
            <el-table-column prop="department" label="部门" />
          </el-table>
        </div>
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
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="40%"
    append-to-body
  >
    <el-form
      ref="formRef"
      v-model="state.form"
      label-width="120px"
      :rules="rules"
    >
      <el-row class="row-flex">
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.form.name" style="color: black"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="职能">
            <el-input v-model="state.form.function" />
          </el-form-item>
        </el-col>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="saveData" type="primary">保存</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import {
ArrowLeft,
ArrowRight,
Check,
Delete,
Edit
} from "@element-plus/icons-vue";
import type { ElTable, ElTree } from "element-plus";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
const tree = ref<InstanceType<typeof ElTree>>();
const roleTable = ref<InstanceType<typeof ElTable>>();
// 定义功能点树形结构类型
interface Tree {
  id: number;
  text: string;
  results?: Tree[];
}
interface Role { 
  name:string;
  id:string;
  memo:string;
}
let state = reactive({
  form:{}
})
let page = ref(1);
let limit = ref(25);
let total = ref(0);
let tableData = ref([]);
onMounted(async () => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  // 获取功能点树
  getTreeList();
  await getRoleList();
  if (tableData.value.length > 0) {
    setCurrent(tableData.value[0]);
    tableRowClick(tableData.value[0]);
  }
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
let dialogTitle = ref('新增')
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
  getRoleList()
};

const currentChange = (val: number) => {
  limit.value = val;
  getRoleList()
};

const getRoleList = async () => {
  let params = {
    page: page.value,
    limit: limit.value,
  };
  await api.common.getRoles(params).then((data: any) => {
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
let currentRow: { id: string } = { id: "" };
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
  assignUser(row);
};
// 分配用户
let userStatus = reactive({
  assignUser: [],
  unassignUser: [],
});
const assignUser = async (row: any) => {
  console.log("assignUser---------row", row);

  let unassignerParams = {
    roleId: row.id,
    assigned: false,
    page: 1,
    limit: 10000,
  };
  let unassignUserResults = await listUsers(unassignerParams);
  userStatus.unassignUser = unassignUserResults?.results;
  let assignerParams = cloneDeep(unassignerParams);
  assignerParams.assigned = true;
  let assignUserResults = await listUsers(assignerParams);
  userStatus.assignUser = assignUserResults?.results;
};
const setCurrent = (row: any) => {
  roleTable.value!.setCurrentRow(row);
};
const listUsers = async (params: any) => {
  const results = await api.common.listUsers(params).then((data: any) => {
    return data;
  });
  return results;
};
const assignTable = () => {
  console.log("leftSelect", leftSelect);
  let selectedIds: string[] = [];
  leftSelect.forEach((item: { id: string }) => {
    selectedIds.push(item.id);
  });

  let params = {
    selectedIds: selectedIds,
    roleId: currentRow?.id,
    direction: "right",
  };
  saveAssignUsers(params);
};

const unassignTable = () => {
  let selectedIds: string[] = [];
  rightSelect.forEach((item: { id: string }) => {
    selectedIds.push(item.id);
  });

  let params = {
    selectedIds: selectedIds,
    roleId: currentRow?.id,
    direction: "left",
  };
  saveAssignUsers(params);
};
const leftRowClick = (row: any) => {
  proxy.$refs.leftTable.toggleRowSelection(row);
};
let leftSelect: { id: string }[] = [];
const leftHandleSelectionChange = (val: any) => {
  leftSelect = val;
};
let rightSelect: { id: string }[] = [];
const rightHandleSelectionChange = (val: any) => {
  rightSelect = val;
};
const rightRowClick = (row: any) => {
  proxy.$refs.rightTable.toggleRowSelection(row);
};
const saveAssignUsers = (params: any) => {
  api.common.saveAssignUsers(params).then((data: any) => {
    if (data.success) {
      console.log("currentRow", currentRow);
      assignUser(currentRow);
    }
  });
};

const deleteRole = async (id: string) => {
  const results = await api.common.deleteRole(id).then((data: any) => {
    return data.success;
  });

  if (results) {
    await getRoleList();
    if (tableData.value.length > 0) {
      setCurrent(tableData.value[0]);
      tableRowClick(tableData.value[0]);
    }
  } else {
    ElMessage.error("删除失败");
  }
};

const editHandle = (row:any) => {};
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
    height: calc(100% - 465px);
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
.userContent {
  height: 300px;
  display: flex;
  padding: 8px;
  border: 1px solid #04a0ce;

  .leftTable {
    width: calc(50% - 45px);
    height: 100%;
  }
  .operate_area {
    display: inline-grid;
    width: 64px;
    height: 100%;
    align-items: center;
    align-content: space-evenly;
    justify-content: center;
    justify-items: end;
  }
  .rightTable {
    width: calc(50% - 45px);
    height: 100%;
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

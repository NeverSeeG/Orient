<!--
 * @description: 单位管理
 * @author: 王磊
 * @date: 2022年1月4日
-->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class="table_title">单位列表</div>
        <div class="btn">
          <el-button type="primary" size="mini" @click="addDept"
            >新增</el-button
          >
        </div>
      </div>
      <div class="table_body" ref="tableBody">
        <el-table
          highlight-current-row
          default-expand-all
          row-key="id"
          :data="tableData"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
          @row-click="rowClick"
        >
          <el-table-column prop="name" label="单位名称" />
          <el-table-column prop="notes" label="备注" />
          <el-table-column fixed="left" label="操作" width="350">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                :icon="Edit"
                @click="editRow(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteRow(scope.row.id)"
              >
                <el-icon style="color: #c75b5f; vertical-align: middle">
                  <delete /> </el-icon
                ><span style="color: #c75b5f; vertical-align: middle"
                  >删除</span
                ></el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.form.name" style="color: black"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职能">
            <el-input v-model="state.form.function" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input v-model="state.form.order" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="state.form.notes" /> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="saveData" v-loading="saveLoading" type="primary"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { cloneDeep } from "lodash";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getDeptList();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let tableData = ref([]);
let dialogVisible = ref(false);
let dialogTitle = ref("新增");
let crudStatus = ref("add");
let saveLoading = ref(false);

let state = reactive({ form: {} });

const rules = reactive({
  name: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "blur",
    },
  ],
});
const getDeptList = () => {
  api.common.deptList({ node: -1 }).then((data: any) => {
    console.log("data", data);
    if (data.success) {
      tableData.value = data.results;
    }
  });
};

const editRow = (row: any) => {
  state.form = cloneDeep(row);
  crudStatus.value = "edit";
  dialogTitle.value = "编辑";
  dialogVisible.value = true;
};

const addDept = (row: any) => {
  state.form = {};
  crudStatus.value = "add";
  dialogTitle.value = "新增";
  dialogVisible.value = true;
};
let pid: string = "-1";
const rowClick = (row: any, column: any, event: any) => {
  pid = row.id;
  console.log("pid: ", pid);
};
const saveData = () => {
  saveLoading.value = true;
  if (crudStatus.value === "add") {
    state.form.pid = pid;
    console.log("state.form: ", state.form);
    api.common
      .saveDept(state.form)
      .then((data: any) => {
        if (data.success) {
          ElMessage.success(data.msg);
          getDeptList();
          dialogVisible.value = false;
        } else {
          ElMessage.error(data.msg);
        }
        saveLoading.value = false;
      })
      .catch(() => {
        saveLoading.value = false;
      });
  } else if (crudStatus.value === "edit") {
    api.common
      .updateDept(state.form)
      .then((data: any) => {
        console.log("data", data);
        if (data.success) {
          ElMessage.success(data.msg);
          getDeptList();
          dialogVisible.value = false;
        } else {
          ElMessage.error(data.msg);
        }
        saveLoading.value = false;
      })
      .catch(() => {
        saveLoading.value = false;
      });
  }
};

const deleteRow = (id: string) => {
  api.common.deleteDept(id).then((data: any) => {
    if (data.success) {
      ElMessage.success(data.msg);
      getDeptList();
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
    height: calc(100% - 100px);
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
  --el-input-text-color: #3d3d3d;
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

::v-deep .el-table__expand-icon {
  position: relative;
  cursor: pointer;
  color: #f4f4f5;
  font-size: 15px;
  transition: transform var(--el-transition-duration-fast) ease-in-out;
  height: 20px;
}

::v-deep .el-dialog {
  --el-dialog-bg-color: #131e3c;
}

</style>

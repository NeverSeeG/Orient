<!--
 * @description: 用户管理
 * @author: 王磊
 * @date: 2022年1月4日
 -->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class="table_title">用户列表</div>
        <div class="btn">
          <el-button type="primary" size="mini" @click="addData"
            >新增</el-button
          >
          <el-button type="danger" size="mini" @click="deleteUser()"
            >批量删除</el-button
          >
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
          @selection-change="handleSelectionChange"
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
          <el-table-column type="selection" width="50" fixed="left" />
          <el-table-column prop="userName" label="账号" />
          <el-table-column prop="allName" label="姓名" />
          <el-table-column prop="department" label="部门" />
          <el-table-column fixed="left" label="操作" width="200">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                :icon="Edit"
                @click="editData(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteUser(scope.row.id)"
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
    v-model="dialogState.dialogVisible"
    :title="dialogState.dialogTitle"
    width="40%"
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="dialogState.form"
      label-width="120px"
      :rules="dialogState.rules"
    >
      <el-row class="row-flex">
        <el-col :span="12">
          <el-form-item label="账号" prop="userName">
            <el-input
              v-model="dialogState.form.userName"
              style="color: black"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="allName">
            <el-input v-model="dialogState.form.allName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="dialogState.form.password" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="department">
            <el-input v-model="dialogState.form.department" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="saveData" type="primary">保存</el-button>
        <el-button @click="dialogState.dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
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
let tableData = ref([]);
const getList = () => {
  api.common.userList().then((data: any) => {
    console.log("data", data);
    if (data.success) {
      tableData.value = data.results;
    }
  });
};
let dialogState = reactive({
  dialogTitle: "新增",
  crudStatus: "add",
  dialogVisible: false,
  btnLoading: false,
  form: {},
  rules: {
    userName: [
      {
        required: true,
        message: "请输入用户账号",
        trigger: "blur",
      },
    ],
    allName: [
      {
        required: true,
        message: "请输入用户姓名",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "请输入用户密码",
        trigger: "blur",
      },
    ],
    department: [
      {
        required: true,
        message: "请输入用户部门",
        trigger: "blur",
      },
    ],
  },
});
const formRef = ref(null);
// 新增
const addData = () => {
  dialogState.dialogTitle = "新增";
  dialogState.crudStatus = "add";
  dialogState.dialogVisible = true;
};
// 修改
const editData = (row: any) => {
  let form = cloneDeep(row);
  dialogState.dialogTitle = "修改";
  dialogState.crudStatus = "edit";
  dialogState.form = form;
  dialogState.dialogVisible = true;
};
interface User {
  id: string;
  username: string;
  allName: string;
  password: string;
  department: string;
  departmentId: string;
}
let selectList: User[] = [];
const handleSelectionChange = (val: Array<User>) => {
  selectList = val;
};
// 保存
const saveData = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogState.crudStatus === "add") {
        api.common.userCreate(dialogState.form).then((data: any) => {});
      } else if (dialogState.crudStatus === "edit") {
        api.common.userUpdate(dialogState.form).then((data: any) => {});
      }
    }
  });
};
const deleteUser = (toDelIds?: string) => {
  if (!toDelIds && !selectList.length) {
    ElMessage.error("请选择数据进行删除");
    return;
  }
  if(!toDelIds){
    let selectIds:string [] = [];
    selectList.forEach((item:User) => {
      selectIds.push(item.id);
    })
    toDelIds = selectIds.join(",");
  }
  api.common.deleteUser(toDelIds).then((data: any) => {
    if(data.success){
      getList();
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
  --el-input-text-color: ;
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

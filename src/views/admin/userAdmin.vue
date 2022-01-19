<!--
 * @description: 用户管理
 * @author: 王磊
 * @date: 2022年1月4日
-->
<template>
  <div class="main">
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
      </div>
      <el-scrollbar style="height: calc(100% - 60px)">
        <el-tree
          style="height: 100%"
          ref="tree"
          :data="deptTree.treeData"
          node-key="id"
          :expand-on-click-node="false"
          :default-expand-all="true"
          highlight-current
          :props="deptTree.treeProps"
          :draggable="false"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        ></el-tree>
      </el-scrollbar>
    </div>
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
          <el-table-column prop="department" label="部门" >
            <template #default="scope">
              {{scope.row.department?JSON.parse(scope.row.department).text:''}}
            </template>
          </el-table-column>
          <el-table-column prop="grade" label="密级" >
            <template #default="scope">
              {{scope.row.grade?JSON.parse(scope.row.grade).value:''}}
            </template>
          </el-table-column>
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
            <el-input type="password" v-model="dialogState.form.password" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="department">
            <el-input v-model="dialogState.form.departmentName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              style="width: 100%"
              type="date"
              v-model="dialogState.form.birthday"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="dialogState.form.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dialogState.form.mobile" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dialogState.form.email" />
          </el-form-item> </el-col
        >
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select style="width: 100%" v-model="dialogState.form.sex">
              <el-option
                v-for="item in enumCombobox.sex"
                :key="item.value"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务" prop="post">
            <el-select style="width: 100%" v-model="dialogState.form.post">
              <el-option
                v-for="item in enumCombobox.post"
                :key="item.value"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密级" prop="grade">
            <el-select style="width: 100%" v-model="dialogState.form.grade">
              <el-option
                v-for="item in enumCombobox.grade"
                :key="item.value"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="dialogState.form.notes"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
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
import type { ElTree } from "element-plus";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
import {
getCurrentInstance,
nextTick,
onMounted,
reactive,
ref,
watch
} from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
const tree = ref<InstanceType<typeof ElTree>>();
let page = ref(1);
let limit = ref(25);
let total = ref(0);
let enumCombobox = reactive({
    sex:[] as Array<EnumCombobox>,
    post:[] as Array<EnumCombobox>,
    grade:[] as Array<EnumCombobox>,
});
onMounted(async () => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getTreeList();
  // 获取性别
  enumCombobox.sex = await getEnumCombobox("u1");
  // 获取岗位
  enumCombobox.post = await getEnumCombobox("u2");
  // 获取密级
  enumCombobox.grade = await getEnumCombobox("u3");
});
interface EnumCombobox {
  id: string;
  value: string;
}
// 获取枚举值
const getEnumCombobox = async (id: string) => {
  const results: EnumCombobox[] = await api.EnumCombobox.getEnumCombobox({
    restrictionId: id,
  }).then((data: any) => {
    if (data.success) {
      return data.results;
    }
  });
  return results;
};
const getTreeList = () => {
  api.common.deptTreeList({ node: "-1" }).then((data: any) => {
    if (data.success) {
      deptTree.treeData = data.results;
    }
    nextTick(() => {
      document.querySelector(".tree .el-tree-node__content") &&
        document.querySelector(".tree .el-tree-node__content").click();
    });
  });
};
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let filterText = ref("");
watch(filterText, (newValue, oldValue) => {
  //直接监听
  tree.value!.filter(newValue);
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.text.indexOf(value) !== -1;
};
let tableData = ref([]);
let currentDeptId: string = "";
let currentDept = {};
const nodeClick = (data: any) => {
  currentDept = data;
  currentDeptId = data.id;
  dialogState.form.departmentName = data.name;
  dialogState.form.department = data.id;
  getList();
};
const sizeChange = (val: number) => {
  page.value = val;
  getList();
};

const currentChange = (val: number) => {
  limit.value = val;
  getList();
};
const getList = () => {
  let params = {
    page: page.value,
    limit: limit.value,
    extraFilter: JSON.stringify({
      depFilter: {
        in: currentDeptId,
      },
    }),
  };
  api.common.userList(params).then((data: any) => {
    console.log("data", data);
    if (data.success) {
      tableData.value = data.results;
      total.value = data.totalProperty;
    }
  });
};
let deptTree = reactive({
  treeData: [],
  treeProps: {
    children: "children",
    label: "name",
  },
});
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
  let dept = JSON.parse(form.department);
  if (dept) {
    form.departmentName = dept.text;
  }
  console.log("form", form);
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
        delete dialogState.form.departmentName;
        api.common.userCreate(dialogState.form).then((data: any) => {
          if (data.success) {
            page.value = 0;
            limit.value = 25;
            getList();
          }
        });
      } else if (dialogState.crudStatus === "edit") {
        delete dialogState.form.departmentName;
        api.common.userUpdate(dialogState.form).then((data: any) => {
          if (data.success) {
            page.value = 0;
            limit.value = 25;
            getList();
          }
        });
      }
    }
  });
};
const deleteUser = (toDelIds?: string) => {
  if (!toDelIds && !selectList.length) {
    ElMessage.error("请选择数据进行删除");
    return;
  }
  if (!toDelIds) {
    let selectIds: string[] = [];
    selectList.forEach((item: User) => {
      selectIds.push(item.id);
    });
    toDelIds = selectIds.join(",");
  }
  api.common.deleteUser(toDelIds).then((data: any) => {
    if (data.success) {
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

.tree {
  height: calc(100% - 35px);
  width: 250px;
  display: inline-block;
  float: left;
  background: #131e3c;
  opacity: 0.8;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  padding: 16px;

  .operate {
    position: sticky;
    top: 0;
    z-index: 1;
    margin-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
    padding: 8px;
  }
}
.content {
  height: calc(100% - 35px);
  width: calc(100% - 340px);
  background: #131e3c;
  opacity: 0.8;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  padding: 16px;
  float: left;
  display: inline-block;
  margin-left: 20px;

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
    height: calc(100% - 160px);
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

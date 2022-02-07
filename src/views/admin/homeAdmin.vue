<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class="table_title">首页管理</div>
        <div class="btn">
          <el-button type="primary" size="mini" @click="addData"
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
        >
          <el-table-column prop="FILENAME" label="图片名称"> </el-table-column>
          <el-table-column prop="FILEDESCRIPTION" label="图片描述" />
          <el-table-column prop="STATE" label="使用状态">
            <template #default="scope">
              <el-switch
                @change="updateMainPicState(scope.row)"
                v-model="scope.row.STATE"
                active-value="使用"
                inactive-value="未使用"
                active-text="使用"
                inactive-text="未使用"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="UPLOAD_DATE" label="上传时间" />
          <el-table-column fixed="left" label="操作" width="250">
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
                @click="deleteRow(scope.row.FILEID)"
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
    <el-form ref="formRef" v-model="state.form" label-width="120px">
      <el-row class="row-flex">
        <el-col :span="24">
          <el-form-item label="上传图片" prop="name">
            <el-upload
              class="upload-demo"
              ref="batchUpload"
              :action="action"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :fileList="fileList"
              :disabled="imgDisabled"
              :multiple="false"
              accept=".png,.jpeg,.jpg"
              :on-change="batchChangeFile"
              :on-remove="batchRemoveFile"
            >
              <el-icon><plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述">
            <el-input v-model="state.form.desc" :rows="5" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
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
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { cloneDeep } from "lodash";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
let tableData = ref([]);
let dialogVisible = ref(false);
let dialogTitle = ref("新增");
let crudStatus = ref("add");
let action = ref("/api/gasImport/importMainPic.rdm");
let state = reactive({
  form: {},
  batchFile: "",
});
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
let imgDisabled = ref(false);
const addData = () => {
  state.form = {};
  imgDisabled.value = false;
  dialogTitle.value = "新增";
  crudStatus.value = "add";
  dialogVisible.value = true;
};
let fileList = ref([]);
const editRow = (row: any) => {
  imgDisabled.value = true;
  let form = cloneDeep(row);
  let files = [
    {
      name: row.FILENAME,
      url: "/api/gasExport/getMainPicForFileId/" + row.FILEID + ".rdm",
    },
  ];
  state.form = {
    desc: form.FILEDESCRIPTION,
    fileId: form.FILEID,
  };
  fileList.value = files;
  dialogTitle.value = "修改";
  crudStatus.value = "edit";
  dialogVisible.value = true;
};
/**
 * 更新图片使用状态
 */
const updateMainPicState = (row: any) => {
  let state = "0";
  if (row.STATE === "使用") {
    state = "1";
  }
  let params = {
    fileId: row.FILEID,
    state: state,
  };
  api.homeAdmin.updateMainPicState(params).then((data: any) => {
    console.log("data", data);
  });
};
const deleteRow = (id: string) => {
  ElMessageBox.confirm("确认删除该数据?", "Warning", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    api.homeAdmin.deleteImg(id).then((data: any) => {
      if (data.success) {
        getList();
        ElMessage.success("删除成功");
      }
    });
  });
};

const getList = () => {
  api.homeAdmin.getList().then((data: any) => {
    tableData.value = data;
    console.log("data: ", data);
  });
};

const batchChangeFile = (file) => {
  state.batchFile = file;
  state.form.file = file.raw || "";
};
const saveData = () => {
  if (crudStatus.value === "add") {
    state.form.file = state.batchFile.raw || "";
    let formData = new FormData();
    formData.append("file", state.batchFile.raw);
    api.homeAdmin.saveData(formData, state.form.desc).then((data: any) => {
      console.log("data: ", data);
      if (data.success) {
        getList();
        dialogVisible.value = false;
        ElMessage.success("保存成功");
      }
    });
  } else if (crudStatus.value === "edit") {
    api.homeAdmin.updateMainPicDesc(state.form).then((data: any) => {
      if (data.success) {
        getList();
        dialogVisible.value = false;
        ElMessage.success("修改成功");
      }
    });
  }
};
</script>
<style scoped lang="scss">
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

::v-deep .el-switch__label {
  color: #ffffff;
}

::v-deep .el-switch__label.is-active {
  color: var(--el-color-primary);
}
</style>

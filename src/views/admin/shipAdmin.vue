<!--
 * @description: 船舶管理
 * @author: 王磊
 * @date: 2022年1月4日
-->
<template>
  <div class="main">
    <div class="content">
      <div class="operate_area">
        <div class="table_title">船舶列表</div>
        <div class="btn">
          <el-button type="primary" size="mini" @click="addData"
            >新增</el-button
          >
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
        >
          <el-table-column type="index" width="50" fixed="left" />
          <el-table-column type="selection" width="50" fixed="left" />
          <el-table-column prop="NAME_4127" label="船舶名称" />
          <el-table-column prop="NO_4127" label="船舶代号" />
          <el-table-column prop="UNIT_4127" label="所属单位" />
          <el-table-column prop="CCS_REGISTER_NUM_4127" label="CCS登记号" />
          <el-table-column prop="IMO_NO_4127" label="IMO NO" />
          <el-table-column prop="SHIP_TYPE_4127" label="船型" />
          <el-table-column prop="REGISTRY_COUNTRY_4127" label="船籍国" />
          <el-table-column prop="SCREW_PITCH_4127" label="螺距(mm)" />
          <el-table-column prop="BOATLOAD_4127" label="载货量(t)" />
          <el-table-column prop="DESIGN_SPEED_4127" label="设计航速" />
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
                @click="deleteData(scope.row.ID)"
              >
                <el-icon style="color: #c75b5f; vertical-align: middle">
                  <delete /> </el-icon
                ><span style="color: #c75b5f; vertical-align: middle"
                  >删除</span
                ></el-button
              >
              <el-upload
                class="upload-demo"
                ref="upload"
                v-model="jsonForm.jsonFile"
                :auto-upload="true"
                :limit="1"
                :multiple="false"
                accept=".xml"
                :show-file-list="false"
                :on-change="changeXmlFile"
                :http-request="importXml(scope.row.ID)"
                :action="
                  '/api/gasImport/importEquipParasData/' + scope.row.ID + '.rdm'
                "
              >
                <el-button slot="trigger" type="text" size="small">
                  导入模型
                </el-button>
              </el-upload>

              <el-button type="text" size="small">
                <el-icon style="vertical-align: middle">
                  <View />
                </el-icon>
                <span style="vertical-align: middle">检测管理</span></el-button
              >
              <el-button type="text" size="small">
                <el-icon style="vertical-align: middle">
                  <User />
                </el-icon>
                <span style="vertical-align: middle">关联用户</span>
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
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="crudStatus === 'edit' ? '详情' : '新增'"
    width="40%"
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="detailForm"
      label-width="120px"
      :rules="formRules"
    >
      <el-row class="row-flex">
        <el-col :span="12">
          <el-form-item label="船舶名称" prop="name">
            <el-input v-model="detailForm.name" style="color: black"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船舶代号" prop="no">
            <el-input v-model="detailForm.no" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属单位" prop="departmentId">
            <el-popover v-model:visible="visible">
              <template #reference>
                <el-input v-model="detailForm.unit" disabled>
                  <template #append>
                    <el-button :icon="Plus" @click="visible = true"></el-button>
                  </template>
                </el-input>
              </template>
              <el-tree
                style="height: 250px; overflow: auto"
                highlight-current
                check-on-click-node
                ref="paramsTree"
                :data="deptMentData"
                node-key="ID"
                :props="deptProp"
                @node-click="deptNodeClick"
                :draggable="false"
              ></el-tree>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CCS登记号" prop="css">
            <el-input v-model="detailForm.css" /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="IMO NO" prop="imoNo">
            <el-input v-model="detailForm.imoNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船型" prop="shipType">
            <el-input v-model="detailForm.shipType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船籍国" prop="registryCountry">
            <el-input v-model="detailForm.registryCountry"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船籍港" prop="registryHarbor">
            <el-input v-model="detailForm.registryHarbor"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="螺距(mm)" prop="screwPitch">
            <el-input v-model="detailForm.screwPitch"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="载货量(t)" prop="boatload">
            <el-input v-model="detailForm.boatload"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计航速(km)" prop="designSpeed">
            <el-input v-model="detailForm.designSpeed"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateData" type="primary" v-loading="updateDataLoading">保存</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { Edit, User, View, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
let visible = ref(false);
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getList();
  getDeptList();
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 2 + "px";
  }
};
let jsonForm = reactive({
  cover: false,
  jsonFile: "",
});
const formRules = reactive({
  name: [
    {
      required: true,
      message: "请输入船舶名称",
      trigger: "blur",
    },
  ],
  no: [
    {
      required: true,
      message: "请输入船舶代号",
      trigger: "blur",
    },
  ],
  departmentId: [
    {
      required: true,
      message: "请选择单位",
      trigger: "blur",
    },
  ],
});
let page = ref(1);
let limit = ref(25);
let total = ref(0);
let dialogVisible = ref(false);
let crudStatus = ref("add");
let detailForm = reactive({
  id: "",
  name: "",
  no: "",
  unit: "",
  departmentId: "",
  css: "",
  imoNo: "",
  shipType: "",
  registryCountry: "",
  registryHarbor: "",
  screwPitch: "",
  boatload: "",
  designSpeed: "",
});
const sizeChange = (val: number) => {
  limit.value = val;
  getList();
};
const currentChange = (val: number) => {
  page.value = val;
  getList();
};
let xmlFile = "";
const changeXmlFile = (file: any) => {
  xmlFile = file;
};

const importXml = (shipId: any) => {};

const deleteData = (shipId: any) => {
  api.ship.deleteData({ id: shipId }).then((data: any) => {});
};
let tableData = ref([]);
let rules = ref([{}]);
const getList = () => {
  api.ship.list({ page: page.value, limit: limit.value }).then((data: any) => {
    console.log("data", data);
    if (data.success) {
      tableData.value = data.results;
      total.value = data.totalProperty;
    }
  });
};
const formRef = ref(null);
let updateDataLoading = ref(false)
const updateData = () => {
  updateDataLoading.value = true
  formRef.value.validate((valid: Boolean) => {
    if (valid) {
      if (crudStatus.value === "add") {
        api.ship.insertShipData(detailForm).then((data: any) => {
          if (data.success) {
            updateDataLoading.value =false
            ElMessage.success("保存成功");
            dialogVisible.value = false;
            getList();
          }else{
            updateDataLoading.value =false
            ElMessage.error("保存失败");
          }
        }).catch((error:any) => {
          updateDataLoading.value =false
        });
      } else if (crudStatus.value === "edit") {
        api.ship.updateData(detailForm).then((data: any) => {
          console.log("data", data);
          if (data.success) {
            updateDataLoading.value =false
            ElMessage.success("修改成功");
            dialogVisible.value = false;
            getList();
          }else{
            updateDataLoading.value =false
            ElMessage.success("修改失败");
          }
        }).catch(error => {
          updateDataLoading.value =false
        });
      }
    }else{
      updateDataLoading.value=false
    }
  });
};
const addData = () => {
  crudStatus.value = "add";
  dialogVisible.value = true;
  // TODO 傻逼写法 后面在优化
  detailForm.id = "";
  detailForm.no = "";
  detailForm.name = "";
  detailForm.unit = "";
  detailForm.imoNo = "";
  detailForm.shipType = "";
  detailForm.registryCountry = "";
  detailForm.registryHarbor = "";
  detailForm.screwPitch = "";
  detailForm.boatload = "";
  detailForm.designSpeed = "";
};
const editRow = (row: any) => {
  crudStatus.value = "edit";
  api.ship.getById({ shipId: row.ID }).then((data: any) => {
    console.log("data", data);
    // TODO 傻逼写法 后面在优化
    detailForm.id = data[0].ID;
    detailForm.no = data[0].NO_4127;
    detailForm.name = data[0].NAME_4127;
    detailForm.unit = data[0].UNIT_4127;
    detailForm.imoNo = data[0].IMO_NO_4127;
    detailForm.shipType = data[0].SHIP_TYPE_4127;
    detailForm.registryCountry = data[0].REGISTRY_COUNTRY_4127;
    detailForm.registryHarbor = data[0].REGISTRY_HARBOR_4127;
    detailForm.screwPitch = data[0].SCREW_PITCH_4127;
    detailForm.boatload = data[0].BOATLOAD_4127;
    detailForm.designSpeed = data[0].DESIGN_SPEED_4127;
    dialogVisible.value = true;
  });
};
// 获取单位列表
let deptMentData = ref([]);
let deptProp = reactive({ children: "children", label: "name" });
const getDeptList = () => {
  api.common.deptList({ node: -1 }).then((data: any) => {
    console.log("data", data);
    if (data.success) {
      deptMentData.value = data.results;
    }
  });
};
const deptNodeClick = (node: any, data: any) => {
  detailForm.unit = node.name;
  detailForm.departmentId = node.id;
  visible.value = false;
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
    height: calc(100% - 138px);
  }
}
.upload-demo {
  display: inline-block;
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
::v-deep .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 0px solid var(--el-table-border-color);
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

::v-deep .el-dialog {
  --el-dialog-bg-color: #131e3c;
}
</style>

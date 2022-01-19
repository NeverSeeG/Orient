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
              <el-button type="text" size="small">
                <el-icon style="color: #c75b5f; vertical-align: middle">
                  <delete /> </el-icon
                ><span style="color: #c75b5f; vertical-align: middle"
                  >删除</span
                ></el-button
              >
              <el-button type="text" size="small">
                <el-icon style="vertical-align: middle">
                  <download />
                </el-icon>
                <span style="vertical-align: middle">导入参数</span></el-button
              >
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
  <el-dialog v-model="dialogVisible" title="详情" width="40%" append-to-body>
    <el-form ref="formRef" :model="detailForm" label-width="120px">
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
          <el-form-item label="所属单位" prop="unit">
            <el-input v-model="detailForm.unit" />
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
        <el-button @click="updateData" type="primary">保存</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { Edit, User, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
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
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 2 + "px";
  }
};
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

let tableData = ref([]);
let rules = ref([{

}]);
const getList = () => {
  api.ship.list({ page: page.value, limit: limit.value }).then((data: any) => {
    console.log("data", data);
    if (data.success) {
      tableData.value = data.results;
      total.value = data.totalProperty;
    }
  });
};

const updateData = () => {
  if (crudStatus.value === "add") {


  } else if (crudStatus.value === "edit") {
    api.ship.updateData({...detailForm}).then((data: any) => {
      console.log("data", data);
      if (data.success) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      }
    });
  }
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

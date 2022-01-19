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
        >
          <el-table-column type="index" width="50" fixed="left" />
          <el-table-column type="selection" width="50" fixed="left" />
          <el-table-column prop="NAME_4127" label="船舶名称"  />
          <el-table-column prop="NO_4127" label="船舶代号" />
          <el-table-column prop="UNIT_4127" label="所属单位" />
          <el-table-column prop="CCS_REGISTER_NUM_4127" label="CCS登记号" />
          <el-table-column prop="IMO_NO_4127" label="IMO NO" />
          <el-table-column prop="SHIP_TYPE_4127" label="船型" />
          <el-table-column prop="REGISTRY_COUNTRY_4127" label="船籍国" />
          <el-table-column prop="SCREW_PITCH_4127" label="螺距(mm)" />
          <el-table-column prop="BOATLOAD_4127" label="载货量(t)" />
          <el-table-column prop="DESIGN_SPEED_4127" label="设计航速" />
          <!-- <el-table-column fixed="left" label="操作" width="350">
            <template #default>
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
          </el-table-column> -->
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
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
let tableMaxHeight = ref("100%");
const { proxy } = getCurrentInstance() as any;
onMounted(() => {
  rerenderTable();
  window.addEventListener("resize", rerenderTable);
  getList()
});
const rerenderTable = () => {
  if (proxy.$refs.tableBody) {
    let tableBodyHeight = proxy.$refs.tableBody.clientHeight;
    console.log("tableBodyHeight", tableBodyHeight);
    tableMaxHeight.value =
      tableBodyHeight <= 0 ? "100%" : tableBodyHeight - 32 + "px";
  }
};
let page = ref(1);
let limit = ref(25);
let total = ref(0);
const sizeChange = (val: number) => {
  console.log("sizeChange", val);
};
const currentChange = (val: number) => {
  console.log("currentChange", val);
};

let tableData = reactive([]);

const getList = ()=>{
  api.ship.list({page:page.value,limit:limit.value}).then((data: any)=>{
    console.log('data',data);
    if(data.success){
      tableData.data = data.results
      total.value = data.totalProperty
    }
  })
}

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
</style>

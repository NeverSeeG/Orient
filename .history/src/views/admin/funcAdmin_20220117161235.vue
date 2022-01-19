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
          <el-scrollbar style="height: calc(100% - 60px)">
            <el-tree
              style="height: calc(100% - 80px)"
              ref="tree"
              :data="treeData"
              node-key="id"
              :expand-on-click-node="false"
              :default-expand-all="true"
              current-node-key="2"
              highlight-current
              :props="treeProps"
              :draggable="false"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
            ></el-tree>
          </el-scrollbar>
        </div>
        <div class="form-group">
          <el-form
            ref="formRef"
            v-model="funcState.form"
            label-width="120px"
            :rules="rules"
          >
            <el-row class="row-flex">
              <el-col :span="24" v-for="(item, index) in formItem" :key="index">
                <el-form-item :label="item.label" :prop="item.prop">
                  <el-input
                    v-model="funcState.form[item.prop]"
                    style="color: black"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="formoperate">
            <el-button
              size="small"
              :disabled="formDisabled"
              type="primary"
              :loading="editLoading"
              @click="onUpdate"
              >保存
            </el-button>
            <el-button
              size="small"
              :disabled="!canEdit"
              type="primary"
              @click="editFunc"
              >修改
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/axios/api";
import type { ElTree } from "element-plus";
import {
getCurrentInstance,
nextTick,
onMounted,
reactive,
ref,
watch
} from "vue";
const tree = ref<InstanceType<typeof ElTree>>();
interface Tree {
  id: number;
  text: string;
  results?: Tree[];
}
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
watch(filterText, (newValue, oldValue) => {
  //直接监听
  tree.value!.filter(newValue);
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.text.indexOf(value) !== -1;
};
const nodeClick = (data:any) => {
  console.log("点击了",data);
};
let rules = reactive({
  name: [
    {
      required: true,
      message: "请输入功能点名称",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入业务功能代号",
      trigger: "blur",
    },
  ],
  position: [
    {
      required: true,
      message: "请输入业务功能点位置",
      trigger: "blur",
    },
  ],
});
let formItem = reactive([
  {
    label: "业务功能代号",
    prop: "code",
  },
  {
    label: "业务功能名称",
    prop: "name",
  },
  {
    label: "位置",
    prop: "position",
  },
  {
    label: "连接",
    prop: "url",
  },
  {
    label: "js类",
    prop: "js",
  },
  {
    label: "备注",
    prop: "notes",
  },
]);
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
const funcState = reactive({
  form: {},
});
// 获取所有功能点
const getList = () => {
  let params = {
    node: "2",
  };
  api.common.getFuncById(params).then((data: any) => {
    if (data.success) {
      treeData.value = data.results;
      nextTick(() => {
        document.querySelector(".table_body .el-tree-node__content") &&
          document.querySelector(".table_body .el-tree-node__content").click();
      });
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
    height: calc(100% - 80px);
  }
}

.tree {
  height: 100%;
  width: 250px;
  display: inline-block;
  float: left;
}

.form-group {
  height: 100%;
  width: calc(100% - 270px);
  margin-left: 20px;
  display: inline-block;
  float: left;
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

.formoperate {
  float: right;
  margin-bottom: 20px;
  margin-right: 16px;
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

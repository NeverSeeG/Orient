<template>
  <el-scrollbar style="height:100%">
    <div class="main">
      <div class="search">
        <div class=table_header>查询条件</div>
        <div class="query_form">
            <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船东:</span>
            <el-select v-model="queryForm.shipowner" clearable placeholder="请选择船舶" style="width:200px;margin-right: 8px;">
              <el-option
                v-for="item in shipownerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船舶:</span>
            <el-select v-model="queryForm.ship" clearable placeholder="请选择船舶" style="width:200px;margin-right: 8px;">
              <el-option
                v-for="item in shipownerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="default" @click="query" >选择设备</el-button>
            <el-button type="primary" size="default" @click="queryAll" :icon="SetUp">查询全部</el-button>
        
        </div>
         <div class="query_form">
            <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">开始时间:</span>
            <el-select v-model="queryForm.shipowner" clearable placeholder="请选择船舶" style="width:200px;margin-right: 8px;">
              <el-option
                v-for="item in shipownerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">结束时间:</span>
            <el-select v-model="queryForm.ship" clearable placeholder="请选择船舶" style="width:200px;margin-right: 8px;">
              <el-option
                v-for="item in shipownerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="default" @click="query" >选择设备</el-button>
            <el-button type="primary" size="default" @click="queryAll" :icon="SetUp">查询全部</el-button>
        
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
const queryForm = reactive({
  shipowner:'',
  ship:'',
  equipment:[],
  equipmentParams:[],
  startTime:'',
  endTime:'',
})
// 船东选择器
const shipownerOptions = reactive([{ 
  label:"307KVLCC",
  value:"307KVLCC"}
])
</script>

<style lang="scss" scoped>
.main{
  height: 100%;
  width: 100%;
  color:#ffffff;

    .search{
      height: 20%;
      min-height: 100px;
      background: #131E3C;
      opacity: 0.8;
      border: 1px solid #00BBFF;
      box-shadow: inset 1px -1px 25px #00CCFF;
      border-radius: 8px;
      padding:16px;
    }

    .content{
      margin-top:16px;
    }
}

.table_header{
  height:32px;
  font-size: 16px;
  line-height: 32px;
  display: flex;
  font-weight: bold;
}
.query_form{
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
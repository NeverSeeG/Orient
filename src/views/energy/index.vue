<!--
 * @description: 能效分析
 * @author: 王磊
 * @date: 2022年1月5日
-->
<template>
  <el-scrollbar style="height:100%">
    <div class="main">
       <div class="search">
        <div class=table_header>查询条件</div>
        <div class="query_form">
          <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">当前船舶:</span>
         <el-select v-model="formInline.name" clearable placeholder="请选择船舶" style="width:200px;margin-right: 8px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span style="color:#00CCFF;font-size: 14px;margin-right: 8px;">航次:</span>
          <el-select v-model="formInline.voyage" clearable placeholder="请选择航次" style="width:200px;margin-right: 8px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="default" @click="query" :icon="Search">查询</el-button>
        </div>
      </div> 
      <div class="content">
        <el-table highlight-current-row :data="tableData"  border fit style="width: 100%" height="100"   :header-cell-style="{background:'#19346B',fontSize: '14px',color:'#FFFFFF'}" :row-style="{background: '#131E3C',fontSize: '14px',color:'#FFFFFF'}">
            <el-table-column prop="date" label="Date" width="150" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
      <div class="statistics" id="statistics1"></div>
      <div class="statistics" id="statistics2"></div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { getCurrentInstance, nextTick, onMounted, reactive } from "vue";
const { proxy } = getCurrentInstance() as any;


onMounted(()=>{
  const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
        textStyle:{
                color:"#fff"
            }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        axisLine: {
                lineStyle: {
                    color: "#fff",
                }
            }
      },
      yAxis: {
        type: "value",
        axisLine: {
                lineStyle: {
                    color: "#fff",
                }
            }
      },
      series: [
        {
          name: "邮件营销",
          type: "line",
          stack: "总量",
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true
        },
        {
          name: "联盟广告",
          type: "line",
          stack: "总量",
          data: [220, 182, 191, 234, 290, 330, 310],
          smooth: true
        },
        {
          name: "视频广告",
          type: "line",
          stack: "总量",
          data: [150, 232, 201, 154, 190, 330, 410],
          smooth: true
        },
        {
          name: "直接访问",
          type: "line",
          stack: "总量",
          data: [320, 332, 301, 334, 390, 330, 320],
          smooth: true
        },
        {
          name: "搜索引擎",
          type: "line",
          stack: "总量",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          smooth: true
        },
      ],
    };
  nextTick(() => {
    const chartDom1 = <HTMLElement>document.getElementById("statistics1");
    const chartDom2 = <HTMLElement>document.getElementById("statistics2");
    const myChart1 = proxy.$echarts.init(chartDom1);
    const myChart2 = proxy.$echarts.init(chartDom2);
    myChart1.setOption(option);
    myChart2.setOption(option);
    window.onresize =  ()=> {
        myChart1.resize();
        myChart2.resize();
      };
  })
})
// 查询方法
const query = () =>{
  console.log('查询')
}
let formInline =  reactive({
  name:'',
  voyage:''
})
const options = reactive([{
  label:"307KVLCC",
  value:"307KVLCC"
}])
// 表格数据
const tableData=reactive(
  [{
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  }]
)
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
.statistics{
  background: #131E3C;
  opacity: 0.8;
  border: 1px solid #00BBFF;
  box-shadow: inset 1px -1px 25px #00CCFF;
  border-radius: 8px;
  min-height: 400px;
  margin-top: 16px;
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
    color: #00CCFF;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
::v-deep .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 0px solid var(--el-table-border-color);
}
::v-deep .el-input {
  --el-input-text-color: #ffffff;
  --el-input-bg-color: ;
  --el-input-border-color: ;
  --el-border-base: var(--el-border-width-base) var(--el-border-style-base) #00CCFF;
}

::v-deep .el-table__body tr.current-row>td.el-table__cell {
    background: linear-gradient(180deg, rgba(2, 153, 210, 0.6) 0%, rgba(2, 153, 210, 0) 100%);
}

::v-deep tbody tr:hover>td,::v-deep tbody tr.hover-row>td{  
  background:linear-gradient(180deg, rgba(2, 153, 210, 0.6) 0%, rgba(2, 153, 210, 0) 100%); 
}
</style>
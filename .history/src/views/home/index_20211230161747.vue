<template>
  <div class="container" :style="{ height: screenHeight + 'px' }">
    <!-- 头部项目标题 -->
    <div class="home-title"><span>新型节能产品数据中心</span></div>
    <!-- 头部基础信息 -->
    <div class="home_info">
      <div class="user_info">
        <el-icon size="36" style="float: left;">
          <Avatar/>
        </el-icon>
        <span>
          张三-管理员-节能公司
        </span>
      </div>
      <div class="date_info">
        {{nowdate.data}}
      </div>
    </div>
    <div class="content">
    <el-container >
      <el-aside width="285px">
        <div class="content_aside">
          <el-button @click="routeJump">船舶汇总</el-button>
        </div>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    </div>
  </div>
</template>
<script lang="ts" setup>
import moment from 'moment';
import 'moment/locale/zh-cn';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
    
  
moment.locale('zh-cn')
let nowdate = reactive({
  data:''
})
let screenHeight = ref(0)

onMounted(()=>{
  setInterval(function() {
    let date = new Date()
    let day = moment(date).format('YYYY-MM-DD')
    let week = moment(date).weekday()
    let time = moment(date).format('HH:mm:ss')
     nowdate.data =day+'  '+getWeek(week)+'  '+time
    }, 1000);

    rerender()
    window.addEventListener('resize', rerender);
})
const rerender = () =>{
  screenHeight.value = window.innerHeight -16;
}
const getWeek=(week: Number)=>{
  switch (week) {
    case 1:
      return  '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 0:
      return  '周日'
  };
}
const  router = useRouter();
// 路由跳转
const  routeJump = () =>{
  router.push("/home/shipSummary");
}
</script>
<style lang="scss" scoped>
.container {
  background: url("./src/assets/home.png");
  background-size: 100% 100%;
}
.home-title {
  font-size:28px;
  height:60px;
  text-align: center;
  letter-spacing: 0.25em;
  font-style: normal;
  font-weight: bold;
  color: transparent;
  background: linear-gradient(to top, #50B5FF, #FFFFFF);
  -webkit-background-clip: text;
  font-family: Microsoft YaHei;
  margin:  0px;
  padding: 10px;
}

.home_info{
  height:40px;
  padding: 0px 60px;

  .user_info{
    height:100%;
    width:200px;
    color:#FFFFFF;
    float:left
  }

  .date_info{
    height:100%;
    width:300px;
    color:#FFFFFF;
    float:right
  }
}

.content{
  height:calc(100% - 120px);
  padding: 0px 60px;
}

::v-deep .el-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    height: calc(100% - 60px);
}

.content_aside{
  background:url('./src/assets/Vector.png') no-repeat;
  background-size: 100% 100%;
  height: 100%
}

::v-deep .el-main {
    --el-main-padding: 0px 20px;
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: auto;
    box-sizing: border-box;
    padding: var(--el-main-padding);
}
</style>





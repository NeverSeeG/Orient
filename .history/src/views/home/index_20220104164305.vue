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
          <el-menu
            default-active="2"
            router
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="(menu,index) in menuList" :key="index">
          <el-sub-menu :index="menu.route" v-if="menu.children">
            <template #title>
              <el-icon><location /></el-icon>
              <span>{{menu.name}}</span>
            </template>
            <el-menu-item v-for="(menuChildren,menuChildrenIndex) in menu.children" :index="menuChildren.route" 
            :key="menuChildrenIndex">{{menuChildren.name}}</el-menu-item>
          </el-sub-menu>
          <el-menu-item :index="menu.route" v-else>
            <el-icon><icon-menu /></el-icon>
            <span>{{menu.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
          <!-- <el-button @click="routeJump('/home/shipSummary')">船舶汇总</el-button>
          <el-button @click="routeJump('/home/admin')">船舶管理</el-button>
          <el-button @click="routeJump('/home/companyAdmin')">单位管理</el-button>
          <el-button @click="routeJump('/home/roleAdmin')">角色管理</el-button>
          <el-button @click="routeJump('/home/userAdmin')">用户管理</el-button> -->
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
import { Location, Menu as IconMenu } from '@element-plus/icons-vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
  
moment.locale('zh-cn')
let nowdate = reactive({
  data:''
})
let screenHeight = ref(0)

let menuList =  reactive([
  {
    index: 0,
    route: '/home/shipSummary',
    name:'船舶汇总',
  }, {
    index: 1,
    name:'状态监测',
  }, {
    index: 2,
    name:'能效分析',
  }, {
    index: 3,
    name:'数据查询',
  }, {
    index: 4,
    name:'系统管理',
    children: [{
      index: "4-1",
      name:'单位管理',
      route: '/home/companyAdmin',
    },{
      index: "4-2",
      name:'用户管理',
      route: '/home/userAdmin',
    },{
      index: "4-3",
      name:'船舶管理',
      route: '/home/admin',
    },{
      index: "4-4",
      name:'角色管理',
      route: '/home/roleAdmin',
    },]
  }
])

onMounted(()=>{
  // 时分秒动态显示
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
// 浏览器高度改变重新渲染
const rerender = () =>{
  screenHeight.value = window.innerHeight -16;
}
// 获取周几
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
// 路由跳转
const  router = useRouter();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const  routeJump = (parmas:String) =>{
  router.push(parmas);
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


::v-deep .el-menu {
  --el-menu-bg-color:'';
  --el-menu-hover-bg-color:#2971EC;
  --el-menu-hover-text-color:#FFFFFF;
  --el-menu-text-color:#FFFFFF;
}
</style>





<template>
  <div class="container" :style="{ height: scrollerHeight + 'px' }">
  <el-row>
    <el-col :span="24">
      <!-- 头部项目标题 -->
      <div class="home-title"><span>新型节能产品数据中心</span></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
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
    </el-col>
  </el-row>
  </div>
</template>
<script lang="ts" setup>
import moment from 'moment';
import 'moment/locale/zh-cn';
import { computed, onMounted, reactive } from 'vue';
moment.locale('zh-cn')
let nowdate = reactive({
  data:''
})
onMounted(()=>{
  setInterval(function() {
    let date = new Date()
    let day = moment(date).format('YYYY-MM-DD')
    let week = moment(date).weekday()

    let time = moment(date).format('HH:mm:ss')
     nowdate.data =day+'  '+getWeek(week)+'  '+time
    }, 1000);
})

function getWeek(week: Number){
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
const scrollerHeight = computed(()=>{
  return window.innerHeight - 20;
})
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
</style>





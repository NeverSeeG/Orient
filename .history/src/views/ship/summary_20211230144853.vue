<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
 -->
 <template>
  <div class="main">
    <div class="carousel_div">
      <el-carousel height="150px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    </div>
  </div>
 </template>

 <style scoped lang="scss">
   .main{
     height: 100%;
     width: 100%;
     color:#FFFFFF
   }
   .carousel_div{
     height: 70%;
     width: 100%;
   }
 </style>
<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
 -->
 <template>
  <div class="main">
    <div class="carousel_div">
      <el-carousel>
        <el-carousel-item v-for="(item,index) in imgList" :key="index">
          <img :src="item.url" style="height:100%;width:100%">
        </el-carousel-item>
    </el-carousel>
    </div>
  </div>
</template>
<script lang="ts" setup>
import loginBackground from "@/assets/loginBackground.png";
import loginbox from "@/assets/loginbox.png";
import login_icon from "@/assets/login_icon.png";
import Vector from "@/assets/Vector.png";
import { reactive } from 'vue';
let imgList = reactive([{
  url:Vector
},{
  url:loginbox
},{
  url:loginBackground
},{
  url:login_icon
}])

</script>
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

::v-deep .el-carousel--horizontal {
  overflow-x: hidden;
  height: 100%;
  min-height: 300px;
}

::v-deep .el-carousel__container {
    position: relative;
    height: 100%;
    min-height: 300px;
}


</style>
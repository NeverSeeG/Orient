<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
 -->
 <template>
  <div class="main">
    <div class="carousel_div">
      <el-carousel @change="carouselChange">
        <el-carousel-item v-for="(item,index) in imgList" :key="index">
          <img :src="item.url" style="height:100%;width:100%">
        </el-carousel-item>
    </el-carousel>
    </div>
    <div class="introduction">
        {{content}}
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style scoped lang="scss">
  

</style>
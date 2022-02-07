<!--
 * @description: 船舶汇总
 * @author: 王磊
 * @date: 2021/1/7
-->
<template>
  <div class="main">
    <div class="carousel_div">
      <el-carousel @change="carouselChange">
        <el-carousel-item v-for="(item, index) in fileList" :key="index">
          <img
            :src="'/api/gasExport/getMainPicForFileId/' + item.FILEID + '.rdm'"
            style="height: 100%; width: 100%"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="introduction">
      {{ content }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { api } from "@/axios/api";
import { onMounted, ref } from "vue";
onMounted(() => {
  getImgAndDesc();
});
let content = ref("");
const carouselChange = (index: number) => {
  console.log(
    "fileList.value[index].FILEDESCRIPTION",
    fileList.value[index].FILEDESCRIPTION
  );
  content.value = fileList.value[index].FILEDESCRIPTION || "";
};
let fileList = ref([]);
const getImgAndDesc = () => {
  const results = api.homeAdmin.findDefMainPic().then((data: any) => {
    if (data && data instanceof Array) {
      fileList.value = data;
      content.value = data[0].FILEDESCRIPTION;
    }
  });
};
</script>
<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  color: #ffffff;
}
.carousel_div {
  height: 65%;
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
.introduction {
  height: calc(35% - 50px);
  margin-top: 8px;
  border: 1px solid #00bbff;
  box-shadow: inset 1px -1px 25px #00ccff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
}
</style>

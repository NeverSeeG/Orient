<template>
<el-config-provider :locale="locale"> 
  <router-view />
  </el-config-provider>
</template>
<script lang="ts" >
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default {
  name: "Layout",//这里根据你自己的修改
  components: {
    [ElConfigProvider.name]:ElConfigProvider,//添加组件
  },
  data(){
    return{
      locale:zhCn,//给locale赋值
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', SimSun, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

</style>

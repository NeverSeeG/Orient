<template>
<el-config-provider :locale="locale"> 
  <router-view />
  </el-config-provider>
</template>
<script lang="ts" setup >
import { ElConfigProvider } from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';
</script>
<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', SimSun, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  padding:0px;
}

body {
    display: block;
    margin: 0px;
    padding: 0px;
}

</style>

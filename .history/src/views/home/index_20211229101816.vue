<template>
  <div class="login-container">
    <el-button @click="handleSubmit">测试</el-button>
  </div>
</template>
<script lang="ts" setup>
import {api} from "../../axios/api";
import router from "../../router";

const handleSubmit = async () => {
  api.common.genres().then(data => {
    console.log('data', data)
  })
}

</script>



<template>
  <div >
    
  </div>
</template>
<script lang="ts" setup>
import { api } from "../../axios/api";

const handleSubmit = async () => {
  api.common.genres().then(data => {
    console.log('data', data)
  })
}
</script>
<style lang="sass" scoped>

</style>



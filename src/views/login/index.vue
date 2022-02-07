<template>
  <div :style="{ height: scrollerHeight + 'px' }">
    <div class="login-container">
      <div class="login-div">
        <el-form
          class="login-form"
          :rules="rules"
          ref="form"
          :model="user"
          size="medium"
          @submit.prevent="handleSubmit"
        >
          <div class="login-form__header">
            <img :src="login_icon" style="position: absolute; top: 60px" />
            <h3 class="login-title">新型节能产品数据中心</h3>
          </div>
          <el-form-item prop="account">
            <el-input
              v-model="user.userName"
              placeholder="请输入用户名"
              prefix-icon="Avatar"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
              style="width: 100%"
              v-model="user.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="submit-button"
              type="primary"
              :loading="loading"
              native-type="submit"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import login_icon from "@/assets/login_icon.png";
import { api } from "@/axios/api";
import router from "@/router";
import { ElMessage } from "element-plus";
import { computed, reactive, ref } from "vue";

const user = reactive({
  userName: "guest1",
  password: "123",
});
const scrollerHeight = computed(() => {
  // 自定义高度需求
  return window.innerHeight;
});
const loading = ref(false);
const rules = ref({
  userName: [{ required: true, message: "请输入账号", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "change" }],
});
const handleSubmit = async () => {
  loading.value = true;
  api.common
    .login(user)
    .then((data: any) => {
      loading.value = false;
      if (data.success) {
        api.common.getUserInfo({ userName: user.userName }).then((data) => {
          router.push("/home");
          localStorage.setItem("user", JSON.stringify(data));
        });
      } else {
        ElMessage.error(data.msg);
      }
    })
    .catch((error) => {
      loading.value = false;
      ElMessage.error(error);
    });
  // 查询用户信息
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: url("@/assets/loginBackground.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-div {
    min-width: 600px;
    height: 500px;
    position: absolute;
    background: url("@/assets/loginbox.png") no-repeat;
    background-size: 100% 100%;
  }
}

.login-form {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: flex-end;
  flex-direction: column;

  .login-form__header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;

    .login-title {
      margin-top: 24px;
      font-size: 38px;
      text-align: center;
      letter-spacing: 0.25em;
      font-style: normal;
      font-weight: bold;
      color: transparent;
      background: linear-gradient(to top, #50b5ff, #ffffff);
      -webkit-background-clip: text;
      font-family: Microsoft YaHei;
    }
  }

  .el-form-item:last-child {
    margin-bottom: 0;
  }

  .login__form-title {
    display: flex;
    justify-content: center;
    color: #fff;
  }

  .submit-button {
    width: 100%;
  }

  .login-logo {
    width: 271px;
    height: 74px;
  }
}

::v-deep .el-input__inner {
  background-color: #0c365c;
}

::v-deep .el-form-item {
  display: flex;
  margin-bottom: 22px;
  width: 300px;
}
</style>

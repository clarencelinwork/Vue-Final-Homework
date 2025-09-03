<script setup>
import { useRouter ,RouterLink } from 'vue-router'
import SideComponent from '@/components/Side.vue'
import EmailInput from '@/components/EmailInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import NicknameInput from '@/components/NicknameInput.vue'
import { ref } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()

const email = ref('')
const nickname = ref('')
const password = ref('')
const repeatPassword = ref('')
const errorMessage = ref('')
const UID = ref('')

function submitForm() {
  const site = 'https://todolist-api.hexschool.io'

  const requestUrl = `${site}/users/sign_up`
  axios
    .post(requestUrl, {
      email: email.value,
      password: password.value,
      nickname: nickname.value,
    })
    .then((response) => {
      Cookies.set('UID', response.data.uid, { expires: 7 })
      errorMessage.value = "註冊成功"
      email.value = ""
      nickname.value = ""
      password.value = ""
      repeatPassword.value = ""
      setTimeout(() => {
        router.push({ name: 'sign-in' });
      }, 1500);
    })
    .catch((error) => {
      console.log(error)
      if (Array.isArray(error.response.data.message)) {
        // 如果是陣列，取得第一個元素
        errorMessage.value = error.response.data.message[0]
      } else {
        // 如果不是陣列（例如是字串），就直接使用
        errorMessage.value = error.response.data.message
      }
    })
}

function getEmailInput(value) {
  email.value = value
}

function getNicknameInput(value) {
  nickname.value = value
}

function getPasswordInput(value) {
  password.value = value
}

function getRepeatPasswordInput(value) {
  repeatPassword.value = value
}
</script>

<template>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <SideComponent />
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">註冊帳號</h2>
          <EmailInput @update:value="getEmailInput" />
          <NicknameInput @update:value="getNicknameInput" />
          <PasswordInput
            input-name="password"
            input-id="password"
            label-name="密碼"
            placeholder="請輸入密碼"
            @update:value="getPasswordInput"
          />
          <PasswordInput
            input-name="repeatPassword"
            input-id="repeatPassword"
            label-name="再次輸入密碼"
            placeholder="請再次輸入密碼"
            @update:value="getRepeatPasswordInput"
          />
          <div id="errorMessage">{{ errorMessage }}</div>
          <input
            class="formControls_btnSubmit"
            type="button"
            v-on:click="submitForm"
            value="註冊帳號"
          />
          <RouterLink class="formControls_btnLink" to="/">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
#errorMessage {
  color: red;
}
</style>

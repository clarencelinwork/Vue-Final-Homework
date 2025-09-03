<script setup>
import { useRouter,RouterLink } from 'vue-router'
import SideComponent from '@/components/Side.vue'
import EmailInput from '@/components/EmailInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

import { ref,onMounted  } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLogin = ref(false)

const site = 'https://todolist-api.hexschool.io'

function submitForm() {

  const requestUrl = `${site}/users/sign_in`
  axios
    .post(requestUrl, {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      Cookies.set('token', response.data.token, { expires: 7 })
      Cookies.set('tokenExpired', response.data.exp, { expires: 7 })
      router.push({ name: 'todo-list' });
    })
    .catch((error) => {
      if (Array.isArray(error.response.data.message)) {
        // 如果是陣列，取得第一個元素
        errorMessage.value = error.response.data.message[0]
      } else {
        // 如果不是陣列（例如是字串），就直接使用
        errorMessage.value = error.response.data.message
      }
    })
}

function signOutButton(){
  const token = Cookies.get('token')
  const requestUrl = `${site}/users/sign_out`
  axios
    .post(requestUrl, 
    {},
      {
        headers: {
          Authorization: token,
        },
      }
      )
    .then((response) => {
      Cookies.remove('token')
      Cookies.remove('tokenExpired')
      errorMessage.value = "登出成功"
      isLogin.value = false
    })
    .catch((error) => {
      if (Array.isArray(error.response.data.message)) {
        // 如果是陣列，取得第一個元素
        errorMessage.value = error.response.data.message[0]
      } else {
        // 如果不是陣列（例如是字串），就直接使用
        errorMessage.value = error.response.data.message
      }
    })
}

onMounted(() => {
  checkLogin()
});

function checkLogin(){
  const token = Cookies.get('token')
  if (token !== undefined){
      const requestUrl = `${site}/users/checkout`

      axios
        .get(requestUrl, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          isLogin.value = true
          errorMessage.value = "登入中"
        })
        .catch((error) => {
          isLogin.value = false
          if (Array.isArray(error.response.data.message)) {
            // 如果是陣列，取得第一個元素
            errorMessage.value = error.response.data.message[0]
          } else {
            // 如果不是陣列（例如是字串），就直接使用
            errorMessage.value = error.response.data.message
          }
          Cookies.remove('UID')
          Cookies.remove('token')
          Cookies.remove('tokenExpired')
        })
  }
}

function getEmailInput(value) {
  email.value = value
}

function getPasswordInput(value) {
  password.value = value
}

</script>

<template>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
      <SideComponent />
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <EmailInput @update:value="getEmailInput" />
          <PasswordInput input-name="password" input-id="password" label-name="密碼" placeholder="請輸入密碼" @update:value="getPasswordInput"/>
          <div id="errorMessage">{{ errorMessage }}</div>
          <button class="formControls_btnSubmit" type="button" v-on:click="signOutButton" v-if="isLogin">登出</button>
          <button class="formControls_btnSubmit" type="button" v-on:click="submitForm" v-else>登入</button>
          <RouterLink class="formControls_btnLink" to="/sign-up">註冊帳號</RouterLink>
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

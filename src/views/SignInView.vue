<script setup>
import {useRouter, RouterLink} from 'vue-router'
import SideComponent from '@/components/Side.vue'
import EmailInput from '@/components/EmailInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

import {ref, onMounted, inject} from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLogin = ref(false)

const site = 'https://todolist-api.hexschool.io'
// inject sweetalert2
const swal = inject('$swal');

function submitForm() {

  const requestUrl = `${site}/users/sign_in`
  axios
    .post(requestUrl, {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      Cookies.set('token', response.data.token, {expires: 7})
      Cookies.set('tokenExpired', response.data.exp, {expires: 7})
      swal.fire({
        icon: 'success',
        title: "登入成功",
      }).then(() => {
        router.push({name: 'todo-list'});
      });
    })
    .catch((error) => {
      let responseMessage;
      if (Array.isArray(error.response.data.message)) {
        // 如果是陣列，取得第一個元素
        responseMessage = error.response.data.message[0]
      } else {
        // 如果不是陣列（例如是字串），就直接使用
        responseMessage = error.response.data.message
      }
      swal.fire({
        icon: 'error',
        title: responseMessage,
      });
    })
}

onMounted(() => {
  checkLogin()
});

function checkLogin() {
  const token = Cookies.get('token')
  if (token !== undefined) {
    const requestUrl = `${site}/users/checkout`

    axios
      .get(requestUrl, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        isLogin.value = true;
        router.push({name: 'todo-list'});
      })
      .catch((error) => {
        isLogin.value = false
        let responseMessage
        if (Array.isArray(error.response.data.message)) {
          // 如果是陣列，取得第一個元素
          responseMessage = error.response.data.message[0]
        } else {
          // 如果不是陣列（例如是字串），就直接使用
          responseMessage = error.response.data.message
        }
        swal.fire({
          icon: 'error',
          title: responseMessage,
        });
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
      <SideComponent/>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <EmailInput @update:value="getEmailInput"/>
          <PasswordInput input-name="password" input-id="password" label-name="密碼"
                         placeholder="請輸入密碼" @update:value="getPasswordInput"/>
          <button class="formControls_btnSubmit" type="button" v-on:click="submitForm">登入
          </button>
          <RouterLink class="formControls_btnLink" to="/sign-up">註冊帳號</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

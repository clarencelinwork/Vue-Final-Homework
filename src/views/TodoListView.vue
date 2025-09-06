<script setup>
import {useRouter, RouterLink} from 'vue-router'
import {ref, onMounted, computed, inject} from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()

const nickname = ref('')

const currentType = ref('全部')
const newTodo = ref('')

const showTodoListData = ref([])

const todoListData = ref([])

const site = 'https://todolist-api.hexschool.io'

const todoListCount = ref(0)
const todoListFinishCount = ref(0)
const todoListUnFinishCount = ref(0)
// inject sweetalert2
const swal = inject('$swal');

onMounted(() => {
  checkLogin()
})

function updateCount() {
  todoListCount.value = todoListData.value.length
  todoListFinishCount.value = todoListData.value.filter((item) => item.status === true).length
  todoListUnFinishCount.value = todoListData.value.filter((item) => item.status === false).length
}

const finishedTodoList = computed(() => {
  return todoListData.value.filter((item) => item.status === true)
})

const unFinishedTodoList = computed(() => {
  return todoListData.value.filter((item) => item.status === false)
})

function changeType(type) {
  switch (type) {
    default:
    case '全部':
      currentType.value = '全部'
      showTodoListData.value = todoListData.value
      break
    case '待完成':
      currentType.value = '待完成'
      showTodoListData.value = unFinishedTodoList.value
      break
    case '已完成':
      currentType.value = '已完成'
      showTodoListData.value = finishedTodoList.value
      break
  }
  updateCount()
}

function addTodo() {
  const token = Cookies.get('token')
  const requestUrl = `${site}/todos`

  const tempNewTodo = newTodo.value.trim()
  if (tempNewTodo.length !== 0) {
    axios
      .post(requestUrl,
        {
          content: newTodo.value,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response.data.status === true) {
          const newTodoItem = response.data.newTodo
          // 使用 push() 方法將新項目加入陣列尾部
          todoListData.value.push(newTodoItem)
          showTodoListData.value = todoListData.value
          newTodo.value = ''
          updateCount()
          swal.fire({
            position: "top-end",
            title: "新增待辦事項成功",
            showConfirmButton: false,
            timer: 1000
          });
        }
      })
      .catch((error) => {
        swal.fire({
          position: "top-end",
          title: "新增待辦事項失敗",
          showConfirmButton: false,
          timer: 1000
        });
      })
  } else {
    swal.fire({
      icon: 'info',
      title: "請輸入待辦事項",
    });
  }
}

function removeItem(id) {
  const token = Cookies.get('token')
  const requestUrl = `${site}/todos/${id}`
  axios
    .delete(requestUrl,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        todoListData.value = todoListData.value.filter((item) => item.id !== id)
        showTodoListData.value = todoListData.value
        updateCount()
        swal.fire({
          position: "top-end",
          title: "移除待辦事項成功",
          showConfirmButton: false,
          timer: 1000
        });
      }
    })
    .catch(() => {
      swal.fire({
        position: "top-end",
        title: "移除待辦事項失敗",
        showConfirmButton: false,
        timer: 1000
      });
    })
}

function checkItem(id) {
  const token = Cookies.get('token')
  const requestUrl = `${site}/todos/${id}/toggle`
  axios
    .patch(requestUrl,
      {}
      , {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.data.status === true) {
        let todoListItem = todoListData.value.find(item => item.id === id);
        todoListItem.status = !todoListItem.status
        updateCount()
      }
    })
    .catch(() => {
      swal.fire({
        position: "top-end",
        title: "取得待辦事項失敗",
        showConfirmButton: false,
        timer: 1000
      });
    })
}

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
      .then((response) => {
        if (response.data.status === false) {
          Cookies.remove('UID')
          Cookies.remove('token')
          Cookies.remove('tokenExpired')
          router.push({name: 'sign-in'});
        } else {
          nickname.value = response.data.nickname
          getTodos();
        }
      })
      .catch((error) => {
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
        }).then(() => {
          router.push({name: 'sign-in'});
        });
        Cookies.remove('UID')
        Cookies.remove('token')
        Cookies.remove('tokenExpired')
      })
  } else {
    router.push({name: 'sign-in'});
  }
}

function getTodos() {
  const requestUrl = `${site}/todos`
  const token = Cookies.get('token')

  axios
    .get(requestUrl, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      todoListData.value = response.data.data
      showTodoListData.value = todoListData.value
      updateCount()
    })
}

function signOutButton() {
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
    .then(() => {
      Cookies.remove('token')
      Cookies.remove('tokenExpired')
      router.push({name: 'sign-in'});
    })
    .catch((error) => {
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
      }).then(() => {
        router.push({name: 'sign-in'});
      });
    })
}
</script>

<template>
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="#"><span>{{ nickname }}的代辦</span></a>
        </li>
        <li><a href="#" @click="signOutButton">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo"/>
          <a href="#" @click="addTodo()">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list">
          <ul class="todoList_tab">
            <li>
              <a href="#" :class="{ active: currentType === '全部' }" @click="changeType('全部')"
              >全部</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ active: currentType === '待完成' }"
                @click="changeType('待完成')"
              >待完成</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ active: currentType === '已完成' }"
                @click="changeType('已完成')"
              >已完成</a
              >
            </li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item" v-for="todoList in showTodoListData" :key="todoList.id">
              <li>
                <label class="todoList_label">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="todoList.value"
                    :checked="todoList.status"
                    @click="checkItem(todoList.id)"
                  />
                  <span>{{ todoList.content }}</span>
                </label>
                <a href="#" @click="removeItem(todoList.id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p v-if="currentType === '已完成'">{{ todoListFinishCount }} 個已完成項目</p>
              <p v-else>{{ todoListUnFinishCount }} 個待完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

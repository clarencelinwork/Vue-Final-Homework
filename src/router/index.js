import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sign-in',
      component: SignInView,
    },
  ],
})

export default router

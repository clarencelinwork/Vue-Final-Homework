import './assets/main.css'
import './assets/fontawesome-free-6.7.2/css/all.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

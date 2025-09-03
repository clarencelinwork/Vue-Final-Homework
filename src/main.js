import './assets/main.css'
import './assets/fontawesome-free-6.7.2/css/all.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App)

app.use(router)
app.use(VueSweetalert2);

app.mount('#app')

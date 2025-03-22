import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  maxToasts: 3,
  // Increase the z-index to be above modals
  containerClassName: "super-high-z-index",
  toastClassName: "toast-class"
}

createApp(App)
  .use(Toast, toastOptions)
  .use(router)
  .mount('#app')


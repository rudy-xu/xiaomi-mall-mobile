import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import NProgress from '@/router/listen-router'

import store from './store'
// import VueLazyload from 'vue-lazyload'  // Vue3.x is not supported
// import mitt from 'mitt'
// import fetch from './api/fetch'
import './assets/css/reset.css'
import '@/assets/css/layout.css'
import './assets/fonts/iconfont.css'
import 'normalize.css'
import mixins from './mixin.js'
// import MiDialog from '@/components/dialog'

const app = createApp(App)

// app.use(MiDialog /** , options use as second parameter */)

/**
 * Vue3.x dosen't export 'vue' to developer
 * So can not use this 'Vue.prototype.$fetch = fetch'
 *
 * Solution:
 *        app.config.globalProperties.$fetch = fetch
 */
// app.config.globalProperties.$fetch = fetch
// app.config.globalProperties.$bus = mitt()
app.config.globalProperties.$NProgress = NProgress
app.mixin(mixins)

app.use(store).use(router).mount('#app')

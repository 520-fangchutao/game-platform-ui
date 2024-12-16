import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from './plugins/elementplusui.js'
import axios from 'axios';
import * as common from './utils/common'
import '@/styles/index.less'

// 配置全局URL
//axios.defaults.baseURL = 'http://192.168.2.75:8083';
axios.defaults.baseURL = 'http://localhost:8083';
// 创建VUE应用
const app = createApp(App)
// 挂载axios到全局
app.config.globalProperties.$http = axios
app.config.globalProperties.$commUtil = common
// 挂载到vue
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')

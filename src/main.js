import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import ElementPlus from 'element-plus'
import ElementPlus from './plugins/elementplusui.js'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios';
import VueClipboard from 'vue-clipboard2'
import moment from 'moment';
import * as common from './utils/common'
import '@/styles/index.less'

// 配置全局URL
axios.defaults.baseURL = 'http://192.168.2.75:8083';
//axios.defaults.baseURL = 'http://localhost:8083';
// 创建VUE应用
const app = createApp(App)
// 挂载axios到全局
app.config.globalProperties.$http = axios
app.config.globalProperties.$commUtil = common
app.config.globalProperties.$moment = moment
// 注册组件icon
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }
// 挂载到vue
app.use(ElementPlus, {locale: zhCn})
app.use(router)
app.use(store)
app.use(VueClipboard)
app.mount('#app')

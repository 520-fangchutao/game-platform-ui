import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios';
import 'element-plus/dist/index.css'

// 配置全局URL
axios.defaults.baseURL = 'http://192.168.2.75:8083'; // 设置全局baseURL
// 创建VUE应用
const app = createApp(App)
// 挂载axios到全局
app.config.globalProperties.$http = axios
// 注册组件icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 挂载到vue
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')

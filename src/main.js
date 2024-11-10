import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios';
import 'element-plus/dist/index.css'

const app = createApp(App)

// 注册组件icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 挂载到vue
app.use(ElementPlus)
app.use(router)
app.use(store)
app.config.globalProperties.$http = axios
app.mount('#app')

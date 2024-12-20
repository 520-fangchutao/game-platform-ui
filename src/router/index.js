import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('@/views/welcome.vue')
  },
  {
    path: '/resource/996',
    name: '996',
    component: () => import('@/views/resource/996.vue')
  },
  {
    path: '/report/dailyData',
    name: 'dailyData',
    component: () => import('@/views/report/dailyData.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router

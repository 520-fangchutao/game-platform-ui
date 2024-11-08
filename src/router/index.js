import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/resource/996',
    name: '996',
    component: () => import('@/views/resource/996.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

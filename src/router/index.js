import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/resource/996',
    name: '996',
    component: () => import('@/views/resource/996.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

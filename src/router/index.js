// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/novo',
        name: 'NewProcess',
        component: () => import('@/views/New.vue'),
      },
      {
        path: '/tutorial',
        name: 'Tutorial',
        component: () => import('@/views/Tutorial.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

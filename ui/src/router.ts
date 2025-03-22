import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from './views/HomeView.vue'
import NestedView from './views/NestedView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/services/:serviceTitle',
    name: 'nested',
    component: NestedView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


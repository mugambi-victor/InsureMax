// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Products from '../views/Products.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/products', name: 'Products', component: Products },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

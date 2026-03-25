import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/MainPages/LoginPage.vue'
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
path:'/LandingPage',
name :'landingpage',
component:()=>import('@/views/MainPages/LandingPage.vue'),
children:[
  {
    path:'/chats',
    name:'chats',
    component:()=>import('@/views/ChildPages/ChatsPage.vue')
  },
]
  },
   {
  path:'/:pathMatch(.*)*',
  name:'fallback',
  component:()=>import('@/views/MainPages/LandingPage.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

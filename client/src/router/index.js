import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import { usePlayerStore } from '@/stores/player'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView
    },
    {
      path: '/room',
      name: 'room',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RoomView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const player = usePlayerStore()
  if (to.name === 'room' && !player.id) {
    next({ name: 'main' })
  } else {
    next()
  }
})

export default router

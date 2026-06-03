/**
 * Core Router — Vue Router v5 configuration
 * 3-step pipeline: Gateway → Studio → Gallery
 */
import { createRouter, createWebHistory } from 'vue-router'

/* ── Eager-loaded (lightweight, no images) ── */
import AboutView from '@/features/about/views/AboutView.vue'

/* ── Lazy-loaded feature views ── */
const GatewayView = () => import('@/features/api-auth/views/GatewayView.vue')
const StudioView = () => import('@/features/studio-generation/views/StudioView.vue')
const GalleryView = () => import('@/features/gallery-export/views/GalleryView.vue')

const routes = [
  {
    path: '/',
    name: 'gateway',
    component: GatewayView,
    meta: { step: 1, title: 'API Gateway' },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { step: 0, title: 'About Us', layout: 'blank' },
  },
  {
    path: '/studio',
    name: 'studio',
    component: StudioView,
    meta: { step: 2, title: 'Generation Studio' },
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: GalleryView,
    meta: { step: 3, title: 'Export Gallery' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/* ── Update document title on navigation ── */
router.afterEach((to) => {
  document.title = `${to.meta.title || 'AutoShot-AI'} | AutoShot-AI`
})

export default router

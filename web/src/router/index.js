import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '@/views/Home.vue'
import MiLogin from '@/views/MiLogin.vue'
import MiHome from '@/views/MiHome.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: MiHome,
    meta: {
      index: 0
    }
  },
  {
    path: '/login',
    name: 'login',
    component: MiLogin
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('@/views/About.vue')
  // },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "category" */ '@/views/MiCategory.vue'),
    meta: {
      index: 1
    }
  },
  {
    path: '/commodity/list/:id',
    name: 'list',
    component: () => import(/* webpackChunkName: "list" */ '@/views/MiList.vue')
  },
  {
    path: '/commodity/detail/:id',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */ '@/views/MiDetail/MiDetail.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '@/views/MiCart/MiCart.vue'),
    meta: {
      index: 2
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/MiUser/MiUser.vue'),
    meta: {
      index: 3
    }
  },
  {
    path: '/user/set',
    name: 'set',
    component: () => import(/* webpackChunkName: "setting" */ '@/views/MiUser/MiSetting.vue'),
    meta: {
      // set router authentication
      requiresAuth: true
    }
  },
  {
    path: '/address/list',
    name: 'addressList',
    component: () => import(/* webpackChunkName: "addressList" */ '@/views/MiAddress/MiAddressList.vue'),
    meta: {
      // set router authentication
      requiresAuth: true
    }
  },
  {
    path: '/address/edit',
    name: 'addressEdit',
    component: () => import(/* webpackChunkName: "addressEdit" */ '@/views/MiAddress/MiAddressEdit.vue'),
    meta: {
      // set router authentication
      requiresAuth: true
    }
  },
  {
    path: '/order/checkout',
    name: 'orderCheckout',
    component: () => import(/* webpackChunkName: "orderCheckout" */ '@/views/MiOrder/MiOrderCheckout.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/order/list',
    name: 'orderList',
    component: () => import(/* webpackChunkName: "orderList" */ '@/views/MiOrder/MiOrderList.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/order/view/:id',
    name: 'orderView',
    component: () => import(/* webpackChunkName: "orderView" */ '@/views/MiOrder/MiOrderView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router

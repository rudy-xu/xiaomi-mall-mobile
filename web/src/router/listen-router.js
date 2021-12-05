import router from '.'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  // trigger the related mutation to change state status
  store.commit('setViewLoading', true)
  NProgress.start()

  // intercept route
  // judge route authentication
  if(to.meta.requiresAuth && !store.getters.isLogin) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default NProgress

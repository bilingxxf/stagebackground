import router from '@/router'
import store from '../store'

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.meta.requiresAuth) {
    if (sessionStorage.getItem("token") && to.meta.indentity.indexOf(sessionStorage.getItem("indentity"))>-1) {
      next()
    }else if(to.name!="login" && sessionStorage.getItem('token')==null){
      next('/login')
    }else{
     next({
       path: '/login',
       query: { redirect: to.fullPath }
     })
    }
  } else {
    next()
  }
})

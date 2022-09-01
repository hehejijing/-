// 权限拦截处理逻辑需要放在路由的前置守卫里处理
// 首先判断有无token
// token 存在 说明 处于登录状态
// 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
// token 不存在 说明 不处于登录状态
// 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页

import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

router.beforeEach(async(to, from, next) => {
  // 全局路由前置守卫
  if (store.getters.token) {
    // 如果有token 则视为已登录
    if (!store.getters.userId) {
      const { roles: { menus }} = await store.dispatch('user/getUserInfo')
      // console.log(res)
      store.dispatch('permission/filterRoutes', menus)
      next(to.path)
    }

    if (to.path === '/login') {
      // 判断去往的页面是否为登录页
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果找到了 表示在白名单 正常跳转
      next()
    } else {
      next('/login')
    }
  }
})

// 根据 当前 用户返回的菜单 匹配 当前用户菜单
// 当前用户菜单 ==》 静态路由 + 动态路由
import router, { asyncRoutes, constantRoutes } from '@/router'
const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, matchRoutes) {
    state.routes = [...constantRoutes, ...matchRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const routes = asyncRoutes.filter(ele => menus.includes(ele.meta.id))
    context.commit('setRoutes', routes)
    router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

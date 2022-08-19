import { login, getUserInfo } from '@/api/user'
import { setToken, removeToken, getToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 通过接口获取token
    // commit setToken
    async login({ commit }, data) {
      const res = await login(data)
      console.log(res)
      commit('setToken', res)
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      console.log(res)
      commit('setUserInfo', res)
    }
  }
}

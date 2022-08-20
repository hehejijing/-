import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'

const timeout = 10
function isCheckOut() {
  return (Date.now() - store.getters.hrsaasTime) / 1000 > timeout
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(config => {
  console.log(config)
  // config.headers 加一个验证的字段
  // Authorization = Bearer + 空格 + token
  if (store.getters.token) {
    if (isCheckOut()) {
      console.log(isCheckOut())
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('接口超时')
      return Promise.reject(new Error('接口超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  const { success, message, data } = response.data
  if (success) {
    Message.success(message)
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, (err) => {
  return Promise.reject(err)
})

export default service

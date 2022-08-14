import textindex from './textindex'
import textindex2 from './textindex2'
import aa from './filters'
const obj = { aa }
const component = [textindex, textindex2]
// export default {
//   install: (Vue) => {
//     Vue.component('textindex', textindex)
//     Vue.component('textindex2', textindex2)
//   }
// }

export default (Vue) => {
  component.forEach((ele) => {
    Vue.component(ele.name, ele)
  })
  // Vue.filter('aa', aa)
  Object.keys(obj).forEach((key) => {
    Vue.filter(key, obj[key])
  })
}

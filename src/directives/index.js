
export const imgerror = {
  inserted: function(dom, options) {
    // console.log('========')
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}

<template>
  <div>
    <el-dropdown @command="change">
      <div>
        <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zh" :disabled="$i18n.locale === 'zh'">我爱一条柴</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="$i18n.locale === 'en'">i love one gun</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Lang',
  data() {
    return {

    }
  },
  methods: {
    change(type) {
      console.log('tyle', type)
      Cookie.set('language', type)
      this.$message.success('牛啊')
      window.location.reload()
    }
  }
}
</script>

<style>

</style>

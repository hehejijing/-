<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <!-- 放置表单 -->
          <el-form ref="infoForm" label-width="120px" :model="userInfo" :rules="rules" style="margin-left: 120px; margin-top:30px">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="userInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password2">
              <el-input v-model="userInfo.password2" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <!-- 放置个人详情 -->
          <component :is="userComponent" ref="userInfoRef" />
          <!-- <user-info /> -->
        </el-tab-pane>
        <el-tab-pane label="岗位详情">
          <!-- 放置岗位详情 -->
          <JobInfo />
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  name: 'Detail',
  components: {
    userInfo,
    JobInfo
  },
  data() {
    return {
      userComponent: 'userInfo',
      userInfo: {
        //   专门存放基本信息
        username: '',
        password: '',
        password2: ''
      },

      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
      this.$refs.userInfoRef.userInfo = { ...this.userInfo }
      this.$refs.userInfoRef.setImageUrl(this.userInfo.staffPhoto)
    },
    async updateInfo() {
      try {
        await this.$refs.infoForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>

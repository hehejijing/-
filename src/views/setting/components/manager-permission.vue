<template>
  <el-dialog
    title="分配权限"
    :visible.sync="dialogManagerPermission"
    :before-close="handleClose"
  >
    <el-tree
      ref="permTree"
      :data="permData"
      :props="{label:'name'}"
      show-checkbox
      :default-expand-all="true"
      :default-checked-keys="permIds"
      node-key="id"
      :check-strictly="true"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="sureAdd">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  name: 'HrsaasManagerPermission',
  props: {
    dialogManagerPermission: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permData: [],
      permIds: [],
      id: '',
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogManagerPermission', false)
      this.permIds = []
    },
    async getPermissionList(id) {
      try {
        this.id = id
        const res = await getPermissionList()
        this.permData = transListToTreeData(res, '0')
        const { permIds } = await getRoleDetail(id)
        this.permIds = permIds
        // console.log(res1)
      } catch (e) {
        console.log(e)
      }
    },
    async sureAdd() {
      try {
        this.loading = true
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.id })
        this.$message.success('修改成功')
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

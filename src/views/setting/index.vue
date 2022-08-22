<template>
  <div>

    <div class="app-container"><el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="first">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible = true">新增角色</el-button>
        <el-table
          border
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
            width="320"
          >
            <template slot-scope="scope">
              <el-button type="success" size="small">分配权限</el-button>
              <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="公司信息" name="second">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
          show-icon
        />
        <el-form label-width="120px" style="margin-top:50px">
          <el-form-item label="公司名称">
            <el-input disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs></div>
    <el-pagination
      background
      layout="-> ,prev, pager, next ,total,sizes"
      :current-page.sync="page.page"
      :total="total"
      :page-size.sync="page.pagesize"
      :page-sizes="[5,10,20,30]"
      @current-change="changePage"
      @size-change="changeSize"
    />

    <roleDialog ref="roleDialog" :dialog-visible.sync="dialogVisible" />

    <!-- .sync 拆分成dialogVsible属性和update:dialogVisible事件
    <roleDialog :dialog-visible="dialogVisible" <template/@update:dialogVisible="接受子组件传递过来的值 改变dialogVisible的值" /> -->

  </div>
</template>

<script>
import { getRoleList, deleteRole } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
export default {
  name: 'Hrsaas1Index',
  components: {
    roleDialog
  },

  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      list: [],
      total: 0,
      loading: false,
      dialogVisible: false
    }
  },

  mounted() {
    this.getRoleList()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.list = rows
        this.total = total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    changePage(val) {
      this.getRoleList()
    },
    changeSize() {
      this.getRoleList()
    },
    edit(row) {
      this.dialogVisible = true
      this.$refs.roleDialog.roleForm = { ...row }
    },
    async del(id) {
      console.log(id)
      try {
        await this.$confirm('是否确认删除该角色?', '提示', { type: 'warning' })
        await deleteRole(id)
        // this.$message.success('角色删除成功')
        this.page.page = 1
        this.getRoleList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

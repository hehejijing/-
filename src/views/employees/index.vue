<template>
  <div class="app-container">
    <PageTools :show-before="true">
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              alt=""
              style="border-radius:50%; width:100px; height:100px; padding:10px"
              @click="showErcodeDialog(row.staffPhoto)"
            >
          </template>
        </el-table-column>

        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFn" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          v-if="total > 0"
          layout="total, prev,pager, next,sizes"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5,10,15,20]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployee :visible-dialog.sync="visibleDialog" @refresh="getEmployeeList" />
    <el-dialog title="头像二维码" :visible.sync="ercodeDialog" custom-class="canvaseq">
      <canvas id="canvas" />
    </el-dialog>
  </div>
</template>
<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    addEmployee
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0, // 总数
      visibleDialog: false,
      ercodeDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async showErcodeDialog(staffPhoto) {
      if (!staffPhoto) return this.$message.error('无头像')
      this.ercodeDialog = true
      await this.$nextTick()
      const dom = document.querySelector('#canvas')
      QrCode.toCanvas(dom, staffPhoto)
    },
    async getEmployeeList() {
      try {
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        if (total !== 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getEmployeeList()
        }
        console.log(rows)
      } catch (e) {
        console.log(e)
      }
    },
    formatterFn(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(ele => ele.id === cellValue * 1)
      return obj ? obj.value : '非正式'
    },
    add() {
      this.visibleDialog = true
    },
    async del(id) {
      try {
        await this.$confirm('确定删除吗', '提示', { type: 'warning' })
        await delEmployee(id)
        this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    },
    async exportData() {
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      console.log(rows)
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      const data = this.fromJson(headers, rows)
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:G1']
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: data, // 具体数据 必填 [['张三
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader,
          merges
        })
      })
      // console.log(arr)
    },
    fromJson(headers, rows) {
      // rows的结构 ->
      // rows: [{username: '234234', mobile: '1398888888', 'workNumber': 123123}, ....]
      // headers的结构 ['姓名', '手机号', '入职日期', ....] -> 配置项里面生效的数据结构
      // rows的预期结果 -> result数组的每一项要和和headers一一对应
      // result -> [['张三', '138888888', '2020-10-01', ...], ['张三', '138888888', '2020-10-01', ...]]
      const result = rows.map(item => {
        // item 为对象 ->
        // 替换成数组即可 ->
        // 数组的结构要和headers对应起来 ->
        return Object.keys(headers).map(key => {
          // key -> 中文的key
          // 预期 -> 返回当前项的值
          // 值在哪？-> item为真实的数据对象 -> 取到正确的值返回即可
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期 -> 已经定义过过滤器直接使用即可
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 需要引入EmployeeEnum常量进行处理
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '非正式'
          }
          // 返回值的思路
          // 1. 数据里面的key是中文还是英文？ -> 英文
          // 2. headers里面取到中文key对应的英文key
          // 3. 直接去数据对象里面取数据
          return item[headers[key]]
        })
      })
      return result
    }
  }
}
</script>
<style lang="scss">
.canvaseq .el-dialog__body {
  text-align: center;
}
</style>

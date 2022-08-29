<template>

  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      list-type="picture-card"
      action="#"
      :file-list="fileList"
      :on-change="onChange"
      :http-request="oRequest"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="limit"
      :class="`${fileList.length === limit ? 'hideCard' : ''}`"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      title="图片预览"
      :visible.sync="previewImgDialogVisible"
    >
      <img style="width: 100%" :src="previewImgUrl">
    </el-dialog>
  </div>

</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDqVv4vVosoTr0rRkmX2GL9gwve5F8l7By',
  SecretKey: 'Zrsc4GBpERP7YjdGchW4LL5YkfKkAKDq'
})
export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line
    beforeUploadCheck: Function
  },
  data() {
    return {
      loading: false,
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewImgDialogVisible: false, // 控制显示弹层
      previewImgUrl: '' // 图片地址
    }
  },
  methods: {
    // 文件状态发生变化
    onChange(file, fileList) {
      // file 当前上传的图片
      // fileList 图片列表
      console.log('上传图片', file, fileList)
      this.fileList = fileList
    },
    oRequest(data) {
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    // params.file
      this.loading = true
      cos.putObject({
        Bucket: 'hehejijing-renzi-1300308872', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // 这个就是上传的百分比
          // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        this.loading = false
        if (err || data.statusCode !== 200) {
          return this.$message.error('请重试')
        }
        this.$emit('onSuccess', {
          url: 'https://' + data.Location
        })
        console.log(err || data)
      })
    },
    onRemove(file, fileList) {
      // file 当前被删除的文件
      // 剩余的文件列表
      this.fileList = fileList
    },
    onPreview(file) {
      this.previewImgUrl = file.url
      this.previewImgDialogVisible = true
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/svg+xml']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG \SVG格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    }

  }
}
</script>
<style lang="scss" >
.hideCard {
  .el-upload--picture-card {

    display: none;
  }
}
</style>

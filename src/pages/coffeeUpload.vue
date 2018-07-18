<template>
  <div class="wrapper">
    <keep-alive>
    <div class="upload-edit" v-show="uploadEdit">
      <div class="upload-file" ref="uploadFile" :class="{'upload-file-ing':uploadFileIng, 'upload-file-hide':uploadFileHide}" data-title="点击上传">
        <div class="upload-image"></div>
        <canvas class="upload-canvas" ref="uploadCanvas" v-bind:width="wrapWidth" v-bind:height="wrapHeight"></canvas>
        <input type="file" accept="image/*" ref="feedbackImg" @change="uploadPreview" />
      </div>
      <div class="upload-radio" style="display:none;">
        <label class="checked" onclick="upload.chooseCup(this);" data-value="1">中杯</label>
        <label onclick="upload.chooseCup(this);" data-value="2">大杯</label>
      </div>
      <div class="upload-handle">
        <div class="btn" @click="drawingRepeat({userZoom:1.1})">放大</div>
        <div class="btn" @click="drawingRepeat({userZoom:0.9})">缩小</div>
        <div class="btn" @click="drawingRepeat({userRotate:15})">旋转</div><!-- 角度 -->
        <br>
        <div class="btn" @click="drawingRepeat({userY:-10})">上移</div>
        <div class="btn" @click="drawingRepeat({userY:10})">下移</div>
        <div class="btn" @click="drawingRepeat({userX:-10})">左移</div>
        <div class="btn" @click="drawingRepeat({userX:10})">右移</div>
      </div>
      <div class="upload-text">自由DIY~ 随心所想！</div>
      <div class="upload-submit">
        <a href="javascript:;" @click="uploadSubmit" v-html="uploadSubmitTxt" :class="uploadSubmitClass"></a>
      </div>
    </div>
    </keep-alive>
    <div class="upload-result" v-if="uploadResult">
      <div class="tit">请将以下号码告诉店员：</div>
      <div class="code">20180520123</div>
      <div class="upload-text">自由DIY~ 随心所想！</div>
      <div class="upload-submit">
        <a href="javascript:;" @click="uploadBack">确&emsp;定</a>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  name: 'coffeeUpload',
  data () {
    return {
      uploadEdit: true,
      uploadResult: false,
      uploadFileIng: false, /* 按钮显示上传中 */
      uploadFileHide: false, /* 隐藏上传按钮 */
      uploadSubmitTxt: '确&emsp;定',
      uploadSubmitClass: '',
      uploadOriginal: '', /* 原图base64 */
      uploadWait: false, /* 防止重复提交 */
      ratio: window.devicePixelRatio ? window.devicePixelRatio : 1, /* 获取设备像素密度，实现高清 */
      rem: 100, /* 根目录font-size默认100 */
      wrapWidth: 0, /* 图案容器宽度 */
      wrapHeight: 0, /* 图案容器高度 */
      inToDataURL: false, /* 重新生成图片中 */
      userZoom: 1, /* 用户放大缩小 */
      userRotate: 0, /* 用户旋转 */
      userY: 0, /* 用户上下移动 */
      userX: 0 /* 用户左右移动 */
    }
  },
  mounted () {
    this.uploadDrawing()
  },
  computed: {
    drawingRem: function () {
      let boundWidth = document.documentElement.getBoundingClientRect().width
      let rem = boundWidth / 7.2 > 100 ? 100 : (boundWidth / 7.2 < 50 ? 50 : boundWidth / 7.2)
      return rem
    }
  },
  methods: {
    uploadPreview (e) {
      let files = e.target.files
      let self = this
      if (files && files[0]) {
        var reader = new FileReader()
        this.uploadFileIng = true
        reader.onload = function (evt) {
          self.uploadFileIng = false
          self.uploadFileHide = true
          self.uploadOriginal = evt.target.result
          self.drawingRepeat()
          /* 重置用户操作 */
          self.userZoom = 1 /* 用户放大缩小 */
          self.userRotate = 0 /* 用户旋转 */
          self.userY = 0 /* 用户上下移动 */
          self.userX = 0 /* 用户左右移动 */
        }
        reader.readAsDataURL(files[0])
      }
      this.$refs.feedbackImg.value = '' /* 清空file */
    },
    uploadDrawing () {
      let wrap = this.$refs.uploadFile
      if (!wrap) return
      this.wrapWidth = this.drawingRatio(wrap.offsetWidth)
      this.wrapHeight = this.drawingRatio(wrap.offsetHeight)
      this.rem = this.drawingRem
    },
    uploadSubmit () {
      let self = this
      if (this.uploadWait) return
      let drawing = this.$refs.uploadCanvas
      let img = drawing.toDataURL('image/png')
      if (!this.uploadOriginal || !img) {
        alert('请上传图案')
        return
      }
      this.uploadWait = true
      this.uploadSubmitTxt = '提交中'
      this.uploadSubmitClass = 'disabled'
      /* 请求返回执行 start */
      setTimeout(() => { /* setTimeout是模拟请求时间，开发时请移除 */
        // console.log('图案:' + img)
        self.uploadWait = false
        self.uploadEdit = false
        self.uploadResult = true
        self.uploadSubmitTxt = '确&emsp;定'
        self.uploadSubmitClass = ''
        self.drawingClear() /* 清空图片 */
      }, 3000)
      /* 请求返回执行end */
    },
    uploadBack () {
      this.uploadEdit = true
      this.uploadResult = false
    },
    drawingRepeat (option) {
      let self = this
      let drawing = this.$refs.uploadCanvas
      if (this.inToDataURL || !drawing) return
      if (option && !this.uploadOriginal) {
        alert('请先上传图案')
        return
      }
      this.inToDataURL = true
      this.userZoom = (option && option.userZoom) ? this.userZoom * option.userZoom : this.userZoom
      this.userRotate = (option && option.userRotate) ? this.userRotate + option.userRotate : this.userRotate
      this.userY = (option && option.userY) ? this.userY + option.userY : this.userY
      this.userX = (option && option.userX) ? this.userX + option.userX : this.userX
      let ctx = drawing.getContext('2d')
      let bg = new Image()
      if (this.uploadOriginal) {
        bg.src = this.uploadOriginal
        bg.onload = function () {
          ctx.clearRect(0, 0, self.wrapWidth, self.wrapHeight) /* 清空 */
          let bgZoom = self.wrapWidth / Math.min(bg.width, bg.height) * self.userZoom /* 缩放比 */
          ctx.save() /* 保存状态 */
          ctx.translate(self.wrapWidth / 2 + self.userX, self.wrapHeight / 2 + self.userY)
          ctx.rotate(self.userRotate * Math.PI / 180)
          ctx.translate(-self.wrapWidth / 2, -self.wrapHeight / 2)
          ctx.drawImage(bg, (self.wrapWidth - bg.width * bgZoom) / 2, (self.wrapHeight - bg.height * bgZoom) / 2, bg.width * bgZoom, bg.height * bgZoom)
          ctx.restore() /* 恢复状态 */
          self.inToDataURL = false
        }
      } else {
        this.inToDataURL = false
      }
    },
    drawingClear () {
      let drawing = this.$refs.uploadCanvas
      let ctx = drawing.getContext('2d')
      ctx.clearRect(0, 0, drawing.width, drawing.height)
      this.uploadOriginal = ''
      this.uploadFileHide = false
    },
    drawingRatio (val) {
      return val * this.ratio
    }
  }
}
</script>

<style scoped src="../assets/css/upload.css"></style>

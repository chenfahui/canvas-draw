<template>
  <div class="hello">
    <div class="tit">{{ msg }}</div>
    <div class="btn">
      <button type="" v-on:click="clear">清除</button>
      <button v-on:click="save">保存</button>
    </div>
    <canvas id="canvas">Canvas画板</canvas>
    <img v-bind:src="url" v-if="url != ''" class="img" />
    <div class="tit" v-if="url != ''">长按保存图片</div>
    <div class="btn" v-if="url != ''">
      <button type="" v-on:click="url = ''">返回</button>
    </div>
  </div>
</template>

<script>
var draw
var preHandler = function (e) { e.preventDefault() }
class Draw {
  constructor (el) {
    this.el = el
    this.canvas = document.getElementById(this.el)
    this.canvasRatio = window.devicePixelRatio
    this.canvasWidth = document.documentElement.getBoundingClientRect().width * this.canvasRatio
    this.canvasHeight = document.documentElement.getBoundingClientRect().height * this.canvasRatio
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    this.cxt = this.canvas.getContext('2d')
    this.stage_info = this.canvas.getBoundingClientRect()
    this.path = {
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0
    }
  }
  init (btn) {
    var that = this
    this.canvas.addEventListener('touchstart', function (event) {
      document.addEventListener('touchstart', preHandler, {passive: false})
      that.drawBegin(event)
    })
    this.canvas.addEventListener('touchend', function (event) {
      document.addEventListener('touchend', preHandler, {passive: false})
      that.drawEnd()
    })
    this.clear(btn)
  }
  drawBegin (e) {
    var that = this
    this.path.beginX = (e.targetTouches[0].pageX - this.stage_info.left) * this.canvasRatio
    this.path.beginY = (e.targetTouches[0].pageY - this.stage_info.top) * this.canvasRatio
    this.cxt.strokeStyle = '#000'
    this.cxt.beginPath()
    this.cxt.moveTo(this.path.beginX, this.path.beginY)
    this.canvas.addEventListener('touchmove', function () {
      that.drawing(event)
    })
  }
  drawing (e) {
    this.path.endX = (e.targetTouches[0].pageX - this.stage_info.left) * this.canvasRatio
    this.path.endY = (e.targetTouches[0].pageY - this.stage_info.top) * this.canvasRatio
    this.cxt.lineWidth = this.canvasRatio * 2
    this.cxt.lineTo(this.path.endX, this.path.endY)
    this.cxt.stroke()
  }
  drawEnd () {
    document.removeEventListener('touchstart', preHandler, {passive: false})
    document.removeEventListener('touchend', preHandler, {passive: false})
    document.removeEventListener('touchmove', preHandler, {passive: false})
  }
  clear (btn) {
    this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }
  save () {
    return this.canvas.toDataURL('image/png')
  }
}

export default {
  data () {
    return {
      msg: 'Vue利用canvas实现移动端手写板',
      val: true,
      url: ''
    }
  },
  mounted () {
    draw = new Draw('canvas')
    draw.init()
  },
  methods: {
    clear: function () {
      draw.clear()
    },
    save: function () {
      var data = draw.save()
      this.url = data
      console.log(data)
    },
    mutate (word) {
      this.$emit('input', word)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body{padding:0;margin:0;min-height:100vh;background-color:#fff;}
  canvas{vertical-align:top;width:100vw;height:100vh;}
  button{vertical-align:top;}
  .tit{position:fixed;left:0;right:0;top:0;font-size:.26rem;text-align:left;padding:.2rem;border-bottom:1px solid #ccc;}
  .btn{position:fixed;right:0;top:0;padding:.2rem;}
  .img{position:fixed;left:0;right:0;top:0;width:100vw;height:100vh;background-color:#fff;}
 </style>

<template>
  <div class="list">
    <ol>
      <li>canvas
        <ul>
          <li>上传图片并编辑(旋转/移动/放大缩小)<router-link tag="a" :class="'btn'" to="/coffeeUpload">coffeeUpload</router-link></li>
          <li>移动端手写板<router-link tag="a" :class="'btn'" to="/handWriting">handWriting</router-link></li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<style scoped>
  body{background-color:#fff;}
  .list{font-size:.26rem;}
</style>

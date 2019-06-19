<template>
  <div class="card_container column_frame" :style="{backgroundColor: bgColor}">
    <svg-icon  :style="icon_box" :icon-class="svgName" />
    <p class="numClass"> {{num}}</p>
    <p class="descriptionClass">{{description}}</p>
  </div>
</template>

<script>
export default {
  name: 'card',
  data () {
    return {
      icon_box: {
        height: this.boxHeight + 'px',
        width: this.boxWidth + 'px',
        border: '1px solid #999'
      }
    }
  },
  props: {
    num: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: '这是一段很长很长的描述，具体多长不知道，暂时这么长'
    },
    boxHeight: {
      type: Number,
      default: 150
    },
    boxWidth: {
      type: Number,
      default: 150
    },
    svgName: {
      type: String,
      default: 'build'
    },
    bgColor: {
      type: String,
      default: '#FFF'
    }
  },
  created () {
    console.log(this.boxWidth)
    console.log(this.boxHeight)
  }
}
</script>

<style lang="scss" scoped>
.card_container{
  width: 300px;
  height: 300px;
  padding: 20px;
  border: 1px solid #dddddd;
}
.column_frame{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.numClass{
  font-size: larger;
  font-weight: bold;
}
.descriptionClass{
  width: 100%;
  color: #bbbbbb;
}

</style>

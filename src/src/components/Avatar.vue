<!-- 个人制作组合标签 -->
<template>
  <div class="container">
    <!-- DONE: need real url -->
    <img class="avatar" :src='url'/>
    <p class="at-text-primary">{{this.user.name}}</p>
    <p class="at-text-secondary">{{this.user.tid}}</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'at-avatar',
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    data() {
      return {
        url: 'https://picsum.photos/300/300/?random',
        name: '孔老师',
        tid: '2018140659'
      }
    }
  }
</script>

<style lang="scss" scoped>
  $grey: #888;
  $black: #2D2D2D;
  .container{
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    .avatar{
      border-radius: 50%;
      box-shadow:0px 0px 0px 4px $black,
      4px 4px 20px 6px #999;
      // outline: 11px #212121;
      width: 150px;
      height: 150px;
      & ~.at-text-primary{
        margin-top: 12px;
      }
    }
    .at-text-primary,.at-text-secondary{
      text-align: center;
    }
    .at-text-primary {
      font-size: 24px;
      margin: 3px;
    }
    .at-text-secondary{
      margin: 3px;
    }
  }
</style>

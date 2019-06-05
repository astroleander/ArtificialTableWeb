<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    localStorage.getItem('userMsg') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('userMsg'))))
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('userMsg', JSON.stringify(this.$store.state))
    })
  }
}
</script>

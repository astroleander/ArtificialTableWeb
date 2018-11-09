<!-- Tree Structure of Transcript Table of Transcript section -->
<!--
table
  |- div
  |- TODO: menu
  |- TODO: table
  |- ... TODO: row
-->
<!---->
<template>
  <div>
    <input type="text"/>
  </div>
</template>

<script>
export default {
  name: 'transcriptTable',
  components: {},
  props: [],
  data() {
    return {
      loading: true,
      dataset: {
        points: null,
        students: null,
        titles: null
      }
    }
  },
  computed: {},
  methods: {},
  created() {
  }
}
</script>

<style lang="scss" scoped>

</style>

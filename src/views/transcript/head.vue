<!-- Head Tree structure  -->
<!-- 
div(head)
    |- TODO: cardtitle
    |- TODO: content
        |- TODO: infos dashboard
        |- TODO: analysis 
-->

<template>
  <header class="at-card at-card-shadow header">
    <span>head head Head HEAD</span>
  </header>
</template>

<script>
export default {
  name: 'transcriptHead',
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

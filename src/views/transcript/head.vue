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
    <span>this.info</span>
    <span>{{this.info}}</span>
  </header>
</template>

<script>
export default {
  name: 'transcriptHead',
  components: {},
  props: ['info'],
  data() {
    return {
      loading: true,
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

<!-- Tree Structure of Transcript section -->
<!--
index
  |- div
    |- TODO: head (固定头部)
    |- TODO: radio tag card
    |- TODO: route
      |- TODO: transcript table
      |- TODO: check weight & analysis
-->
<!---->
<template>
  <div>
    <transcript-head></transcript-head>
    <button class='select' @click='switchMode()'>Switch</button><!-- Switch Bar -->
    <div id="transcript-container">
      <transcript-table v-show='isTable'></transcript-table>
      <transcript-weight v-show='!isTable'></transcript-weight>
    </div>
  </div>
</template>

<script>
import transcriptHead from './head'
import transcriptTable from './table'
import transcriptWeight from './weight'

export default {
  components: {
    transcriptHead,
    transcriptTable,
    transcriptWeight
  },
  data() {
    return {
      containerShown: true
    }
  },
  computed: {
    isTable: function() {
      return this.containerShown === true
    }
  },
  methods: {
    switchMode: function() {
      this.containerShown = !this.containerShown
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

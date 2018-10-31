<!-- Tree Structure of Mainpage -->
<!-- 
div(mainpage)
    |- TODO: welcome card
    |- TODO: class list
        |- TODO: semester selected list
        |- TODO: semester list
            |- TODO: class list inside
-->
<template>
    <div>
        <h1>Main Page Dashboard</h1>
        <semester>1024 1024</semester>
    </div>
</template>

<script>
import semester from '@/components/Mainpage/Semester'

export default {
    components: {
        'Semester' : semester
    }
  }
</script>

<style lang="scss" scoped>

</style>

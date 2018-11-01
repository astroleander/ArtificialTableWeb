<!-- Tree Structure of Mainpage -->
<!-- 
div(mainpage)
    |- TODO: welcome card
    |- TODO: class list
        |- TODO: semester selected list 
        |- DONE: semester list
            |- DONE: class list inside
-->
<template>
    <div>
        <header class="at-card at-card-shadow header">
            <h1>主界面</h1>
        </header>
        <semester class="semester">在此插入学期</semester>
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
header {
  & h1{
    margin: 0 0 24px 24px; 
    padding: 24px;
  }
}
.at-card-shadow {
    :hover{
        
    }
}

.semester{
    margin: 2rem;
}

</style>

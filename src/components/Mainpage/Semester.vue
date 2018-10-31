<!-- As container for Class Card Conponent -->
<template>
    <div>
        <!-- Semester Title -->
        <input id='at-m-collapsible-checkbox' class="toggle" type="checkbox">
        <label for='at-m-collapsible-checkbox' class="label-toggle">
            <slot></slot>
        </label>
        <!-- Card List -->
        <div id="at-m-list-container" class="at-collapsible">
            <at-class-card :key="idx" v-for="idx in [1,2,3,4,5]"></at-class-card>
        </div>
    </div>
</template>

<script>
import AtClassCard from '@/components/Mainpage/at-class-card'
export default {
    components:{AtClassCard}
}
</script>

<style lang="scss" scoped>

// toggle boxs 
.toggle{
    display: none;

    &~ .at-collapsible{
        display: none;
        transition: all 1s ease-in-out;
        opacity: 0;
    }
    &:checked ~  .at-collapsible{
        display: block;
        transition: all 1s ease-in-out;
        opacity: 100;
    }
}

.label-toggle{
    display: block;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
    &:hover{
        transform: translateY(1px);
        transition: 0ms;
    }
    // 建立小三角形，并添加动画效果，在::before
    // 更多信息 @see https://css-tricks.com/snippets/css/css-triangle/
    &::before {
      content: ' ';
      display: inline-block;

      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid currentColor;

      vertical-align: middle;
      margin-right: .7rem;
      transform: translateY(-2px);

      transition: transform .2s ease-out;
    }
}

</style>

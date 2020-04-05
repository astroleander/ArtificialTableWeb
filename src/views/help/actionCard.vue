<template>
    <div @click="routerTo">
            <el-card class="card" shadow="hover" :style="background">
                <div slot="header" class="clearfix" align="center">
                    {{title}}
                </div>
                <div class="text">{{description}}</div>
            </el-card>
    </div>
</template>

<script>
    export default {
      name: 'atCard',
      props: {
        title: {
          type: String,
          default: ''
        },
        router: {
          type: String,
          default: ''
        },
        description: {
          type: String,
          default: ''
        },
        background: {
          type: String,
          default: ''
        }
      },
      methods: {
        routerTo() {
          console.log(this.router)
          this.$router.push({ path: this.router })
        }

      }
    }
</script>

<style scoped>
    .card{
        width: 200px;
        height: 200px;
        cursor:pointer;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .text {
        font-size: 14px;
    }
</style>
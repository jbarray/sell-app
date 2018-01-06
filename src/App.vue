<!--//<link rel="stylesheet" href="common/stylus/mixin.styl">-->
<template xmlns="http://www.w3.org/1999/html">
  <div id="content">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
    <div class="tab-item">
    <router-link to="/goods">商品</router-link>
    </div>
    <div class="tab-item">
    <router-link to="/goods">评论</router-link>
    </div>
    <div class="tab-item">
    <router-link to="/goods">商家</router-link>
    </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import header from './components/header/header.vue'
  // 判断resource的资源返回是否是我们想要的内容
  const ERR_OK = 0
  export default {
    data(){
      return{
        seller:{}
      }
    },
    components:{
      'v-header':header
    },
    created(){
      this.$http.get('/api/seller').then((response) => {
        if(response.body.errno===ERR_OK){
          this.seller=response.body.data;
        }
      });
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  //引入1像素文件
  @import "./common/stylus/mixin.styl"
 .tab
   display flex
   width:100%
   height: 40px
   line-height 40px
   border-bottom:1px solid rgba(7,17,27,0.1)
   .tab-item
     flex: 1
     text-align center
     & > a
       display:block
       font-size: 14px
       color:rgb(77,85,93)
       &:active
         color:rgb(240,20,20)
</style>

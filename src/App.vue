<template xmlns="http://www.w3.org/1999/html">
  <div id="content">
    <div class="tab">
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
//  import header from './components/header/header'
</script>
<style lang="stylus" rel="stylesheet/stylus">
 .tab
  display flex
  width:100%
  height: 40px
  line-height 40px
 .tab .tab-item
  flex: 1
  line-height:40px
</style>

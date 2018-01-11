<template>
  <div class="cartControl">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" transition="move">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
//      减少商品数量的按钮
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count > 0) {
          this.food.count--;
        }
      },
//      增加商品数量的按钮
      addCart:function(event) {
        if (!event._constructed) {
          return;
        }
//        没有找到count的话, 就重新设定一个count
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        }
        else {
          this.food.count++
        }
        //        触发小球事件的启动
        this.$emit('cart-add', event.target);
        //      this.$dispatch('cart.add', event.target);
      }
    }
  }
 </script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartControl
    position absolute
    right: 20px
    top: 20px
    font-size: 0
    /*width: 62px*/
    /*height: 24px*/
    .cart-decrease
      display: inline-block
      transition: all 0.4s linear
      font-size: 20px
      color: rgb(0, 160, 220)
      &.move-transition
        opacity: 1
        transform: translate3d(0, 0, 0)
        .inner
          display: inline-block
          line-height: 24px
          font-size: 24px
          transition: all 0.4s linear
          transform: rotate(0)
      &.move-enter, &.move-leave
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding: 0 5px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      line-height: 20px
      width: 20px
      height: 20px
      font-size: 20px
      color: rgb(0, 160, 220)
      text-align center
      border-radius 50%
</style>


<template>
  <div class="shopcart">
   <div class="content" @click="toggleList">
     <div class="content-left">
       <div class="logo-wrapper">
         <div class="logo" :class="{'highlight':totalCount>0}">
           <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
         </div>
         <div class="num" v-show="totalCount>0">{{totalCount}}</div>
       </div>
       <div class="price" :class="{'highlight':totalCount>0}">¥{{totalPrice}}</div>
       <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
     </div>
     <div class="content-right">
        <div class="pay"  :class="payClass">
          {{payDesc}}
        </div>
     </div>
     <!--选择商品时,飞出的小球动画-->
     <!--<div class="ball-container">-->
       <!--<div transition="drop" v-for="ball in balls" v-show="ball.show" class="ball">-->
         <!--<div class="inner inner-hook"></div>-->
       <!--</div>-->
     <!--</div>-->
     <div class="ball-container">
       <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeDrop" @enter="droping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
       </div>
     </div>
     <!--购物车详情-->
     <div class="shopcart-list" v-show="listShow" transition="fold">
       <div class="list-header">
         <h1 class="title">购物车</h1>
         <span class="empty" @click="empty">清空</span>
       </div>
       <div class="list-content" ref="listContent">
         <ul>
           <li class="food" v-for="food in selectFoods">
             <span class="name">{{food.name}}</span>
             <div class="price">
               <span>￥{{food.price*food.count}}</span>
             </div>
             <div class="cartcontrol-wrapper">
               <cartControl :food="food" v-on:cart-add="cartAdd"></cartControl>
             </div>
           </li>
         </ul>
       </div>
     </div>
   </div>
  <div class="list-mask" @click="hideList" v-show="listShow" transition="fade"></div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import cartControl from '../cart_control/cart_control';

  export default {
    data() {
      return {
        //设计五个小球,以供使用
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
        ],
        //正在使用的小球集合
        dropBalls: [],
        fold: false
      };
    },
    props: {
      seller: {
        type: Object
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
    },
    methods: {
      //接受由goods传来的所点击的el,将小球分类
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop(el) {
        //          找到show的小球
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
//              获取小球当前位置
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      droping(el,done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend',done);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      //    改变购物车详情的存在与否
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
        let now = new Date();
        now.setDate(now.getDate()-7);
        document.cookie = 'carList=xx;expires=' + now;
      },
      //     监听cartControl中的_drop事件
      cartAdd(el) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.drop(el);
//        console.log(el);
        });
      },
    },
    computed: {
//    计算选中商品的个数
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
//  计算商品的总金额
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.count * food.price;
        });
        return total;
      },
//  右下角 ..元起送/差多少元/结算
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
//    当商品金额大于配送金额时,显示class属性,从而改变背景颜色
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      },
    },
//  小球滑落的动画
//    transitions: {
//      drop: {
////        确认小球初始位置
//        beforeEnter(el) {
////          找到show的小球
//          let count = this.balls.length;
//          while (count--) {
//            let ball = this.balls[count];
//            if (ball.show) {
////              获取小球当前位置
//              let rect = ball.el.getBoundingClientRect();
//              let x = rect.left - 32;
//              let y = -(window.innerHeight - rect.top - 22);
////              el.style.display = '';
//              el.style.webkitTransform = `translate3d(0,${y}px,0)`;
//              el.style.transform = `translate3d(0,${y}px,0)`;
//              let inner = el.getElementsByClassName('inner-hook')[0];
//              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
//              inner.style.transform = `translate3d(${x}px,0,0)`;
//            }
//          }
//        },
//        enter(el,done) {
//          /* eslint-disable no-unused-vars */
//          let rf = el.offsetHeight;
//          this.$nextTick(() => {
//            el.style.webkitTransform = 'translate3d(0,0,0)';
//            el.style.transform = 'translate3d(0,0,0)';
//            let inner = el.getElementsByClassName('inner-hook')[0];
//            inner.style.webkitTransform = 'translate3d(0,0,0)';
//            inner.style.transform = 'translate3d(0,0,0)';
//            el.addEventListener('transitionEnd',done);
//          });
//        },
//        afterEnter(el) {
//          let ball = this.dropBalls.shift();
//          if (ball) {
//            ball.show = false;
//            el.style.display = 'none';
//          }
//        }
//      }
//    },
    components: {
      cartControl
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        z-index: 500
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        z-index: 50
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff

      .ball-container
        .ball
          position: fixed
          left: 32px
          bottom: 22px
          z-index: 200
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      bottom: 50px
      z-index: 40
      width: 100%
      &.fold-transition
        transition: all 0.5s
        transform: translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 150px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            top: -7px
            right: 10px
            width: 80px
            height: 24px
            .cartControl
              width: 62px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 30
    backdrop-filter: blur(10px)
    background: rgba(7, 17, 27, 0.6)
    &.fade-transition
      transition: all 0.5s
      opacity: 1
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>

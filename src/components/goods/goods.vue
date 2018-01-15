<template>
  <div class="goods">
    <!--左侧列表-->
   <div class="menu-wrapper" ref="menuWrapper">
     <ul>
       <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
         <span class="text">
           <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
           {{item.name}}
         </span>
       </li>
     </ul>
   </div>
    <!--右侧商品栏-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!--food-list-hook为常用规定,意味着用在js中-->
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartContorl-wrapper">
                  <cartControl :food="food" v-on:cart-add="cartAdd"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车-->
    <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
    <!--产品详情页-->
    <food :food="selectedFood" ref="food" v-on:cart-plus="cartAdd" ></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart'
  import cartControl from '../cart_control/cart_control'
  import food from '../food/food'
//  const ERR_OK = 0;
export default {
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.$http.get('../../../static/goods.json').then((response) => {
        if (response.statusText === "OK") {
          this.goods = response.body.goods
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        }
      });
  //    this.$http.get('/api/goods').then((response) => {
  //      if (response.body.errno === ERR_OK) {
  //        this.goods = response.body.data
  //        this.$nextTick(() => {
  //          this._initScroll();
  //          this._calculateHeight();
  //        })
  //      }
  //    });
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
  //    shopcart.$on('cart.add',(el) =>{
  //      console.log(el);
  //    })
    },
    components: {
      shopcart,
      cartControl,
      food
    },
    methods: {
      //点击左侧菜单,右侧跳至相应的模块
      selectMenu: function (index, event) {
        //获取右侧模块的高度数组
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        //使右侧菜单跳转到相应的地方,在300毫秒内
        this.foodsScroll.scrollToElement(el, 300);
      },
      //点击具体食物,food页面出现
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$nextTick(() => {
          this.$refs.food.show();
        })
      },
  //     监听cartControl中的_drop事件
      cartAdd(el) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
         this.$refs.shopcart.drop(el);
        });
      },
      _initScroll() {
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          //给左侧菜单创建一个click事件.
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          //        目的是实时监控右侧滚动的位置
          click: true,
          probeType: 3
        });
        //监听当前的位置在y轴上的位置
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        })
      },
      //收集每个模块从最上端数的高度值
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
    },
      //访问子组件shopcart
    computed: {
      //比较现在所在位置和每个模块的高度值的大小
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display flex
    position absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow hidden
    .menu-wrapper
      flex:0 0 80px
      width: 80px
      background #f3f5f7
      .menu-item
        display table
        height: 54px
        width: 56px
        line-height 14px
        padding:0 12px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #ffffff
          font-weight:700
          .text
            border-none()
        .icon
          display inline-block
          width: 12px
          height:12px
          margin-right 2px
          background-size:12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width: 56px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
          font-size 12px
    .foods-wrapper
      flex:1
      .title
        padding-left 14px
        height: 26px
        line-height 26px
        border-left:2px solid #d9dde1
        font-size 12px
        color:rgb(147,153,159)
        background #f3f5f7
      .food-item
        display flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          position relative
          flex: 1
          .name
            margin:2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px
            width: 150px
          .extra
            &.count
              margin-right 12px
          .price
             font-weight 700
             line-heiht 24px
             .now
               margin-right 8px
               font-size  14px
               color: rgb(240, 20, 20)
             .old
                text-decoration line-through
                font-size 10px
                color: rgb(147, 153, 159)

</style>

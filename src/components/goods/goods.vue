<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
            <span class="text border-1px"><span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="food-list" :key="index" ref="foodList">
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" class="food-item border-1px" :key="index" @click="selectFood(food, $event)"><!--点击进入商品详情页-->
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>
                  <p class="desc">{{ food.description }}</p>
                  <div class="extra">
                    <span class="count">月售{{ food.sellCount }}</span><span>好评率{{ food.rating }}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{ food.price }}</span><span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}%</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @increase="increaseFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <cart ref="cart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></cart>
    </div>
    <food @increase="increaseFood" :food="selectedFood" ref="food"></food> <!--商品详情页-->
  </div>
</template>

<script>

import cart from '@/components/cart/cart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import food from '@/components/food/food'

import BScroll from 'better-scroll'

const ERR_OK = 0

export default {
  name: 'goods',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () { // 记录左侧菜单当前索引位置
      for (let i = 0; i < this.listHeight.length; i++) {
        let heightTop = this.listHeight[i]
        let heightBottom = this.listHeight[i + 1]
        if (!heightBottom || (this.scrollY >= heightTop && this.scrollY < heightBottom)) {
          return i
        }
      }
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {click: true, probeType: 3}) // probeType: 3 实时监听滚动位置
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y)) // 监听获取Y值
      })
    },
    _drop (target) {
      this.$nextTick(() => { // 优化体验，异步执行动画
        this.$refs.cart.drop(target) // 将事件触发点，即增加按钮，传递给小球
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    increaseFood (target) { // increase处理事件
      this._drop(target)
    },
    selectMenu (index, event) {
      if (!event._constructed) { // 屏蔽掉浏览器原生点击事件，_constructed是BetterScroll事件的属性，原生点击无此属性
        return
      }
      let foodList = this.$refs.foodList
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300) // 滚动到指定位置
    },
    selectFood (food, event) { // 选中商品，进入详情页
      if (!event._constructed) { // 屏蔽掉浏览器原生点击事件，_constructed是BetterScroll事件的属性，原生点击无此属性
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  components: {
    cart: cart,
    cartcontrol: cartcontrol,
    food: food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "../../common/stylus/mixin"

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        margin-top: -1px
        font-weight: 700
        background: #fff
        z-index: 9
        .text
          border-none()
      .icon
        display: inline-block
        width: 12px
        height: 12px
        margin-right: 2px
        vertical-align: top
        background-size: 12px 12px
        background-repeat: no-repeat
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
        display: table-cell
        width: 56px
        vertical-align: middle
        border-1px(rgba(7, 17, 27, .1))
        font-size: 12px
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 1px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, .1))
      &:last-child
        margin-bottom: 0
        border-none()
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          margin-bottom: 8px
          line-height: 12px
        .extra
          line-height: 10px
          .count
           margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>

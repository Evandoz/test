<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{ food.name }}</h1>
          <div class="detail">
            <span class="sell-count">月售{{ food.sellCount }}</span>
            <span class="rating">好评率{{ food.rating }}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{ food.price }}</span>
            <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @increase="increaseFood" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{ food.info }}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="(rating, index) in food.ratings" :key="index" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
                <div class="user">
                  <span class="name">{{ rating.username }}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{ rating.rateTime | formatDate }}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{ rating.text }}
                </p>
              </li>
            </ul>
            <div v-show="!food.ratings || !food.ratings.length" class="no-rating">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import cartcontrol from '@/components/cartcontrol/cartcontrol'
import split from '@/components/split/split'
import ratingselect from '@/components/ratingselect/ratingselect'

import BScroll from 'better-scroll'
import Vue from 'vue'
import {formatDate} from '@/common/js/date'

const ALL = 2

export default {
  name: 'food',
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false, // 商品详情页默认关闭
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectType = ALL // 保持初始化
      this.onlyContent = true // 保持初始化
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {click: true})
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst (event) {
      if (!event._constructed) {
        return
      }
      this.$emit('increase', event.target) // 小球动画
      Vue.set(this.food, 'count', 1)
    },
    increaseFood (target) {
      this.$emit('increase', target)
    },
    selectRating (type) {
      this.selectType = type // 接受子组件传递过来的selectType,使两个组建联动起来
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent () {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow (type, text) {
      // 负责是否显示有内容的评价
      if (this.onlyContent && !text) { // 当前显示有内容评价，但无评价内容，则不显示
        return false
      }
      // 负责显示评价类型
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType // 当前条目的rateType与当前所选selectType一致则显示，否则不显示
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartcontrol: cartcontrol,
    split: split,
    ratingselect: ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "../../common/stylus/mixin"

.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  width: 100%
  z-index: 9
  background: #fff
  transform: translate3d(0, 0, 0)
  &.move-enter-active, &.move-leave-active
    transition: all .2s linear
  &.move-enter, &.move-leave-active
    transform: translate3d(0, 100%, 0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100% /*相对于width计算*/
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 16px
        color: #fff
  .content
    position: relative
    padding: 18px
    .title
      margin-bottom: 8px
      line-height: 14px
      font-size: 14px
      font-weight: 700
      color: rgb(7, 17, 27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      font-size: 0
      .sell-count, rating
        font-size: 10px
        color: rgb(147, 153, 159)
      .sell-count
        margin-right: 12px
    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        font-size: 10px
        color: rgb(147, 153, 159)
        text-decoration: line-through
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      height: 24px
      padding: 0 12px
      line-height: 24px
      z-index: 10
      box-sizing: border-box
      font-size: 10px
      color: #fff
      border-radius: 12px
      opacity: 1
      background: rgb(0, 160, 220)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.2s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        z-index: -1
  .info
    padding: 18px
    .title
      margin-bottom: 6px
      line-height: 14px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      padding: 0 8px
      line-height: 24px
      font-size: 12px
      color: rgb(77, 85, 93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px
        border-1px(rgba(7, 17, 27, .1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)

</style>

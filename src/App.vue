<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive> <!--保留页面状态，无需重新发送请求-->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import vheader from '@/components/header/vheader.vue'

import {urlParse} from '@/common/js/util'

const ERR_OK = 0

export default {
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          console.log(queryParam)
          return queryParam.id
        })()
      }
    }
  },
  created () {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data) // 给seller扩展属性(id)
      }
    })
  },
  components: {
    'v-header': vheader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import "./common/stylus/mixin.styl"

#app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, .1)
    border-1px(rgba(7, 17, 27, .1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>

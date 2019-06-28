<template>
  <div class="addBooking-wrap">
    <div class="tab">
      <div class="tab-item" :class="{'active': recordType == 0}" @click="tabSwitch(0)">支出</div>
      <div class="tab-item" :class="{'active': recordType == 1}" @click="tabSwitch(1)">收入</div>
    </div>
    <swiper
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      class="swiper"
      @change="swiperChange"
      :current="recordType"
    >
      <swiper-item 
      class="swiper-item swiper-item-1" 
      :catchtouchmove="stopSwiper? 'stopTouchMove': ''" 
      :class="isIphoneX? 'isIphoneX':''"
      
      >

        <movable-sort :recordType='0' :isUpdate.sync="isPayListUpdated"></movable-sort>
        <!-- <movable-area :style ="'display: '+ movableViewInfo.showClass + '; height: 100vh'" class="movable-area">
          <movable-view 
            :y="movableViewInfo.y" 
            :direction="'vertical'" 
            :damping="'999'"
            :animation="false"
            @change="change"
            class="moveable-view"
          >
            {{movableViewInfo.data.text}}
            <div class="left-icon icon">
              <i class="iconfont icon-quchujinzhi-copy" style="color: #ea4f3d; font-size: 50rpx;  line-height: 60rpx; text-align: center"></i>
            </div>
            <div class="right-icon icon">
              <i class="iconfont icon-yidongheng" style="line-height: 60rpx; text-align: center"></i>
            </div>
          </movable-view>
        </movable-area> -->

        <!-- <scroll-view class="scroll-view" :scroll-y='pageInfo.scrollY' style="height: 100%" @scroll="bindScroll">
          <div style="height: 120rpx"></div>
          <ul class="list-wrap">
            <li class="list-item" 
            v-for="(item, index) in cateList" 
            :key="item.id"
            
            :class="{selected: pageInfo.readyPlaceIndex == index}"
            >
              {{item.text}}
              <div class="left-icon icon" :style="{display: pageInfo.readyPlaceIndex == index? 'none':'block'}">
                <i class="iconfont icon-quchujinzhi-copy" style="color: #ea4f3d; font-size: 50rpx;  line-height: 60rpx; text-align: center"></i>
              </div>
              <div class="right-icon icon"
                :data-index="index"
                @touchstart.stop="touchstart"
                @touchmove.stop="touchmove"
                @touchend.stop="touchend"
                :style="{display: pageInfo.readyPlaceIndex == index? 'none':'block'}"
              >
                <i class="iconfont icon-yidongheng" style="line-height: 60rpx; text-align: center"></i>
              </div>
            </li>
            
          </ul>
        </scroll-view> -->
        
       
      </swiper-item>
      <swiper-item class="swiper-item swiper-item-2" :class="isIphoneX? 'isIphoneX':''">
        <movable-sort :recordType='1' :isUpdate.sync="isIncomeListUpdated"></movable-sort>
      </swiper-item>
      
      
    </swiper>

    <div class="addBtn" :class="isIphoneX? 'isIphoneX':''" @click="goToAddCategory">新增{{recordType == 0? '支出': '收入'}}类别</div>

  </div>
</template>

<script>

import movableSort from '@/components/movableSort'
import utils from '@/utils'
// api
import { getCategoryList, updateCategoryList } from '@/utils/api'

export default {
  data(){
    return {
      indicatorDots: false,
      autoplay: false,
      systemInfo: null,
      stopSwiper: false,
      recordType: 0, // 默认支出
      isPayListUpdated: false,
      isIncomeListUpdated: false,
      cateList: [
        {id:1, text:'1111111'},
        {id:2, text:'2222222'},
        {id:3, text:'3333333'},
        {id:4, text:'4444444'},
        //  {id:5, text:'5'},
        // {id:6, text:'66'},
        // {id:7, text:'777777'},
        // {id:8, text:'88888'},
        //  {id:9, text:'99999'},
        // {id:10, text:'10'},
        // {id:11, text:'11'},
        // {id:12, text:'12'},
        //  {id:13, text:'13'},
        // {id:14, text:'14'},
        // {id:15, text:'15'},
        // {id:16, text:'16'},
        //  {id:17, text:'17'},
        // {id:18, text:'18'},
        // {id:19, text:'19'},
        // {id:20, text:'20'},
        // {id:21, text:'21'},
        //  {id:22, text:'22'},
        // {id:23, text:'23'},
        // {id:24, text:'24'},
        // {id:25, text:'25'},

        
      ],
      payCategoryList: [],
      incomeCategoryList: [],
      pageInfo: {
        rowHeight: null,
        scrollHeight: 100,
        scrollY: true,
        startY: 0, //初始位置Y
        readyPlaceIndex: null, //moveable元素最终放置处
        selectedIndex: null,  //选中的index项
        startIndex: null, //最初点击的index项
        movedIndex: 0
      },
      movableViewInfo: {
        offsetY: 0,
        scrollTop: 0,
        startY: 0,
        y: 0,
        showClass: 'none',
        data: {}
      },
      tabSwitch(index){
        this.recordType = index
      } 
    }
  },
  components: {
    movableSort
  },
  methods: {
    async goUpdateCategoryList(){
      let params = {}
      if (this.recordType == 0) {
        params.list = this.pList
        params.recordType = 0
      } else if (this.recordType == 1) {
        params.list = this.iList
        params.recordType = 1
      }
      console.log('更新类别', params)
      try {
        let res = await updateCategoryList(params)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    swiperChange(e){
      console.log('isPayListUpdated',this.isPayListUpdated)
      console.log('isIncomeListUpdated',this.isIncomeListUpdated)
      if (this.isPayListUpdated || this.isIncomeListUpdated) {
        this.goUpdateCategoryList()
        this.isPayListUpdated = false
        this.isIncomeListUpdated = false
      }
      this.recordType = e.mp.detail.current
    },
    stopTouchMove(){
      return false
    },
    goToAddCategory(){
      this.goUpdateCategoryList()
      wx.navigateTo({url:'/pages/addCategory/main?type=' + this.recordType})
    },
    
  },
  created(){
    var rpx = 10000;
    this.systemInfo = wx.getSystemInfoSync();
    this.pageInfo.rowHeight = 100 / 750 * this.systemInfo.windowWidth
    this.movableViewInfo.offsetY = 120 / 750 * this.systemInfo.windowWidth
  },
  mounted(){
    
     this.recordType = this.$mp.query.type || 0
     console.log(this.recordType)
    this.$store.dispatch('getCategoryList',0)
    this.$store.dispatch('getCategoryList',1)
  },
  computed: {
      isIphoneX(){
          return this.$store.getters.isIphoneX
      },
      iList(){
        // console.log('iListiListiListiList')
        // console.log(this.$store.getters.iList)
        return this.$store.getters.iList
      },
      pList(){
        // console.log('pListpListpList')
        // console.log(this.$store.getters.pList)
        return this.$store.getters.pList
      },
  },
  onShow(){
    console.log(this.$store.state.cateListNeedRefresh)
    if (this.$store.state.cateListNeedRefresh) {
      this.$store.dispatch('getCategoryList',0)
      this.$store.dispatch('getCategoryList',1)
      this.$store.commit('CATELIST_REFRESH_DONE')
    }
    
  },
  onUnload(){
    if (this.isPayListUpdated || this.isIncomeListUpdated) {
        this.goUpdateCategoryList()
        this.isPayListUpdated = false
        this.isIncomeListUpdated = false
      }
  },
  watch: {
    recordType(){
       wx.setNavigationBarTitle({
        title: `${this.recordType == 0? '支出':'收入'}类别`,
      })
    }
  },
}
</script>

<style lang="stylus" scoped>
inputLineHeight = 110px   
  page {
    background #f5f5f5
  }
  
  .swiper
    height 100vh
    .swiper-item
        box-sizing border-box
        padding-bottom 100px
        &.isIphoneX
          padding-bottom 100px + isPhoneXBottom
        // .scroll-view
          
        .list-wrap 
            background #fff
            display flex
            justify-content center
            align-items center
            width 100%
            flex-direction column
            .list-item
              box-sizing border-box
              padding-left 80px
              height 100px
              width 100%
              padding 0 100px
              line-height 100px
              font-size 30px
              border-bottom 1px solid #ededed
              position relative
              transition all 0.2s
              .icon
                position absolute
                width 60px
                height 60px
                background gory
                  .iconfont
                    height 60px
                    line-height 60px
                    text-align center
                &.left-icon
                  left 30px
                  top 50%
                  margin-top -30px
                &.right-icon
                  right 30px
                  top 50%
                  margin-top -30px
              &.last-child
                border-bottom none
              &.selected
                background #f5f5f5
                color #f5f5f5
        &.swiper-item-1 
        &.swiper-item-2
          background #f5f5f5

.movable-area
  position:absolute;
  top:0;
  left:0;
  z-index:10;
  width:100%;
  .moveable-view
    box-sizing border-box
    padding 0 100px
    height 100px
    width 100%
    background #fff
    line-height 100px
    font-size 30px
    box-shadow 0px 0px 10px #bfbfbf
    .icon
      position absolute
      width 60px
      height 60px
      background gory
        .iconfont
          height 60px
          line-height 60px
          text-align center
      &.left-icon
        left 30px
        top 50%
        margin-top -30px
      &.right-icon
        right 30px
        top 50%
        margin-top -30px

.addBtn 
  height 100px
  width 100%
  position fixed
  bottom 0
  left 0
  background #fff
  font-size 30px
  text-align center
  line-height 100px
  &.isIphoneX
    padding-bottom isPhoneXBottom
</style>

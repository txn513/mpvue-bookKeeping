<template>
  <div @touchstart="fatherClick">
      <div class="header">
        <div class="header-bar">
          <div class="bar-item bar-item-1">
            <div class="top">{{sYear}}年</div>
            <div class="bottom"> 
              <time-picker :date="selectDate" @update:date="updateDate" mode="head"></time-picker>
              <div class="month">{{sMonth}}<span>月</span>
              <i class="iconfont icon-icon11" style="margin-left: 10px;display: inline; text-align: center; font-size: 40rpx"></i>
              </div>
              
            </div>
           
          </div>
          <div class="bar-item bar-item-2">
            <div class="bar-item-income">
              <div class="top">总收入<span v-if="requestMode == 1">(月)</span></div>
              <div class="bottom"> 
                <div class="acount">{{totalIncomeAmount}}</div>
              </div>
            </div>
             <div class="bar-item-pay">
              <div class="top">总支出<span v-if="requestMode == 1">(月)</span></div>
              <div class="bottom"> 
                <div class="acount"><span v-if="totalPayAmount > 0">-</span>{{totalPayAmount}}</div>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      <scroll-view :scroll-y="listTouchInfo.scrollY" class="scroll-view" >
        <div v-if="isListEmpty" class="isListEmpty">
          <img mode='aspect-fill' src="/static/images/empty_list.png" alt="">
          <p>空空如也</p>
        </div>
        <div class="bookingList-wrap" :class="isIphoneX? 'isIphoneX':''">
          <div class="item-block" v-for="(item, index) in accList" :key="item._id">
            <div class="item-head">
              <div class="item-date">{{sYear+ '-' + sMonth +'-'+ item._id}}</div>
              <div class="item-info">{{ '收入 '+ item.incomeAmount + ' | 支出 '+ item.payAmount}}</div>
            </div>
            <div class="item-list addAmination"
              @touchstart="listTouchStart"
              @touchmove="listTouchMove"
              @touchend="listTouchEnd"
              :style="{transform: listTouchInfo.currentIndex == index+'-'+cIndex? 'translate('+ listTouchInfo.finalX  +'px,0)' : ''}"
              v-for="(cItem, cIndex) in item.content" :key="cItem._id"
              :data-index="index+'-'+cIndex"
            >
              <div class="detail-info">
                <div class="detail-icon">
                  <i class="iconfont" :class="cItem.icon" style="line-height: 80rpx; text-align: center; font-size: 50rpx"></i>
                </div>
                <div class="detail-title">{{cItem.title}}</div>
              </div>
              <div class="detail-price"><span v-if="cItem.recordType == 0">-</span>{{cItem.price}}</div>
              <div class="delete" @click="delAccounting(cItem._id)">删除</div>
            </div>
            
            
            
            
          </div>
          <!-- <div class="item-block">
            <div class="item-head">
              <div class="item-date">2019</div>
              <div class="item-info">支出：xxxx</div>
            </div>
            <div class="item-list">
              <div class="detail-info">
                <div class="detail-icon">
                  <i class="iconfont icon-jiahao" style="line-height: 80rpx; text-align: center; font-size: 50rpx"></i>
                </div>
                <div class="detail-title">交通</div>
              </div>
              <div class="detail-price">99</div>
            </div>
          </div> -->
          <!-- <div class="item-block">
            <div class="item-head">
              <div class="item-date">2019</div>
              <div class="item-info">支出：xxxx</div>
            </div>
            <div class="item-list">
              <div class="detail-info">
                <div class="detail-icon">
                  <i class="iconfont icon-jiahao" style="line-height: 80rpx; text-align: center; font-size: 50rpx"></i>
                </div>
                <div class="detail-title">交通</div>
              </div>
              <div class="detail-price">99</div>
            </div>
          </div> -->
        </div>
       
      </scroll-view>
       

      <!-- <picker
        mode="date"
        :value="date"
        fields="month"
        @change="bindDateChange"
      >

        <view class="picker">
          当前选择：{{date}}
        </view>
      </picker> -->

      

      <tab-bar :selectNavIndex="0"></tab-bar>
  </div>
</template>

<script>
import utils from '@/utils'
import timePicker from '@/components/timePicker'
import tabBar from '@/components/tabBar'

import { getAccountingList, getAmount, deleteAccounting} from '@/utils/api'
 
export default {
  data () {
    return {
      date: '',
      selectDate: '',
      listTouchInfo: {
        startX: 0,
        startY: 0,
        scrollY: true,
        movedDistance: 0,
        movedDistanceY: 0,
        lastX: 0,
        finalX: 0,
        moveBoundray: 0,
        currentIndex: null,
        
        
      },
      categoryList: [],
      requestMode: 1, // 1-请求月份，2-请求年份
      sYear: utils.getTodayDate().year,
      sMonth: utils.getTodayDate().month,
      totalPayAmount: 0,
      totalIncomeAmount: 0,
    }
  },

  components: {
    timePicker,
    tabBar
  },

  methods: {
    updateDate(v){
      console.log(v)
      this.sYear = utils.getTodayDate(v).year
      this.sMonth = utils.getTodayDate(v).month
      this.getBookingList()
      this.getAllAmount()
    },
    delAccounting(id){
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除',
        success(res) {
          if (res.confirm) {
            deleteAccounting({id}).then((res) => {
              if(res.code == 1){
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })
                that.getBookingList()
                that.getAllAmount()
              }
            }).catch(err => {
              console.log(err)
            })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    },
    getBookingList(){
      return this.$store.dispatch('getAccountingList',{
        recordYear: parseInt(this.sYear),
        recordMonth: parseInt(this.sMonth)
      })
    },
    getAllAmount(){
      return getAmount({
        recordYear: parseInt(this.sYear),
        recordMonth: parseInt(this.sMonth)
      }).then(res => {
        console.log(res)
        if (res.data) {
          this.totalPayAmount = res.data.payAmount
          this.totalIncomeAmount = res.data.incomeAmount
          // this.$store.commit("ACCLIST_REFRESH_DONE")
        } else {
          this.totalPayAmount = 0
          this.totalIncomeAmount = 0
        }
        
      })
    },
    listTouchStart(e){
      this.listTouchInfo.lastX = null
      this.listTouchInfo.finalX = null
      this.listTouchInfo.startX = e.touches[0].clientX
      this.listTouchInfo.startY = e.touches[0].clientY
      
      // console.log(e.mp.currentTarget.dataset.index)
      this.listTouchInfo.currentIndex = e.mp.currentTarget.dataset.index
      this.xCanMove = true   // 默认允许左滑

    },
    listTouchMove(e){
      this.listTouchInfo.movedDistance = e.mp.touches[0].clientX - this.listTouchInfo.startX
      this.listTouchInfo.movedDistanceY = e.mp.touches[0].clientY - this.listTouchInfo.startY
      console.log(this.listTouchInfo.movedDistanceY)
      if (Math.abs(this.listTouchInfo.movedDistanceY) < 5) {
        // 
        if (this.listTouchInfo.movedDistance < -7 && this.xCanMove) { //&& (Math.abs(this.listTouchInfo.movedDistance) < this.listTouchInfo.moveBoundray)
          // this.xCanMove = true
          this.listTouchInfo.scrollY = false
          this.listTouchInfo.finalX = -this.listTouchInfo.moveBoundray
        }
        else if ((this.listTouchInfo.movedDistance) > 0) {
          this.listTouchInfo.finalX = 0
        } 
      } else {
        this.xCanMove = false
        this.listTouchInfo.scrollY = true
      }
    },
    listTouchEnd(e){
      this.listTouchInfo.lastX = this.listTouchInfo.finalX
      this.listTouchInfo.scrollY = true
      this.xCanMove = true
    },
    fatherClick(){
      this.listTouchInfo.finalX = 0
      this.listTouchInfo.lastX = 0
    },
  },

  created () {
    // let app = getApp()
    this.systemInfo = wx.getSystemInfoSync();
    this.listTouchInfo.moveBoundray = 100 / 750 * this.systemInfo.windowWidth
    
  },
  computed:{
    isIphoneX(){
        return this.$store.getters.isIphoneX
    },
    isListEmpty(){
      return (this.accList && this.accList.length > 0) ? false : true
    },
    accList(){
      return this.$store.getters.accList
    },
    

  },
  onShow () {
      this.getBookingList()
      this.getAllAmount()

  },

  mounted(){
    // this.getBookingList({
    //   recordYear: parseInt(utils.getTodayDate().year),
    //   recordMonth: parseInt(utils.getTodayDate().month)
    // })
  },
  onPullDownRefresh() {
    
    this.getBookingList()
    this.getAllAmount()
    wx.stopPullDownRefresh();
  }

}
</script>

<style scoped lang="stylus">

headerBigFontSize = 40px
headerHeight = 150px
.header 
  height headerHeight
  background themeColor
  position fixed
  top 0
  left 0
  width 100%
  z-index 1000
  .header-bar
    display flex
    justify-content left
    align-items flex-end
    height 100%
  .bar-item 
    position relative
    height indexHeaderBar

    .top
      height indexHeaderBarTop
      line-height 24px
      font-size 24px
      color #6e633e
    .bottom 
      display flex
      position relative
      height: indexHeaderBarBottom
      font-size 30px
      justify-content flex-start
      align-items center
      .month 
        font-size headerBigFontSize
        border-right 1px solid darkGrayColor
        width 100%
      > span 
        font-size 24px

  .bar-item-1 
    flex 2
    box-sizing border-box
    padding 0 30px
  .bar-item-2
    flex 5
    box-sizing border-box
    display flex
    padding 0 30px
    .bar-item-pay
    .bar-item-income
      flex 1
      .acount 
        font-size headerBigFontSize
  

.testBtn 
  height 100px
  width 100px
  background-color gray
  text-align center

.time-picker {
  height: 500px;
}

.bookingList-wrap
  box-sizing border-box
  background backgroundGray
  padding-bottom tabbarBottomHeight
  padding-top headerHeight
  // background #fff
  &.isIphoneX 
    padding-bottom tabbarBottomHeight + isPhoneXBottom

.item-block 
  // border-top 20px solid #f5f5f5
  background #fff
  margin-top 20px
  // margin-top 20px
  .item-head
    padding 0 30px
    height 80px
    display flex
    align-items center
    justify-content space-between
    font-size 28px
    color #969696
  .item-list 
    position relative
    padding 0 30px
    height 150px
    display flex
    justify-content space-between
    align-items center
    .detail-info 
      display flex
      align-items center
      height 100%
      .detail-icon
        width 80px
        height 80px
        border-radius 50%
        background themeColor
        margin-right 20px
      .detail-title 
        line-height 150px
        font-size 30px
        color fontColorGray
    .detail-price
        font-size 36px
        color #000
    .delete
      position absolute
      height 100%
      width 100px
      right -100px
      top 0
      background #ed736e
      line-height 150px
      text-align center
      color #fff
      font-size 30px
    &.addAmination
      transition all 0.5s

.scroll-view 
  height 100vh
  box-sizing border-box
  background backgroundGray
  position relative
  // padding-top headerHeight

.isListEmpty
  position absolute
  top 50%
  left 50%
  margin-left -100px
  margin-top -125px
  width 200px
  height 250px
  img 
    height 200px
    width 200px
  p
    color #dbdbdb
    font-weight bold
    text-align center
    font-size 30px
</style>

<template>
  <div style="height:100%">
    <movable-area :style ="'display: '+ movableViewInfo.showClass + '; height: 100vh'" class="movable-area">
        <movable-view 
        :y="movableViewInfo.y" 
        :direction="'vertical'" 
        :damping="'999'"
        :animation="false"
        class="moveable-view"
        >
        {{movableViewInfo.data.categoryName}}
        <div class="left-icon icon">
            <i class="iconfont icon-quchujinzhi-copy" style="color: #ea4f3d; font-size: 50rpx;  line-height: 60rpx; text-align: center"></i>
        </div>
        <div class="right-icon icon">
            <i class="iconfont icon-yidongheng" style="line-height: 60rpx; text-align: center"></i>
        </div>
        </movable-view>
    </movable-area>

    <scroll-view class="scroll-view" :scroll-y='pageInfo.scrollY' style="height: 100%" @scroll="bindScroll">
        <div style="height: 120rpx"></div>
        <ul class="list-wrap">
        <li class="list-item" 
        v-for="(item, index) in cateList" 
        :key="item.id"
        
        :class="{selected: pageInfo.readyPlaceIndex == index}"
        >
            <!-- <i></i> -->
            {{item.categoryName}}
            <div @click="deleteCategory(item._id)" class="left-icon icon" :style="{display: pageInfo.readyPlaceIndex == index? 'none':'block'}">
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
    </scroll-view>
  </div>
</template>

<script>
import { deleteCategory } from '@/utils/api'
export default {
  props: {
    'recordType': {
      type: Number
    },
    'isUpdate': {
      type: Boolean
    }
  },
  data(){
    return {
    
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
    }
  },
  methods: {
    touchstart(e){
        console.log(e.touches[0].clientY)
      this.pageInfo.startY = e.touches[0].clientY
      this.pageInfo.readyPlaceIndex = e.mp.currentTarget.dataset.index
      this.pageInfo.selectedIndex = e.mp.currentTarget.dataset.index
      this.pageInfo.startIndex = e.mp.currentTarget.dataset.index
      this.pageInfo.scrollY = false

      this.movableViewInfo.y = this.pageInfo.startIndex * this.pageInfo.rowHeight - this.movableViewInfo.scrollTop + this.movableViewInfo.offsetY
      this.movableViewInfo.startY = this.movableViewInfo.y
      this.movableViewInfo.showClass = 'block'
      this.movableViewInfo.data.categoryName = this.cateList[this.pageInfo.startIndex].categoryName

      this.movedIndex = 0
      this.stopSwiper = true
    },
    touchmove(e){
      // console.log(e.mp.touches[0].pageY)
      let movedDistance = e.mp.touches[0].clientY - this.pageInfo.startY
      this.movableViewInfo.y = this.movableViewInfo.startY + movedDistance
      let movedIndex = 0

      if (movedDistance >= 0) {
        movedIndex = parseInt(movedDistance / this.pageInfo.rowHeight + 0.5)    
      } else {
        movedIndex = parseInt(movedDistance / this.pageInfo.rowHeight - 0.5)   
      }

      let readyPlaceIndex = this.pageInfo.startIndex + movedIndex

      if (readyPlaceIndex < 0) {
        this.pageInfo.readyPlaceIndex = readyPlaceIndex = 0
      }
      else if (readyPlaceIndex >= this.cateList.length) {
        this.pageInfo.readyPlaceIndex = readyPlaceIndex =this.cateList.length - 1
      }

      if (readyPlaceIndex != this.pageInfo.selectedIndex) {
        this.pageInfo.readyPlaceIndex = readyPlaceIndex
        var selectedData = this.cateList[this.pageInfo.selectedIndex]

        this.cateList.splice(this.pageInfo.selectedIndex, 1)
        this.cateList.splice(readyPlaceIndex, 0, selectedData)
        this.pageInfo.selectedIndex = readyPlaceIndex
        this.$emit('update:isUpdate',true)
      }
    },
    touchend(e){
      this.pageInfo.readyPlaceIndex = null
      this.pageInfo.startY = null
      this.pageInfo.selectedIndex = null
      this.pageInfo.startIndex = null
      this.pageInfo.scrollY = true
      this.movableViewInfo.y = 0
      this.movableViewInfo.showClass = 'none'
      this.stopSwiper = false

        if(this.recordType == 0){
            this.$store.commit('GET_PAYLIST', this.cateList)
        } else if (this.recordType == 1) {
            this.$store.commit('GET_INCOMELIST', this.cateList)
        }
      
    },
    bindScroll(e){
    //   console.log(e)
      this.movableViewInfo.scrollTop = e.mp.detail.scrollTop
    },
    deleteCategory(id){
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除',
        success(res) {
          if (res.confirm) {
            deleteCategory({
              id,
              recordType: that.recordType
            }).then(res => {
              if (res.code == 1) {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.$store.dispatch('getCategoryList',0)
                  that.$store.dispatch('getCategoryList',1)
              }
            }).catch(err => {
              console.log(err)
            })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
     
    }
  },
  created(){
    this.systemInfo = wx.getSystemInfoSync();
    this.pageInfo.rowHeight = 100 / 750 * this.systemInfo.windowWidth
    this.movableViewInfo.offsetY = 120 / 750 * this.systemInfo.windowWidth
  },
  computed: {
      cateList(){
          if(this.recordType == 0){
              return [...new Set(this.$store.getters.pList)]
          } else if (this.recordType == 1) {
              return [...new Set(this.$store.getters.iList)]
          }
      },
      
  }
}
</script>

<style lang="stylus" scoped>
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
</style>

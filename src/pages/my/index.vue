<template>
  <div class="my-wrap">
      <div class='head'>
        <open-data class="user-avatar" type="userAvatarUrl"></open-data>
        <open-data class="user-nick" type="userNickName"></open-data>
      </div>

      <div class="my-info">
        <div class="my-info-item my-info-item-1">
          <div class="item-top">0</div>
          <div class="item-bottom">记账天数</div>
        </div>
        <div class="my-info-item my-info-item-2">
          <div class="item-top">0</div>
          <div class="item-bottom">记账笔数</div>
        </div>
      </div>
      
      <div class="my-list">
        <div class="list-item" @click="navigateTo('/pages/categoryList/main')">
          <p class="list-item-left"><i class="iconfont icon--biaodanfenlei"></i>类别设置</p>
          <p class="list-item-right"><i class="iconfont icon-Icons_ToolBar_ArrowRight"></i></p>
        </div>
        <!-- <div class="list-item" @click="navigateTo('')">
          <p class="list-item-left"><i class="iconfont icon--biaodanfenlei"></i>年度账单</p>
          <p class="list-item-right"><i class="iconfont icon-Icons_ToolBar_ArrowRight"></i></p>
        </div> -->
      </div>

    <tab-bar :selectNavIndex="4"></tab-bar>
  </div>
</template>

<script>
import tabBar from '@/components/tabBar'

export default {
  components: {
    tabBar
  },

  data () {
    return {
      
    }
  },
  methods: {
    navigateTo(url){
      if (!url) {
        wx.showToast({
          title: '敬请期待~~',
          icon: 'none'
        })
      }
       wx.navigateTo({
        url
      })
    },
  },
  created () {
    
  }
}
</script>

<style scoped lang="stylus">
.my-wrap 
  height 100vh
  background #f5f5f5
.head{
  /* border-bottom: 1rpx #F6F6F6 solid; */
  height: 190rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  background: themeColor
  width: 100%;
  // margin-bottom: 10rpx;
}
.user-avatar{
  overflow:hidden;
  display: block;
  margin-left:20rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 1rpx solid #fff;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  margin-right: 50rpx; 
}
.user-nick {
  font-size: 34rpx;
  font-weight: bold;
  color: rgba(51,51,51,1);

}

.my-info 
  display flex
  height 150px
  // margin-top 10px
  background themeColor
  font-size 25px
  .my-info-item
    flex 1
    display flex
    flex-direction column
    align-items center
    justify-content center
    font-weight light
    .item-top
      line-height 75px
      font-size 40px
      color #000
.my-list
  background #ffffff
  padding 0 30px
  margin-top 20px
  .list-item
    display flex
    height 100px
    border-bottom 1px solid grayColor
    justify-content space-between
    line-height 100px
    font-size 30px
    .list-item-left
      display flex
      .iconfont
        margin-right 10px
        line-height: 100px; 
        color: #f9db61;
        text-align: center; 
        font-size: 40px
      .list-item-right
        .iconfont
          line-height: 100px; 
          text-align: right; 
          font-size: 30px; 
          color: #888
    &:last-child
      border none
</style>

<template>
  <div class="addCategory">
     <div class="input-wrap">
       <span class="input-icon-wrap">
         <i class="iconfont" :class="currentIconClassName" style="text-align: center"></i>
       </span>
       <input class="input" type="text" maxlength="10" placeholder="请输入类别名称，不超过4个汉字" v-model="categoryName">
     </div>

     <scroll-view :scroll-y="true" class="scroll-view" :class="isIphoneX? 'isIphoneX':''">
        <ul class="list-wrap icon-wrap">
          <li class="list-item icon-item" 
          v-for="(item, index) in iconArray" 
          :key="index"
          :class="{active:selectedIndex == index}">
            <div class="circle" :data-index="index" @click="chooseIcon(index, item)">
              <i class="iconfont" :class="item" style="line-height: 110rpx; text-align: center; font-size: 50rpx"></i>
            </div>
          </li>
        </ul>
     </scroll-view>

     <div class="submitBtn bottomBtn" :class="isIphoneX? 'isIphoneX':''" @click="submit">确定</div>
  </div>
</template>

<script>
import {addCategory} from '@/utils/api'

export default {
  components: {
    
  },

  data () {
    return {
      iconArray: [],
      selectedIndex: 0, //默认选中第一个
      currentIconClassName: '',
      recordType: 0,
      categoryName: ''
    }
  },
  methods: {
    chooseIcon(index, className){
      this.selectedIndex = index
      this.currentIconClassName = className
    },
    async submit () {
      if (this.categoryName == '') {
        wx.showToast({
          title: '请输入类别名称',
          icon: 'none',
          duration: 2000
        })
        return 
      }
      let params = {
        recordType: this.recordType,
        categoryName: this.categoryName,
        iconClassName: this.currentIconClassName
      }
      console.log(params)
     try {
       let res = await addCategory(params)
        
        if (res.code == 1) {
          this.categoryName = ''
          this.$store.commit('CATELIST_NEED_REFRESH')
          wx.navigateBack()
        }
     } catch (error) {
       wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
     }
      
    }
  },
  mounted(){
    // console.log(this.$mp.query.type)
    // console.log(this.globalData.iconArray)
    this.recordType = this.$mp.query.type || 0

    if (this.recordType == 0) {
      wx.setNavigationBarTitle({
        title: '新增支出类别',
      })
      this.iconArray = this.globalData.iconArray.payIcon
      this.currentIconClassName = this.iconArray[0]
    } else {
      wx.setNavigationBarTitle({
        title: '新增收入类别',
      })
      this.iconArray = this.globalData.iconArray.incomeIcon
      this.currentIconClassName = this.iconArray[0]
    }
  },
  created () {
    
     
  },
  computed: {
      isIphoneX(){
          return this.$store.getters.isIphoneX
      }
  }
}
</script>

<style lang="stylus" scoped>
inputWrapHeight = 140px
inputInnerHeight = 100px
.input-wrap 
  position fixed 
  top 0
  left 0
  display flex
  box-sizing border-box
  width 100%
  padding 20px 30px  
  height inputWrapHeight
  border-bottom 1px solid #ededed
  z-index 100
  background #fff
  align-items center
  .input-icon-wrap
    display inline
    height inputInnerHeight
    width inputInnerHeight
    text-align center
    border-radius 50%
    background themeColor
    margin-right 20px
    .iconfont
      line-height inputInnerHeight
  .input
    flex 5
    line-height inputInnerHeight
    height inputInnerHeight

.scroll-view 
  box-sizing border-box
  height 100vh
  background #ffffff
  padding-top inputWrapHeight + 20px
  padding-bottom  bottomBtnHeight
  &.isIphoneX
    padding-bottom: bottomBtnHeight + isPhoneXBottom


</style>

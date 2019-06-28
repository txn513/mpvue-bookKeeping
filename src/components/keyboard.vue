<template>
  <div class="keyboard-wrap" @touchmove.stop="''" @click.stop="bindKeyboard" :class="{'isPhoneX-bottom': isIphoneX}">
    <div class="text" :class="{optMode: optNum !== ''}">
        <p class="big">{{totalNum}}</p>
        <p class="small" v-if="optNum ">
            {{number}}
            <i v-if="inOptMode == 'plus'" class="iconfont icon-op0" style="display: inline-block;line-height: 30rpx; text-align: left; font-size: 20rpx"></i>
            <i v-if="inOptMode == 'sub'" class="iconfont icon-op1" style="display: inline-block;line-height: 30rpx; text-align: left; font-size: 20rpx"></i>
            <i v-if="inOptMode == 'multi'" class="iconfont icon-op2" style="display: inline-block;line-height: 30rpx; text-align: left; font-size: 20rpx"></i>
            <i v-if="inOptMode == 'divide'" class="iconfont icon-op3" style="display: inline-block;line-height: 30rpx; text-align: left; font-size: 20rpx"></i>
            {{optNum}}
        </p>
    </div>
    <div class="calendar">
        <p v-if="selectDate && selectDate != todayDate" class="format-select-date">
            <!-- <span class="year">{{recordYear}}</span> -->
            <span>{{recordYear +'/'+recordMonth + '/' + recordDay}}</span>
        </p>
        <i v-else :data-tag="17" class="iconfont icon-rili" style="line-height: 100rpx; text-align: center; font-size: 50rpx"></i>
        <time-picker :date.sync="selectDate" mode="head" fields="day"></time-picker>
    </div>
    <div 
    v-for="(item,index) in digits" 
    :key="index" 
    :data-tag="index"
    :class="{'digits-0': index == 0}"
    >{{item}}</div>

    <div class="operators">
        <div 
        v-for="(item,index) in operators"
        :key="index" 
        
        class="op-item"
        :class="{'active': (index+13) == optActiveIndex}"
        >
        <!-- {{item}} -->
        <i :data-tag="index + 13" class="iconfont" :class="'icon-op'+index" style="line-height: 100rpx; text-align: center; font-size: 40rpx"></i>
        </div>
    </div>
    <div class="dot" :data-tag="-1">.</div>
    <div class="submit" :data-tag="12">完成</div>
    <div class="del" :data-tag="11">删除</div>
  </div>
</template>

<script>
import utils from '@/utils'
import timePicker from '@/components/timePicker'
export default {
  props: ['text', 'reset'],
  data(){
      return {
          digits: [0,1,2,3,4,5,6,7,8,9],
          operators: ['+','-','*','/'],
          number: '0',
          selectDate: '',
          inOptMode: '',
          optNum: '',
          maxNum: 100000000,
          optActiveIndex: null

      }
  },
  components: {
      timePicker
  },
  methods: {
      bindKeyboard(e){
        //   console.log(e)
        let tag = e.mp.target.dataset.tag
        this.optActiveIndex = null
        if (tag == 12) { // 完成
            
            this.$emit('bindSubmit',{
                selectDate: this.selectDate,
                price: this.totalNum
            })
            
        } else if (tag >= 0 && tag < 10) { // 数字键
            if (parseFloat(this.totalNum) > this.maxNum) {
                return
            }
            // 清除运算符选中样式
            let reg = /\d+(\.\d+$)?/
           
            // 运算模式
            if (this.inOptMode != '') {
      
                if (this.optNum == '0') {
                    this.optNum = ''
                }
                reg.test(this.optNum)
                if (!this.optNum.includes('.') || RegExp.$1.length < 3) {
                    this.optNum += tag.toString()
                }
            } else { // 普通模式
  
                if (this.number == '0') {
                    this.number = ''
                }
                reg.test(this.number)
                if (!this.number.includes('.') || RegExp.$1.length < 3) {
                    this.number += tag.toString()
                }
            }
        } else if (tag == -1) { // 点
            if (parseFloat(this.totalNum) > this.maxNum) {
                return
            }
            
            // 运算模式
            if (this.inOptMode != '') {
                if (!this.optNum) {
                    this.optNum = '0.'
                }
                else if(!this.optNum.includes('.')){
                    this.optNum += '.'
                }
            } else { // 普通模式
                if (!this.number) {
                    this.number = '0.'
                }
                else if(!this.number.includes('.')){
                    this.number += '.'
                }
            }
        } else if (tag == 11) { // 删除
            let number = this.number.toString()
            if (this.inOptMode != '' && this.optNum.length > 0) {
                this.optNum = this.optNum.slice(0, this.optNum.length-1)
            } else if (number.toString().length > 0) {
                this.number = number.slice(0, number.length-1)
            } 
            if (this.optNum.length == 0) {
                this.inOptMode = ''
            }
            if (this.number.length == 0) {
                this.number = '0'
            }
        } else if (tag >= 13 && tag <= 16) { // 加减乘除
           
            // 超出最大值return
            if (parseFloat(this.totalNum) > this.maxNum) {
                return
            }
           
            // 没有初始值则return
            if (this.number === '') {
                return
            }
            // 点击样式
            this.optActiveIndex = tag

            // 再次点击加号复制，并清空optNum
            console.log(this.totalNum)
            if (this.optNum) {
                this.number = this.totalNum
                this.optNum = ''
            }
            console.log(this.number)
            // 判断运算符
            if(this.number !== ''){
                
                switch(tag){
                    case 13: 
                    this.inOptMode = 'plus'
                    break
                    case 14: 
                    this.inOptMode = 'sub'
                    break
                    case 15: 
                    this.inOptMode = 'multi'
                    break
                    case 16: 
                    this.inOptMode = 'divide'
                    break
                }

            }
       
            
            
        }

      },
       add() {
        const args = [...arguments]
        const maxLen = Math.max.apply(
          null,
          args.map(item => {
            const str = String(item).split('.')[1]
            return str ? str.length : 0
          })
        )
        return (
          args.reduce((sum, cur) => sum + cur * 10 ** maxLen, 0) / 10 ** maxLen
        )
      },
  },
  computed:{
        totalNum(){
            let optNum = ''
            let totalNum = 0
            if(this.optNum){
                optNum = parseFloat(this.optNum)
            } 
            if (this.inOptMode == 'plus') {
                
                totalNum =  optNum === '' ? parseFloat(this.number) : this.add(parseFloat(this.number),optNum).toFixed(2)
                
            } else if (this.inOptMode == 'sub') {
                totalNum =  optNum === '' ? parseFloat(this.number) : (parseFloat(this.number) - optNum).toFixed(2)
            } else if (this.inOptMode == 'divide') {
                totalNum = optNum === '' ? parseFloat(this.number) : optNum == '0' ? parseFloat(this.number) : (parseFloat(this.number) / optNum).toFixed(2)
            } else if (this.inOptMode == 'multi') {
                totalNum = optNum === '' ? parseFloat(this.number) : (parseFloat(this.number) * optNum).toFixed(2)
                
            }
            else {
                
                totalNum = this.number
            }

            if (totalNum < 0) {
                totalNum = 0
            }
            return totalNum
        },
        isIphoneX(){
            return this.$store.getters.isIphoneX
        },
        recordYear(){
            return utils.getTodayDate(this.selectDate).year
        },
        recordMonth(){
            return utils.getTodayDate(this.selectDate).month
        },
        recordDay(){
            return utils.getTodayDate(this.selectDate).day
        },
        todayDate(){
            let dateObj = utils.getTodayDate()
            return `${dateObj.year}-${dateObj.month}-${dateObj.day}`
        },

  },
  watch: {
      reset(val){
          console.log('reset',val)
          if (val) {
                this.optNum = ''
                this.number = '0'
                this.$emit('update:reset', false)
          }
      }
  }
}
</script>

<style lang="stylus" scoped>
.keyboard-wrap
    position fixed
    bottom 0
    left 0
    z-index 1000
    width 100%
    display grid
    box-sizing border-box
    grid-template-columns 1fr 1fr 1fr 1fr;
    grid-template-rows 100px 100px 100px 100px 100px;
    justify-items center
    align-items center
    box-shadow 0px -5px 12px grayColor
    // border-bottom 1px solid grayColor;
    grid-gap 2px;
    background-color grayColor;
    div 
        background #fff
        height 100%
        width 100%
        line-height 100px
        text-align center
        position relative
    .digits-0
        grid-column-start 2;
        grid-column-end 3;
        grid-row-start 5;
        grid-row-end 6;
        font-size 40px
    .operators 
        display grid
        grid-template-columns 1fr 1fr;
        grid-template-rows 1fr 1fr;
        justify-items center
        align-items center
        grid-column-start 4;
        grid-column-end 5;
        grid-row-start 2;
        grid-row-end 4;
        grid-gap 2px;
        background-color grayColor;
        div.active
            background themeColor
    .text 
        grid-column-start 1;
        grid-column-end 4;
        grid-row-start 1;
        grid-row-end 2;
        &.optMode
            display grid 
            grid-template-columns 100%
            grid-template-rows 65px 35px
            font-size 20px
            .small 
                line-height 20px
                color darkGrayColor
            .big
                font-size 30px
                line-height 70px
    .canlendar
        position relative
        grid-column-start 5;
        grid-column-end 6;
        grid-row-start 1;
        grid-row-end 2;
    .submit
        background themeColor
        grid-column-start 4;
        grid-column-end 5;
        grid-row-start 4;
        grid-row-end 6;
        height 100%
        width 100%
        display grid 
        justify-items center
        align-items center
    .dot
        grid-column-start 1;
        grid-column-end 2;
        grid-row-start 5;
        grid-row-end 6;
    .del 
        grid-column-start 3;
        grid-column-end 4;
        grid-row-start 5;
        grid-row-end 6;

.format-select-date
    height 100%
    display flex
    flex-direction column
    align-items center
    justify-content center
    span 
        display inline-block
        height 40px
        line-height 40px  
        font-size 26px
        &.year
            font-size 20px
</style>




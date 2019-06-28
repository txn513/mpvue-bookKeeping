<template>
  <div>
    <picker
        mode="date"
        :value="date"
        :fields="fields"
        @change="bindDateChange"
        @cancel="bindCancel"
      >

        <view class="picker" :class="{maxSize: mode == 'head'}">
          <!-- 当前选择：{{date}} -->
        </view>
    </picker>
  </div>
</template>

<script>
export default {
  props: {
    'date': {
      type: String
    },
    'fields': {
      default: 'month'
    },
    'mode': {
      type: String
    },
    // 用于确定后恢复键盘显示
    'showInput': {
      default: false
    }
  },
  methods: {
    bindDateChange(e){
        console.log('picker发送选择改变，携带值为', e)
        // this.date = e.mp.detail.value
        this.$emit('update:date',e.mp.detail.value)
        this.$emit('update:showInput',true)
    },
    bindCancel(){
      this.$emit('update:showInput',true)
    }
  },
  created(){
  }

}
</script>

<style lang="stylus" scoped>
.picker-wrap
  position relative

.max
  height indexHeaderBarBottom
  width 100%


.picker.maxSize 
  position absolute
  height 100%
  width 100%
  top 0
  left 0
  z-index 100

</style>

<template>
    <!--时间线-->
    <div style="display:flex;">
        <!-- 当日志记录不超过9个，全排列 -->
        <div class="container" :style="'width:'+ width">
            <div style="display:flex;">
                <!-- 默认选中第一个 -->
                <!-- <div style="flex:1;display:flex;flex-direction:column;">
                    <div style="flex:1;display:flex">
                        <div style="flex:1;"></div>
                            <div class="dot" @click="clicktime(item, 0)" :class="{active: 0 === timeIndex}"></div>
                        <div class="item"></div>
                    </div>
                    <div class="item_bottom">
                        <span>{{timeLineList[0]}}</span>
                    </div>
                </div> -->
                <!-- <div style="flex:1;display:flex;flex-direction:column">
                    <div style="flex:1;display:flex;border:red solid 1px;width:32">
                        <img src="../../static/image/start.png" v-if="startTime" style="width:30px;height:30px;"/>
                        <img src="../../static/image/stop.png" v-else style="width:30px;height:30px"/>
                    </div>
                </div> -->
                <div v-for="(item,index) in timeLineList" :key="index" style="flex:1;display:flex;flex-direction:column;">
                    <div style="flex:1;display:flex">
                        <div class="item"></div>
                            <div class="dot" @click="clicktime(item, index)" :class="{active: index === timeIndex}"></div>
                        <div class="item"></div>
                    </div>
                    <div class="item_bottom">
                        <span>{{timeLineList[index]}}</span>
                    </div>
                </div>
                <!-- <div style="flex:1;display:flex;flex-direction:column;">
                    <div style="flex:1;display:flex">
                        <div class="item"></div>
                        <div class="dot" @click="clicktime(item, timeLineList.length-1)" :class="{active: timeLineList.length-1 === timeIndex}"></div>
                        <div style="flex:1;"></div>
                    </div>
                    <div class="item_bottom">
                        <span>{{timeLineList[timeLineList.length-1]}}</span>
                    </div>
                </div> -->
            </div>
        </div>
        <!-- 当日志记录超过8个，可以左右滑动 -->
        <!-- <div class="container" :style="'width:'+ width" >
            <div style="display:flex;">
                <div style="flex:1;display:flex;flex-direction:column">
                    <div style="flex:1;display:flex;">
                        <div style="flex:1;"></div>
                        <div class="move-button el-icon-arrow-left" v-bind:class="{active: left_button_active}" :disabled="left_button_disabled" @click="moveLeft()">
                        </div>
                        <div class="item"></div>
                    </div>
                    <div class="item_bottom">
                        <span style="color:white;">左</span>
                    </div>
                </div>

                <div v-for="(item,index) in timeLineList" :key="index" style="flex:1;display:flex;flex-direction:column;">
                    <div style="flex:1;display:flex">
                        <div class="item"></div>
                        <div class="dot" @click="clicktime(item, index)" :class="{active: index === timeIndex}"></div>
                        <div class="item"></div>
                    </div>
                    <div class="item_bottom">
                        <span>{{timeLineList[index]}}</span>
                    </div>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;">
                    <div style="flex:1;display:flex">
                        <div class="item"></div>
                        <div class="move-button el-icon-arrow-right"
                            v-bind:class="{active: right_button_active}" :disabled="right_button_disabled" @click="moveRight()">
                        </div>
                        <div style="flex:1;"></div>
                    </div>
                    <div class="item_bottom">
                        <span style="color:white;">右</span>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
export default {
  name: 'timeLine',
  props: {
    timeLineList: {
      type: Array
    },
    pointend: {
      type: Number
    },
    width: {
      type: String
    }
  },
  data () {
    return {
      timeIndex: 0, // 默认当前选择的为最近的时间点
      point: 0, // 时间轴只展示6个,初始为最后6个
      point_end: 0,
      right_button_active: false,
      left_button_active: true,
      left_button_disabled: false,
      right_button_disabled: true,
      data: [],
      timer: null,
      startTime: true
    }
  },
  methods: {
    clicktime (item, index) {
      this.timeIndex = index
      console.log(item, index)
      this.$emit('clicktime', item)
    },
    refresh () {
      if (typeof (this.timeLineList) !== 'undefined') {
        if (this.timeIndex === this.timeLineList.length - 1) {
          this.timeIndex = 0
        } else {
          this.timeIndex = this.timeIndex + 1
        }
        this.$emit('clicktime', this.timeLineList[this.timeIndex])
      }
    },
    // changeActive (index) {
    // //   this.timeIndex = index
    // //   console.log('悬浮选择的时间点：', this.timeIndex)
    // },
    moveLeft () {
      if (this.point > 0) {
        this.point -= 1
        this.point_end -= 1
        this.timeIndex -= 1
        this.right_button_disabled = false
        this.right_button_active = true
        if (this.point === 0) {
          // 如果移到第一个时间点，设置左按钮不可点击
          this.left_button_disabled = true
          this.left_button_active = false
        }
      }
    },
    moveRight () {
      if (this.point_end < this.timeLineList.length - 1) {
        this.point += 1
        this.point_end += 1
        this.timeIndex += 1
        this.left_button_disabled = false
        this.left_button_active = true
        if (this.point_end === this.timeLineList.length - 1) {
          // 如果移到最后一个时间点，设置右按钮不可点击
          this.right_button_disabled = true
          this.right_button_active = false
        }
      }
    }
  },
  mounted () {
    this.point_end = this.pointend
    console.log(this.point_end)
    this.timer = setInterval(() => {
      this.refresh()
    }, 8000)
    this.$once('hook:beforeDestroy', () => {
      console.log(11)
      clearInterval(this.timer)
    })
    // console.log(this.timeLineList)
    // this.data = this.timeLineList
    // console.log(this.timeLineList)
    // if (typeof (this.timeLineList) !== 'undefined') {
    // //   this.timeLineList = this.data
    // //   this.timeIndex = this.timeLineList.length - 1
    // //   this.point = this.timeLineList.length - 7
    // //   this.point_end = this.timeLineList.length - 1
    // }
  }
}
</script>

<style scoped>
.container{
    /* width: 800px; */
    height: 30px;
    margin-left: 0px;
    padding-left: 0px;
    margin-bottom: 5px;
}
.dot{
    border:2px solid #DCDFE6;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    background: white;
    margin: 2px 0px;
    box-sizing: border-box;
}
.item{
    flex:1;
    border-bottom:1px solid #DCDFE6;
    margin-bottom: 9px;
    box-sizing: border-box;
}
.item_bottom{
    flex:1;
    text-align:center;
    height: 15px;
    margin-top:7px;
    font-size: 14px;
    color: #bddfff;
}
.move-button {
    border:2px solid #DCDFE6;
    width: 40px;
    height: 19px;
    border-radius: 19px;
    background: white;
    text-align: center;
    box-sizing: border-box;
}
.active{
    background-color: #fff !important;
    border: 3px solid #67C23A;
}

</style>

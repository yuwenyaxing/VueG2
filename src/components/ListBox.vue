<template>
  <div  class="main_list">
    <div class="container">
      <div v-for="(item,index) in listData" :key="index" >
        <div>
          <div class="dot" style="color:yellow" v-if="item==='煤炭开采和洗选业' || item==='化学原料和化学制品制造业' || item==='橡胶和塑料制品业' || item==='纺织业' || item==='通用设备制造业' || item==='汽车制造业'" @click="click(item, index)" :class="{active: index === currentIndex}">{{item}}</div>
          <div class="dot" v-else @click="click(item, index)" :class="{active: index === currentIndex}">{{item}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'listbox',
  props: {
    listData: {
      type: Array
    },
    width: {
      type: String
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    click (item, index) {
      this.currentIndex = index
      this.$emit('click', item)
    }
  }
}
</script>
<style scoped>
.main_list{
  background: url('../../static/image/listbox_bk.png')  no-repeat;
  padding:30px 0;
  width: 250px;
}
.container{
  margin-left: 30px;
  height: 900px;
  overflow:auto
}
.dot{
  width: 190px;
  background: transparent;
  box-sizing: border-box;
  color: white;
  line-height: 28px;
  font-size: 18px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  cursor: pointer;
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
  background-color: #5DA5FF !important;
}
</style>

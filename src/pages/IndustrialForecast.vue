<template>
  <div>
     <div id='CreateValueSpeed' class="stas">
       <p>临沂市规模以上工业增加值增速及预测</p>
       <label>单位（%）</label>
    </div>
    <div id='ElectricityCost' class="stas">
       <p>临沂市工业用电情况</p>
       <label>单位（亿千瓦时）</label>
    </div>
    <div id='TotalProfit' class="stas">
       <p>工业利润总额比上年增长</p>
       <label>单位（%）</label>
    </div>
    <div id='EnterprisesNum' class="stas">
       <p>临沂市规模以上工业企业单位数</p>
       <label>单位（个）</label>
    </div>
    <div id='EnterprisesLoss' class="stas">
       <p>临沂市规模以上工业企业亏损面</p>
       <label>单位（%）</label>
    </div>
    <div id='HiTech' class="stas">
       <p>高新技术产业产值占规模以上工业比重</p>
       <label>单位（%）</label>
    </div>
    <div id='IndustryProp' class="stas">
       <p>工业增加值行业占比</p>
    </div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      CreateValueSpeedData: [],
      ElectricityCostData: [],
      TotalProfitData: [],
      EnterprisesNumData: [],
      EnterprisesLossData: [],
      HiTechData: [],
      IndustryPropData: []
    }
  },
  methods: {
    setCreateValueSpeed () {
      let chart = new Chart({
        container: 'CreateValueSpeed',
        height: document.getElementById('CreateValueSpeed').clientHeight,
        width: document.getElementById('CreateValueSpeed').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 30]
      })
      chart.data(this.CreateValueSpeedData)
      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5
      })
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('type').shape('smooth')
      chart.point().position('year*value').color('type').shape('circle')
      chart.render()
    },
    setElectricityCost () {
      let chart = new Chart({
        container: 'ElectricityCost',
        height: document.getElementById('ElectricityCost').clientHeight,
        width: document.getElementById('ElectricityCost').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.ElectricityCostData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#00CED1').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setTotalProfit () {
      let chart = new Chart({
        container: 'TotalProfit',
        height: document.getElementById('TotalProfit').clientHeight,
        width: document.getElementById('TotalProfit').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 30]
      })
      chart.data(this.TotalProfitData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#FFFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setEnterprisesNum () {
      let chart = new Chart({
        container: 'EnterprisesNum',
        height: document.getElementById('EnterprisesNum').clientHeight,
        width: document.getElementById('EnterprisesNum').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.EnterprisesNumData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#FF8C00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setEnterprisesLoss () {
      let chart = new Chart({
        container: 'EnterprisesLoss',
        height: document.getElementById('EnterprisesLoss').clientHeight,
        width: document.getElementById('EnterprisesLoss').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.source(this.EnterprisesLossData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.area().position('year*value').color('l(96) 0:#24ff00 1:#000000').shape('smooth').tooltip(false)
      chart.line().position('year*value').size(2).color('#24ff00').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setHiTech () {
      let chart = new Chart({
        container: 'HiTech',
        height: document.getElementById('HiTech').clientHeight,
        width: document.getElementById('HiTech').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.source(this.HiTechData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').size(2).color('#9370DB').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setIndustryProp () {
      let chart = new Chart({
        container: 'IndustryProp',
        height: document.getElementById('IndustryProp').clientHeight,
        width: document.getElementById('IndustryProp').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.IndustryPropData)
      chart.legend('type', false)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      // this.changeChartAxisForeground(chart, 'year', 'value')
      chart.coordinate('theta', {radius: 0.75, innerRadius: 0.6})
      chart.interval().adjust('stack').position('value').color('type').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.type}: ${value}%`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('type*value', (type, value) => {
        value = value + '%'
        return {
          name: type,
          value: value
        }
      })
      chart.interaction('element-active')
      chart.render()
    }
  },
  mounted () {
    this.axios.get('/industry/forecast/data').then(res => {
      this.CreateValueSpeedData = res.data.data.filter(x => x.part === '0')
      this.ElectricityCostData = res.data.data.filter(x => x.part === '1')
      this.TotalProfitData = res.data.data.filter(x => x.part === '4')
      this.EnterprisesNumData = res.data.data.filter(x => x.part === '2')
      this.EnterprisesLossData = res.data.data.filter(x => x.part === '3')
      this.HiTechData = res.data.data.filter(x => x.part === '5')
      this.IndustryPropData = utils.sortByKey(res.data.data.filter(x => x.part === '6'), 'value').slice(0, 10)
      // console.log(this.IndustryPropData,utils.sortByKey(this.IndustryPropData, 'value').slice(0,3))
      this.setCreateValueSpeed()
      this.setElectricityCost()
      this.setTotalProfit()
      this.setEnterprisesNum()
      this.setEnterprisesLoss()
      this.setHiTech()
      this.setIndustryProp()
    })
  }
}
</script>
<style scoped>
#CreateValueSpeed{
  height: 473px;
  width: 890px;
  left:20px;
  top:99px;
}
#ElectricityCost{
  height: 468px;
  width: 445px;
  left:20px;
  top:580px;
}
#TotalProfit{
  height: 468px;
  width: 440px;
  left:470px;
  top:580px;
}
#EnterprisesNum{
  height: 473px;
  width: 500px;
  left:917px;
  top:99px;
}
#EnterprisesLoss{
  height: 468px;
  width: 500px;
  left:917px;
  top:580px;
}
#HiTech{
  height: 473px;
  width: 480px;
  left:1425px;
  top:99px;
}
#IndustryProp{
  height: 468px;
  width: 480px;
  left:1425px;
  top:580px;
}
</style>

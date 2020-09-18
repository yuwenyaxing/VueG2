export const changeChartAxisForeground = (chart, x, y) => {
  chart.axis(x, {
    label: {
      style: {
        fill: '#bddfff'
      }
    }
  })
  chart.axis(y, {
    label: {
      style: {
        fill: '#bddfff'
      }
    }
  })
}
// 从大到小排序
export const sortByKey = (ary, key) => {
  return ary.sort(function (a, b) {
    let x = a[key]
    let y = b[key]
    return ((x > y) ? -1 : (x < y) ? 1 : 0)
  })
}
// 从小到大排序
export const sortFromSmallToLargeByKey = (ary, key) => {
  return ary.sort(function (a, b) {
    let x = a[key]
    let y = b[key]
    return ((x < y) ? -1 : (x > y) ? 1 : 0)
  })
}

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
export const sortByKey = (ary, key) => {
  return ary.sort(function (a, b) {
    let x = a[key]
    let y = b[key]
    return ((x > y) ? -1 : (x < y) ? 1 : 0)
  })
}

/*
 * Draw timeline graph
 */
$(function() {
  $('.timeline .chart').highcharts({
    chart: {
      backgroundColor: 'transparent',
      zoomType: 'xy',
      spacing: 0,
      spacingTop: 6,
      spacingBottom: 2, /* or J's get cut-off */
      style: {
        fontFamily: 'Open Sans'
      },
      resetZoomButton: {
        theme: {
          fill: '#AAAAAA',
          stroke: undefined,
          style: {
            textTransform: 'uppercase'
          },
          r: 2,
          states: {
            hover: {
              fill: '#AAAAAA',
              stroke: undefined,
              style: {
                color: 'white'
              }
            }
          }
        }
      }
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    title: {
      text: ''
    },
    xAxis: [{
      categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      tickLength: 0,
      labels: {
        style: {
          color: '#AAAAAA',
          fontSize: '12px',
          textTransform: 'uppercase'
        }
      },
      lineWidth: 0
    }],
    yAxis: [{ // Primary yAxis
      title: {
        text: ''
      },
      labels: {
        enabled: false
      },
      gridLineWidth: 0,
      ceiling: 100
    }, { // Secondary yAxis
      title: {
        text: ''
      },
      labels: {
        enabled: false
      },
      gridLineWidth: 0
    }],
    tooltip: {
      shared: true,
      style: {
        color: '#EBEBEB'
      },
      backgroundColor: '#222222',
      headerFormat: '<p style="text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">{point.key}</p>',
      pointFormat: '<div style="margin-bottom: 2px;"><span style="background:{point.color}; margin-right: 5px; display: inline-block; height: 11px; width: 12px;"></span> {series.name}: <b>{point.y}</b></div>',
      useHTML: true
    },
    legend: {
      enabled: false,
      floating: true,
      align: 'left',
      verticalAlign: 'top',
      layout: 'vertical',
      itemStyle: {
        'color': '#AAAAAA',
        'fontWeight': 'normal',
        'textTransform': 'uppercase'
      }
    },
    series: [{
      name: 'Submitted translations',
      type: 'column',
      color: '#4D5967',
      borderColor: 'transparent',
      yAxis: 1,
      pointWidth: 38,
      data: [491, 711, 331, 151, 101, 761, 1351, 1481, 2161, 1941, 951, 541]
    }, {
      name: 'Completeness',
      type: 'area',
      color: '#7BC876',
      fillOpacity: 0.1,
      dashStyle: 'Solid',
      lineWidth: 3,
      marker: {
        fillColor: '#333941',
        lineColor: '#7BC876',
        lineWidth: 3,
        radius: 4
      },
      tooltip: {
        valueSuffix: ' %'
      },
      data: [49, 58, 73, 69, 61, 46, 46, 51, 59, 75, 90, 96]
    }]
  });
});

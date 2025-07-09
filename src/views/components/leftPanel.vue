<template>
  <div class="left-panel-container">
    <!-- 健康监测概况 -->
    <div class="chart-item">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-icon">*</span>
          <span>健康监测概况</span>
        </div>
      </div>
      <div class="chart-content">
        <div class="ring-chart" ref="healthRingChart"></div>
      </div>
    </div>

    <!-- 背包物资状态 -->
    <div class="chart-item">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-icon">*</span>
          <span>背包物资状态</span>
        </div>
      </div>
      <div class="chart-content">
        <div class="bar-chart" ref="supplyBarChart"></div>
      </div>
    </div>

    <!-- 异常健康事件统计 -->
    <div class="chart-item">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-icon">*</span>
          <span>异常健康事件统计</span>
        </div>
      </div>
      <div class="chart-content">
        <div class="horizontal-bar-chart" ref="eventBarChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 使用全局的echarts实例
export default {
  name: 'LeftPanel',
  data() {
    return {
      healthChart: null,
      supplyBarChart: null,
      eventBarChart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.healthChart && this.healthChart.dispose()
    this.supplyBarChart && this.supplyBarChart.dispose()
    this.eventBarChart && this.eventBarChart.dispose()
  },
  methods: {
    initCharts() {
      setTimeout(() => {
        this.initHealthChart()
        this.initSupplyChart()
        this.initEventChart()
      }, 200)
    },
    handleResize() {
      this.healthChart && this.healthChart.resize()
      this.supplyBarChart && this.supplyBarChart.resize()
      this.eventBarChart && this.eventBarChart.resize()
    },
    initHealthChart() {
      if (this.$refs.healthRingChart) {
        this.healthChart = this.$echarts.init(this.$refs.healthRingChart)
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          color: ['#1DFFC0', '#83F8FF', '#FF45A5'],
          legend: {
            show: false
          },
          series: [
            {
              name: '健康状态分布',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: '#041B43',
                borderWidth: 2
              },
              label: {
                show: true,
                position: 'outside',
                formatter: '{b} {c} ({d}%)',
                color: '#ffffff',
                fontSize: 13,
                lineHeight: 18
              },
              labelLine: {
                show: true,
                length: 15,
                length2: 10,
                lineStyle: {
                  color: '#ffffff',
                  width: 1
                }
              },
              data: [
                { value: 3, name: '健康' },
                { value: 2, name: '正常' },
                { value: 2, name: '异常' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        this.healthChart.setOption(option)
      }
    },
    initSupplyChart() {
      if (this.$refs.supplyBarChart) {
        this.supplyBarChart = this.$echarts.init(this.$refs.supplyBarChart)
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['药品', '食品', '水', '电池', '雷达', '帐篷', '通信器', '医疗包', '工具箱'],
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 13
            }
          },
          yAxis: {
            type: 'value',
            max: 15,
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            axisLabel: {
              color: '#ffffff'
            }
          },
          series: [
            {
              data: [12, 8, 15, 3, 6, 9, 7, 11, 5],
              type: 'bar',
              barWidth: '16px',
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(88,167,255,0.8)' },
                  { offset: 0.5, color: 'rgba(25,102,198,0.75)' },
                  { offset: 1, color: 'rgba(6,45,110,0.64)' }
                ])
              },
              label: {
                show: true,
                position: 'top',
                color: '#ffffff'
              }
            }
          ]
        }
        this.supplyBarChart.setOption(option)
      }
    },
    initEventChart() {
      if (this.$refs.eventBarChart) {
        this.eventBarChart = this.$echarts.init(this.$refs.eventBarChart)
        
        // Calculate total from data
        const data = [
          { value: 2, name: 'A区' },
          { value: 3, name: 'B区' },
          { value: 4, name: 'C区' },
          { value: 3, name: 'D区' }
        ];
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}例'
          },
          color: ['#FF6B86', '#FFA27E', '#FFDC56', '#83F8FF'],
          legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 10,
            textStyle: {
              color: '#fff',
              fontSize: 13
            },
            formatter: '{name} {c}例',
            itemWidth: 15,
            itemHeight: 10
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: '#041B43',
                borderWidth: 2
              },
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 14,
                  color: '#fff',
                  formatter: '{b}: {c}例'
                }
              },
              data: data
            },
            {
              type: 'pie',
              radius: ['0%', '40%'],
              center: ['40%', '50%'],
              label: {
                position: 'center',
                show: true,
                formatter: function() {
                  return '{totalSize|' + total + '}\n{totalName|事件总计}';
                },
                rich: {
                  totalSize: {
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#1DFFC0'
                  },
                  totalName: {
                    fontSize: 14,
                    color: '#FFFFFF',
                    padding: [5, 0]
                  }
                }
              },
              data: [
                {
                  value: 1,
                  name: '总计',
                  itemStyle: {
                    color: 'rgba(4, 27, 67, 0.8)'
                  }
                }
              ],
              z: 1
            }
          ]
        }
        
        this.eventBarChart.setOption(option)
      }
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/leftPanel.scss';
</style> 
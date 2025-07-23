<template>
  <div class="right-panel-container">
    <!-- 任务动态跟踪 -->
    <div class="chart-item">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-icon">*</span>
          <span>任务动态跟踪</span>
        </div>
      </div>
      <div class="chart-content">
        <div class="bar-chart" ref="taskBarChart"></div>
      </div>
    </div>

    <!-- 队员生命体征 -->
    <div class="chart-item">
      <div class="chart-header vital-signs-header">
        <div class="chart-title">
          <span class="title-icon">*</span>
          <span>队员生命体征</span>
        </div>
        <div class="header-controls">
          <div class="personnel-select" @click.stop>
            <div class="selector-text" @click="togglePersonnelSelector">
              <span>{{ selectedPersonnelName }}</span>
              <span class="arrow-icon" :class="{ 'arrow-up': showPersonnelSelector }"></span>
            </div>
            <div class="selector-dropdown" v-show="showPersonnelSelector">
              <div class="dropdown-item" 
                   v-for="person in personnelList" 
                   :key="person.id"
                   :class="{ active: selectedPersonnel === person.id }"
                   @click="selectPersonnel(person)">
                {{ person.name }}
              </div>
            </div>
          </div>
          <div class="details-link" @click="showVitalSignsModal = true">详情</div>
        </div>
      </div>
      <div class="chart-content">
        <div class="line-chart" ref="vitalSignsChart">
          <div class="vital-indicator">
            <div class="indicator-item heart-rate">
              <div class="indicator-value">{{ personnelVitalData[selectedPersonnel].heartRate.current }}</div>
              <div class="indicator-label">心率</div>
            </div>
            <div class="indicator-item oxygen">
              <div class="indicator-value">{{ personnelVitalData[selectedPersonnel].oxygen.current }}%</div>
              <div class="indicator-label">血氧</div>
            </div>
            <div class="indicator-item temperature">
              <div class="indicator-value">{{ personnelVitalData[selectedPersonnel].temperature.current }}°C</div>
              <div class="indicator-label">体温</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源调度统计 -->
    <div class="chart-item">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-icon">*</span>
          <span>资源调度统计</span>
        </div>
      </div>
      <div class="chart-content">
        <div class="legend-info">
          <div class="legend-item">
            <span class="legend-color orange"></span>
            <span>物资调拨</span>
          </div>
          <div class="legend-item">
            <span class="legend-color blue"></span>
            <span>健康事件</span>
          </div>
        </div>
        <div class="mixed-chart" ref="resourceChart"></div>
      </div>
    </div>
    
    <VitalSignsModal 
      :visible="showVitalSignsModal" 
      :personnel-data="detailedPersonnelData" 
      @close="showVitalSignsModal = false" 
    />
  </div>
</template>

<script>
import VitalSignsModal from '@/components/VitalSignsModal.vue';


export default {
  name: 'RightPanel',
  components: {
    VitalSignsModal
  },
  data() {
    return {
      taskBarChart: null,
      vitalSignsChart: null,
      resourceChart: null,
      showVitalSignsModal: false,
      showPersonnelSelector: false,
      taskData: [68, 62, 46, 32, 63],
      selectedPersonnel: 1,
      personnelList: [
        { id: 1, name: '张队长' },
        { id: 2, name: '李医生' },
        { id: 3, name: '王工程师' },
        { id: 4, name: '赵技术员' }
      ],
      personnelVitalData: {
        1: {
          heartRate: { current: 78, data: [78, 82, 90, 84, 77, 81, 88] },
          oxygen: { current: 99, data: [99, 98, 97, 98, 99, 98, 97] },
          temperature: { current: 36.5, data: [36.5, 36.6, 36.4, 36.5, 36.8, 36.7, 36.5] }
        },
        2: {
          heartRate: { current: 75, data: [75, 73, 76, 74, 71, 72, 75] },
          oxygen: { current: 98, data: [98, 98, 99, 97, 98, 99, 98] },
          temperature: { current: 36.2, data: [36.2, 36.3, 36.1, 36.2, 36.0, 36.3, 36.2] }
        },
        3: {
          heartRate: { current: 82, data: [82, 85, 83, 87, 86, 84, 82] },
          oxygen: { current: 97, data: [97, 96, 97, 95, 96, 97, 97] },
          temperature: { current: 36.7, data: [36.7, 36.8, 36.9, 37.0, 36.9, 36.8, 36.7] }
        },
        4: {
          heartRate: { current: 70, data: [70, 72, 71, 69, 68, 70, 71] },
          oxygen: { current: 99, data: [99, 99, 98, 99, 99, 98, 99] },
          temperature: { current: 36.4, data: [36.4, 36.3, 36.5, 36.4, 36.2, 36.3, 36.4] }
        }
      }
    }
  },
  computed: {
    detailedPersonnelData() {
      // 构建完整的人员生命体征数据供表格展示
      const currentTime = new Date().toLocaleTimeString();
      return this.personnelList.map(person => {
        const vitalData = this.personnelVitalData[person.id];
        const heartRate = vitalData.heartRate.current;
        const oxygen = vitalData.oxygen.current;
        const temperature = vitalData.temperature.current;
        
        // 判断生命体征是否正常
        const isHeartRateNormal = heartRate >= 60 && heartRate <= 100;
        const isOxygenNormal = oxygen >= 95;
        const isTempNormal = temperature >= 36 && temperature <= 37.3;
        const status = (isHeartRateNormal && isOxygenNormal && isTempNormal) ? '正常' : '异常';
        
        return {
          id: person.id,
          name: person.name,
          heartRate: heartRate,
          oxygen: oxygen,
          temperature: temperature,
          status: status,
          updateTime: currentTime
        };
      });
    },
    selectedPersonnelName() {
      const person = this.personnelList.find(p => p.id === this.selectedPersonnel);
      return person ? person.name : '';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.taskBarChart && this.taskBarChart.dispose()
    this.vitalSignsChart && this.vitalSignsChart.dispose()
    this.resourceChart && this.resourceChart.dispose()
  },
  methods: {
    initCharts() {
      setTimeout(() => {
        this.initTaskBarChart()
        this.initVitalSignsChart()
        this.initResourceChart()
      }, 200)
    },
    handleResize() {
      this.taskBarChart && this.taskBarChart.resize()
      this.vitalSignsChart && this.vitalSignsChart.resize()
      this.resourceChart && this.resourceChart.resize()
    },
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        setTimeout(() => {
          this.taskBarChart && this.taskBarChart.resize()
          this.vitalSignsChart && this.vitalSignsChart.resize()
          this.resourceChart && this.resourceChart.resize()
        }, 200)
      }
    },
    initTaskBarChart() {
      if (this.$refs.taskBarChart) {
        this.taskBarChart = this.$echarts.init(this.$refs.taskBarChart)
        const option = {
          backgroundColor: 'transparent',
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function(params) {
              return `${params[0].name}<br/>完成率: ${params[0].value}%`;
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '12%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['物资补给', '健康巡查', '紧急任务', '特急任务', '物资配送'],
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 12,
              margin: 15,
              rotate: 0,
              interval: 0,
              formatter: function(value) {
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + value.substring(4);
                }
                return value;
              }
            }
          },
          yAxis: {
            type: 'value',
            max: 100,
            min: 0,
            interval: 20,
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              color: '#ffffff',
              formatter: '{value}%',
              fontSize: 12
            }
          },
          series: [
            {
              data: this.taskData,
              type: 'custom',
              name: '完成率',
              emphasis: {
                focus: 'series',
                label: {
                  show: true
                },
                itemStyle: {
                  opacity: 1
                }
              },
              renderItem: (params, api) => {
                const value = api.value(1);
                const categoryIndex = api.value(0);
                
                // Calculate the coordinates for the base point of triangle
                const basePoint = api.coord([categoryIndex, 0]);
                const topPoint = api.coord([categoryIndex, value]);
                
                // Dimensions for triangle
                const width = 40;
                
                return {
                  type: 'group',
                  children: [
                    // Triangle
                    {
                      type: 'path',
                      shape: {
                        pathData: `M${basePoint[0] - width/2},${basePoint[1]} L${basePoint[0] + width/2},${basePoint[1]} L${basePoint[0]},${topPoint[1]} Z`
                      },
                      style: {
                        fill: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: '#00FCFF' },
                          { offset: 1, color: '#2E9EF5' }
                        ]),
                        opacity: 0.8,
                        shadowColor: 'rgba(0, 252, 255, 0.5)',
                        shadowBlur: 10
                      },
                      emphasis: {
                        style: {
                          opacity: 1,
                          shadowBlur: 20,
                          shadowColor: 'rgba(0, 252, 255, 0.8)'
                        }
                      }
                    },
                    // Percentage text - only display when not hovering
                    {
                      type: 'text',
                      style: {
                        text: value + '%',
                        textAlign: 'center',
                        textVerticalAlign: 'bottom',
                        x: basePoint[0],
                        y: topPoint[1] - 5,
                        fill: '#ffffff',
                        fontSize: 14,
                        fontWeight: 'bold'
                      },
                      emphasis: {
                        style: {
                          fontSize: 16,
                          fontWeight: 'bolder',
                          fill: '#FFFFFF'
                        }
                      }
                    }
                  ]
                };
              },
              z: 10
            }
          ]
        }
        this.taskBarChart.setOption(option)
      }
    },
    initVitalSignsChart() {
      if (this.$refs.vitalSignsChart) {
        this.vitalSignsChart = this.$echarts.init(this.$refs.vitalSignsChart)
        const personnelData = this.personnelVitalData[this.selectedPersonnel]
        
        const option = {
          backgroundColor: 'transparent',
          grid: {
            top: 50,
            left: 40,
            right: 40,
            bottom: 20
          },
          legend: {
            data: ['心率', '血氧', '体温'],
            top: 10,
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            itemWidth: 15,
            itemHeight: 10,
            icon: 'rect'
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,19,52,0.8)',
            borderColor: 'rgba(0,209,255,0.3)',
            textStyle: {
              color: '#fff'
            },
            formatter: function(params) {
              let result = `${params[0].name}<br/>`;
              params.forEach(param => {
                let marker = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>`;
                let value = param.value;
                let unit = param.seriesName === '体温' ? '°C' : (param.seriesName === '血氧' ? '%' : 'bpm');
                result += `${marker} ${param.seriesName}: ${value}${unit}<br/>`;
              });
              return result;
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            axisLabel: {
              color: '#ffffff',
              fontSize: 10
            }
          },
          yAxis: [
            {
              name: '心率/血氧',
              nameTextStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10,
                padding: [0, 0, 0, 10]
              },
              type: 'value',
              min: 60,
              max: 140,
              splitLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              },
              axisLabel: {
                color: '#ffffff',
                fontSize: 10
              }
            },
            {
              name: '体温(°C)',
              nameTextStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10,
                padding: [0, 10, 0, 0]
              },
              type: 'value',
              min: 35,
              max: 40,
              position: 'right',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              },
              axisLabel: {
                color: '#ffffff',
                fontSize: 10,
                formatter: '{value}°C'
              }
            }
          ],
          series: [
            {
              name: '心率',
              type: 'line',
              data: personnelData.heartRate.data,
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 6,
              lineStyle: {
                color: '#42a5f5',
                width: 2
              },
              itemStyle: {
                color: '#42a5f5',
                borderColor: '#ffffff',
                borderWidth: 1
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(66, 165, 245, 0.4)' },
                  { offset: 1, color: 'rgba(66, 165, 245, 0.1)' }
                ])
              },
              emphasis: {
                itemStyle: {
                  borderWidth: 2,
                  shadowColor: 'rgba(66, 165, 245, 0.8)',
                  shadowBlur: 10
                }
              }
            },
            {
              name: '血氧',
              type: 'line',
              data: personnelData.oxygen.data,
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 6,
              lineStyle: {
                color: '#ff7043',
                width: 2
              },
              itemStyle: {
                color: '#ff7043',
                borderColor: '#ffffff',
                borderWidth: 1
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(255, 112, 67, 0.4)' },
                  { offset: 1, color: 'rgba(255, 112, 67, 0.1)' }
                ])
              },
              emphasis: {
                itemStyle: {
                  borderWidth: 2,
                  shadowColor: 'rgba(255, 112, 67, 0.8)',
                  shadowBlur: 10
                }
              }
            },
            {
              name: '体温',
              yAxisIndex: 1,
              type: 'line',
              data: personnelData.temperature.data,
              smooth: true,
              symbol: 'emptyCircle',
              symbolSize: 6,
              lineStyle: {
                color: '#ffca28',
                width: 2
              },
              itemStyle: {
                color: '#ffca28',
                borderColor: '#ffffff',
                borderWidth: 1
              },
              emphasis: {
                itemStyle: {
                  borderWidth: 2,
                  shadowColor: 'rgba(255, 202, 40, 0.8)',
                  shadowBlur: 10
                }
              }
            }
          ]
        }
        this.vitalSignsChart.setOption(option)
      }
    },
    initResourceChart() {
      if (this.$refs.resourceChart) {
        this.resourceChart = this.$echarts.init(this.$refs.resourceChart)
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
            data: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'],
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
            max: 20,
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
              name: '物资调拨',
              type: 'line',
              data: [5, 8, 12, 15, 18, 16, 13],
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#ff6d00', // orange
                borderColor: '#fff',
                borderWidth: 1,
                shadowColor: 'rgba(255, 109, 0, 0.8)',
                shadowBlur: 10
              },
              lineStyle: {
                color: '#ff6d00',
                width: 3,
                shadowColor: 'rgba(255, 109, 0, 0.5)',
                shadowBlur: 10
              },
              // no areaStyle
            },
            {
              name: '健康事件',
              type: 'bar',
              data: [3, 2, 6, 4, 7, 5, 8],
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
        this.resourceChart.setOption(option)
      }
    },
    togglePersonnelSelector() {
      this.showPersonnelSelector = !this.showPersonnelSelector;
    },
    selectPersonnel(person) {
      this.selectedPersonnel = person.id;
      this.showPersonnelSelector = false;
      this.handlePersonnelChange();
    },
    handlePersonnelChange() {
      this.updateVitalSignsChart()
    },
    updateVitalSignsChart() {
      if (this.vitalSignsChart && this.selectedPersonnel) {
        const personnelData = this.personnelVitalData[this.selectedPersonnel]
        
        const option = this.vitalSignsChart.getOption()
        
        // Update series data
        option.series[0].data = personnelData.heartRate.data
        option.series[1].data = personnelData.oxygen.data
        option.series[2].data = personnelData.temperature.data
        
        this.vitalSignsChart.setOption(option)
      }
    },
    handleOutsideClick(event) {
      const selector = this.$el.querySelector('.personnel-select');
      if (selector && !selector.contains(event.target)) {
        this.showPersonnelSelector = false;
      }
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/rightPanel.scss';
</style> 
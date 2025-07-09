<template>
  <div class="panel-content">
    <div class="map-controls">
      <div class="area-tabs">
        <div class="tab">辖区</div>
        <div class="selector-text" @click="toggleSelector">
          {{ currentAreaText }}
          <span class="arrow-icon" :class="{ 'arrow-up': showSelector }">▲</span>
        </div>
      </div>
      <div class="selector-dropdown" v-show="showSelector">
        <div class="dropdown-content">
          <!-- 省级 -->
          <div class="dropdown-column">
            <div class="dropdown-item" 
                 v-for="province in provinces" 
                 :key="province.value"
                 :class="{ active: selectedProvince === province.value }"
                 @click="selectProvince(province)">
              <span class="radio-circle" :class="{ selected: selectedProvince === province.value }"></span>
              <span>{{ province.label }}</span>
              <span class="arrow" v-if="province.hasChildren">></span>
            </div>
          </div>
          
          <!-- 市级 -->
          <div class="dropdown-column" v-if="cities.length > 0">
            <div class="dropdown-item" 
                 v-for="city in cities" 
                 :key="city.value"
                 :class="{ active: selectedCity === city.value }"
                 @click="selectCity(city)">
              <span class="radio-circle" :class="{ selected: selectedCity === city.value }"></span>
              <span>{{ city.label }}</span>
              <span class="arrow" v-if="city.hasChildren">></span>
            </div>
          </div>
          
          <!-- 区县级 -->
          <div class="dropdown-column" v-if="districts.length > 0">
            <div class="dropdown-item" 
                 v-for="district in districts" 
                 :key="district.value"
                 :class="{ active: selectedDistrict === district.value }"
                 @click="selectDistrict(district)">
              <span class="radio-circle" :class="{ selected: selectedDistrict === district.value }"></span>
              <span>{{ district.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="map-container" class="map-container"></div>
    
    <!-- 添加右下角图例 -->
    <div class="legend-container">
      <div class="legend-item">
        <div class="legend-icon">
          <div class="icon-circle" style="background-color: #3b97f7;"></div>
        </div>
        <div class="legend-text">应急人员</div>
      </div>
    </div>
    
    <img src="@/assets/map-bg-02.png" class="bottom-bg-02" alt="">
    <img src="@/assets/map-bg-03.png" class="bottom-bg-03" alt="">
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'CenterPanel',
  data() {
    return {
      chart: null,
      showSelector: false,
      selectedProvince: 'zhejiang',
      selectedCity: '',
      selectedDistrict: '',
      currentAreaText: '请选择区域',
      mapLoaded: false,
      // 省级数据
      provinces: [
        { label: '浙江省', value: 'zhejiang', hasChildren: true }
      ],
      // 市级数据
      cities: [
        { label: '杭州市', value: 'hangzhou', hasChildren: true },
        { label: '宁波市', value: 'ningbo', hasChildren: true },
        { label: '温州市', value: 'wenzhou', hasChildren: true },
        { label: '嘉兴市', value: 'jiaxing', hasChildren: true },
        { label: '湖州市', value: 'huzhou', hasChildren: true },
        { label: '绍兴市', value: 'shaoxing', hasChildren: true },
        { label: '金华市', value: 'jinhua', hasChildren: true },
        { label: '衢州市', value: 'quzhou', hasChildren: true },
        { label: '舟山市', value: 'zhoushan', hasChildren: true },
        { label: '台州市', value: 'taizhou', hasChildren: true },
        { label: '丽水市', value: 'lishui', hasChildren: true },
        { label: '舟山群岛新区', value: 'zsd', hasChildren: true }
      ],
      // 区县数据
      districts: [],
      // 地图配置
      mapConfig: {
        zhejiang: {
          code: '330000',
          name: '浙江省'
        }
      }
    }
  },
  mounted() {
    this.initMap();
    // 点击地图外区域关闭选择器
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    async initMap() {
      // 确保DOM已经渲染
      await this.$nextTick();
      
      // 初始化echarts实例
      this.chart = echarts.init(document.getElementById('map-container'));
      
      // 加载浙江省地图数据
      await this.loadMapData('zhejiang', '330000');
      
      // 渲染地图
      this.renderMap('zhejiang');
    },
    async loadMapData(mapName, mapCode) {
      if (echarts.getMap(mapName)) return true;
      
      try {
        // 根据参数决定是否加载完整数据
        const isFull = mapName === 'zhejiang' || this.cities.some(c => c.value === mapName);
        console.log(`正在加载地图数据: ${mapName}, 编码: ${mapCode}`);
        const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${mapCode}${isFull ? '_full' : ''}.json`);
        const geoJson = await response.json();
        echarts.registerMap(mapName, geoJson);
        console.log(`地图数据加载成功: ${mapName}`);
        return true;
      } catch (error) {
        console.error(`加载${mapName}地图数据失败:`, error);
        return false;
      }
    },
    renderMap(mapName) {
      if (!this.chart) return;
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            // 为应急人员显示详细信息
            if (params.seriesName === '应急人员') {
              const data = params.data;
              // 模拟健康数据
              const heartRate = Math.floor(Math.random() * 30) + 60; // 60-90之间
              const oxygen = Math.floor(Math.random() * 5) + 95; // 95-99之间
              const temp = (Math.random() * 1 + 36.3).toFixed(1); // 36.3-37.3之间
              
              return `<div style="padding: 8px; min-width: 150px;">
                <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px; text-align: center; color: #fff;">${data.name}</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0aec0;">心率:</span>
                  <span style="color: ${heartRate > 85 ? '#ff4d4f' : '#52c41a'}; font-weight: bold;">${heartRate} 次/分</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="color: #a0aec0;">血氧:</span>
                  <span style="color: ${oxygen < 96 ? '#ff4d4f' : '#52c41a'}; font-weight: bold; text-align: right;">${oxygen}%</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #a0aec0;">体温:</span>
                  <span style="color: ${temp > 37 ? '#ff4d4f' : '#52c41a'}; font-weight: bold; text-align: right;">${temp}°C</span>
                </div>
              </div>`;
            } else {
              return params.name;
            }
          },
          backgroundColor: 'rgba(0, 26, 66, 0.9)',
          borderColor: '#3b97f7',
          borderWidth: 2,
          padding: [10, 15],
          extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); border-radius: 4px;',
          textStyle: {
            color: '#fff',
            fontSize: 13
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 100,
          inRange: {
            color: ['#0a2552', '#0d2d5e', '#10345a', '#133b66']
          }
        },
        geo: {
          map: mapName,
          roam: 'scale',
          zoom: 1.2,
          label: {
            show: true,
            color: '#fff',
            fontSize: 12
          },
          itemStyle: {
            areaColor: '#0a2552',
            borderColor: '#2a5a82',
            borderWidth: 1,
            shadowColor: 'rgba(42, 90, 130, 0.3)',
            shadowBlur: 5
          },
          emphasis: {
            label: {
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              areaColor: '#e6c700'
            }
          }
        },
        series: [
          {
            name: this.getAreaNameByCode(mapName),
            type: 'map',
            geoIndex: 0,
            data: this.getMapData(mapName)
          },
          // 添加应急人员标记 - 修改为effectScatter以增强可见性
          {
            name: '应急人员',
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 20,
            label: {
              show: false // 不显示标签
            },
            symbol: 'circle',
            symbolSize: 18,
            showEffectOn: 'none',
            itemStyle: {
              color: '#ffffff',
              borderColor: '#3b97f7',
              borderWidth: 3,
              opacity: 1,
              shadowBlur: 15,
              shadowColor: '#3b97f7'
            },
            emphasis: {
              scale: 1.2,
              itemStyle: {
                color: '#ffffff',
                borderColor: '#3b97f7',
                borderWidth: 3,
                shadowBlur: 20,
                shadowColor: '#3b97f7'
              }
            },
            data: this.getEmergencyPersonnelData(mapName)
          }
        ]
      };
      
      this.chart.setOption(option, true);
      
      // 监听窗口大小变化，重新调整地图大小
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize();
      });
    },
    getMapData(mapName) {
      // 根据地图类型返回不同的数据
      const baseValue = 50;
      
      if (mapName === 'zhejiang') {
        // 浙江省各市数据
        return [
          { name: '杭州市', value: baseValue + Math.random() * 50 },
          { name: '宁波市', value: baseValue + Math.random() * 50 },
          { name: '温州市', value: baseValue + Math.random() * 50 },
          { name: '嘉兴市', value: baseValue + Math.random() * 50 },
          { name: '湖州市', value: baseValue + Math.random() * 50 },
          { name: '绍兴市', value: baseValue + Math.random() * 50, itemStyle: { areaColor: '#e6c700' } },
          { name: '金华市', value: baseValue + Math.random() * 50 },
          { name: '衢州市', value: baseValue + Math.random() * 50 },
          { name: '舟山市', value: baseValue + Math.random() * 50 },
          { name: '台州市', value: baseValue + Math.random() * 50 },
          { name: '丽水市', value: baseValue + Math.random() * 50 }
        ];
      } else if (this.selectedDistrict || this.selectedCity) {
        // 区县级或城市级地图数据 - 为所有子区域提供数据
        // 动态从地图数据中提取区域名称
        const registeredMap = echarts.getMap(mapName);
        if (registeredMap && registeredMap.geoJson) {
          const features = registeredMap.geoJson.features || [];
          return features.map(feature => {
            const name = feature.properties.name;
            return {
              name: name,
              value: baseValue + Math.random() * 50,
              itemStyle: {
                areaColor: '#0a2552'
              }
            };
          });
        }
        return [];
      } else {
        return [];
      }
    },
    // 切换选择器显示状态
    toggleSelector(event) {
      event.stopPropagation();
      this.showSelector = !this.showSelector;
    },
    // 选择省份
    selectProvince(province) {
      this.selectedProvince = province.value;
      this.selectedCity = '';
      this.selectedDistrict = '';
      this.districts = [];
      this.currentAreaText = province.label;
      
      // 加载城市列表
      this.loadCities();
      
      // 渲染省级地图
      this.renderMap('zhejiang');
    },
    // 选择城市
    async selectCity(city) {
      this.selectedCity = city.value;
      this.selectedDistrict = '';
      this.currentAreaText = city.label;
      
      // 加载该城市的区县数据
      this.loadDistricts(city.value);
      
      // 加载并渲染城市地图
      const cityCode = this.getCityCode(city.value);
      if (cityCode) {
        await this.loadMapData(city.value, cityCode);
        this.renderMap(city.value);
      }
    },
    // 选择区县
    async selectDistrict(district) {
      this.selectedDistrict = district.value;
      this.currentAreaText = district.label;
      // this.showSelector = false; // 注释掉这行，不关闭下拉框
      
      // 加载并渲染区县地图
      const districtCode = this.getDistrictCode(district.value);
      if (districtCode) {
        await this.loadMapData(district.value, districtCode);
        this.renderMap(district.value);
      }
    },
    // 加载城市列表
    loadCities() {
      // 已在data中预设
    },
    // 加载区县数据
    async loadDistricts(cityValue) {
      const cityCode = this.getCityCode(cityValue);
      if (!cityCode) {
        this.districts = [];
        return;
      }
      try {
        const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${cityCode}_full.json`);
        const geoJson = await response.json();
        if (geoJson.features) {
          this.districts = geoJson.features.map(feature => ({
            label: feature.properties.name,
            value: feature.properties.adcode.toString()
          }));
        } else {
          this.districts = [];
        }
      } catch (error) {
        console.error(`加载${cityValue}的区县数据失败:`, error);
        this.districts = [];
      }
    },
    // 获取城市编码
    getCityCode(cityValue) {
      const cityCodeMap = {
        'hangzhou': '330100',
        'ningbo': '330200',
        'wenzhou': '330300',
        'jiaxing': '330400',
        'huzhou': '330500',
        'shaoxing': '330600',
        'jinhua': '330700',
        'quzhou': '330800',
        'zhoushan': '330900',
        'taizhou': '331000',
        'lishui': '331100',
        'zsd': '330900' // 舟山群岛新区使用舟山市的编码
      };
      return cityCodeMap[cityValue];
    },
    // 获取区县编码
    getDistrictCode(districtValue) {
      // 区县编码就是它自身的值（adcode）
      return districtValue;
    },
    // 根据编码获取区域名称
    getAreaNameByCode(code) {
      // 省级
      if (code === 'zhejiang') {
        return '浙江省';
      }
      
      // 城市
      const cityMap = {
        'hangzhou': '杭州市',
        'ningbo': '宁波市',
        'wenzhou': '温州市',
        'jiaxing': '嘉兴市',
        'huzhou': '湖州市',
        'shaoxing': '绍兴市',
        'jinhua': '金华市',
        'quzhou': '衢州市',
        'zhoushan': '舟山市',
        'taizhou': '台州市',
        'lishui': '丽水市',
        'zsd': '舟山群岛新区'
      };
      
      // 区县
      const districtMap = {};
      if (this.districts.length > 0) {
        this.districts.forEach(d => {
          districtMap[d.value] = d.label;
        });
      }
      
      return cityMap[code] || districtMap[code] || code;
    },
    // 处理点击外部区域关闭选择器
    handleOutsideClick(event) {
      const selector = document.querySelector('.area-tabs');
      const dropdown = document.querySelector('.selector-dropdown');
      // 检查点击是否在下拉框内或在选择器内
      if (selector && !selector.contains(event.target) && 
          dropdown && !dropdown.contains(event.target) && 
          this.showSelector) {
        this.showSelector = false;
      }
    },

    // 获取应急专家数据
    getEmergencyPersonnelData(mapName) {
      // 移除未使用的generateHealthData函数
      const hangzhouDistrictsData = {
        '330102': { name: '应急人员01', value: [120.19, 30.26, 100] }, // 上城区
        '330106': { name: '应急人员02', value: [120.12, 30.31, 90] },  // 西湖区
        '330108': { name: '应急人员03', value: [120.21, 30.20, 85] },  // 滨江区
        '330109': { name: '应急人员04', value: [120.28, 30.15, 80] },  // 萧山区
        '330111': { name: '应急人员05', value: [119.94, 30.07, 75] }   // 富阳区
      };

      if (mapName === 'zhejiang') {
        const hangzhouCoord = [120.16, 30.29];
        return [
          { name: '应急人员01', value: [...hangzhouCoord, 100] },
          { name: '应急人员02', value: [hangzhouCoord[0] + 0.05, hangzhouCoord[1] - 0.08, 90] },
          { name: '应急人员03', value: [hangzhouCoord[0] - 0.1, hangzhouCoord[1] + 0.05, 85] }
        ];
      }

      if (mapName === 'hangzhou') {
        return Object.values(hangzhouDistrictsData);
      }

      if (hangzhouDistrictsData[mapName]) {
        return [hangzhouDistrictsData[mapName]];
      }

      return [];
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/CenterPanel.scss';

/* 添加图例样式 */
.legend-container {
  position: absolute;
  right: 100px;
  bottom: 280px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(10, 37, 82, 0.7);
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(10, 37, 82, 0.9);
  }
}

.legend-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
  border: 3px solid #3b97f7;
  box-shadow: 0 0 10px #3b97f7;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px #3b97f7;
  }
  50% {
    box-shadow: 0 0 20px #3b97f7;
  }
  100% {
    box-shadow: 0 0 5px #3b97f7;
  }
}

.legend-text {
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
}
</style> 
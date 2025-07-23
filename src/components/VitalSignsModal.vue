<template>
  <div class="vital-signs-modal" v-if="visible">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title">队员生命体征详情</div>
        <div class="modal-close" @click="closeModal">×</div>
      </div>
      <div class="modal-body">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchName" 
            placeholder="输入队员姓名搜索" 
            class="search-input"
          />
        </div>
        <div class="table-container">
          <table class="vital-signs-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>心率(bpm)</th>
                <th>血氧(%)</th>
                <th>体温(°C)</th>
                <th>状态</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredPersonnel.length === 0">
                <tr>
                  <td colspan="6" class="no-data">暂无生命体征详情</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="person in filteredPersonnel" :key="person.id">
                  <td>{{ person.name }}</td>
                  <td :class="getVitalClass(person.heartRate, 'heartRate')">{{ person.heartRate }}</td>
                  <td :class="getVitalClass(person.oxygen, 'oxygen')">{{ person.oxygen }}</td>
                  <td :class="getVitalClass(person.temperature, 'temperature')">{{ person.temperature }}</td>
                  <td :class="person.status === '正常' ? 'normal' : 'warning'">{{ person.status }}</td>
                  <td>{{ person.updateTime }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-close" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VitalSignsModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    personnelData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchName: '',
      vitalRanges: {
        heartRate: { min: 60, max: 100 },
        oxygen: { min: 95, max: 100 },
        temperature: { min: 36, max: 37.3 }
      }
    }
  },
  computed: {
    filteredPersonnel() {
      if (!this.searchName) {
        return this.personnelData;
      }
      
      return this.personnelData.filter(person => 
        person.name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    getVitalClass(value, type) {
      const range = this.vitalRanges[type];
      if (value < range.min) return 'below-normal';
      if (value > range.max) return 'above-normal';
      return 'normal';
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/scss/vitalSignsModal.scss';

.vital-signs-modal {
  // 可在此处添加局部样式优化
}
</style> 
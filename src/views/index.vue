<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <!-- 头部标题 -->
        <header-panel />

        <!-- 主体内容: 左-中-右 布局 -->
        <div class="main-content">
          <!-- 左侧内容 -->
          <div class="left-panel">
            <dv-border-box-12>
              <left-panel />
            </dv-border-box-12>
          </div>
          
          <!-- 中间内容 -->
          <div class="center-panel">
            <center-panel />
          </div>
          
          <!-- 右侧内容 -->
          <div class="right-panel">
            <dv-border-box-12>
              <right-panel />
            </dv-border-box-12>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawMixin from "../utils/drawMixin";
import LeftPanel from './components/leftPanel.vue';
import RightPanel from './components/rightPanel.vue';
import HeaderPanel from './components/headerPanel.vue';
import CenterPanel from './components/CenterPanel.vue';

export default {
  mixins: [ drawMixin ],
  components: {
    LeftPanel,
    RightPanel,
    HeaderPanel,
    CenterPanel
  },
  data() {
    return {
      timing: null,
      loading: true
    }
  },
  mounted() {
    this.cancelLoading();
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  methods: {
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/index.scss';

.main-content {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 70px);
  margin-top: -20px;
  position: relative;
  z-index: 1;
}

.left-panel, .center-panel, .right-panel {
  height: 100%;
}

.left-panel {
  flex: 2.5;
  overflow: hidden;
}

.center-panel {
  flex: 6;
  margin: 0 20px;
  overflow: hidden;
  background: url('../assets/map-bg-01.png') no-repeat center;
  background-size: 100% 100%;
}

.right-panel {
  flex: 2.5;
  overflow: hidden;
}
</style>

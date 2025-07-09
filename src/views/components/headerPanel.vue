<template>
  <div class="header-container">
    <div class="left-section">
      <img src="@/assets/home-icon.png" class="home-icon" />
      <img src="@/assets/ai-animation.png" class="ai-icon" />
    </div>
    <div class="title">
      <span class="title-text">应急背包一张图</span>
    </div>
    <div class="right-section">
      <div class="fullscreen-btn" @click="toggleFullScreen" :class="{ 'active': isFullScreen }">
        <span class="btn-text">{{ isFullScreen ? '退出全屏' : '全屏' }}</span>
      </div>
      <div class="time-display">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }} {{ weekday }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderPanel',
  data() {
    return {
      currentTime: '',
      currentDate: '',
      weekday: '',
      timer: null,
      isFullScreen: false
    }
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', this.fullScreenChanged);
    document.addEventListener('webkitfullscreenchange', this.fullScreenChanged);
    document.addEventListener('mozfullscreenchange', this.fullScreenChanged);
    document.addEventListener('MSFullscreenChange', this.fullScreenChanged);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // Remove event listeners
    document.removeEventListener('fullscreenchange', this.fullScreenChanged);
    document.removeEventListener('webkitfullscreenchange', this.fullScreenChanged);
    document.removeEventListener('mozfullscreenchange', this.fullScreenChanged);
    document.removeEventListener('MSFullscreenChange', this.fullScreenChanged);
  },
  methods: {
    updateTime() {
      const now = new Date();
      
      // 格式化时间 HH:MM:SS
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;
      
      // 格式化日期 YYYY/MM/DD
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}/${month}/${day}`;
      
      // 获取星期
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      this.weekday = `周${weekdays[now.getDay()]}`;
    },
    
    toggleFullScreen() {
      if (!this.isFullScreen) {
        // Enter fullscreen
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    
    fullScreenChanged() {
      this.isFullScreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/scss/headerPanel.scss';
</style> 
<template>
  <view v-if="visibleSync" :class="{ 'uni-drawer--visible': showDrawer }" class="uni-drawer"
        @touchmove.stop.prevent="clear">
    <view class="uni-drawer__mask" :class="{ 'uni-drawer__mask--visible': showDrawer && mask }" @tap="close('mask')" />
    <view class="uni-drawer__content"
          :class="{'uni-drawer--right': rightMode,'uni-drawer--left': !rightMode, 'uni-drawer__content--visible': showDrawer}"
          :style="{width:drawerWidth+'px'}">
      <slot />
    </view>
  </view>
</template>

<script>
/**
 * Drawer drawer
 * @description drawer side sliding menu
 * @tutorial https://ext.dcloud.net.cn/plugin?id=26
 * @property {Boolean} mask = [true | false] Whether to display the mask
 * @property {Boolean} maskClick = [true | false] Click whether to close the mask
 * @property {Boolean} mode = [left | right] Drawer slide out position
 * @value left slide out from the left
 * @value right slide out from the right side
 * @property {Number} width The width of the drawer, only valid for the vue page
 * @event {Function} close The event is triggered when the component is closed
 */
export default {
  name: 'UniDrawer',
  props: {
    /**
     * Display mode (left and right), only effective in initialization
     */
    mode: {
      type: String,
      default: ''
    },
    /**
     * Mask display status
     */
    mask: {
      type: Boolean,
      default: true
    },
    /**
     * Whether the mask can be clicked to close
     */
    maskClick: {
      type: Boolean,
      default: true
    },
    /**
     * Drawer width
     */
    width: {
      type: Number,
      default: 220
    }
  },
  data() {
    return {
      visibleSync: false,
      showDrawer: false,
      rightMode: false,
      watchTimer: null,
      drawerWidth: 220
    };
  },
  created() {
    // #ifndef APP-NVUE
    this.drawerWidth = this.width;
    // #endif
    this.rightMode = this.mode === 'right';
  },
  methods: {
    clear() {
    },
    close(type) {
      // fixed by mehaotian does not trigger the following logic when the drawer has not been completely closed or the mask is forbidden to click
      if ((type === 'mask' && !this.maskClick) || !this.visibleSync) return;
      this._change('showDrawer', 'visibleSync', false);
    },
    open() {
      // fixed by mehaotian handles repeated clicks to open events
      if (this.visibleSync) return;
      this._change('visibleSync', 'showDrawer', true);
    },
    _change(param1, param2, status) {
      this[param1] = status;
      if (this.watchTimer) {
        clearTimeout(this.watchTimer);
      }
      this.watchTimer = setTimeout(() => {
        this[param2] = status;
        this.$emit('change', status);
      }, status ? 50 : 300);
    }
  }
};
</script>

<style lang="scss" scoped>
// Drawer width
$drawer-width: 220px;

.uni-drawer {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 999;
}

.uni-drawer__content {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  position: absolute;
  top: 0;
  width: $drawer-width;
  bottom: 0;
  background-color: $uni-bg-color;
  transition: transform 0.3s ease;
}

.uni-drawer--left {
  left: 0;
  /* #ifdef APP-NVUE */
  transform: translateX(-$drawer-width);
  /* #endif */
  /* #ifndef APP-NVUE */
  transform: translateX(-100%);
  /* #endif */
}

.uni-drawer--right {
  right: 0;
  /* #ifdef APP-NVUE */
  transform: translateX($drawer-width);
  /* #endif */
  /* #ifndef APP-NVUE */
  transform: translateX(100%);
  /* #endif */
}

.uni-drawer__content--visible {
  transform: translateX(0px);
}


.uni-drawer__mask {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $uni-bg-color-mask;
  transition: opacity 0.3s;
}

.uni-drawer__mask--visible {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  opacity: 1;
}
</style>

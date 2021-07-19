<template>
  <view v-if="showPopup" class="uni-popup" :class="[popupstyle]" @touchmove.stop.prevent="clear">
    <uni-transition v-if="maskShow" :mode-class="['fade']" :styles="maskClass" :duration="duration" :show="showTrans"
                    @click="onTap" />
    <uni-transition :mode-class="ani" :styles="transClass" :duration="duration" :show="showTrans" @click="onTap">
      <view class="uni-popup__wrapper-box" @click.stop="clear">
        <slot />
      </view>
    </uni-transition>
  </view>
</template>

<script>
import uniTransition from '../uni-transition/uni-transition.vue';
import popup from './popup.js';

/**
 * PopUp pop-up layer
 * @description pop-up layer component, in order to solve the problem of masking the bomb layer
 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
 * @property {String} type = [top|center|bottom] pop-up method
 * @value top pops up at the top
 * @value center pops up in the middle
 * @value bottom pops up at the bottom
 * @value message
 * @value dialog dialog
 * @value share bottom sharing example
 * @property {Boolean} animation = [ture|false] Whether to enable animation
 * @property {Boolean} maskClick = [ture|false] Whether to close the pop-up window when the mask is clicked
 * @event {Function} change is triggered by opening and closing the pop-up window, e={show: false}
 */

export default {
  name: 'UniPopup',
  components: {
    uniTransition
  },
  props: {
// Turn on the animation
    animation: {
      type: Boolean,
      default: true
    },
// Pop-up layer type, optional value, top: top pop-up layer; bottom: bottom pop-up layer; center: full-screen pop-up layer
// message: message prompt; dialog: dialog box
    type: {
      type: String,
      default: 'center'
    },
// maskClick
    maskClick: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      popup: this
    };
  },
  mixins: [popup],
  watch: {
    /**
     * Monitoring type
     */
    type: {
      handler: function (newVal) {
        this[this.config[newVal]]();
      },
      immediate: true
    },
    /**
     * Whether the monitoring mask can be clicked
     * @param {Object} val
     */
    maskClick(val) {
      this.mkclick = val;
    }
  },
  data() {
    return {
      duration: 300,
      ani: [],
      showPopup: false,
      showTrans: false,
      maskClass: {
        'position': 'fixed',
        'bottom': 0,
        'top': 0,
        'left': 0,
        'right': 0,
        'backgroundColor': 'rgba(0, 0, 0, 0.4)'
      },
      transClass: {
        'position': 'fixed',
        'left': 0,
        'right': 0
      },
      maskShow: true,
      mkclick: true,
      popupstyle: 'top'
    };
  },
  created() {
    this.mkclick = this.maskClick;
    if (this.animation) {
      this.duration = 300;
    } else {
      this.duration = 0;
    }
  },
  methods: {
    clear(e) {
// TODO nvue cancel bubbling
      e.stopPropagation();
    },
    open() {
      this.showPopup = true;
      this.$nextTick(() => {
        new Promise(resolve => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.showTrans = true;
// fixed by mehaotian compatible with app
            this.$nextTick(() => {
              resolve();
            });
          }, 50);
        }).then(res => {
// Custom open event
          clearTimeout(this.msgtimer);
          this.msgtimer = setTimeout(() => {
            this.customOpen && this.customOpen();
          }, 100);
          this.$emit('change', {
            show: true,
            type: this.type
          });
        });
      });
    },
    close(type) {
      this.showTrans = false;
      this.$nextTick(() => {
        this.$emit('change', {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
// Custom close event
        this.customOpen && this.customClose();
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      });
    },
    onTap() {
      if (!this.mkclick) return;
      this.close();
    },
    /**
     * Top pop style processing
     */
    top() {
      this.popupstyle = 'top';
      this.ani = ['slide-top'];
      this.transClass = {
        'position': 'fixed',
        'left': 0,
        'right': 0
      };
    },
    /**
     * Bottom pop-up style processing
     */
    bottom() {
      this.popupstyle = 'bottom';
      this.ani = ['slide-bottom'];
      this.transClass = {
        'position': 'fixed',
        'left': 0,
        'right': 0,
        'bottom': 0
      };
    },
    /**
     * Intermediate pop-up style processing
     */
    center() {
      this.popupstyle = 'center';
      this.ani = ['zoom-out', 'fade'];
      this.transClass = {
        'position': 'fixed',
        /* #ifndef APP-NVUE */
        'display': 'flex',
        'flexDirection': 'column',
        /* #endif */
        'bottom': 0,
        'left': 0,
        'right': 0,
        'top': 0,
        'justifyContent': 'center',
        'alignItems': 'center'
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.uni-popup {
  position: fixed;
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.uni-popup__mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $uni-bg-color-mask;
  opacity: 0;
}

.mask-ani {
  transition-property: opacity;
  transition-duration: 0.2s;
}

.uni-top-mask {
  opacity: 1;
}

.uni-bottom-mask {
  opacity: 1;
}

.uni-center-mask {
  opacity: 1;
}

.uni-popup__wrapper {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  position: absolute;
}

.top {
  /* #ifdef H5 */
  top: var(--window-top);
  /* #endif */
  /* #ifndef H5 */
  top: 0;
  /* #endif */
}

.bottom {
  bottom: 0;
}

.uni-popup__wrapper-box {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  position: relative;
  /* iphonex 等安全区设置，底部安全区适配 */
  /* #ifndef APP-NVUE */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  /* #endif */
}

.content-ani {
  // transition: transform 0.3s;
  transition-property: transform, opacity;
  transition-duration: 0.2s;
}


.uni-top-content {
  transform: translateY(0);
}

.uni-bottom-content {
  transform: translateY(0);
}

.uni-center-content {
  transform: scale(1);
  opacity: 1;
}
</style>

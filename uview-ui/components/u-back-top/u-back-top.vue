<template>
  <view @tap="backToTop" class="u-back-top" :class="['u-back-top--mode--' + mode]" :style="[{
bottom: bottom +'rpx',
right: right +'rpx',
borderRadius: mode =='circle'? '10000rpx': '8rpx',
zIndex: uZIndex,
opacity: opacity
}, customStyle]">
    <view class="u-back-top__content" v-if="!$slots.default">
      <u-icon @click="backToTop" :name="icon" :custom-style="iconStyle"></u-icon>
      <view class="u-back-top__content__tips">
        {{ tips }}
      </view>
    </view>
    <slot v-else />
  </view>
</template>

<script>
export default {
  name: 'u-back-top',
  props: {
// Return to the top shape, circle-circle, square-square
    mode: {
      type: String,
      default: 'circle'
    },
// custom icon
    icon: {
      type: String,
      default: 'arrow-upward'
    },
// Prompt text
    tips: {
      type: String,
      default: ''
    },
// Return to the top scroll time
    duration: {
      type: [Number, String],
      default: 100
    },
// Scroll distance
    scrollTop: {
      type: [Number, String],
      default: 0
    },
// How much distance from the top is displayed, the unit is rpx
    top: {
      type: [Number, String],
      default: 400
    },
// The distance from the top button to the bottom, in rpx
    bottom: {
      type: [Number, String],
      default: 200
    },
// The distance from the top button to the right, in rpx
    right: {
      type: [Number, String],
      default: 40
    },
// level
    zIndex: {
      type: [Number, String],
      default: '9'
    },
// Icon style, object form
    iconStyle: {
      type: Object,
      default() {
        return {
          color: '#909399',
          fontSize: '38rpx'
        };
      }
    },
// The style of the entire component
    customStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    showBackTop(nVal, oVal) {
// When the display and hidden states of the component jump, modify the level and opacity of the component
// Let the component display and disappear animation effects, if you use v-if to control the component state, there will be no animation effect
      if (nVal) {
        this.uZIndex = this.zIndex;
        this.opacity = 1;
      } else {
        this.uZIndex = -1;
        this.opacity = 0;
      }
    }
  },
  computed: {
    showBackTop() {
// Since scrollTop is the scroll distance of the page, the default unit is px, which will be used here for the incoming top(rpx) value
// Converted to px for comparison, if the distance from the scroll bar to the top is greater than the set distance, the button to return to the top will be displayed
      return this.scrollTop > uni.upx2px(this.top);
    }
  },
  data() {
    return {
// Opacity, in order to make the component have a transition animation for display and hide
      opacity: 0,
// The z-index value of the component, set to -1 when hidden, you will not be able to see it
      uZIndex: -1
    };
  },
  methods: {
    backToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: this.duration
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../libs/css/style.components.scss";

.u-back-top {
  width: 80 rpx;
  height: 80 rpx;
  position: fixed;
  z-index: 9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #E1E1E1;
  color: $u-content-color;
  align-items: center;
  transition: opacity 0.4s;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__tips {
      font-size: 24 rpx;
      transform: scale(0.8);
      line-height: 1;
    }
  }
}
</style>

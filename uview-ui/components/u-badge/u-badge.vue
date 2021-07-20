<template>
  <view v-if="show" class="u-badge" :class="[
isDot?'u-badge-dot':'',
size =='mini'?'u-badge-mini':'',
type?'u-badge--bg--' + type:''
]" :style="[{
top: offset[0] +'rpx',
right: offset[1] +'rpx',
fontSize: fontSize +'rpx',
position: absolute?'absolute':'static',
color: color,
backgroundColor: bgColor
}, boxStyle]"
  >
    {{ showText }}
  </view>
</template>

<script>
/**
 * badge corner
 * @description This component is generally used in places where the avatar is displayed, such as the personal center, or the user avatar display on the comment list page.
 * @tutorial https://www.uviewui.com/components/badge.html
 * The number displayed by @property {String Number} count is displayed as ${overflowCount}+ when it is greater than overflowCount, hidden when it is 0 and show-zero is false
 * @property {Boolean} is-dot does not display numbers, only a small dot (default false)
 * @property {Boolean} absolute Whether the component is positioned absolutely, when it is true, the offset parameter is valid (default true)
 * @property {String Number} overflow-count displays the capped number value (default 99)
 * @property {String} type use the preset background color (default error)
 * @property {Boolean} show-zero When the value is 0, whether to show Badge (default false)
 * @property {String} size Badge size, set to mini will get one size smaller Badge (default default)
 * @property {Array} offset Set the position offset of the badge, the format is [x, y], that is, the value of top and right is set, and the unit is rpx. Valid when absolute is true (default [20, 20])
 * @property {String} color font color (default #ffffff)
 * @property {String} bgColor background color, priority is higher than type, if set, type parameter will be invalid
 * @property {Boolean} is-center Whether the center point of the component coincides with the upper right corner of the parent component, the priority is higher than offset, if set, the offset parameter will be invalid (default false)
 * @example <u-badge type="error" count="7"></u-badge>
 */
export default {
  name: 'u-badge',
  props: {
// primary,warning,success,error,info
    type: {
      type: String,
      default: 'error'
    },
// default, mini
    size: {
      type: String,
      default: 'default'
    },
//Is it a dot
    isDot: {
      type: Boolean,
      default: false
    },
// Displayed value content
    count: {
      type: [Number, String]
    },
// Show the capped numeric value
    overflowCount: {
      type: Number,
      default: 99
    },
// When the value is 0, whether to display Badge
    showZero: {
      type: Boolean,
      default: false
    },
// position offset
    offset: {
      type: Array,
      default: () => {
        return [20, 20];
      }
    },
// Whether to enable absolute positioning, it will work only when offset is enabled
    absolute: {
      type: Boolean,
      default: true
    },
    // font size
    fontSize: {
      type: [String, Number],
      default: '24'
    },
// Font demo
    color: {
      type: String,
      default: '#ffffff'
    },
// The background color of the badge
    bgColor: {
      type: String,
      default: ''
    },
// Whether to make the center point of the badge component coincide with the upper right corner of the parent component, if configured, the offset will be invalid
    isCenter: {
      type: Boolean,
      default: false
    }
  },
  computed: {
// Whether to overlap the center of the badge with the upper right corner of the parent component
    boxStyle() {
      let style = {};
      if (this.isCenter) {
        style.top = 0;
        style.right = 0;
// The Y-axis -50% means that the badge has moved up half of its height, and the X-axis 50% means that it has moved half of its width to the right
        style.transform = 'translateY(-50%) translateX(50%)';
      } else {
        style.top = this.offset[0] + 'rpx';
        style.right = this.offset[1] + 'rpx';
        style.transform = 'translateY(0) translateX(0)';
      }
// If the size is mini, followed by scal()
      if (this.size == 'mini') {
        style.transform = style.transform + 'scale(0.8)';
      }
      return style;
    },
// When isDot type, no text is displayed
    showText() {
      if (this.isDot) return '';
      else {
        if (this.count > this.overflowCount) return `${ this.overflowCount }+`;
        else return this.count;
      }
    },
// Whether to display the component
    show() {
// If the value of count is 0 and showZero is set to false, the component is not displayed
      if (this.count == 0 && this.showZero == false) return false;
      else return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../libs/css/style.components.scss";

.u-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 24 rpx;
  padding: 4 rpx 8 rpx;
  border-radius: 100 rpx;

  &--bg--primary {
    background-color: $u-type-primary;
  }

  &--bg--error {
    background-color: $u-type-error;
  }

  &--bg--success {
    background-color: $u-type-success;
  }

  &--bg--info {
    background-color: $u-type-info;
  }

  &--bg--warning {
    background-color: $u-type-warning;
  }
}

.u-badge-dot {
  height: 16 rpx;
  width: 16 rpx;
  border-radius: 100 rpx;
  line-height: 1;
}

.u-badge-mini {
  transform: scale(0.8);
  transform-origin: center center;
}

// .u-primary {
// 	background: $u-type-primary;
// 	color: #fff;
// }

// .u-error {
// 	background: $u-type-error;
// 	color: #fff;
// }

// .u-warning {
// 	background: $u-type-warning;
// 	color: #fff;
// }

// .u-success {
// 	background: $u-type-success;
// 	color: #fff;
// }

// .u-black {
// 	background: #585858;
// 	color: #fff;
// }

.u-info {
  background: $u-type-info;
  color: #fff;
}
</style>

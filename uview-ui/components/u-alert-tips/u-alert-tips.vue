<template>
  <view class="u-alert-tips" v-if="show" :class="[
!show?'u-close-alert-tips':'',
type?'u-alert-tips--bg--' + type +'-light':'',
type?'u-alert-tips--border--' + type +'-disabled':'',
]" :style="{
backgroundColor: bgColor,
borderColor: borderColor
}">
    <view class="u-icon-wrap">
      <u-icon v-if="showIcon" :name="uIcon" :size="description? 40: 32" class="u-icon" :color="uIconType"
              :custom-style="iconStyle">< /u-icon>
    </view>
    <view class="u-alert-content" @tap.stop="click">
      <view class="u-alert-title" :style="[uTitleStyle]">
        {{ title }}
      </view>
      <view v-if="description" class="u-alert-desc" :style="[descStyle]">
        {{ description }}
      </view>
    </view>
    <view class="u-icon-wrap">
      <u-icon @click="close" v-if="closeAble && !closeText" hoverClass="u-type-error-hover-color" name="close"
              color="#c0c4cc"
              :size="22" class="u-close-icon" :style="{
top: description? '18rpx': '24rpx'
}"></u-icon>
    </view>
    <text v-if="closeAble && closeText" class="u-close-text" :style="{
top: description? '18rpx': '24rpx'
}">{{ closeText }}
    </text>
  </view>
</template>

<script>
/**
 * alertTips warning tips
 * @description warning reminder, showing information that needs attention
 * @tutorial https://uviewui.com/components/alertTips.html
 * @property {String} title displayed title text
 * @property {String} description auxiliary text, the color is lighter than the title, the font size is also smaller, optional
 * @property {String} type close button (default is the cross icon icon)
 * @property {String} icon icon name
 * @property {Object} icon-style icon style, object form
 * @property {Object} title-style title style, object form
 * @property {Object} desc-style described style, object form
 * @property {String} close-able replace the close icon with text, valid when close-able is true
 * @property {Boolean} show-icon whether to show the auxiliary icon on the left
 * @property {Boolean} show show or hide components
 * @event {Function} click to trigger when the component is clicked
 * @event {Function} close is triggered when the close button is clicked
 */
export default {
  name: 'u-alert-tips',
  props: {
// display text
    title: {
      type: String,
      default: ''
    },
// Subject, success/warning/info/error
    type: {
      type: String,
      default: 'warning'
    },
// auxiliary text
    description: {
      type: String,
      default: ''
    },
// Can it be closed
    closeAble: {
      type: Boolean,
      default: false
    },
// Close button custom text
    closeText: {
      type: String,
      default: ''
    },
// Whether to display the icon
    showIcon: {
      type: Boolean,
      default: false
    },
// Text color, if the color value is defined, the icon will be invalid
    color: {
      type: String,
      default: ''
    },
    // background color
    bgColor: {
      type: String,
      default: ''
    },
// border color
    borderColor: {
      type: String,
      default: ''
    },
// Whether to display
    show: {
      type: Boolean,
      default: true
    },
// icon shown on the left
    icon: {
      type: String,
      default: ''
    },
// icon style
    iconStyle: {
      type: Object,
      default() {
        return {};
      }
    },
// The style of the title
    titleStyle: {
      type: Object,
      default() {
        return {};
      }
    },
// The style of the description text
    descStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    uTitleStyle() {
      let style = {};
// If there is a description text, the title will be bold
      style.fontWeight = this.description ? 500 : 'normal';
// Combine the user's incoming style object and style. The incoming priority is higher than style, and the same attributes will be overwritten
      return this.$u.deepMerge(style, this.titleStyle);
    },
    uIcon() {
// If there is an icon name set, use it, otherwise, according to the type theme, infer a default icon
      return this.icon ? this.icon : this.$u.type2icon(this.type);
    },
    uIconType() {
// If there is a style for setting the icon, use it first, if not, use the style of type
      return Object.keys(this.iconStyle).length ? '' : this.type;
    }
  },
  methods: {
// Click on the content
    click() {
      this.$emit('click');
    },
// Click the close button
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../libs/css/style.components.scss";

.u-alert-tips {
  display: flex;
  align-items: center;
  padding: 16 rpx 30 rpx;
  border-radius: 8 rpx;
  position: relative;
  transition: all 0.3s linear;
  border: 1px solid #fff;

  &--bg--primary-light {
    background-color: $u-type-primary-light;
  }

  &--bg--info-light {
    background-color: $u-type-info-light;
  }

  &--bg--success-light {
    background-color: $u-type-success-light;
  }

  &--bg--warning-light {
    background-color: $u-type-warning-light;
  }

  &--bg--error-light {
    background-color: $u-type-error-light;
  }

  &--border--primary-disabled {
    border-color: $u-type-primary-disabled;
  }

  &--border--success-disabled {
    border-color: $u-type-success-disabled;
  }

  &--border--error-disabled {
    border-color: $u-type-error-disabled;
  }

  &--border--warning-disabled {
    border-color: $u-type-warning-disabled;
  }

  &--border--info-disabled {
    border-color: $u-type-info-disabled;
  }
}

.u-close-alert-tips {
  opacity: 0;
  visibility: hidden;
}

.u-icon {
  margin-right: 16 rpx;
}

.u-alert-title {
  font-size: 28 rpx;
  color: $u-main-color;
}

.u-alert-desc {
  font-size: 26 rpx;
  text-align: left;
  color: $u-content-color;
}

.u-close-icon {
  position: absolute;
  top: 20 rpx;
  right: 20 rpx;
}

.u-close-hover {
  color: red;
}

.u-close-text {
  font-size: 24 rpx;
  color: $u-tips-color;
  position: absolute;
  top: 20 rpx;
  right: 20 rpx;
  line-height: 1;
}
</style>

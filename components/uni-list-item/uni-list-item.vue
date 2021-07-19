<template>
  <!-- #ifdef APP-NVUE -->
  <cell>
    <!-- #endif -->
    <view :class="disabled ? 'uni-list-item--disabled' : ''"
          :hover-class="disabled || showSwitch ? '' : 'uni-list-item--hover'" class="uni-list-item" @click="onClick">
      <view class="uni-list-item__container" :class="{ 'uni-list-item--first': isFirstChild }">
        <view v-if="thumb" class="uni-list-item__icon">
          <image :src="thumb" class="uni-list-item__icon-img" />
        </view>
        <view v-else-if="showExtraIcon" class="uni-list-item__icon">
          <uni-icons :color="extraIcon.color" :size="extraIcon.size" :type="extraIcon.type" class="uni-icon-wrapper" />
        </view>
        <view class="uni-list-item__content">
          <slot name="left"></slot>
          <text class="uni-list-item__content-title">{{ title }}</text>
          <text v-if="note" class="uni-list-item__content-note">{{ note }}</text>
        </view>
        <view class="uni-list-item__extra">
          <text v-if="rightText" class="uni-list-item__extra-text">{{ rightText }}</text>
          <uni-badge v-if="showBadge" :type="badgeType" :text="badgeText" />
          <switch v-if="showSwitch" :disabled="disabled" :checked="switchChecked" @change="onSwitchChange" />
          <slot name="right"></slot>
          <uni-icons v-if="showArrow" :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
        </view>
      </view>
    </view>
    <!-- #ifdef APP-NVUE -->
  </cell>
  <!-- #endif -->
</template>

<script>
import uniIcons from '../uni-icons/uni-icons.vue';
import uniBadge from '../uni-badge/uni-badge.vue';

/**
 * ListItem list subcomponent
 * @description list subcomponent
 * @tutorial https://ext.dcloud.net.cn/plugin?id=24
 * @property {String} title
 * @property {String} note description
 * @property {String} Thumb Thumbnail on the left, if the thumb has a value, the extension icon will not be displayed
 * @property {String} badgeText digital badge content
 * @property {String} badgeType Digital badge type, refer to [uni-icons](https://ext.dcloud.net.cn/plugin?id=21)
 * @property {String} rightText right text content
 * @property {Boolean} disabled = [true|false] Whether to disable
 * @property {Boolean} showArrow = [true|false] Whether to show the arrow icon
 * @property {Boolean} showBadge = [true|false] Whether to display digital badges
 * @property {Boolean} showSwitch = [true|false] Whether to show Switch
 * @property {Boolean} switchChecked = [true|false] Whether the switch is selected
 * @property {Boolean} showExtraIcon = [true|false] Whether to show the extension icon on the left
 * @property {Boolean} scrollY = [true|false] Vertical scrolling is allowed, and its width and height need to be set explicitly
 * @property {Object} extraIcon extended icon parameter, the format is {color:'#4cd964',size: '22',type:'spinner'}
 * @event {Function} click uniListItem to trigger the event
 * @event {Function} switchChange Triggered when the switch is clicked
 */
export default {
  name: 'UniListItem',
  components: {
    uniIcons,
    uniBadge
  },
  props: {
    title: {
      type: String,
      default: ''
    }, // List title
    note: {
      type: String,
      default: ''
    }, // List description
    disabled: {
// Whether to disable
      type: [Boolean, String],
      default: false
    },
    showArrow: {
// Whether to show the arrow
      type: [Boolean, String],
      default: true
    },
    showBadge: {
// Whether to display the digital corner mark
      type: [Boolean, String],
      default: false
    },
    showSwitch: {
// Whether to display Switch
      type: [Boolean, String],
      default: false
    },
    switchChecked: {
// Whether the Switch is selected
      type: [Boolean, String],
      default: false
    },
    badgeText: {
// badge content
      type: String,
      default: ''
    },
    badgeType: {
// badge type
      type: String,
      default: 'success'
    },
    rightText: {
// Text content on the right
      type: String,
      default: ''
    },
    thumb: {
// Thumbnail
      type: String,
      default: ''
    },
    showExtraIcon: {
// Whether to display the extended icon
      type: [Boolean, String],
      default: false
    },
    extraIcon: {
      type: Object,
      default() {
        return {
          type: 'contact',
          color: '#000000',
          size: 20
        };
      }
    }
  },
  inject: ['list'],
  data() {
    return {
      isFirstChild: false
    };
  },
  mounted() {
    if (!this.list.firstChildAppend) {
      this.list.firstChildAppend = true;
      this.isFirstChild = true;
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onSwitchChange(e) {
      this.$emit('switchChange', e.detail);
    }
  }
};
</script>

<style lang="scss" scoped>
$list-item-pd: $uni-spacing-col-lg $uni-spacing-row-lg;

.uni-list-item {
  font-size: $uni-font-size-lg;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
}

.uni-list-item--disabled {
  opacity: 0.3;
}

.uni-list-item--hover {
  background-color: $uni-bg-color-hover;
}

.uni-list-item__container {
  line-height: 48 rpx;
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  padding: $list-item-pd;
  padding-left: 0;
  flex: 1;
  position: relative;
  justify-content: space-between;
  align-items: center;
  /* #ifdef APP-PLUS */
  border-top-color: $uni-border-color;
  border-top-style: solid;
  border-top-width: 0.5px;
  /* #endif */
}

.uni-list-item--first {
  border-top-width: 0px;
}

/* #ifndef APP-NVUE */
.uni-list-item__container:after {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  content: '';
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: $uni-border-color;
}

.uni-list-item--first:after {
  height: 0px;
}

/* #endif */

.uni-list-item__content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  overflow: hidden;
  flex-direction: column;
  color: #3b4144;
}

.uni-list-item__content-title {
  font-size: $uni-font-size-base;
  color: #3b4144;
  overflow: hidden;
}

.uni-list-item__content-note {
  margin-top: 6 rpx;
  color: $uni-text-color-grey;
  font-size: $uni-font-size-sm;
  overflow: hidden;
}

.uni-list-item__extra {
  // width: 25%;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.uni-list-item__icon {
  display: flex;
  margin-right: 18 rpx;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin-left: 20 rpx;
}

.uni-list-item__icon-img {
  // height: $uni-img-size-base;
  // width: $uni-img-size-base;
  height: 38 rpx;
  width: 38 rpx;
}

.uni-list-item__extra-text {
  color: $uni-text-color-grey;
  font-size: $uni-font-size-sm;
}
</style>

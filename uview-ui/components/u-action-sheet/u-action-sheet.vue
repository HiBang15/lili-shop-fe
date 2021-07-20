<template>
  <u-popup mode="bottom" :border-radius="borderRadius" :popup="false" v-model="value" :maskCloseAble="maskCloseAble"
           length="auto" :safeAreaInsetBottom="safeAreaInsetBottom" @close="popupClose" :z-index="uZIndex">
    <view class="u-tips u-border-bottom" v-if="tips.text" :style="[tipsStyle]">
      {{ tips.text }}
    </view>
    <block v-for="(item, index) in list" :key="index">
      <view
          @touchmove.stop.prevent
          @tap="itemClick(index)"
          :style="[itemStyle(index)]"
          class="u-action-sheet-item"
          :class="[index <list.length-1?'u-border-bottom':'']"
          :hover-stay-time="150"
      >
        {{ item.text }}
      </view>
    </block>
    <view class="u-gab" v-if="cancelBtn">
    </view>
    <view @touchmove.stop.prevent class="u-actionsheet-cancel u-action-sheet-item" hover-class="u-hover-class"
          :hover-stay-time="150" v-if="cancelBtn" @tap="close">{{ cancelText }}
    </view>
  </u-popup>
</template>

<script>
/**
 * actionSheet operation menu
 * @description This component is used to pop up an operation menu from the bottom for the user to select and return the result. The function of this component is similar to uni.showActionSheetAPI, the configuration is more flexible, and all platforms have the same performance.
 * @tutorial https://www.uviewui.com/components/actionSheet.html
 * @property {Array<Object>} list The text array of the button, see the official document example
 * @property {Object} tips The prompt text at the top, see the official document example
 * @property {String} cancel-text The prompt text of the cancel button
 * @property {Boolean} cancel-btn Whether to display the cancel button at the bottom (default true)
 * @property {Number String} border-radius The rounded corners around the top of the pop-up part, the unit is rpx (default 0)
 * @property {Boolean} mask-close-able Click whether the mask can be closed (default true)
 * @property {Boolean} safe-area-inset-bottom whether to enable bottom safe area adaptation (default false)
 * @property {Number String} z-index z-index value (default 1075)
 * @property {String} cancel-text The prompt text of the cancel button
 * @event {Function} click to trigger when the ActionSheet list item is clicked
 * @event {Function} close is triggered when the cancel button is clicked
 * @example <u-action-sheet :list="list" @click="click" v-model="show"></u-action-sheet>
 */
export default {
  name: 'u-action-sheet',
  props: {
// Click on the mask to close the actionsheet
    maskCloseAble: {
      type: Boolean,
      default: true
    },
// The text array of the button, you can customize the color and font size, the font unit is rpx
    list: {
      type: Array,
      default() {
        // as follows
// return [{
// text:'OK',
// color:'',
// fontSize:''
// }]
        return [];
      }
    },
// Prompt text at the top
    tips: {
      type: Object,
      default() {
        return {
          text: '',
          color: '',
          fontSize: '26'
        };
      }
    },
// Cancel button at the bottom
    cancelBtn: {
      type: Boolean,
      default: true
    },
// Whether to enable the bottom safety zone adaptation, if enabled, a certain inner margin will be added to the bottom of the iPhoneX model
    safeAreaInsetBottom: {
      type: Boolean,
      default: false
    },
// Control the pop-up and collapse of components through two-way binding
    value: {
      type: Boolean,
      default: false
    },
// The top fillet value of the pop-up
    borderRadius: {
      type: [String, Number],
      default: 0
    },
// The z-index value that pops up
    zIndex: {
      type: [String, Number],
      default: 0
    },
// Text prompt for cancel button
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  computed: {
// The style of the top prompt
    tipsStyle() {
      let style = {};
      if (this.tips.color) style.color = this.tips.color;
      if (this.tips.fontSize) style.fontSize = this.tips.fontSize + 'rpx';
      return style;
    },
// The style of the operation item
    itemStyle() {
      return (index) => {
        let style = {};
        if (this.list[index].color) style.color = this.list[index].color;
        if (this.list[index].fontSize) style.fontSize = this.list[index].fontSize + 'rpx';
// The style where the option is disabled
        if (this.list[index].disabled) style.color = '#c0c4cc';
        return style;
      };
    },
    uZIndex() {
// If the user has passed the z-index value, it will be used first
      return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
    }
  },
  methods: {
// Click the cancel button
    close() {
// Sending an input event does not affect the parent component, but to set the value parameter passed through props inside the component
// This is a special use of vue to send events
      this.popupClose();
      this.$emit('close');
    },
// The pop-up window closes
    popupClose() {
      this.$emit('input', false);
    },
// Click on an item
    itemClick(index) {
// The disabled item is forbidden to click
      if (this.list[index].disabled) return;
      this.$emit('click', index);
      this.$emit('input', false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../libs/css/style.components.scss";

.u-tips {
  font-size: 26 rpx;
  text-align: center;
  padding: 34 rpx 0;
  line-height: 1;
  color: $u-tips-color;
}

.u-action-sheet-item {
  display: flex;
  line-height: 1;
  justify-content: center;
  align-items: center;
  font-size: 34 rpx;
  padding: 34 rpx 0;
}

.u-gab {
  height: 12 rpx;
  background-color: rgb(234, 234, 236);
}

.u-actionsheet-cancel {
  color: $u-main-color;
}
</style>

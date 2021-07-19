<template>
  <view class="serach">
    <view class="left-box" @tap="onClickLeft">
      <uni-icons style="line-height:70rpx" type="back" size="24" />
    </view>
    <view class="content" :style="{'border-radius': radius +'px' }">
      <!-- HM modification to increase the click range to enter the input state -->
      <view class="content-box" :class="{ center: mode === 2 }">
        <u-icon name="search" size="32" style="padding:0 15rpx;"></u-icon>
        <!-- HM modification add placeholder input confirm-type confirm-->
        <input style="width:100%; " :placeholder="placeholder" placeholder-class="placeholder-color"
               @input="inputChange" confirm-type="search" @confirm="triggerConfirm" class="input"
               :class="{ center: !active && mode === 2 }" :focus="isFocus" v-model="inputVal" @focus="focus"
               @blur="blur" />
        <u-icon name="close" v-if="isDelShow" style="padding:0 30rpx;" @click="clear"></u-icon>
      </view>
      <view v-show="(active && show && button ==='inside') || (isDelShow && button ==='inside')" class="serachBtn"
            @click="search">Search
      </view>
    </view>
    <view v-if="button ==='outside'" class="button" :class="{ active: show || active }">
      <view v-if="isShowSeachGoods !=true" class="button-item">
        <div @click="out()">Cancel</div>
      </view>

      <view v-else class="button-item">
        <u-icon name="grid-fill" size="50" @click="handelListClass()" v-if="!switchLayout"></u-icon>
        <u-icon v-else @click="handelListClass()" name="list-dot" size="50"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import uniStatusBar from '../uni-status-bar/uni-status-bar.vue';
import uniIcons from '../uni-icons/uni-icons.vue';

export default {
  components: {
    uniStatusBar,
    uniIcons
  },
  props: {
    mode: {
      value: Number,
      default: 1
    },
    //HM modification defines the default search keywords (watermark text)
    placeholder: {
      value: String,
      default: 'Please enter search content'
    },
    value: {
      type: String,
      default: ''
    },
    button: {
      value: String,
      default: 'outside'
    },
    //
    show: {
      value: Boolean,
      default: true
    },
    // The default radius is 60
    radius: {
      value: String,
      default: 60
    },
    // Whether to get focus
    isFocusVal: {
      value: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShowSeachGoods: false, //Whether to display the queried goods
      active: false, //whether selected
      inputVal: '', //Content in Input
      isDelShow: false, //Whether to display the delete icon on the right
      isFocus: false, //Whether to get the focus
      switchLayout: true //Switch the layout of the current product, the default is two columns
    };
  },
  mounted() {
    this.isFocus = this.isFocusVal;
  },
  methods: {
    //
    out() {
      uni.reLaunch({
        url: '/pages/tabbar/home/index'
      });
    },
    // Switch the arrangement order
    handelListClass() {
      this.switchLayout = !this.switchLayout;
      this.$emit('SwitchType');
    },
    //HM modification triggers the component confirm event
    triggerConfirm() {
      this.$emit('confirm', false);
      uni.hideKeyboard();
    },
    //HM modification trigger component input event
    inputChange(event) {
      var keyword = event.detail.value;
      this.$emit('input', keyword);
      if (this.inputVal) {
        this.isDelShow = true;
      }
    },
    focus() {
      this.active = true;
      //HM modification add focus judgment
      if (this.inputVal) {
        this.isDelShow = true;
      }
    },
    blur() {
      this.isFocus = false;
      if (!this.inputVal) {
        this.active = false;
      }
    },
    clear() {
      //HM modification Put away the keyboard
      uni.hideKeyboard();
      this.isFocus = false;
      this.inputVal = '';
      this.active = false;
      //HM modification trigger component input when clearing the content
      this.$emit('input', '');
      //this.$emit('search','');//HM modification does not search when clearing the content
    },


    /**
     * Go back to the previous level
     */
    onClickLeft() {
      uni.navigateBack();
    },

    /**
     * When the content is empty, enter the default keyword
     */
    search() {
      if (!this.inputVal) {
        if (!this.show && this.searchName == 'Cancel') {
          uni.hideKeyboard();
          this.isFocus = false;
          this.active = false;
          return;
        }
      }
      this.$emit('search', this.inputVal ? this.inputVal : this.placeholder);
    }
  },
  watch: {
    /**
     * Monitor whether there is a value currently and whether to display the clear icon
     */
    inputVal(newVal) {
      newVal ? (this.isDelShow = true) : (this.isDelShow = false);
    }
  }
};
</script>

<style lang="scss" scoped>
.serach {
  display: flex;
  width: 100%;
  //border-bottom: 1px #f5f5f5 solid; //HM modification to remove the border
  box-sizing: border-box;
  font-size: $uni-font-size-base;

  .left-box {
    width: 15%;
    /* #ifndef APP-NVUE */
    text-align: center;
    // display: flex;
    // /* #endif */
  }

  .content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 70 rpx;
    color: #999;
    background: #eee;
    overflow: hidden;
    transition: all 0.2s linear;

    .content-box {
      width: 100%;
      display: flex;
      align-items: center;

      &.center {
        justify-content: center;
      }

      .icon {
        padding: 0 15 rpx;

        &.icon-serach:before {
          content: "\e61c";
        }
      }

      .input {
        width: 100%;
        max-width: 100%;
        line-height: 60 rpx;
        height: 60 rpx;
        transition: all 0.2s linear;

        &.center {
          width: 200 rpx;
        }

        &.sub {
          // position: absolute;
          width: auto;
          color: grey;
        }
      }
    }

    .serachBtn {
      height: 100%;
      flex-shrink: 0;
      padding: 0 30 rpx;
      //HM modify button background color
      background: linear-gradient(to right, grey, grey);
      //background: $uni-color-success;
      line-height: 60 rpx;
      color: #eee;
      //border-left: 1px #ccc solid; //HM modification to remove the border
      transition: all 0.3s;
    }
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
    width: 0;
    transition: all 0.2s linear;
    white-space: nowrap;
    overflow: hidden;

    &.active {
      padding-left: 15 rpx;
      width: 100 rpx;
    }
  }
}

.icon {
  font-family: iconfont;
  font-size: 32 rpx;
  font-style: normal;
  color: #999;
}

.placeholder-color {
  color: #999;
  opacity: 0.4;
}
</style>

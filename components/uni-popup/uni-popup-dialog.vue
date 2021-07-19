<template>
  <view class="uni-popup-dialog">
    <view class="uni-dialog-title">
      <text class="uni-dialog-title-text" :class="['uni-popup__'+dialogType]">{{ title }}</text>
    </view>
    <view class="uni-dialog-content">
      <text class="uni-dialog-content-text" v-if="mode === 'base'">{{ content }}</text>
      <input v-else class="uni-dialog-input" v-model="val" type="text" :placeholder="placeholder" :focus="focus">
    </view>
    <view class="uni-dialog-button-group">
      <view class="uni-dialog-button" @click="close">
        <text class="uni-dialog-button-text">Cancel</text>
      </view>
      <view class="uni-dialog-button uni-border-left" @click="onOk">
        <text class="uni-dialog-button-text uni-button-color">OK</text>
      </view>
    </view>
    <view class="uni-dialog-button-group">
      <view class="uni-dialog-button" @click="close">
        <text class="uni-dialog-button-text">Cancel</text>
      </view>
      <view class="uni-dialog-button uni-border-left" @click="onOk">
        <text class="uni-dialog-button-text uni-button-color">OK</text>
      </view>
    </view>

  </view>
</template>

<script>
/**
 * PopUp pop-up layer-dialog style
 * @description pop-up layer-dialog style
 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
 * @property {String} The default value in value input mode
 * @property {String} input prompt in placeholder input mode
 * @property {String} type = [success|warning|info|error] theme style
 * @value success success
 * @value warning prompt
 * @value info message
 * @value error
 * @property {String} mode = [base|input] mode,
 * @value base basic dialog
 * @value input input dialog
 * @property {String} content dialog box content
 * @property {Boolean} Whether to intercept the cancellation event beforeClose
 * @event {Function} confirm Click the confirm button to trigger
 * @event {Function} close Click the cancel button to trigger
 */

export default {
  name:'uniPopupDialog',
  props: {
    value: {
      type: [String, Number],
      default:''
    },
    placeholder: {
      type: [String, Number],
      default:'Please enter content'
    },
    /**
     * Dialog theme success/warning/info/error default success
     */
    type: {
      type: String,
      default:'error'
    },
    /**
     * Dialog mode base/input
     */
    mode: {
      type: String,
      default:'base'
    },
    /**
     * Dialog title
     */
    title: {
      type: String,
      default:'Prompt'
    },
    /**
     * Dialog content
     */
    content: {
      type: String,
      default:''
    },
    /**
     * Intercept the cancellation event, if you intercept the cancellation event, you must listen to the close event and execute done()
     */
    beforeClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogType:'error',
      focus: false,
      val:''
    };
  },
  inject: ['popup'],
  watch: {
    type(val) {
      this.dialogType = val;
    },
    mode(val) {
      if (val ==='input') {
        this.dialogType ='info';
      }
    },
    value(val) {
      this.val = val;
    }
  },
  created() {
    // The dialog mask is not clickable
    this.popup.mkclick = false;
    if (this.mode ==='input') {
      this.dialogType ='info';
      this.val = this.value;
    } else {
      this.dialogType = this.type;
    }
  },
  mounted() {
    this.focus = true;
  },
  methods: {
    /**
     * Click the confirm button
     */
    onOk() {
      this.$emit('confirm', () => {
        this.popup.close();
        if (this.mode ==='input') this.val = this.value;
      }, this.mode ==='input'? this.val:'');
    },
    /**
     * Click the cancel button
     */
    close() {
      if (this.beforeClose) {
        this.$emit('close', () => {
          this.popup.close();
        });
        return;
      }
      this.popup.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.uni-popup-dialog {
  width: 300px;
  border-radius: 15px;
  background-color: #fff;
}

.uni-dialog-title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  padding-top: 15px;
  padding-bottom: 5px;
}

.uni-dialog-title-text {
  font-size: 16px;
  font-weight: 500;
}

.uni-dialog-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 15px 15px 15px;
}

.uni-dialog-content-text {
  font-size: 14px;
  color: #6e6e6e;
}

.uni-dialog-button-group {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-dialog-button {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */

  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 45px;
}

.uni-border-left {
  border-left-color: #f0f0f0;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-dialog-button-text {
  font-size: 14px;
}

.uni-button-color {
  color: $uni-color-primary;
}

.uni-dialog-input {
  flex: 1;
  font-size: 14px;
}

.uni-popup__success {
  color: $uni-color-success;
}

.uni-popup__warn {
  color: $uni-color-warning;
}

.uni-popup__error {
  color: $uni-color-error;
}

.uni-popup__info {
  color: #909399;
}
</style>

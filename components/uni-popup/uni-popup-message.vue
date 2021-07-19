<template>
  <view class="uni-popup-message" :class="'uni-popup__'+[type]">
    <text class="uni-popup-message-text" :class="'uni-popup__'+[type]+'-text'">{{ message }}</text>
  </view>
</template>

<script>

/**
 * PopUp pop-up layer-message prompt
 * @description pop-up layer-message prompt
 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
 * @property {String} type = [success|warning|info|error] theme style
 * @value success success
 * @value warning prompt
 * @value info message
 * @value error
 * @property {String} message message prompt text
 * @property {String} duration display time, set to 0 will not automatically close
 */
To;
export default {
  name: 'UniPopupMessage',
  props: {
    /**
     * Subject success/warning/info/error default success
     */
    type: {
      type: String,
      default: 'success'
    },
    /**
     * Message text
     */
    message: {
      type: String,
      default: ''
    },
    /**
     * Display time, set to 0 will not automatically close
     */
    duration: {
      type: Number,
      default: 3000
    }
  },
  inject: ['popup'],
  data() {
    return {};
  },
  created() {
    this.popup.childrenMsg = this;
  },
  methods: {
    open() {
      if (this.duration === 0) return;
      clearTimeout(this.popuptimer);
      this.popuptimer = setTimeout(() => {
        this.popup.close();
      }, this.duration);
    },
    close() {
      clearTimeout(this.popuptimer);
    }
  }
};
</script>
<style lang="scss" scoped>
.uni-popup-message {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  background-color: #e1f3d8;
  padding: 10px 15px;
  border-color: #eee;
  border-style: solid;
  border-width: 1px;
}

.uni-popup-message-text {
  font-size: 14px;
  padding: 0;
}

.uni-popup__success {
  background-color: #e1f3d8;
}

.uni-popup__success-text {
  color: #67C23A;
}

.uni-popup__warn {
  background-color: #faecd8;
}

.uni-popup__warn-text {
  color: #E6A23C;
}

.uni-popup__error {
  background-color: #fde2e2;
}

.uni-popup__error-text {
  color: #F56C6C;
}

.uni-popup__info {
  background-color: #F2F6FC;
}

.uni-popup__info-text {
  color: #909399;
}
</style>

<template>
  <view>
    <view class="header">
      <u-icon name='checkmark' size="150" color="#ff6b35"></u-icon>
      <view class="success-text">After-sales application submitted successfully</view>
      <view class="btn-view">
        <view class="btn-item">
          <u-button ripple class="btn1" shape="circle" @click="navigateToAfterSales()">View record</u-button>
        </view>
        <view class="btn-item">
          <u-button ripple class="btn2" shape="circle" @click="navigateToHome()">Back to homepage</u-button>
        </view>
      </view>
    </view>
    <view class="text-view">
      <view style="display: flex; margin-bottom: 20rpx; align-items: center">Reminder:</view>
      <view>• The return address of the product will be checked in the application record after approval.</view>
      <view>• After submitting the service order, the after-sales specialist may communicate with you on the phone,
        please keep your mobile phone open.
      </view>
      <view>• The refund amount will be returned to your support account after successful return processing;</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    /**
     * Jump to after-sales service
     */
    navigateToAfterSales() {
      uni.redirectTo({
        url: '/pages/order/afterSales/afterSales'
      });
    },

    /**
     * Jump to the homepage
     */
    navigateToHome() {
      uni.switchTab({
        url: '/pages/tabbar/home/index'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background: $page-color-base;
  padding-bottom: 100 rpx;
}

.btn1 {
  background: $light-color;
  color: #fff;
}

.btn2 {
  color: $light-color;
}

.header {
  background-color: #fff;
  height: 500 rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .success-text {
    font-size: 40 rpx;
    font-weight: 400;
    margin: 20 rpx 0;
  }

  .btn-view {
    display: flex;
    flex-direction: row;
    margin: 40 rpx 0 rpx;

    .btn-item {
      margin: 0 rpx 20 rpx;
    }
  }
}

.text-view {
  margin: 40 rpx;
  color: #909399;
}
</style>

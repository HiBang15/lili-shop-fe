<template>
  <view>
    <view class="info-view">
      <view class="header-title-view">
        <view class="title">After-sale order number:</view>
        <view>{{ sn }}</view>
      </view>
      <view class="header-title-view">
        <view class="title">Application time:</view>
        <view>{{ createTime }}</view>
      </view>
    </view>
    <view class="info-view">
      <view class="header-title-view">
        <view>{{ serviceStatus }}</view>
      </view>
    </view>
    <view class="info-view">
      <view>
        <u-time-line v-if="logList.length != 0">
          <u-time-line-item>
            <!-- There is no custom content on the left here, a dot will be displayed by default -->
            <template v-slot:content>
              <view v-for="(time,index) in logList" :key="index">
                <view class="u-order-desc">{{time.message}}</view>
                <view class="u-order-time">{{time.createTime}}</view>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
        <view v-else>
          <u-empty text="No audit log for now"></u-empty>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      sn: "", //sn
      createTime: "", //Create time
      logList: [], //Log collection
      serviceStatus: "", //Order status
    };
  },
  onLoad(options) {
    this.sn = options.sn;
    this.createTime = decodeURIComponent(options.createTime);
    this.serviceStatus = this.statusFilter(options.serviceStatus);
    this.logList = JSON.parse(decodeURIComponent(options.logs));

  },
  methods: {
    statusFilter(val) {
      switch (val) {
        case "APPLY":
          return "After-sales service application is successful, waiting for merchant review";
        case "PASS":
          return "After-sales service application approved";
        case "REFUSE":
          return "The after-sales service application has been rejected by the merchant. If you have any questions, please contact the merchant in time";
        case "FULL_COURIER":
          return "The goods applied for after-sales have been sent, waiting for the merchant to receive the goods";
        case "STOCK_IN":
          return "The merchant has put the after-sale goods into the warehouse";
        case "WAIT_FOR_MANUAL":
          return "Waiting for a manual refund on the platform";
        case "REFUNDING":
          return "The merchant is refunding, please wait patiently";
        case "COMPLETED":
          return "After-sales service has been completed, thank you for your support";
        case "ERROR_EXCEPTION":
          return "The system generates a new order exception, waiting for the merchant to manually create a new order";
        case "CLOSED":
          return "After-sales service is closed";
        case "WAIT_REFUND":
          return "Waiting for the platform to refund";
        default:
          return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.u-order-time {
  font-size: 24rpx;
  color: #999;
  margin: 20rpx 0;
}

.info-view {
  margin: 20rpx 0;
  border-radius: 20rpx;
  background-color: #fff;
  padding: 30rpx;

  .header-title-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #909399;

    .title {
      width: 160rpx;
    }
  }

  .steps-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #909399;
    border-bottom: 1px solid $page-color-base;
    margin-bottom: 10rpx;

    .title {
      width: 160rpx;
    }
  }
}
</style>

<template>
  <view class="coupon-center">
    <swiper class="swiper-box">
      <swiper-item class="swiper-item">
        <scroll-view class="scroll-v" enableBackToTop="true" scroll-y @scrolltolower="loadMore">
          <u-empty mode="coupon" text="No coupons anymore" v-if="whetherEmpty"></u-empty>
          <view v-else class="coupon-item" v-for="(item, index) in couponList" :key="index">
            <view class="left">
              <view class="wave-line">
                <view class="wave" v-for="(item, index) in 12" :key="index"></view>
              </view>
              <view class="message">
                <view>
                  <!-- Determine the current coupon type couponType PRICE || DISCOUNT -->
                  <span v-if="item.couponType =='DISCOUNT'">{{ item.couponDiscount }} discount</span>
                  <span v-else>{{ item.price }}yuan</span>
                </view>
                <view>Full {{ item.consumeThreshold | unitPrice }} is available</view>
              </view>
              <view class="circle circle-top"></view>
              <view class="circle circle-bottom"></view>
            </view>
            <view class="right">
              <view>
                <!-- Determine whether it is a platform, category or store based on scopeType -->
                <view v-if="item.scopeType">
                  <span v-if="item.scopeType =='ALL' && item.id =='platform'">all platforms</span>
                  <span v-if="item.scopeType =='PORTION_CATEGORY'">Category only</span>
                  <view v-else>{{ item.storeName =='platform'?'full platform' :item.storeName+'shop' }}Use</view>
                </view>
                <view>Valid until: {{ item.endTime.split(" ")[0] }}</view>
              </view>
              <view class="receive" @click="receive(item)">
                <text>Click</text><br />
                <text>Receive</text>
              </view>
              <view class="bg-quan"> Coupons </view>
            </view>
          </view>
          <uni-load-more :status="loadStatus"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { receiveCoupons } from "@/api/members.js";
import { getAllCoupons } from "@/api/promotions.js";
export default {
  data() {
    return {
      loadStatus: "more", //Dropdown status
      whetherEmpty: false, //Whether it is empty
      couponList: [], // coupon list
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      storeId: "", //store id
    };
  },
  onLoad(option) {
    this.storeId = option.storeId;
    this.getCoupon();
  },
  onPullDownRefresh() {
    //Pull down to refresh
    this.params.pageNumber = 1;
    this.couponList = [];
    this.getCoupon();
  },
  methods: {
    /**
     * Get current coupons
     */
    getCoupon() {
      uni.showLoading({
        title: "Loading",
      });
      let submitData = {...this.params };
      // Determine whether there is a shop currently
      this.storeId? (submitData = {...this.params, storeId: this.storeId }): "",
        getAllCoupons(submitData)
          .then((res) => {
            uni.hideLoading();
            uni.stopPullDownRefresh();
            if (res.data.code == 200) {
              // If the request is successful, display the data and display it
              let data = res.data.result;
              if (data.total == 0) {
                // When this request data is empty, display empty information
                this.whetherEmpty = true;
              } else {
                this.couponList.push(...data.records);
                this.loadStatus = "noMore";
              }
            }
          })
          .catch((err) => {
            uni.hideLoading();
          });
    },
    /**
     * Receive coupons
     */
    receive(item) {
      receiveCoupons(item.id).then((res) => {
        if (res.data.code == 200) {
          uni.showToast({
            title: "Received successfully",
            icon: "none",
          });
        } else {
          uni.showToast({
            title: res.data.message,
            icon: "none",
          });
        }
      });
    },
    /**
     * load more
     */
    loadMore() {
      if (this.loadStatus != "noMore") {
        this.params.pageNumber++;
        this.getAllCoupons();
      }
    },
  },
  onNavigationBarButtonTap(e) {
    uni.navigateTo({
      url: "/pages/cart/coupon/couponIntro",
    });
  },
};
</script>
<style>
page {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.coupon-center {
  height: 100%;

  .couponList-scroll-content {
    position: relative;
    width: 100%;
    display: flex;
    white-space: nowrap;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    background-color: $main-color;
    color: #ffffff;

    .tab-item {
      width: 160rpx;
      height: 80rpx;
      line-height: 60rpx;
      text-align: center;
      display: inline-block;
    }

    .active {
      border-bottom: 2px solid #ffffff;
      broder-width: 60rpx;
      font-size: 30rpx;
      font-weight: 700;
      padding-bottom: 4rpx;
    }
  }

  .swiper-box {
    height: 100%;

    .scroll-v {
      height: 100%;
    }

    .coupon-item {
      display: flex;
      align-items: center;
      height: 220rpx;
      margin: 20rpx;

      .left {
        height: 100%;
        width: 260rpx;
        background-color: $light-color;
        position: relative;
        .message {
          color: $font-color-white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 40rpx;

          view:nth-child(1) {
            font-weight: bold;
            font-size: 60rpx;
          }

          view:nth-child(2) {
            font-size: $font-sm;
          }
        }

        .wave-line {
          height: 220rpx;
          width: 8rpx;
          position: absolute;
          top: 0;
          left: 0;
          background-color: $light-color;
          overflow: hidden;

          .wave {
            width: 8rpx;
            height: 16rpx;
            background-color: #ffffff;
            border-radius: 0 16rpx 16rpx 0;
            margin-top: 4rpx;
          }
        }
        .circle {
          width: 40rpx;
          height: 40rpx;
          background-color: $bg-color;
          position: absolute;
          border-radius: 50%;
          z-index: 111;
        }
        .circle-top {
          top: -20rpx;
          right: -20rpx;
        }
        .circle-bottom {
          bottom: -20rpx;
          right: -20rpx;
        }
      }

      .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 450rpx;
        font-size: $font-sm;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        position: relative;
        > view:nth-child(1) {
          color: #666666;
          margin-left: 20rpx;
          line-height: 3em;
          > view:nth-child(1) {
            color: #ff6262;
            font-size: 30rpx;
          }
        }

        .receive {
          color: #ffffff;
          background-color: $main-color;
          border-radius: 50%;
          width: 86rpx;
          height: 86rpx;
          text-align: center;
          margin-right: 30rpx;
          vertical-align: middle;
          padding-top: 8rpx;
          position: relative;
          z-index: 2;
        }

        .bg-quan {
          width: 244rpx;
          height: 244rpx;
          border: 6rpx solid $main-color;
          border-radius: 50%;
          opacity: 0.1;
          color: $main-color;
          text-align: center;
          padding-top: 30rpx;
          font-size: 130rpx;
          position: absolute;
          right: -54rpx;
          bottom: -60rpx;
        }
      }
    }
  }
}
</style>

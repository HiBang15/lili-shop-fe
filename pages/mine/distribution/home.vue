<template>
  <view>
    To
    <view class="nav-list">
      <view class="total">Available cash amount</view>
      <view class="price">{{ distributionData.canRebate | unitPrice }}</view>
      <view class="frozen"
      >Frozen amount{{ distributionData.commissionFrozen | unitPrice }}
      </view
      >
    </view>
    <view class="nav">
      <view class="nav-item">
        <u-icon
            size="50"
            @click="handleClick('/pages/mine/distribution/list?id='+distributionData.id+'&name='+distributionData.memberName)"
            color="#ff6b35"
            name="bag-fill"
        ></u-icon>
        <view>Distributing goods</view>
      </view>
      <view
          class="nav-item"
          @click="handleClick(`/pages/mine/distribution/history?type=0&id=${distributionData.id}&name=${distributionData.memberName}`)"
      >
        <u-icon size="50" color="#ff6b35" name="order"></u-icon>
        <view>Distribution performance</view>
      </view>
      <view
          class="nav-item"
          @click="handleClick('/pages/mine/distribution/history?type=1')"
      >
        <u-icon size="50" color="#ff6b35" name="red-packet-fill"></u-icon>
        <view>Withdrawal record</view>
      </view>
      <view
          class="nav-item"
          @click="handleClick('/pages/mine/distribution/withdrawal')"
      >
        <u-icon size="50" color="#ffc71c" name="rmb-circle-fill"></u-icon>
        <view>Withdrawal</view>
      </view>


    </view>

  </view>
</template>

<script>

import { distribution } from '@/api/goods';

export default {

  data() {
    return {
      distributionData: ''
    };
  },
  methods: {
    handleClick(url) {
      uni.navigateTo({
        url
      });
    },
    queryGoods(src) {
      uni.navigateTo({
        url: `/pages/mine/distribution/${ src }`
      });
    },
    /**
     * Initialize promotional products
     */
    init() {
      uni.showLoading({
        title: 'Loading'
      });
      distribution().then((res) => {
        if (res.data.result) {
          this.distributionData = res.data.result;
        }
        uni.hideLoading();
      });
    }
  },
  onShow() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.nav {
  background: #fff;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}

.nav-list {
  color: #fff;
  padding: 40 rpx 0;
  background: $aider-light-color;
}

.total {
  padding: 10 rpx 0;
  text-align: center;
  font-size: 28 rpx;
  opacity: 0.8;
}

.frozen {
  text-align: center;
  font-size: 24 rpx;
  opacity: 0.8;
}

.price {
  text-align: center;
  color: #fff;
  font-size: 50 rpx;
}

.nav-item {
  height: 240 rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > * {
    margin: 10 rpx 0;
  }

  width: 33%;
  // color: #fff;
}
</style>

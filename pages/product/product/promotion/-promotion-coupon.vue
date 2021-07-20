<template>
  <view class="wrapper">

    <div class="coupon-empty" v-if="!res">No coupon available</div>
    <view class="coupon-List" v-if="res && item.__key=='COUPON'" v-for="(item, index) in res" :key="index">

      <view class="coupon-item">
        <view class="top">
          <div class="price">

            <span v-if="item.couponType =='DISCOUNT'">{{ item.couponDiscount }} discount</span>
            <span v-if="item.couponType =='PRICE'">￥{{ item.price | unitPrice }}</span>
          </div>
          <view class="text">

            <div class="coupon-List-title">
              <view v-if="item.scopeType">
                <span v-if="item.scopeType =='ALL' && item.id =='platform'">all platforms</span>
                <span v-if="item.scopeType =='PORTION_CATEGORY'">Category only</span>
                <view v-else>{{ item.storeName == 'platform' ? 'full platform' : item.storeName + 'shop' }}Use</view>
              </view>
            </div>
            <div>Full {{ item.consumeThreshold | unitPrice }} available</div>
          </view>
          <view class="lingqu-btn" @click="getCoupon(item)">
            <div :class="yhqFlag?'cur':''">{{ yhqFlag ? 'Received or completed' : 'Receive immediately' }}</div>
          </view>
        </view>
        <view class="line"></view>
        <view class="time">{{ item.startTime }}-{{ item.endTime }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      yhqFlag: false //Get coupons to determine whether to click
    };
  },
  props: {
    res: {
      type: null,
      default: ''
    }
  },
  watch: {
    res: {
      handler() {
        if (this.res && this.res.length != 0) {
          Object.keys(this.res).forEach((item) => {
            let key = item.split('-')[0];
            this.res[item].__key = key;
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    // Submit coupon
    getCoupon(item) {
      this.yhqFlag = true;

      this.$emit('getCoupon', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-List {
  display: flex;
  flex-direction: column;
  height: 230 rpx;
  background: #e9ebfb;
  margin: 30 rpx 0;
  padding: 10 rpx 30 rpx;

  .line {
    height: 1px;
    background: #fff;
    margin: 0 20 rpx;
    position: relative;

    &:before,
    &:after {
      content: "";
      display: block;
      width: 15 rpx;
      height: 30 rpx;
      background: #fff;
      position: absolute;
      top: -15rpx;
    }

    &:before {
      left: -50rpx;
    }

    &:after {
      right: -50rpx;
    }
  }

  .time {
    flex: 1;
    font-size: 24 rpx;
    align-items: center;
    display: flex;
    align-items: center;
  }
}

.top {
  height: 140 rpx;
  display: flex;

  .price {
    width: 33%;
    justify-content: center;
    color: #6772e5;
    font-size: 40 rpx;
    display: flex;

    height: 100%;
    align-items: center;

    span {
      font-size: 50 rpx;
    }
  }

  .text {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 26 rpx;
    color: 333;
    margin-left: 40 rpx;

    .coupon-List-title {
      font-size: 30 rpx;
      font-weight: bold;
    }
  }

  .lingqu-btn {
    display: flex;
    align-items: center;
    margin-left: 40 rpx;

    text {
      width: 140 rpx;
      height: 40 rpx;
      text-align: center;
      line-height: 40 rpx;
      color: #fff;
      background: #6772e5;
      border-radius: 5px;
      font-size: 26 rpx;

      &.cur {
        background: none;
        transform: rotate(45deg) translate(10 rpx, -46rpx);
      }
    }
  }
}
</style>

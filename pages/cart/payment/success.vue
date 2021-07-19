<template>
  <div class="wrapper">
    <div class="pay-wrapper">
      <div class="pay-money">
        ￥{{ Number(payPrice) | unitPrice }}
      </div>
      <div class="pay-btns">
        <div v-show="!from" @click="checkOrder">View {{ this.orderType == 'RECHARGE' ? 'Balance' : 'Order' }}</div>
        <div @click="navigateTo('/pages/tabbar/home/index','switch')">Back to home page</div>

      </div>
    </div>
    <div class="pay-box">
      <div class="pay-tag-box">
        <h2>The order payment is successful!</h2>

        <div class="pay-item">
          <div>
            payment method:
          </div>
          <div>{{ paymentMethod | paymentTypeFilter }}</div>
        </div>

      </div>
      <!-- #ifdef MP-WEIXIN -->
      <div class="subscribe flex">
        <div>Subscription order status</div>
        <div>
          <u-switch size="50" :disabled="checked" :active-color="activeColor" @change="changeStatus"
                    v-model="checked"></u-switch>
        </div>
      </div>
      <!-- #endif -->
    </div>
    <goodsRecommend />
  </div>

</template>
<script>
import { getWeChatMpMessage } from '@/api/message.js';
import goodsRecommend from '@/components/m-goods-recommend';

export default {
  data() {
    return {
      checked: false,
      paymentMethod: '',

      from: '',
      payPrice: 0,
      goodsList: [],
      activeColor: this.$mainColor

    };
  },
  components: {
    goodsRecommend
  },
  filters: {
    paymentTypeFilter(val) {
      switch (val) {
        case 'WECHAT':
          return 'WeChat';
        case 'ALIPAY':
          return 'Alipay';
        case 'WALLET':
          return 'Balance Payment';
        default:
          return '';
      }
    }
  },
  onLoad(options) {
    this.paymentMethod = options.paymentMethod || '';
    this.from = options.from || '';
    this.payPrice = options.payPrice || 0;
    this.orderType = options.orderType;
  },
  methods: {
    checkOrder() {
      /**
       * check order
       * 1. Recharge and jump to the details
       * 2. Payment jump to order details
       */
      if (this.orderType == 'RECHARGE') {
        uni.reLaunch({
          url: `/pages/mine/deposit/operation`
        });
      } else {
        this.navigateTo('/pages/order/myOrder?status=0');
      }
    },
    changeStatus(val) {
      if (val) {
        this.sendMessage();
      }
    },

    sendMessage() {
      //Subscribe news
      //#ifdef MP-WEIXIN
      getWeChatMpMessage().then((res) => {
        var message = res.data.result;
        var templateid = message.map((item) => item.code);
        uni.requestSubscribeMessage({
          tmplIds: templateid,
          success: (res) => {
            for (let key in res) {
              if (res[key] == 'reject') {
                this.checked = false;
              }
            }
          },
          fail: (res) => {
            uni.removeStorageSync('acceptSubscribeMessage');
            this.checked = false;
          }
        });
      });
      //#endif
    },

    navigateTo(url, type) {
      if (type === 'switch') {
        uni.switchTab({
          url
        });
      } else {
        uni.redirectTo({
          url
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.subscribe {
  justify-content: space-between;
  align-items: center;
  margin: 0 auto 40 rpx auto;
  padding: 0 20 rpx 20 rpx;
  width: 80%;
}

.pay-btns {
  display: flex;
  width: 50%;
  justify-content: space-between;
  margin: 0 auto;
  color: #fff;

  > div {
    padding: 6px 12px;
    border: 1px solid #fff;
    border-radius: 100px;
  }
}

.pay-money {
  line-height: 1;
  font-size: 50 rpx;
  color: #fff;
  margin-bottom: 100 rpx;
}

.pay-item {
  font-weight: bold;
  margin: 32 rpx 0;
  display: flex;
  justify-content: space-between;
  font-size: 24 rpx;
  color: rgba($color: $main-color, $alpha: 0.8);
}

.pay-box {
  overflow: hidden;
}

.pay-tag-box {
  width: 80%;
  margin: 80 rpx auto 40 rpx auto;
  padding: 20 rpx;
  border-radius: 20 rpx;
  background: rgba($color: $main-color, $alpha: 0.2);

  > h2 {
    margin-top: 20 rpx;
    font-size: 40 rpx;
    color: $main-color;
  }
}

.pay-wrapper {
  background-image: linear-gradient(90deg, #fa123b, #ff6b35, #ff9f28, #ffcc03);
  height: 480 rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.pay-box {
  transform: translateY(-100rpx);
  width: 100%;
  background: #fff;
  border-top-right-radius: 100 rpx;
}
</style>

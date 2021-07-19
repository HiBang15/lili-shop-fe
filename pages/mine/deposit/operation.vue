<template>
  <div class="wrapper">
    <u-navbar :custom-back="back" title="balance"></u-navbar>
    <div class="box">
      <div class="deposit">Pre-deposit amount</div>
      <div class="money">￥{{ walletNum | unitPrice }}</div>
      <div class="operation-btns">
        <div class="operation-btn light" @click="navgition('/pages/mine/deposit/withdrawal')">Withdrawal</div>
        <div class="operation-btn" @click="navgition('/pages/mine/deposit/recharge')">Recharge</div>
      </div>
    </div>
    <div class="box list" @click="navgition('/pages/mine/deposit/index')">
      <div class="list-left">Pre-deposit details</div>
      <div class="list-right">
        <u-icon name="arrow-right"></u-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserWallet } from '@/api/members';

export default {
  data() {
    return {
      walletNum: 0
    };
  },
  async mounted() {
    if (this.$options.filters.isLogin('auth')) {
      let result = await getUserWallet(); //Pre-deposit
      this.walletNum = result.data.result.memberWallet;
    } else {
      uni.showToast({
        icon: 'none',
        duration: 3000,
        title: 'Please log in first!'
      });
      uni.redirectTo({
        url: '/pages/passport/login'
      });
    }
  },
  methods: {
    back() {
      uni.switchTab({
        url: '/pages/tabbar/user/my'
      });
    },
    /**
     * Jump
     */
    navgition(url) {
      uni.navigateTo({
        url
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  justify-content: center;
  align-items: center;
}

.list-left {
  flex: 8;
}

.list-right {
  flex: 2;
  text-align: right;
}

.wrapper {
  width: 94%;
  margin: 0 3%;
}

.box {
  margin: 20 rpx 0;
  background: #fff;
  border-radius: 20 rpx;

  padding: 40 rpx;
}

.operation-btns {
  display: flex;
  justify-content: center;
  align-items: center;
}

.money {
  text-align: center;
  color: #333;
  font-size: 50 rpx;
  margin: 20 rpx 0 40 rpx 0;
  letter-spacing: 2 rpx;
}

.deposit {
  margin-top: 50 rpx;
  text-align: center;
  color: #999;
  font-size: 28 rpx;

  letter-spacing: 2 rpx;
}

.operation-btn {
  background: #ee6d41;
  color: #fff;
  height: 90 rpx;
  width: 240 rpx;
  margin: 0 20 rpx;
  border-radius: 10 rpx;
  text-align: center;
  line-height: 90 rpx;
  font-size: 32 rpx;
}

.light {
  background: #fdf2ee;
  color: #ee6d41;
}
</style>

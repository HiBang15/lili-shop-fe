<template>
  <view>
    <view class="-list">
      <view class="title">Withdrawal amount</view>
      <view class="content">
        <view class="price">
          <span> ￥</span>
          <u-input v-model="price" placeholder="" type="number" />
        </view>

        <view class="all">
          <view @click="handleAll" :style="{ color: $mainColor }">All</view>
          <view style="font-size: 24rpx; color: #999">Amount of cash available<span>{{ walletNum | unitPrice }}</span>yuan
          </view>
        </view>
      </view>
    </view>

    <view class="submit" @click="cashd">Withdrawal</view>
  </view>
</template>
<script>
import { getUserWallet, withdrawalApply } from '@/api/members';

export default {
  data() {
    return {
      price: 0,
      walletNum: 0
    };
  },
  async mounted() {
    let result = await getUserWallet(); //Pre-deposit
    this.walletNum = result.data.result.memberWallet;
  },

  methods: {
    cashd() {
      this.price = this.price + '';

      if (this.$u.test.amount(parseInt(this.price))) {
        withdrawalApply({price: this.price}).then((res) => {
          if (res.data.success) {
            uni.showToast({
              title: 'Withdrawal is successful!',
              duration: 2000,
              icon: 'none'
            });
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              });
            }, 1000);
          }
        });
      } else {
        uni.showToast({
          title: 'Please enter the correct amount',
          duration: 2000,
          icon: 'none'
        });
      }
    },
    handleAll() {
      this.price = this.walletNum;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>

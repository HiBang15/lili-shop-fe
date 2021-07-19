<template>
  <view>
    <view class="withdrawal-list">
      <view class="title">Withdrawal amount</view>
      <view class="content">
        <view class="price">
          <span> ￥</span>
          <u-input v-model="price" placeholder="" type="number" />
        </view>

        <view class="all">
          <view @click="handleAll" :style="{ color: $mainColor }">All</view>
          <view style="font-size: 24rpx; color: #999"
          >Cash withdrawal amount<span>{{ distributionData.canRebate | unitPrice }}</span
          >yuan
          </view
          >
        </view>
      </view>
    </view>

    <view class="submit" @click="cashd">Withdrawal</view>
  </view>
</template>
<script>
import { distribution, cash } from '@/api/goods';

export default {
  data() {
    return {
      price: 0,
      distributionData:''
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    cashd() {
      this.price = this.price +'';


      if (this.$u.test.amount(parseInt(this.price))) {
        cash({price: this.price}).then((res) => {
          if (res.data.success) {
            uni.showToast({
              title:'Withdrawal is successful!',
              duration: 2000,
              icon:'none'
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
          title:'Please enter the correct amount',
          duration: 2000,
          icon:'none'
        });
      }
    },
    handleAll() {
      this.price = this.distributionData.canRebate;
    },
    /**
     * Initialize promotional products
     */
    init() {
      uni.showLoading({
        title:'Loading'
      });
      distribution().then((res) => {
        if (res.data.result) {
          this.distributionData = res.data.result;
        }
        uni.hideLoading();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .u-input__input,
.u-input {
  font-size: 80 rpx !important;
  height: 102 rpx !important;

}

/deep/ .u-input__input {
  height: 100%;
  font-size: 80 rpx;
}

.content {
  display: flex;

  > .price {
    width: 60%;
    margin: 20 rpx 0;
    font-size: 80 rpx;
    display: flex;
  }

  > .all {
    justify-content: center;
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}

.withdrawal-list {
  margin: 20 rpx 0;
  background: #fff;
  padding: 16 rpx 32 rpx;
}

.title {
  font-size: 35 rpx;
}

.submit {
  margin: 80 rpx auto;
  width: 94%;
  background: $light-color;
  height: 90 rpx;
  color: #fff;
  border-radius: 10 rpx;
  text-align: center;
  line-height: 90 rpx;
}
</style>

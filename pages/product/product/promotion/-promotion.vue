<template>
  <view>

    <view v-for="(promotionItem,promotionIndex) in promotion" :key="promotionIndex" class="promotion_row"
          @click="shutMask(1)">
      <view v-if="res!=null" v-for="(item, index) in Object.keys(res)" :key="index">
        <div class="promotion_col"
             v-if="item.split('-')[0] == promotionItem.value && item.split('-')[0] =='FULL_DISCOUNT'">
          <!-- Full reduction, discount -->
          <div class="flex">
            <view class="deg_tag">{{ promotionItem.title }}</view>
            <div class="text proText">Full {{ res[item].fullMoney }} yuan, instant discount</div>
          </div>
        </div>
        <div class="promotion_col" v-if="item.split('-')[0] == promotionItem.value && item.split('-')[0] =='PINTUAN'">
          <!-- Join a group -->
          <div class="flex">
            <view class="deg_tag">{{ promotionItem.title }}</view>
            <div class="text proText">{{ res[item].promotionName }}</div>
          </div>
        </div>
        <div class="promotion_col" v-if="item.split('-')[0] == promotionItem.value && item.split('-')[0] =='SECKILL'">
          <!-- Limited time buying -->
          <div class="flex">
            <view class="deg_tag">{{ promotionItem.title }}</view>
            <div class="text proText">{{ res[item].promotionName }}</div>
          </div>
        </div>

      </view>

      <view class="promotion_row" style="display:inline;">
        <view>
          <div class="promotion_col coupon" v-if="couponList && promotionIndex ==1">
            <!-- Coupon -->

            <div>
              <view class="deg_tag">Coupons</view>
            </div>

          </div>
        </view>
      </view>
    </view>

    <view v-if=" this.res != null && Object.keys(res).length == 0">
      No promotion information
    </view>

  </view>
</template>

<script>
import promotion from './promotion_type';

export default {
  data() {
    return {
      promotion,
      couponList: ''
    };
  },
  props: {
    // The data passed back by the parent component
    res: {
      type: null,
      default: {}
    }
  },
  watch: {
    res: {
      handler() {
        if (this.res && this.res.length != 0 && this.res != null) {
          Object.keys(this.res).forEach((item) => {

            let key = item.split('-')[0];
            this.res[item].__key = key;

            if (item.split('-')[0] == 'COUPON') {
              this.couponList = 'COUPON';
            }
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // This method bar uses the parent method
    shutMask(val) {
      this.$emit('shutMasks', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.deg_tag {
  color: $jd-color;
  padding: 0 4 rpx;
  border: 2 rpx solid $jd-color;
  font-size: 22 rpx;
}

.promotion_col {
  /**/
  // margin: 0 0 17rpx 0;

  padding: 0 !important;

  margin: 10 rpx 0;
}

.promotion_row {
  display: flex;
  align-items: center;
}

.flex {
  display: flex;
}

.proText {
  font-size: 26 rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  margin-left: 20 rpx;
}

/deep/ .u-mode-light-error {
  border: none;
}
</style>

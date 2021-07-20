<template>
  <view class="wrapper" v-if="res">

    <view v-for="(prom, index) in Object.keys(res)" :key="index">
      <view>

        <view v-if="prom.split('-')[0] =='FULL_DISCOUNT'">
          <div class="res_prom_item" v-if="res[prom].fullMinus">
            <u-tag text="Full minus" type="error"></u-tag>
            <span class="proText">If you spend {{ res[prom].fullMoney }}, you can get a cash reduction of <span
                class="price">{{ res[prom].fullMinus }}</span></span>
          </div>
          <div class="res_prom_item" v-if="res[prom].fullRate">
            <u-tag text="Discount" type="error"></u-tag>
            <span class="proText">If you spend {{ res[prom].fullMoney }}, you can enjoy a <span
                class="price">{{ res[prom].fullRate }} discount</span> discount</span>
          </div>
        </view>

        <view v-if="prom.split('-')[0] =='PINTUAN'">

          <div class="res_prom_item" v-if="res[prom].requiredNum">
            <u-tag text="join group" type="error"></u-tag>
            <span class="proText">{{ res[prom].requiredNum }} people join a group and purchase limited <span
                class="price">{{ res[prom].limitNum }} pieces</span></span>
          </div>
        </view>

        <view v-if="prom.split('-')[0] =='SECKILL'">
          <div class="res_prom_item">
            <u-tag text="Limited time purchase" type="error"></u-tag>
            <span class="proText">Limited time panic buying</span>
          </div>
        </view>
      </view>
    </view>
    <view v-if="!res">No promotions at this time</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  watch: {
    res: {
      handler() {
        if (this.res && this.res.length != 0) {
          Object.keys(this.res).forEach((item) => {
            if (item != 'COUPON') {
              let key = item.split('-')[0];
              this.res[item]._key = key;
            }
          });
        }
      },

      immediate: true
    }
  },

  props: {
    // The data passed back by the parent component
    res: {
      type: null,
      default: ''
    }
  },
  mounted() {
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.proText {
  font-size: 26 rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  margin-left: 20 rpx;
}

.wrapper {
  display: block;
}

/deep/ .u-mode-light-error {
  border: none;
}

.res_prom_item {
  margin: 20 rpx 0;
}

.price_image {
  display: block;
}
</style>

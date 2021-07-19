<template>
  <view>
    <view class="after-sales-goods-detail-view">
      <view class="header">
        <view>
          This after-sales service will be
          <text class="seller-name">{{ sku.storeName }}</text>
          Provide you with
        </view>
      </view>
      <view>
        <view class="goods-item-view" :key="index" v-for="(item,index) in sku.orderItems" v-if="item.sn == sn"
              @click="navigateToGoodsDetail( sku.skuId)">
          <view class="goods-img">
            <u-image border-radius="6" width="131rpx" height="131rpx" :src="item.image"></u-image>
          </view>
          <view class="goods-info">
            <view class="goods-title u-line-2">{{ item.name }}</view>
            <view class="goods-price">
              <span v-if="sku.orderItems.length <= 1">￥{{ sku.flowPrice }}</span>
              <span class="num" v-else>Purchase quantity{{ item.num }}</span>
              <span v-if="sku.orderItems.length <= 1" class="num">Purchase quantity: {{ item.num }}</span>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="select-view">
      <view class="select-cell" v-if="applyInfo.returnGoods" @click="onSelect(1)">
        <view class="select-image">
          <image style="height: 51rpx; width: 51rpx" src="/static/order/t1.png"></image>
        </view>
        <view class="right">
          <view class="select-title">Returns</view>
          <view class="select-sub-title">
            Return the recovered goods
            <uni-icons color="#BABABA" type="arrowright"></uni-icons>
          </view>
        </view>
      </view>
      <view class="select-cell" v-if="applyInfo.returnMoney" @click="onSelect(3)">
        <view class="select-image">
          <image style="height: 51rpx; width: 51rpx" src="/static/order/t3.png"></image>
        </view>
        <view class="right">
          <view class="select-title">Refund</view>
          <view class="select-sub-title">
            Amount of refunded goods
            <uni-icons color="#BABABA" type="arrowright"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import UniIcons from '@/components/uni-icons/uni-icons.vue';

import { getAfterSaleInfo } from '@/api/after-sale';

export default {
  components: {
    UniIcons
  },
  data() {
    return {
      sn: '',
      sku: {}, //sku
      applyInfo: ''
    };
  },
  onLoad(options) {
    this.sn = options.sn;
    let dData = decodeURIComponent(options.sku);
    let newData = JSON.parse(dData);
    this.sku = newData;

    // Check whether the current product supports refund and return
    this.init();
  },
  methods: {
    // Initialization data
    init() {
      getAfterSaleInfo(this.sn).then((response) => {
        if (response.data.success) {
          this.applyInfo = response.data.result;
        }
      });
    },

    /**
     * Choose the return process
     */
    onSelect(value) {
      uni.redirectTo({
        url: `./afterSalesDetail?sn=${ this.sn }&sku=${ encodeURIComponent(
            JSON.stringify(this.sku)
        ) }&value=${ value }`
      });
    },

    /**
     * Jump to product information
     */
    navigateToGoodsDetail(id) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${ id }&goodsId=${ goodsId }`
      });
    }
  }
};
</script>

<style lang="scss">
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.after-sales-goods-detail-view {
  background-color: #fff;

  .header {
    background-color: #f7f7f7;
    color: #999999;
    font-size: 22 rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    line-height: 70 rpx;

    .header-text {
      background-color: #999999;
      padding: 10 rpx 30 rpx;
      border-radius: 50 rpx;
    }

    .seller-name {
      color: $main-color;
    }
  }

  .goods-item-view {
    display: flex;
    flex-direction: row;
    padding: 10 rpx 30 rpx;
    background-color: #eef1f2;

    .goods-img {
    }

    .goods-info {
      padding-left: 30 rpx;
      flex: 1;

      .goods-title {
        margin-bottom: 10 rpx;
        color: $font-color-dark;
      }

      .goods-specs {
        font-size: 24 rpx;
        margin-bottom: 10 rpx;
        color: #cccccc;
      }

      .goods-price {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 28 rpx;
        margin-bottom: 10 rpx;
        color: $light-color;

        .num {
          font-size: 24 rpx;
          color: #999999;
        }
      }
    }

    .goods-num {
      width: 60 rpx;
      color: $main-color;
    }
  }
}

.select-view {
  background-color: #fff;
  margin-top: 20 rpx;

  .select-cell {
    display: flex;
    align-items: center;
    margin: 0 rpx 20 rpx;
    line-height: 110 rpx;
    border-bottom: 1px solid $page-color-base;

    .select-image {
      width: 51 rpx;
      height: 110 rpx;
      line-height: 110 rpx;
      display: flex;
      align-items: center;
    }

    .right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .select-title {
        margin-left: 18 rpx;
        color: #666666;
        width: 200 rpx;
      }

      .select-sub-title {
        color: #cccccc;
      }
    }
  }
}
</style>

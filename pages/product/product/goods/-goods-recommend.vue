<template>
  <view class="recommend-box">
    <h4 class="goods-recommend-title">Baby recommendation</h4>
    <view class="like-goods-list">
      <view class="like-goods-list">
        <view
            class="like-goods-item"
            @click="clickGoods(item)"
            v-for="(item, index) in res"
            :key="index"
        >
          <u-image
              :fade="true"
              duration="450"
              :lazy-load="true"
              :src="item.thumbnail"
              width="330rpx"
              height="330rpx"
              class="like-goods-uimage"
          >
            <u-loading slot="loading"></u-loading>
          </u-image>
          <view style="background-color: #ffffff; width: 100%">
            <view class="name">{{ item.goodsName }}</view>
            <view class="price-sales">
              <div class="item-price" v-if="item.price != undefined">
                $
                <span>{{ formatPrice(item.price)[0] }}</span>
                .{{ formatPrice(item.price)[1] }}
                <!-- <text v-if="item.point != undefined">+{{ item.point }}Points</text> -->
              </div>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['res'],
  methods: {
    // Click on store recommendation
    clickGoods(val) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${ val.id }&goodsId=${ val.goodsId }`
      });
    },
    // Format money 1999 --> [1999,00]
    formatPrice(val) {
      if (typeof val == 'undefined') {
        return val;
      }

      return val.toFixed(2).split('.');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../mp-goods.scss";
@import "../product.scss";

.goods_recomm {
  padding: 12px 0 20 rpx 20 rpx;
  color: #000;
  font-size: 30 rpx;
  font-weight: 400;
  margin-bottom: 28 rpx;
}

.like-goods-uimage {
  /deep/ .u-image {
    height: 350 rpx !important;
  }

  width: 100%;
}

.recommend-box {
  background-color: #ffffff;

  width: 100%;

  padding-bottom: 120 rpx;

  .title {
    width: 120 rpx;
    height: 42 rpx;
    font-size: 30 rpx;
    font-weight: 700;
    text-align: left;
    color: #333333;
    margin-left: 20 rpx;
  }
}

.like-goods-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.like-goods-item {
  padding: 0 !important;
  width: 48%;
  margin: 0 1% 10 rpx 1%;
  background: #f7f7f7;
  border-radius: 12 rpx;

  overflow: hidden;

  /deep/ .u-image {
    width: 100%;
  }
}

.like-goods-list {
  // background-color: #f8f8f8;
  width: 100%;
  margin-bottom: 100 rpx;

  .name {
    padding: 14 rpx 8 rpx 0 8 rpx;

    color: #333;
    font-size: 24 rpx;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;

    -webkit-line-clamp: 2;

    background: #f7f7f7;
    height: 80 rpx;
  }

  .price-sales {
    padding: 8 rpx;
    background: #f7f7f7;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item-price {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 26 rpx;
      text-align: left;
      color: $jd-color;
      line-height: 23px;
      font-weight: bold;

      > span {
        font-size: 32 rpx;
      }
    }

    .sales {
      line-height: 23px;
      font-size: 22 rpx;
      text-align: left;
      letter-spacing: 0;
      color: #cccccc;
      // padding-right: 10rpx;
    }
  }
}
</style>

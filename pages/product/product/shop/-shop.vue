<template>
  <view v-if="storeDetail">
    <!-- Store Information -->
    <view class="store-info">
      <view class="logo">
        <u-image width="120rpx" mode="aspectFit" height="120rpx" :src="storeDetail.storeLogo"></u-image>
      </view>
      <view class="name-star star-con">
        <div class="name">
          {{ storeDetail.storeName }}
          <span v-if="storeDetail.selfOperated == 1" class="shopTag">self-operated</span>
        </div>
        <div class="store-row">
          <div class="collectionNum">{{ storeDetail.collectionNum || 0 }} Followed by people</div>
          <div class="goodsNum">{{ storeDetail.goodsNum || 0 }} items</div>
        </div>
      </view>
      <view class="to-store-btn" @click="tostorePage(goodsDetail)">
        <view>Enter the store and stroll around</view>
      </view>
    </view>

    <view class="store-recommend">
      <view class="store-recommend-title">Product recommendation</view>
      <view class="recommend-list">
        <view class="recommend-item" @click="clickGoods(item)" v-for="(item, index) in res" :key="index">
          <u-image class="recommend-item-img" :fade="true" duration="450" ​​:lazy-load="true" :src="item.thumbnail"
                   height="218rpx">
            <u-loading slot="loading"></u-loading>
            <view slot="error" style="font-size: 24rpx; ">Failed to load</view>
          </u-image>
          <view class="recommend-item-name">
            {{ item.goodsName }}
          </view>
          <view class="item-price" v-if="item.price != undefined">
            ￥<span class="item-price-blod">{{ formatPrice(item.price)[0] }}</span>.{{ formatPrice(item.price)[1] }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['res', 'goodsDetail', 'storeDetail'],
  mounted() {
  },
  methods: {
    // Format money 1999 --> [1999,00]
    formatPrice(val) {
      if (typeof val == 'undefined') {
        return val;
      }
      return val.toFixed(2).split('.');
    },
    // Click on the product
    clickGoods(val) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${ val.id }&goodsId=${ val.goodsId }`
      });
    },

    tostorePage(val) {
      uni.navigateTo({
        url: '../product/shopPage?id=' + val.storeId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../product.scss";

.recommend-item-name {
  height: 70 rpx;
  color: #333;
  font-weight: 400;
  font-size: 24 rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-price-blod {
  font-weight: bold;
  font-size: 32 rpx;
}

.recommend-item {
  width: 30%;
  margin: 10 rpx 0 rpx;
  overflow: hidden;
  border-radius: 12 rpx;

  /deep/ .u-image__image {
    height: 218 rpx;
    border-radius: 12 rpx !important;
  }
}

.recommend-item-img {
  /deep/ .u-image__image {
    width: 100% !important;
  }
}

.shopTag {
  background: $main-color;
  font-size: 24 rpx;
  padding: 0 12 rpx;
  margin-left: 10 rpx;
  font-weight: normal;
  border-radius: 10 rpx;
  color: #fff;
}

.recommend-list-view {
  width: 100%;
}

.store-info {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 40 rpx 20 rpx 50 rpx;

  .logo {
    overflow: hidden;
    border-radius: 6px;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  .name-star {
    flex: 1;
    margin-left: 20 rpx;
    padding: 10 rpx 0;
    font-size: 30 rpx;

    .name {
      display: flex;
      width: 100%;
      font-weight: 700;
      font-size: 28 rpx;
      line-height: 24px;
      margin-left: 10px;
    }

    .desc {
      font-size: 12px;
      color: #999;
      margin-left: 10px;

      text {
        margin-right: 10px;
      }
    }
  }

  .to-store-btn {
    display: flex;
    align-items: center;

    > view {
      font-size: 24 rpx;
      color: #fff;
      width: 160 rpx;
      height: 60 rpx;
      line-height: 60 rpx;
      text-align: center;
      background: $main-color;
      border-radius: 28 rpx;
    }
  }
}

/* star */
.star-con {
  display: flex;
  flex-direction: column;

  view {
    display: flex;
    align-items: center;

    .star {
      width: 30 rpx;
      height: 30 rpx;
      background: url(https://image.shutterstock.com/image-vector/star-icon-vector-illustration-260nw-474687040.jpg);
      background-size: 100%;
    }
  }
}

.recommend-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  /deep/ .u-row {
    width: 100%;
  }

  .item-price {
    margin: 10 rpx 0 20 rpx 0;
    text-align: left;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    margin: 18 rpx 0;
    font-size: 22 rpx;
    color: $jd-color;
  }

  .recommend-list-con {
    display: flex;
    flex-direction: column;
    width: 32%;
    margin-bottom: 24 rpx;
  }

  .name {
    overflow: hidden;
    white-space: nowrap;
  }
}

.store-recommend {
  background: #fff;

  margin: 20 rpx 0 0 0;
}

.goodsNum,
.collectionNum {
  font-size: 24 rpx;
  color: #999;
}

.store-row {
  display: flex;
  margin: 10 rpx 0;

  > div {
    margin-right: 20 rpx;
  }
}
</style>

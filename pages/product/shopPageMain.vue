<template>
  <view class="store-page">
    <view>
      <!-- Store Information -->
      <view class="store-info">
        <view class="logo">
          <image :src="storeInfo.storeLogo ||'/static/logo.png'" mode="aspectFit"></image>
        </view>
        <view class="store-name">
          <view class="name">{{ storeInfo.storeName }}</view>
          <view>{{ storeInfo.goodsNum || 0 }}Follow {{ storeInfo.collectionNum || 0 }} items</view>
        </view>
        <view class="follow" @click="whetherCollection">
          <view>{{ isCollection == 'success' ? 'Followed' : '+ Follow' }}</view>
        </view>
      </view>
      <view class="store-intro">
        <view class="title">Store introduction</view>
        <view class="text">
          <view v-html="storeInfo.storeDesc"></view>

        </view>
      </view>
      <!-- Coupon -->
      <scroll-view scroll-x="true" show-scrollbar="false" class="discount" v-if="couponList.length> 0">
        <view class="card-box" v-for="(item, index) in couponList" :key="index">
          <view class="card" @click="getCoupon(item)">
            <view class="money">
              <view>
                <span v-if="item.couponType =='DISCOUNT'">{{ item.couponDiscount }} discount</span>
                <span v-else>{{ item.price }}yuan</span>
              </view>

            </view>
            <view class="xian"></view>
            <view class="text">
              <text>{{ 'Receive coupons' }}</text>
              <text>Full {{ item.consumeThreshold | unitPrice }} is available</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- Featured Products -->
      <view class="handpick">
        <view class="title">Selected Products</view>
        <view class="contant">
          <view v-if="!recommandGoods.length" class="no-goods">No product information temporarily</view>
          <view v-else class="item" v-for="(item,index) in recommandGoods" :key="index"
                @click="navigateToGoodsDetail(item)">
            <u-image width="324rpx" height="324rpx" mode="aspectFit" :src="item.thumbnail">
              <u-loading slot="loading"></u-loading>
            </u-image>
            <div class="name">{{ item.goodsName }}</div>
            <div class="price">
              <div>￥{{ item.price | unitPrice }}</div>
            </div>
            <view class="buyCount">
              <div>Sold {{ item.buyCount || '0' }}</div>
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import { getstoreBaseInfo } from '@/api/store.js';
import {
  receiveCoupons,
  deleteGoodsCollection,
  collectionGoods,
  getGoodsIsCollect
} from '@/api/members.js';
import { getGoodsList } from '@/api/goods.js';
import { getAllCoupons } from '@/api/promotions.js';

export default {
  props: {
    storeId: {
      value: Number
    },
    load: {
      value: Boolean
    }
  },
  data() {
    return {
      // Store introduction button
      storeInfo: '', //Store details
      isCollection: false, //Whether to follow
      recommandGoods: [], //Recommended Goods
      couponList: [], //Coupon list
      params: {
        pageNumber: 1,
        pageSize: 50,
        storeId: ''
      }
    };
  },
  watch: {},
  mounted(options) {
    if (this.$options.filters.isLogin('auth')) {
      getGoodsIsCollect('STORE', this.storeId).then((res) => {
        this.isCollection = res.data.message;
      });
    }
    this.initStoreInfo();
  },
  methods: {

    /**
     * Store Information
     */
    initStoreInfo() {
      uni.showLoading({
        title: 'Loading'
      });
      this.params.storeId = this.storeId;
      getstoreBaseInfo(this.storeId).then((res) => {
        if (res.data.success) {
          this.storeInfo = res.data.result;
          uni.hideLoading();
          Promise.all([
            getAllCoupons(this.params),
            getGoodsList({storeId: this.storeId}),

          ]).then((res) => {
            this.couponList = res[0].data.result.records;
            this.recommandGoods = res[1].data.result.content;
          });
        } else {
          uni.reLaunch({
            url: '/'
          });
        }
      });
    },


    /**
     * Jump to product details
     */
    navigateToGoodsDetail(val) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${ val.id }&goodsId=${ val.goodsId }`
      });
    },

    /**
     * Whether to collect
     */
    whetherCollection() {
      if (this.isCollection) {
        deleteGoodsCollection('STORE', this.storeId).then((res) => {
          if (res.statusCode === 200) {
            this.isCollection = 'error';
            uni.showToast({
              icon: 'none',
              duration: 3000,
              title: 'Unfollow successfully!'
            });
          }
        });
      } else {
        collectionGoods('STORE', this.storeId).then((res) => {
          if (res.statusCode === 200) {
            this.isCollection = 'success';
            uni.showToast({
              icon: 'none',
              duration: 3000,
              title: 'Follow success!'
            });
          }
        });
      }
    },

    /**
     * Get coupons
     */
    getCoupon(item) {
      if (!this.$options.filters.isLogin('auth')) {
        uni.showToast({
          icon: 'none',
          duration: 3000,
          title: 'Please log in first!'
        });
        uni.redirectTo({
          url: '/pages/passport/login'
        });
        return false;
      }
      receiveCoupons(item.id).then((res) => {
        if (res.data.success) {
          uni.showToast({
            icon: 'none',
            duration: 3000,
            title: 'Received successfully!'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.store-page {
  height: 100%;
  background: #fff;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90 rpx;
    line-height: 90 rpx;
    font-size: 30 rpx;
    z-index: 9999;
  }

  .tab-header {
    position: fixed;
    top: 90 rpx;
    left: 0;
    right: 0;
    height: 100 rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30 rpx;
    z-index: 9999;
    background: #fff;

    text {
      width: 30%;
      text-align: center;

      &.cur {
        color: #29bb9c;
        font-size: 34 rpx;
        font-weight: 500;
      }
    }
  }

  .header-line {
    height: 1px;
    background: #f2f2f2;
    position: fixed;
    top: 190 rpx;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .store-info {
    display: flex;
    justify-content: space-between;
    padding: 40 rpx 40 rpx 30 rpx;

    .logo {
      width: 128 rpx;
      height: 128 rpx;
      overflow: hidden;
      border-radius: 6px;

      image {
        width: 128 rpx;
        height: 128 rpx;
      }
    }

    .store-name {
      text-align: center;
      font-size: 26 rpx;
      color: #999;
      margin-left: -50rpx;

      .name {
        margin: 20 rpx 0 16 rpx;
        font-size: 30 rpx;
        color: #333;
        text-align: left;
      }
    }

    .follow {
      padding: 40 rpx 0;

      > view {
        font-size: 26 rpx;
        color: #fff;
        padding: 0 30 rpx;
        height: 56 rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        background: $aider-light-color;
        border-radius: 28 rpx;

        text {
          font-size: 40 rpx;
        }
      }
    }
  }

  .store-intro {
    padding: 0 40 rpx 18 rpx;

    .title,
    .text {
      font-size: 26 rpx;
      color: #999999;
      line-height: 48 rpx;
    }

    .title {
      padding-left: 20 rpx;
      position: relative;

      &:before {
        content: "";
        width: 1px;
        height: 45 rpx;
        background: #999;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .text {
      position: relative;

      &.close {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 46 rpx;
      }

      &.open {
        padding-right: 0;
        white-space: wrap;
        overflow: auto;
        text-overflow: clip;
      }

      .zhankai {
        width: 20 rpx;
        height: 20 rpx;
        position: absolute;
        right: 10 rpx;
        bottom: 0;
        border-top: 3px solid #999;
        border-right: 3px solid #999;

        &.close {
          transform: rotateZ(135deg);
          bottom: 15 rpx;
        }

        &.open {
          transform: rotateZ(-45deg);
        }
      }
    }
  }

  .discount {
    height: 189 rpx;
    border-top: 1px solid #f6f6f6;
    border-bottom: 18 rpx solid #f6f6f6;
    background: #f6f6f6;
    overflow: hidden;
    white-space: nowrap;

    .card-box {
      display: inline-block;
      padding-top: 25 rpx;
    }

    .card {
      width: 324 rpx;
      height: 116 rpx;
      background: #fff;
      margin-left: 20 rpx;
      border-radius: 5px;
      display: flex;
      align-items: center;

      .money {
        width: 45%;
        color: #fd6466;
        font-weight: 500;
        text-align: center;

        text {
          font-size: 50 rpx;
        }
      }

      .xian {
        height: 66 rpx;
        border: 1px dashed #f6f6f6;
        position: relative;

        &:before,
        &:after {
          content: "";
          width: 22 rpx;
          height: 12 rpx;
          position: absolute;
          background: #f6f6f6;
        }

        &:before {
          border-radius: 0 0 22 rpx 22 rpx;
          top: -30rpx;
          left: -10rpx;
        }

        &:after {
          border-radius: 22 rpx 22 rpx 0 0;
          bottom: -30rpx;
          left: -10rpx;
        }
      }

      .text {
        flex: 1;
        color: $aider-light-color;
        font-size: 24 rpx;
        display: flex;
        flex-direction: column;
        margin-left: 14 rpx;

        text:nth-of-type(2) {
          color: #ccc;
        }

        .cur:nth-of-type(1) {
          color: #ccc;
        }
      }
    }
  }

  .hot,
  .handpick {
    .title {
      height: 132 rpx;
      padding: 0 20 rpx;
      line-height: 132 rpx;
      font-size: 32 rpx;
      text-align: center;
      position: relative;

      &:before,
      &:after {
        content: "";
        width: 44 rpx;
        height: 6 rpx;
        position: absolute;
        background: #f0f1fc;
      }

      &:before {
        top: 63 rpx;
        left: 236 rpx;
      }

      &:after {
        border-radius: 22 rpx 22 rpx 0 0;
        top: 63 rpx;
        right: 236 rpx;
      }
    }

    .no-goods {
      width: 100%;
      height: 364 rpx;
      text-align: center;
      line-height: 364 rpx;
      color: #999999;
    }
  }

  .hot {
    .contant {
      height: 364 rpx;
      display: flex;
      padding: 0 20 rpx;
      overflow: hidden;
      white-space: nowrap;

      .item-box {
        display: inline-block;
      }

      .item {
        width: 216 rpx;
        margin-left: 15 rpx;
        font-size: 24 rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        image {
          width: 212 rpx;
          height: 212 rpx;
        }

        .name {
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 66 rpx;
        }

        .price {
          font-weight: 500;
          margin-bottom: 20 rpx;
          color: #fd6466;

          text {
            font-size: 26 rpx;
          }
        }
      }
    }

    border-bottom: 18 rpx solid #f9f9f9;
  }

  .item-img-recommand {
    width: 324 rpx !important;
    height: 324 rpx !important;
  }

  .item-img {
    width: 212 rpx !important;
    height: 212 rpx !important;
  }

  .handpick {
    background: #fff;

    .contant {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 40 rpx;

      .item {
        width: 324 rpx;
        height: 484 rpx;
        font-size: 26 rpx;
        display: flex;
        flex-direction: column;
        border: 1px solid #f8f8f8;
        margin-bottom: 20 rpx;

        image {
          width: 324 rpx;
          height: 260 rpx;
        }

        .name {
          text-align: left !important;
          color: #333;
          padding: 0 20 rpx;
          margin-top: 20 rpx;
          line-height: 1.4em;
          max-height: 2.8em; //height是line-height的整数倍，防止文字显示不全
          overflow: hidden;
        }

        .price {
          font-weight: 500;
          color: $main-color;
          font-size: 30 rpx;
          padding: 0 20 rpx;
          margin-top: 20 rpx;
          white-space: nowrap;
        }

        .buyCount {
          display: flex;
          padding: 0 20 rpx;
          font-size: 24 upx;
          justify-content: space-between;
          color: #999;
        }
      }
    }
  }

  .bottom {
    background: #fff;
    height: 90 rpx;
    text-align: center;

    text {
      color: #ccc;
      font-size: 24 rpx;
      position: relative;

      &:before {
        content: "";
        display: block;
        width: 180 rpx;
        height: 1px;
        background: #f0f1fc;
        position: absolute;
        top: 20 rpx;
        left: -270rpx;
      }

      &:after {
        content: "";
        display: block;
        width: 180 rpx;
        height: 1px;
        background: #f0f1fc;
        position: absolute;
        top: 20 rpx;
        right: -200rpx;
      }
    }
  }
}
</style>

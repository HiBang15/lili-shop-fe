<template>
  <view class="sale">
    <view class="sale-head">
      <image src="@/pages/promotion/static/head-sample.png"></image>
    </view>
    <scroll-view scroll-x>
      <view class="index-navs">
        <view class="index-nav-v">
          <view class="index-nav" :class="{'index-nav-active': nav == index }" @click="clickNavigateTime(index)"
                v-for="(item, index) in timeLine" :key="index">
            {{ item.timeLine }}:00
            <view class="index-nav-desc">{{
                index === 0 && item.distanceStartTime === 0 ? 'Buying soon' : 'Coming soon'
              }}
            </view>
          </view>
        </view>
      </view>
      <view class="trailer" v-if="timeLine[nav] && times">
        {{
          timeLine[nav].distanceStartTime === 0 ? (onlyOne ? 'distance to end' : 'distance to next round') : 'distance to start'
        }}
        {{ times.hours == '00' ? '0' : times.hours }} hours {{ times.minutes }} minutes {{ times.seconds }} seconds
      </view>
    </scroll-view>
    <view class="sale-items" v-if="goodsList.length> 0">
      <view class="sale-item" v-for="(item,index) in goodsList" :key="index">
        <view class="sale-item-img">
          <image :src="item.goodsImage" mode="aspectFill"></image>
        </view>
        <view class="sale-item-content">
          <view class="sale-item-title">
            {{ item.goodsName }}
            <view class="sale-item-title-desc"></view>
          </view>
          <view class="sale-item-price">
            <text class="sale-item-price-now">¥{{ item.price | unitPrice }}</text>
            <text class="sale-item-price-origin"> ¥{{ item.originalPrice | unitPrice }}</text>
          </view>
          <view class="sale-item-surplus">
            Only {{ item.quantity - item.salesNum }} left
            <view class="sale-item-surplus-text"
                  :style="{ width: (item.quantity / (item.quantity-item.salesNum)) * 100 +'%' }">
            </view>
          </view>
          <view class="sale-item-btn" @click="navigateToGoodsDetail(item)">
            {{
              timeLine[nav].distanceStartTime === 0 ? (item.salesNum === item.quantity ? 'Sold out' : 'Purchase') : 'Coming soon'
            }}
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="nodata">
        <image style="height: 240rpx;width: 320rpx;" src="/static/nodata.png" alt="" />
        <div>No products yet</div>
      </view>
    </view>

  </view>
</template>

<script>
import { getSeckillTimeLine, getSeckillTimeGoods } from '@/api/promotions.js';
import Foundation from '@/utils/Foundation.js';

export default {
  data() {
    return {
      nav: 0, //The first time is selected by default
      timeLine: '', //Get a few points of activity
      resTime: 0, //current time
      time: 0, //Time value from the next activity
      times: {}, //Time collection
      onlyOne: '', //Is the last product
      goodsList: [], //Commodity collection
      params: {
        pageNumber: 1,
        pageSize: 10
      }
    };
  },

  /**
   * Show time activity
   */
  async onShow() {
    await this.getTimeLine();
    if (!this.timeLine) {
      await uni.showToast({
        icon: 'none',
        duration: 2000,
        title: 'No event today, come back tomorrow'
      });
    }
    this._setTimeInterval = setInterval(() => {
      if (this.time <= 0) {
        clearInterval(this._setTimeInterval);
        this.getGoodsList();
        this.getTimeLine();
      } else {
        this.times = Foundation.countTimeDown(this.time);
        this.time--;
      }
    }, 1000);
  },

  onUnload() {
    this._setTimeInterval && clearInterval(this._setTimeInterval);
  },
  methods: {
    /**
     * Get timeline products
     */
    async getTimeLine() {
      let res = await getSeckillTimeLine();
      if (res.data.success && res.data.result.length > 0) {
        let timeLine = res.data.result.sort(
            (x, y) => Number(x.timeLine) - Number(y.timeLine)
        );
        this.timeLine = timeLine.slice(0, 5);
        this.resTime = parseInt(new Date().getTime() / 1000);
        this.onlyOne = res.data.result.length === 1;
        this.diffTime = parseInt(new Date().getTime() / 1000) - this.resTime;

        this.time =
            this.timeLine[this.nav].distanceStartTime ||
            (this.timeLine[this.nav + 1] &&
                this.timeLine[this.nav + 1].distanceStartTime) ||
            Foundation.theNextDayTime() - this.diffTime;
        this.times = Foundation.countTimeDown(this.time);

        this.getGoodsList();
      }
    },

    /**
     * Get product collection
     */
    async getGoodsList() {
      this.params.timeLine = this.timeLine[this.nav].timeLine;
      let res = await getSeckillTimeGoods(this.params.timeLine);
      if (res.data.success && res.data.result.length != 0) {
        this.goodsList = res.data.result;
      } else {
        this.goodsList = [];
      }
    },

    /**
     * Jump to product details
     */
    navigateToGoodsDetail(item) {
      if (
          item.sold_num === item.quantity ||
          this.timeLine[this.nav].distanceStartTime !== 0
      ) {
        return;
      } else {
        uni.navigateTo({
          url: `/pages/product/goods?id=${ item.skuId }&goodsId=${ item.goodsId }`
        });
      }
    },

    /**
     * Click navigation time
     */
    clickNavigateTime(type) {
      this.nav = type;
      this.diffTime = parseInt(new Date().getTime() / 1000) - this.resTime;
      this.time =
          this.timeLine[this.nav].distanceStartTime ||
          (this.timeLine[this.nav + 1] &&
              this.timeLine[this.nav + 1].distanceStartTime) ||
          Foundation.theNextDayTime() - this.diffTime;

      this.times = Foundation.countTimeDown(this.time);
      this.getGoodsList();
    }
  }
};
</script>

<style lang="scss" scoped>
.sale {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f7f7;
}

.nodata {
  flex-direction: column;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 40 rpx;

  > div {
    font-size: 24 rpx;
    margin-top: 20 rpx;
    color: #666;
  }
}

.sale-head {
  image {
    width: 100%;
    height: 280 rpx;
  }
}

.sale-items {
  padding-top: 20 rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.sale-item {
  width: 710 rpx;
  height: 226 rpx;
  padding-left: 20 rpx;
  margin-bottom: 10 rpx;
  border-radius: 12 rpx;
  background-color: #fff;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}

.sale-item-img {
  margin-right: 20 rpx;

  image {
    width: 186 rpx;
    height: 186 rpx;
    border-radius: 8 rpx;
  }
}

.sale-item-content {
  line-height: 2em;
}

.sale-item-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.5;
  font-size: 28 rpx;
  color: #333;
}

.sale-item-title-desc {
  font-size: 22 rpx;
  color: #999;
}

.sale-item-price {
  font-size: 22 rpx;
  color: 999;
}

.sale-item-price-now {
  font-size: 40 rpx;
  color: #ff5a10;
  margin: 0 10 rpx;
}

.sale-item-price-origin {
  font-size: 20 rpx;
  color: #999;

  -webkit-text-decoration-line: line-through;
  text-decoration-line: line-through;
  text-decoration: line-through;
}

.sale-item-surplus {
  border: 2 rpx solid rgb(34, 178, 140);
  border-radius: 12px;
  width: 166 rpx;
  color: rgb(31, 177, 138);
  font-size: 20 rpx;
  position: relative;
  text-align: center;
  z-index: 2;
  height: 32 rpx;
  line-height: 28 rpx;
  overflow: hidden;
}

.sale-item-surplus-text {
  width: 166 rpx;
  background: rgb(234, 247, 245);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  height: 100%;
}

.sale-item-btn {
  position: absolute;
  right: 20 rpx;
  bottom: 20 rpx;
  padding: 0 20 rpx;
  height: 60 rpx;
  background-color: #1abc9c;
  border-radius: 10 rpx;
  font-size: 25 rpx;
  color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trailer {
  height: 100 rpx;
  background: #ffffff;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22 rpx;
  color: #666666;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}

.index-navs {
  background-color: #f7f7f7;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.index-nav-v {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.index-nav {
  font-size: 28 rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150 rpx;
  flex-direction: column;
  color: #bababa;
  height: 115 rpx;
  line-height: 1em;
  position: relative;

  &-active {
    background-image: url(/static/seckill/active.png);
    background-size: 100% 115 rpx;
    background-repeat: no-repeat;
    color: #ffffff;
    position: relative;
    z-index: 30;

    .index-nav-desc {
      color: #ffffff;
    }
  }
}

.index-nav-desc {
  margin-top: 8 rpx;
  font-size: 22 rpx;
  color: #bababa;
}
</style>

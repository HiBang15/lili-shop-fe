<template>
  <view class="content">
    <view class="navbar">
      <!-- Loop out the nav bar at the top -->
      <view v-for="(item, index) in navList" :key="index" class="nav-item" @click="tabClick(index)">
        <text :class="{current: tabCurrentIndex === index}">{{item.text}}</text>
      </view>
    </view>
    <view class="swiper-box">
      <!-- Show product column -->
      <view v-if="tabCurrentIndex == 0" class="tab-content">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadMore">
          <!-- Blank page -->
          <u-empty text="No favorite product data yet" mode="favor" v-if="goodsEmpty"></u-empty>
           <!-- Product display data -->
          <u-swipe-action @open="openLeftChange(item,index,'goods')" :show="item.selected" btn-width="180" :options="LeftOptions" v-else v-for=" (item,index) in goodList"
            @click="clickGoodsSwiperAction(item,index)" :index="index" :key="index">
            <view class="goods" @click="goGoodsDetail(item)">
              <u-image width="131rpx" height="131rpx" :src="item.image" mode="aspectFit">
                <u-loading slot="loading"></u-loading>
              </u-image>
              <view class="goods-intro">
                <view>{{item.goodsName}}</view>
                <view class="goods-sn">{{item.goods_sn}}</view>
                <view>￥{{item.price | unitPrice}}</view>
              </view>
            </view>
          </u-swipe-action>

          <uni-load-more :status="goodsLoad"></uni-load-more>
        </scroll-view>
      </view>
      <!-- Show the favorite shop bar -->
      <view v-else class="tab-content">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadMore">
          <!-- Blank page -->
          <u-empty text="No favorite store data yet" mode="favor" v-if="storeEmpty"></u-empty>
          <!-- Store display data -->
          <u-swipe-action @open="openLeftChange(item,'store')" :show="item.selected" btn-width="180" :options="LeftOptions" v-else v-for="(item ,index) in storeList" :key="index"
            @click="clickstoreSwiperAction(item)">
            <view class="store" @click="gostoreMainPage(item.storeId)">
              <view class="intro">
                <view class="store-logo">
                  <u-image width="102rpx" height="102rpx" :src="item.logo" :alt="item.storeName" mode="aspectFit">
                    <u-loading slot="loading"></u-loading>
                  </u-image>
                </view>
                <view class="store-name">
                  <view>{{item.storeName}}</view>
                  <u-tag size="mini" type="error" :color="$mainColor" v-if="item.selfOperated" text="self-operated" mode="plain" shape="circle" />
                </view>
                <view class="store-collect">
                  <view>Enter the store and stroll around</view>
                </view>
              </view>
            </view>
          </u-swipe-action>
          <uni-load-more :status="storeLoad"></uni-load-more>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getGoodsCollection,
  deleteGoodsCollection,
  deleteStoreCollection,
} from "@/api/members.js";
export default {
  data() {
    return {
      // Product left sidebar
      LeftOptions: [
        {
          text: "Cancel",
          style: {
            backgroundColor: this.$lightColor,
          },
        },
      ],
      tabCurrentIndex: 0, //The subscript of the tab defaults to 0, which means that the product will be requested by default
      navList: [
        //tab display data
        {
          text: "Product (0)",
          loadingType: "more",
          params: {
            pageNumber: 1,
            pageSize: 10,
          },
        },
        {
          text: "Shop (0)",
          loadingType: "more",
          params: {
            pageNumber: 1,
            pageSize: 10,
          },
        },
      ],
      goodsLoad: "more", //Commodity loading
      storeLoad: "more", //store load
      goodsEmpty: false, //Whether the product data is empty
      storeEmpty: false, //Whether the store data is empty
      goodList: [], //Commodity collection
      storeList: [], //Store collection
    };
  },
  onLoad() {
    this.getGoodList();
    this.getstoreList();
  },

  methods: {
    /**
     * Open the left side of the product to cancel the collection
     */
    openLeftChange(val, type) {
      const {goodList, storeList} = this;
      let way;
      type == "goods"? (way = goodList): (way = storeList);
      way.forEach((item) => {
        this.$set(item, "selected", false);
      });
      this.$set(val, "selected", false);
      val.selected = true;
    },

    /**
     * Click on the left side of the product to cancel the collection
     */
    clickGoodsSwiperAction(val) {
      deleteGoodsCollection(val.skuId).then((res) => {

        if (res.statusCode == 200) {
          this.storeList = [];
          this.goodList = [];
          this.getGoodList();
        }
      });
    },

    /**
     * Click on the left side of the shop to cancel the collection
     */
    clickstoreSwiperAction(val) {
      deleteStoreCollection(val.storeId).then((res) => {
        if (res.statusCode == 200) {
          this.storeList = [];
          this.getstoreList();
        }
      });
    },

    /**
     * Click on the top tab
     */
    tabClick(index) {
      this.tabCurrentIndex = index;

    },

    /**
     * View product details
     */
    goGoodsDetail(val) {
      //product details
      uni.navigateTo({
        url: "/pages/product/goods?id=" + val.skuId + "&goodsId=" + val.goodsId,
      });
    },

    /**
     * View store details
     */
    gostoreMainPage(id) {
      //Shop homepage
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + id,
      });
    },

    /**
     * Get product collection
     */
    getGoodList() {
      uni.showLoading({
        title: "Loading",
      });
      getGoodsCollection(this.navList[0].params, "GOODS").then((res) => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        if (res.data.success) {
          let data = res.data.result;
          data.selected = false;
          this.navList[0].text = `Product(${data.total})`;
          if (data.total == 0) {
            this.goodsEmpty = true;
          } else if (data.total <10) {
            this.goodsLoad = "noMore";
            this.goodList.push(...data.records);
          } else {
            this.goodList.push(...data.records);
            if (data.total.length <10) this.goodsLoad = "noMore";
          }
        }
      });
    },

    /**
     * Get the store collection
     */
    getstoreList() {
      uni.showLoading({
        title: "Loading",
      });
      getGoodsCollection(this.navList[1].params, "store").then((res) => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        if (res.data.success) {
          let data = res.data.result;
          data.selected = false;
          this.navList[1].text = `Shop(${data.total})`;
          if (data.total == 0) {
            this.storeEmpty = true;
          } else if (data.total <10) {
            this.storeLoad = "noMore";
            this.storeList.push(...data.records);
          } else {
            this.storeList.push(...data.records);
            if (data.total.length <10) this.storeLoad = "noMore";
          }
        }
      });
    },

    /**
     * Load more at the bottom
     */
    loadMore() {
      if (this.tabCurrentIndex == 0) {
        this.navList[0].params.pageNumber++;
        this.getGoodList();
      } else {
        this.navList[1].params.pageNumber++;
        this.getstoreList();
      }
    },
  },

  /**
   * When pulling down to refresh
   */
  onPullDownRefresh() {
    if (this.tabCurrentIndex == 0) {
      this.navList[0].params.pageNumber = 1;
      this.goodList = [];
      this.getGoodList();
    } else {
      this.navList[1].params.pageNumber = 1;
      this.storeList = [];
      this.getstoreList();
    }
  },
};
</script>

<style lang="scss">
page,
.content {
  background: $page-color-base;
  height: 100%;
}
.content {
  width: 100%;
  overflow: hidden;
}
.swiper-box {
  overflow-y: auto;
}

.list-scroll-content {
  height: 100%;
  width: 100%;
}

/deep/ .u-swipe-content {
  overflow: hidden;
}
.goods {
  background-color: #fff;
  border-bottom: 1px solid $border-color-light;
  height: 190rpx;
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx;
  margin-top: 20rpx;
  image {
    width: 131rpx;
    height: 131rpx;
    border-radius: 10rpx;
  }
  .goods-intro {
    flex: 1;
    font-size: $font-base;
    line-height: 48rpx;
    margin-left: 30rpx;

    view:nth-child(1) {
      line-height: 1.4em;
      font-size: 24rpx;
      max-height: 2.8em; //height是line-height的整数倍，防止文字显示不全
      overflow: hidden;
      color: #666;
    }
    view:nth-child(2) {
      color: #cccccc;
      font-size: 24rpx;
    }
    view:nth-child(3) {
      color: $light-color;
    }
  }
  button {
    color: $main-color;
    height: 50rpx;
    width: 120rpx;
    font-size: $font-sm;
    padding: 0;
    line-height: 50rpx;
    background-color: #ffffff;
    margin-top: 80rpx;
    &::after {
      border-color: $main-color;
    }
  }
}
.store {
  background-color: #fff;
  border: 1px solid $border-color-light;
  border-radius: 16rpx;
  margin: 20rpx 10rpx;
  .intro {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx 0 40rpx;
    height: 170rpx;

    .store-logo {
      width: 102rpx;
      height: 102rpx;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .store-name {
      flex: 1;
      margin-left: 30rpx;
      line-height: 2em;
      :first-child {
        font-size: $font-base;
      }
      :last-child {
        font-size: $font-sm;
        color: #999;
      }
    }
    .store-collect {
      border-left: 1px solid $border-color-light;
      padding-left: 20rpx;
      text-align: center;
      :last-child {
        color: #999;
        font-size: $font-sm;
      }
    }
  }
}
.navbar {
  display: flex;
  height: 40px;
  padding: 0 5px;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 26rpx;

    text {
      position: relative;
    }
    text.current {
      color: $light-color;
      font-weight: bold;
      font-size: 28rpx;
      &::after {
        content: "";
        position: absolute;
        left: 20rpx;
        bottom: -10rpx;
        width: 30rpx;
        height: 0;
        border-bottom: 2px solid $light-color;
      }
    }
  }
}
</style>

<template>
  <view class="store-page">
    <view class="status_bar">
      <!-- Here is the status bar -->
    </view>
    <view class="header">
      <div class="search">
        <u-icon @click="back" style="margin:0 10rpx 0;" name="arrow-left" size="40" color="#fff"></u-icon>
        <u-search :show-action="false" border-color="#fff" bg-color="#fff" v-model="keyword" @search="search" placeholder="Please enter search" />
        <u-icon @click="shareChange()" style="margin:0 10rpx 0;" name="share-fill" size="40" color="#fff"></u-icon>
      </div>
      <view class="tab-header">
        <text :class="{ cur: tabIndex == 0 }" @click="checkNavigation(0)">Home</text>
        <text :class="{ cur: tabIndex == 1 }" @click="checkNavigation(1)">Products</text>
      </view>
    </view>
    <swiper :current="tabIndex" class="swiper-box" @change="tabChange">
      <swiper-item class="swiper-item" v-for="(item, index) in indexCats" :key="index">
        <scroll-view class="scroll-v" scroll-anchoring enableBackToTop="true" scroll-y @refresherrefresh="refresh()" @scroll="pageScroll">
          <storePageMain :load="load" :storeId="storeId" v-if="index == 0"></storePageMain>
          <storePageGoods :load="load" :categoryId="item" :storeId="storeId" v-if="index == 1"></storePageGoods>
        </scroll-view>
      </swiper-item>
    </swiper>

    <!-- Share -->
    <shares type="shops" :link="'/pages/product/shopPage?id='+ this.storeId" v-if="shareFlage" @close="shareFlage = false" />

  </view>
</template>

<script>
import shares from "@/components/m-share/index"; //Share
import storePageMain from "./shopPageMain.vue";
import storePageGoods from "./shopPageGoods.vue";
export default {
  components: {
    shares,
    storePageMain,
    storePageGoods,
  },
  data() {
    return {
      shareFlage: false, //share share
      tabIndex: 0, //The default is the first tab
      keyword: "", //Search keywords
      load: false,
      storeId: undefined, //store id
      indexCats: [0, 1], //The default is 2 tabs
      loadIndex: 1, //load distance

    };
  },

  /**
   * Load
   */
  async onLoad(options) {
    this.storeId = options.id;

  },
  mounted() {
    // #ifdef MP-WEIXIN
    // Mini Programs are shared by default
    uni.showShareMenu({ withShareTicket: true });
    // #endif
  },

  methods: {
    // Click to share
    async shareChange() {
      this.shareFlage = true;
    },

    /**
     * search for
     */
    search() {
      uni.navigateTo({
        url: `/pages/navigation/search/searchPage?storeId=${this.storeId}&keyword=${this.keyword}`,
      });
    },

    /**
     * Slide down loading
     */
    pageScroll(e) {
      if (e.detail.scrollTop> 300 * this.loadIndex) {
        this.loadIndex++;
        this.load = this.loadIndex;
      }
    },

    /**
     * Return
     */
    back() {
      if (getCurrentPages().length == 1) {
        uni.switchTab({
          url: "/pages/tabbar/home/index",
        });
      } else {
        uni.navigateBack();
      }
    },

    /**
     * Click on the navigation bar
     */
    checkNavigation(index) {
      this.tabIndex = index;
    },

    /**
     * Sliding callback
     */
    tabChange(e) {
      this.tabIndex = e.detail.current;
      this.checkNavigation(this.tabIndex);
    },
  },
};
</script>
<style>
page {
  height: 100%;
}
</style>
<style lang="scss" scoped>
// #ifdef MP-WEIXIN
@import "./mp-shopPage.scss";
// #endif
input[type="search"] {
  -webkit-appearance: none;
  // 也可以去除加上border: 0;之类的 根据设计图来
}

input::-webkit-search-cancel-button {
  display: none;
}
// 关闭的按钮

.storeScrollBox {
  overflow-y: auto;
}

.store-page {
  height: 100%;
  // background: #fff;
  overflow: auto;

  .tab-header {
    height: 80rpx;
    display: flex;

    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    z-index: 9999;

    text {
      width: 50%;
      text-align: center;
      position: relative;
      color: #fff;
      &.cur {
        font-size: 30rpx;
        font-weight: bold;
        color: #fff;

        &::after {
          content: "";
          position: absolute;
          width: 30rpx;
          border: 1px solid #fff;
          bottom: -6rpx;
          left: 50%;
          margin-left: -15rpx;
        }
      }
    }
  }

  .header-line {
    height: 1px;
    background: #f2f2f2;
    position: fixed;
    top: 170rpx;
    left: 0;
    right: 0;
    z-index: 999;
  }
}

.swiper-box {
  width: 750rpx;

  height: calc(
    100% - var(--status-bar-height) - var(--window-top) - var(--window-bottom) -
      (160rpx) - 16rpx - 28rpx
  );

  // #ifdef H5
  height: calc(
    100% - var(--status-bar-height) - var(--window-top) - var(--window-bottom) -
      (160rpx)
  );
  // #endif
}

.swiper-item {
  height: 100%;
}

.scroll-v {
  width: 750rpx;
  height: 100%;
  overflow-y: auto;
}
.status_bar {
  height: calc(var(--status-bar-height) + 160rpx);
  width: 100%;
  background-image: linear-gradient(
    25deg,
    $main-color,
    $light-color,
    $aider-light-color
  );
}
.header {
  width: 100%;
  position: fixed;
  top: var(--status-bar-height);

  padding: 16rpx 0 0;
  font-size: 30rpx;
  z-index: 9999;
  > .search {
    width: 100%;
    display: flex;
    align-items: center;
    .back {
      width: 90rpx;
      height: 90rpx;
    }

    .input-wrap {
      background: $light-color;
      width: 600rpx;
      height: 58rpx;
      padding: 10rpx 30rpx 10rpx 30rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 50rpx;
      position: relative;
      border: 1px solid $light-color;

      input {
        font-size: 26rpx;
      }
    }
  }
}
</style>

<template>
  <view class="wrapper">
    <!-- Filter pop-up layer TODO subsequent version update -->
    <!-- <u-popup width="90%" v-model="popup" mode="right">
      <view class="screen-title">Product screening</view>

      <view class="screen-view">
        <view class="screen-item">
          <h4>Price range</h4>
          <view class="flex">
            <u-input class="u-bg" placeholder-style="font-size:22rpx;" type="number" input-align="center" placeholder="lowest price"></u-input>
            <view class="line"></view>
            <u-input class="u-bg" placeholder-style="font-size:22rpx;" type="number" input-align="center" placeholder="highest price"></u-input>
          </view>
        </view>
        <view class="screen-item">
          <h4>Sales volume</h4>
          <view class="flex">
            <u-input class="u-bg w200 flex1" placeholder-style="font-size:22rpx;" type="number" input-align="center" placeholder="Sales"></u-input>
            <view class="flex1">More than pen</view>
          </view>
        </view>
        <view class="screen-item">
          <h4>Revenue ratio</h4>
          <view class="flex">
            <u-input class="u-bg" placeholder-style="font-size:22rpx;" type="number" input-align="center" placeholder="minimum%"></u-input>
            <view class="line"></view>
            <u-input class="u-bg" placeholder-style="font-size:22rpx;" type="number" input-align="center" placeholder="maximum%"></u-input>
          </view>
        </view>
        <view class="screen-item">
          <h4>Free shipping</h4>
          <view class="flex">
            <u-tag class="u-tag" shape="circle" text="Free shipping" mode="plain" type="info" />
          </view>
        </view>
        <view class="screen-item">
          <h4>Promotions</h4>
          <view class="flex">
            <u-tag class="u-tag" shape="circle" text="Limited time purchase" mode="plain" type="info" />
            <u-tag class="u-tag" shape="circle" text="Join the group spike" mode="plain" type="info" />
          </view>
        </view>
        <view class="screen-item">
          <h4>Business type</h4>
          <view class="flex">
            <u-tag class="u-tag" shape="circle" text="Platform self-operated" mode="plain" type="info" />
            <u-tag class="u-tag" shape="circle" text="Tripartite shop" mode="plain" type="info" />
          </view>
        </view>
      </view>

      <view class="screen-btn">
        <view class="screen-clear"> Reset </view>
        <view class="screen-submit"> OK </view>
      </view>
    </u-popup> -->

    <!-- Navigation bar -->
    <view class="nav">
      <view class="nav-item" @click="handleMyGoods(true)" :class="{ checked: params.checked }">Selected</view>
      <view class="nav-item" @click="handleMyGoods(false)" :class="{ checked: !params.checked }">not selected</view>

      <!-- <view class="nav-item" @click="popup = !popup">Filtering</view> -->
    </view>
    <!-- Product list -->

    <view class="goods-list">
      <u-swipe-action v-for="(item, index) in goodsList" :disabled="!params.checked" :show="item.___selected" @open="openAction(item)" :index="index ":options="options" bg-color="#fff"
        ref="swiperAction" :key="item.id" @click="changeActionTab(item)">

        <div class="goods-item">
          <view class="goods-item-img" @click="handleNavgationGoods(item)">
            <u-image width="176rpx" height="176rpx" :src="item.thumbnail"></u-image>
          </view>
          <view class="goods-item-desc">
            <!-- Product description -->
            <view class="-item-title" @click="handleNavgationGoods(item)">
              {{ item.goodsName }}
            </view>
            <!-- Commodity amount -->
            <view class="-item-price" @click="handleNavgationGoods(item)">
              commission:
              <span> ￥{{ item.commission | unitPrice }}</span>
            </view>
            <!-- Ratio commission -->
            <view class="-item-bottom">
              <view class="-item-bootom-money" @click="handleNavgationGoods(item)">
                <!-- <view class="-item-bl">
                ratio:
                <span>{{ "5.00%" }}</span>
              </view> -->
                <view class="-item-yj">
                  <span>￥{{ item.price | unitPrice }}</span>
                </view>
              </view>
              <view>
                <view class="click" v-if="!params.checked" @click="handleClickGoods(item)">Select now</view>
                <view class="click" v-if="params.checked" @click="handleLink(item)">distributing goods</view>
              </view>
            </view>
          </view>
        </div>
      </u-swipe-action>

      <view class="empty">
        <!-- <u-empty v-if="empty" text="There are no more products for distribution" mode="list"></u-empty> -->
      </view>
    </view>
    <canvas class="canvas-hide" canvas-id="qrcode" />
    <drawCanvas ref="drawCanvas" v-if="showFlag" :res="res" />
    <u-modal v-model="deleteShow" :confirm-style="{'color':lightColor}" @confirm="delectConfirm" show-cancel-button :content="deleteContent" :async-close="true" ></u-modal>

  </view>
</template>
<script>
import {
  distributionGoods,
  checkedDistributionGoods,
  getMpCode,
} from "@/api/goods";

import drawCanvas from "@/components/m-canvas";
export default {
  data() {
    return {
      lightColor: this.$lightColor,
      deleteContent: "Unbind this product?", //Delete the displayed information
      // Slide button on the right side of the commodity bar
      options: [
        {
          text: "Unbind",
          style: {
            backgroundColor: this.$lightColor, //Highlight color
          },
        },
      ],
      showFlag: false, //Distribution sharing switch
      empty: false,
      popup: false, //Pop up layer switch
      active_color: this.$mainColor,
      current: 0,
      params: {
        pageNumber: 1,
        pageSize: 10,
        checked: true,
      },
      goodsList: [],

      // Distribution sharing example
      res: {
        container: {
          width: 600,
          height: 960,
          background: "#fff",
          title: "Share background",
        },
        // Distribution sharing
        bottom: {
          img: "",
          code: "",
          price: 0,
        },
      },

      routers: "",
      deleteShow: false, //Delete the modal box
      goodsVal: false, //Distributor shop information
    };
  },
  components: {
    drawCanvas,
  },
  onLoad(options) {
    this.routers = options;
  },
  watch: {
    showFlag(val) {},
  },
  onShow() {
    this.goodsList = [];
    this.init();
  },
  methods: {
    /**
     * Swipe to delete
     */
    changeActionTab(val) {
      this.deleteShow = true;
      this.goodsVal = val;
    },

    /**
     * Click to untie the goods
     */
    delectConfirm() {
      checkedDistributionGoods({ id: this.goodsVal.id, checked: false }).then(
        (res) => {
          if (res.data.success) {
            uni.showToast({
              title: "This product is untied successfully",
              duration: 2000,
            });
            this.deleteShow = false;
            this.goodsList = [];
            this.init();
          }
        }
      );
    },

    /**
     * Swipe left to open delete
     */
    openAction(val) {
      this.goodsList.forEach((item) => {
        this.$set(item, "___selected", false);
      });
      this.$set(val, "___selected", true);
    },

    /**
     * view image
     */
    handleNavgationGoods(val) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${val.skuId}&goodsId=${val.id}`,
      });
    },

    async handleLink(goods) {
      uni.showToast({
        title: "Please press and hold to save the picture",
        duration: 2000,
        icon: "none",
      });
      let page = `pages/product/goods`;
      let scene = `${goods.skuId},${goods.goodsId},${this.routers.id}`;
      let result = await getMpCode({ page, scene });
      if (result.data.success) {
        let callback = result.data.result;
        this.res.container.title = `${goods.goodsName}`;
        this.res.bottom.code = `data:image/png;base64,${callback}`;
        this.res.bottom.price = this.$options.filters.unitPrice(
          goods.price,
          "￥"
        );
        this.res.bottom.desc = `${goods.goodsName}`;
        this.res.bottom.img = `${goods.thumbnail}`;

        if (this.showFlag) {
          this.$refs.drawCanvas.init();
        }
        this.showFlag = true;
      } else {
        uni.showToast({
          title: `Failed to make QR code! Please try again later`,
          duration: 2000,
          icon: "none",
        });
      }
    },

    change(index) {
      this.current = index;
    },
    // Click on my selection library
    handleMyGoods(flag) {
      this.goodsList = [];
      this.params.checked = flag;
      this.init();
    },

    // select product
    handleClickGoods(val) {
      uni.showLoading({
        title: "Loading",
        mask: true,
      });
      checkedDistributionGoods({ id: val.id, checked: true }).then((res) => {
        uni.hideLoading();
        if (res.data.success) {
          uni.showToast({
            title: "Already added to my selection library",
            duration: 2000,
            icon: "none",
          });

          setTimeout(() => {
            this.goodsList = [];
            this.init();
          }, 500);
        }
      });
    },

    init() {
      uni.showLoading({
        title: "Loading",
      });
      distributionGoods(this.params).then((res) => {
        uni.hideLoading();

        if (res.data.success && res.data.result.records.length >= 1) {
          res.data.result.records.forEach((item) => {
            this.$set(item, "___selected", false);
          });
          this.goodsList.push(...res.data.result.records);
        }
        if (this.goodsList.length == 0) {
          this.empty = true;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.canvas-hide {
  /* 1 */
  position: fixed;
  right: 100vw;
  bottom: 100vh;
  /* 2 */
  z-index: -9999;
  /* 3 */
  opacity: 0;
}
.empty {
  margin: 40rpx 0;
}
.checked {
  color: $main-color;
  font-weight: bold;
}
.screen-btn {
  display: flex;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  position: fixed;
  bottom: 0;
  > .screen-clear,
  .screen-submit {
    width: 50%;
    text-align: center;
  }
  .screen-submit {
    background: $main-color;
    color: #fff;
  }
}
.screen-item {
  margin-bottom: 40rpx;
}
.flex1 {
  padding-left: 10rpx;
}
.u-tag {
  margin-right: 20rpx;
}
.line {
  width: 40rpx;
  height: 2rpx;
  background: #999;
  margin: 0 10rpx;
}
.u-bg {
  background: #eff1f4;
  border-radius: 0.4em;
  font-size: 22rpx;
}
.screen-title {
  height: 88rpx;
  text-align: center;
  font-size: 28upz;
  line-height: 88rpx;
  border-bottom: 1px solid #ededed;
}
.flex {
  display: flex;
  margin: 20rpx 0;
  align-items: center;
}
.screen-view {
  padding: 32rpx;
}
.bar {
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  width: 100%;
  background: #fff;
  z-index: 8;
  > .bar-btn {
    display: flex;
  }
}
.nav {
  background: #fff;
  width: 100%;
  display: flex;
  height: 88rpx;
  box-sizing: border-box;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  > .nav-item {
    line-height: 88rpx;
    height: 88rpx;
    flex: 1;
    text-align: center;
  }
}
.click {
  background: $main-color;
  color: #fff;
  margin: 0 4rpx;
  font-size: 22rpx;
  padding: 10rpx 20rpx;
  border-radius: 100px;
}
.goods-list {
  // #ifdef H5
  height: calc(100vh - 176rpx);
  // #endif
  // #ifndef H5
  height: calc(100vh - 88rpx);
  // #endif
  overflow: auto;
}
.goods-item {
  border-radius: 20rpx;
  background: #fff;
  display: flex;
  padding: 22rpx;
  margin: 20rpx;
  justify-content: space-between;
  > .goods-item-desc {
    flex: 2;
    padding: 0 16rpx;
    line-height: 1.7;
    > .-item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding-bottom: 20rpx;
      > .-item-bootom-money {
        > .-item-bl,
        .-item-yj {
          margin-right: 10rpx;
          font-size: 24rpx;
          color: $font-color-base;
        }
      }
    }
    > .-item-title {
      display: -webkit-box;

      -webkit-box-orient: vertical;

      -webkit-line-clamp: 1;

      overflow: hidden;
    }
    > .-item-price {
      color: $jd-color;
      > span {
        font-size: 36rpx;
      }
    }
  }
}
.wrapper {
  width: 100%;
}
</style>

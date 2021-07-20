<template>
  <view class="wrapper">

    <u-navbar :border-bottom="false" :background="background" class="unavbar" :title="title">
      <!-- middle -->
      <view class="slot-wrap container-wrap">

        <view v-if="search">
          <u-search @search="searchFun()" @custom="searchFun()" v-model="params.goodsName"></u-search>
        </view>

      </view>
      <!-- right side -->
      <view slot="right">
        <view style="margin-right: 24rpx;" @click="searchFlag()">
          <view v-if="search">Cancel</view>
          <u-icon v-if="!search" size="44rpx" name="search"></u-icon>
        </view>
      </view>
    </u-navbar>
    <!-- Top bar -->

    <!-- Commodity column -->
    <div class="swiper">

      <div v-if="groupBuy.length !=0">
        <view class="view-item" v-for="(groupItem, groupIndex) in groupBuy" :key="groupIndex">
          <view class="view-left">
            <u-image border-radius="10" shape="square" :src="groupItem.goodsImage" width="186rpx" height="186rpx">

              <view slot="error" style="font-size: 24rpx;">Failed to load</view>
            </u-image>
          </view>
          <view class="view-content">
            <view class="view-content-name">
              {{ groupItem.goodsName }}
            </view>
            <view class="view-content-bottom">
              <view>
                <view class="view-content-price">
                  <!-- ￥{{groupItem.sales_price | unitPrice }} <span v-if="groupItem.point">+{{groupItem.point}}Points</span> -->
                  ￥{{ groupItem.price | unitPrice }}
                </view>
                <view class="view-content-original_price">
                  ￥{{ groupItem.originPrice | unitPrice }}
                </view>
              </view>

              <view>
                <view class="btn-group" @click="toHref(groupItem)"> To join the group</view>
                <view class="buy-content">Sold {{ groupItem.num || 0 }} pieces</view>
              </view>
            </view>
          </view>
        </view>
        <u-loadmore bg-color='#f8f8f8' :status="status" />
      </div>
      <u-empty v-else style="margin-top:20%" text="No group activities at the moment" mode="data"></u-empty>

    </div>

  </view>
</template>

<script>
import * as API_Promotions from '@/api/promotions';
import * as API_Goods from '@/api/goods';

export default {
  components: {},
  data() {
    return {
      status: 'loadmore',
      is_empty: false,
      search: false,
      title: 'Group Joining Activities',
      background: {
        backgroundColor: '#fff'
      },
      empty: false,
      params: {
        pageNumber: 1,
        pageSize: 10,
        categoryPath: '',
        goodsName: ''
      },
      groupBuy: []
    };
  },
  mounted() {
  },
  watch: {
    search(val) {
      val ? (this.title = '') : (this.title = 'Join group activities');
    }
  },
  onReachBottom() {
    this.loadMore();
  },
  // Click the search button
  onNavigationBarButtonTap(e) {
    this.popupFlag = !this.popupFlag;
  },
  async onLoad() {
    this.GET_AssembleGoods();
  },

  methods: {
    loadMore() {
      this.params.pageNumber++;
      this.GET_AssembleGoods();
    },
    searchFlag() {
      this.search = !this.search;
    },

    toHref(goods) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${ goods.skuId }&goodsId=${ goods.goodsId }`
      });
    },
    searchFun() {
      this.groupBuy = [];
      this.GET_AssembleGoods();
    },
    // Request join group data
    GET_AssembleGoods() {
      this.status = 'loading';
      const params = JSON.parse(JSON.stringify(this.params));
      if (params.category_id === 0) delete params.category_id;

      API_Promotions.getAssembleList(params)
          .then((response) => {
            const data = response.data.result.records;

            if (!data || !data.length) {
              this.is_empty = true;
              this.status = 'nomore';
            } else {
              if (data.length <= this.params.pageSize) {
                this.status = 'nomore';
              } else {
                this.status = 'loadmore';
              }
              this.is_empty = false;
              this.groupBuy.push(...(data || []));
            }
          })
          .catch(() => {
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.slot-wrap {
  display: flex;
  align-items: center;
  /* 如果您想让slot内容占满整个导航栏的宽度 */
  flex: 1;
  /* 如果您想让slot内容与导航栏左右有空隙 */
  /* padding: 0 30rpx; */
}

.invalid {
  filter: grayscale(1);
}

.wrapper {
  padding: 0 24 rpx;
}

.live-item {
  display: flex;
  overflow: hidden;
  border-radius: 20 rpx;
  flex-wrap: wrap;
  background: #fff;

  margin: 20 rpx 0;
}

.live-cover-img {
  position: relative;
}

.swiper {
  margin: 20 rpx 0;
}

.live-goods {
  position: relative;
  flex: 1;
  padding: 16 rpx 24 rpx 24 rpx;
}

.live-goods-name {
  height: 84 rpx;
  font-weight: bold;
  font-size: 30 rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.live-store {
  display: flex;
  align-items: center;
  margin: 20 rpx 0;
  overflow: hidden;
  width: calc(100% - 50rpx);
}

.live-gif {
  width: 20 rpx;
  height: 20 rpx;
}

.live-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40 rpx;
  margin-right: 10 rpx;
  height: 40 rpx;
  background: linear-gradient(90deg, #ff6b35, #ff9f28, #ffcc03);
}

.live-goods-list {
  display: flex;
  align-items: center;
  justify-content: space-between;

  > .live-goods-item {
    flex: 1;
  }

  > .live-goods-item:nth-of-type(1) {
    padding-right: 38 rpx;
  }
}

.live-icon,
.zan {
  position: absolute;
  width: 80 rpx;
  height: 80 rpx;
  z-index: 9;
}

.tips {
  display: flex;
  position: absolute;
  z-index: 9;

  align-items: center;
  top: 20 rpx;
  right: 0;
  padding: 4 rpx 12 rpx 4 rpx 0;
  font-size: 24 rpx;
  border-radius: 100px;
  color: #fff;
  background: rgba(0, 0, 0, 0.46);
}

.live-icon {
  right: 0;
  top: 104 rpx;
}

.zan {
  bottom: 0;
  right: 0;
  width: 100 rpx;
  height: 100 rpx;
}

.bg {
  position: absolute;
  bottom: 4 rpx;
  width: 100%;
  height: 100 rpx;
  z-index: 8;
  background-image: -webkit-gradient(
          linear,
          left bottom,
          left top,
          from(rgba(0, 0, 0, 0.25)),
          color-stop(82%, transparent)
  );
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 82%);
  border-bottom-left-radius: 20 rpx;
}
</style>

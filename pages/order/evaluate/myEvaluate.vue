<template>
  <view>
    <view class="wrap">
      <view class="u-tabs-box">
        <u-tabs :list="list" :is-scroll="false" inactive-color="#333" :current="current" class="utabs" :active-color="$lightColor" @change=" changeTab"></u-tabs>
      </view>
      <swiper class="swiper-box" :current="current" @change="changeSwiper" duration="500">
        <swiper-item v-for="(item, listIndex) in list" :key="listIndex">
          <scroll-view scroll-y style="height: 100%" @scrolltolower="renderData(listIndex)">
            <u-empty text="There are no products to be evaluated yet" mode="list" v-if="orderList.length == 0"></u-empty>
            <view class="seller-view" v-for="(order, index) in orderList" :key="index">
              <!-- shop name -->
              <view class="box-title">
                <view class="title_seller_name">
                  {{ order.storeName }}
                </view>
              </view>
              <view v-for="(sku, _index) in order.orderItems" :key="_index">
                <view class="goods-item-view">
                  <view>
                    <u-image border-radius="6rpx" width="132rpx" height="132rpx" class="goods_img" :src="sku.image" alt />
                  </view>
                  <view class="goods-info">
                    <view class="goods-title u-line-2">{{ sku.name }}</view>
                    <view class="text title">{{ gradeList[order.grade] ||'' }}</view>
                  </view>
                </view>
                <view class="btn-view u-row-between" v-if="current != 0">
                  <view class="description">
                    <view class="text title">
                      <u-read-more ref="uReadMore" :color="$lightColor" text-indent="0">
                        <rich-text :nodes="'Comment content:' + order.content ||''"></rich-text>
                      </u-read-more>
                    </view>

                    <view class="goods-imgs-view" v-if="order.image">
                      <view class="img-view" v-if="order.image" v-for="(img, imgIndex) in order.image.split(',')" :key="imgIndex">
                        <u-image v-if="order.image" @click.native="
                            preview(order.image.split(','), imgIndex)
                          "width="160rpx" height="160rpx" :src="img"></u-image>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="again-btn" @click="onDetail(order)" v-if="current == 1">
                  <u-tag text="review details" shape="circle" mode="plain" type="error" />
                </view>
                <view v-if="current == 0 && sku.commentStatus =='UNFINISHED'">
                  <view class="evaluate">
                    <view @click="talkCommont(order)">
                      <u-tag text="Post a review" shape="circle" mode="plain" type="error" />
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <uni-load-more :status="params.loadStatus"></uni-load-more>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import {getOrderList} from "@/api/order.js";
import {getComments} from "@/api/members.js";

export default {
  data() {
    return {
      list: [//top tab
        {
          name: "To be evaluated",
        },
        {
          name: "Evaluated",
        },
      ],
      gradeList: {//comment list
        GOOD: "Very Good",
        MODERATE: "Intermediate Review",
        WORSE: "Bad review",
        haveImage: "There are pictures",
      },
      current: 0, //current tabIndex
      orderList: [], //Commodity collection
      params: {
        pageNumber: 1,
        pageSize: 10,
        loadStatus: "more",
      },
    };
  },

  onShow() {
    this.orderList = [];
    this.params.pageNumber = 1;
    this.current == 0? this.loadData(): this.loadComments();
  },
  watch: {
    /**
     * Toggle current
     * Change the page and reload the data
     */
    current(val) {
      this.params.pageNumber = 1;
      this.params.loadStatus = "more";
      this.orderList = [];
      //Re-read data
      if (val == 0) {
        this.loadData();
      }
      if (val == 1) {
        this.orderList = [];
        this.loadComments();
      }
    },
  },

  methods: {
    /**
     * Determine whether the current store has products that can be evaluated
     */
    commentStatus(val) {
      if (this.current == 1) {
        return true;
      } else {
        let show;
        val.orderItems &&
          val.orderItems.forEach((item) => {
            if (item.commentStatus == "UNFINISHED") {
              show = true;
            } else {
              show = false;
            }
          });

        return show;
      }
    },

    /**
     * Click the picture to enlarge or save
     */
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ["Save Picture"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },

    /**
     * Click tab to trigger
     */
    changeTab(index) {
      this.current = index;
    },

    /**
     * Click swiper
     */
    changeSwiper(e) {
      this.current = e.target.current;
    },

    /**
     * Get order data
     */
    loadData() {
      uni.showLoading({
        title: "Loading",
      });
      getOrderList(this.params).then((res) => {
        uni.hideLoading();
        const orderList = res.data.result.records;
        if (orderList.length <10) {
          this.params.loadStatus = "noMore";
        }
        if (orderList.length> 0) {
          this.orderList = this.orderList.concat(orderList);
          this.params.pageNumber += 1;
        }
      });
    },

    /**
     * Post a review
     */
    talkCommont(order) {
      uni.navigateTo({
        url: `./releaseEvaluate?sn=${order.sn}&order=${encodeURIComponent(
          JSON.stringify(order)
        )}`,
      });
    },

    /**
     * Load the evaluated data
     */
    loadComments() {
      uni.showLoading({
        title: "Loading",
      });
      getComments(this.params).then((res) => {
        uni.hideLoading();
        let orderList = res.data.result.records;
        if (orderList.length <10) {
          this.params.loadStatus = "noMore";
        }
        orderList.forEach((item) => {
          item.orderItems = [
            {
              image: item.goodsImage,
              name: item.goodsName,
              goodsId: item.goodsId,
              skuId: item.skuId,
            },
          ];
        });
        this.orderList = this.orderList.concat(orderList);
        this.params.pageNumber += 1;
      });
    },

    /**
     * Slide to the bottom to load data
     */
    renderData(index) {
      if (this.params.loadStatus == "noMore") return;
      if (index == 0) {
        this.loadData();
      }
      if (index == 1) {
        this.params.audit_status = "PASS_AUDIT";
        this.params.comments_type = "INITIAL";
        this.params.comment_status = "WAIT_CHASE";
        this.loadComments();
      }
    },

    /**
     * Evaluation details
     */
    onDetail(comment) {
      uni.navigateTo({
        url:
          "./evaluateDetail?comment=" +
          encodeURIComponent(JSON.stringify(comment)),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
page {
  height: 100%;
}
.wrap {
  background: #f6f6f6;
  height: calc(100vh - var(--window-top));
  width: 100%;
}

.goods-imgs-view {
  margin: 20rpx 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  .img-view {
    margin-right: 15rpx;
  }
}
.u-tabs-box {
  position: relative;
  z-index: 10;
}
.box-content {
  margin: 20rpx 0;
}
.title_seller_name {
  font-weight: 700;
  font-size: 28rpx;
  color: #333;
  padding-left: 0 !important;
}
.box-title {
  height: 90rpx;
  line-height: 90rpx;
}

.swiper-box {
  height: calc(100% - 88rpx);
}

.goods-specs {
  margin-bottom: 10rpx;
  color: #cccccc;
  font-size: 24rpx;
}
.goods-price {
  margin-bottom: 10rpx;
  color: #999999;
  font-size: 24rpx;
}
.goods-item-view {
  display: flex;
  margin-bottom: 20rpx;
  .goods-info {
    padding-left: 30rpx;

    .goods-title {
      color: $u-main-color;
      margin-bottom: 10rpx;
    }
  }
  .goods-num {
    margin: 0rpx 10rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 10rpx;
    .u-num {
      color: $aider-light-color;
      font-size: 33rpx;
    }
  }
}
.again-btn {
  margin: 0rpx 10rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 10rpx;
}
.seller-view {
  background-color: #fff;
  margin: 20rpx 0px;
  padding: 0px 20rpx 20rpx 20rpx;
  border-radius: 20rpx;
  .seller-info {
    height: 70rpx;
    .seller-name {
      font-size: 33rpx;
      font-weight: 600;
    }
    .order-sn {
      color: #909399;
    }
  }

  .btn-view {
    min-height: 70rpx;
    margin: 5rpx 5rpx;
    display: flex;
    flex-direction: row;
    .description {
      size: 25rpx;
      color: #999999;
      .text {
        margin: 20rpx 0rpx;
      }
      .title {
        color: #5f5d5f;
      }
    }
  }
  .evaluate {
    padding: 20rpx 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

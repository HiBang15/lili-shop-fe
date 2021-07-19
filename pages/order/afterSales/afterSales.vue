<template>
  <view class="content">
    <view class="u-tabs-box">
      <u-tabs bg-color="#fff" :list="list" :is-scroll="false" :current="current" @change="change"
              :active-color="$lightColor"></u-tabs>
    </view>
    <div class="u-tabs-search">
      <u-search placeholder="Please enter the order number" @search="handleGetOrderList(current)"
                @clear="handleGetOrderList(current)" @custom="handleGetOrderList(current)"
                v-model="params.orderSn"></u-search>
    </div>
    <scroll-view class="body-view" scroll-y @scrolltolower="renderDate">
      <view class="seller-view" v-for="(order, orderIndex) in orderList" :key="orderIndex">
        <!-- shop name -->
        <view class="seller-info u-flex u-row-between" v-if="current == 0">
          <view class="seller-name">
            <view class="name">{{ order.storeName }}</view>
          </view>
          <view class="order-sn">Order number: {{ order.sn }}</view>
        </view>
        <!-- Application record tab -->
        <view class="seller-info u-flex u-row-between" v-if="current != 0">
          <view class="order-sn">After-sale order number: {{ order.service_sn || order.sn }}</view>
          <view class="order-sn">{{ order.serviceType_text }}</view>
        </view>
        <view v-for="(sku, goodsIndex) in order.orderItems" :key="goodsIndex">
          <view class="goods-item-view" @click="onDetail(sku)">
            <view class="goods-img">
              <u-image border-radius="6" width="100%" height="100%" :src="sku.image"></u-image>
            </view>
            <view class="goods-info">
              <view class="goods-title u-line-2">{{ sku.name }}</view>
              <!-- If there are multiple products, the price of each product will not be displayed -->
              <view class="goods-price" v-if="order.orderItems.length <= 1">
                ￥{{ order.flowPrice | unitPrice }}
              </view>
            </view>
            <view class="goods-num">
              <view>x{{ sku.num }}</view>
            </view>
          </view>
          <view class="btn-view u-flex u-row-between">
            <view class="description">
              <!-- After-sales application -->
              <view v-if="
                  current === 0 && order.groupAfterSaleStatus &&
                  order.groupAfterSaleStatus ==='ALREADY_APPLIED'
                " class="cannot_apply">
                <u-icon class="icon" name="info-circle-fill"></u-icon>
                This product has applied for after-sales service
              </view>
              <view class="cannot_apply"
                    v-if="current === 0 && order.groupAfterSaleStatus && order.groupAfterSaleStatus ==='EXPIRED'"
                    @click="tipsShow = true">
                <u-icon class="icon" name="info-circle-fill"></u-icon>
                This product cannot be applied for after-sales
              </view>

              <div v-if="current === 1 || current === 2">
                <!-- Applying -->
                <view class="cannot_apply" v-if="order.serviceType =='RETURN_GOODS'">Return
                  processing-{{ order.serviceStatus | serviceStatusList }}
                </view>
                <view class="cannot_apply" v-if="order.serviceType =='SUPPLY_AGAIN_GOODS'">Reissue
                  goods-{{ order.serviceStatus | serviceStatusList }}
                </view>
                <view class="cannot_apply" v-if="order.serviceType =='RETURN_MONEY'">
                  Refund-{{ order.serviceStatus | serviceStatusList }}
                </view>
                <view class="cannot_apply" v-if="order.serviceType =='EXCHANGE_GOODS'">
                  Exchange-{{ order.serviceStatus | serviceStatusList }}
                </view>
                <view class="cannot_apply" v-if="order.serviceType =='CANCEL'">Cancel
                  order-{{ order.serviceStatus | serviceStatusList }}
                </view>
              </div>
              <!-- Application record -->
            </view>
            <view class="after-line">
              <!-- After-sales application -->
              <view v-if="
                  current === 0 && order.groupAfterSaleStatus=='NOT_APPLIED'
                " @click="applyService(sku.sn, order, sku)" class="rebuy-btn">
                Apply for after-sales
              </view>
              <!-- Applying -->
              <view class="rebuy-btn" v-if="
                  current === 2 &&
                  order.serviceStatus &&
                  order.serviceStatus =='PASS' &&
                  order.serviceType !='RETURN_MONEY'
                " @click="onExpress(order, sku)">
                Submit logistics
              </view>
              <view @click="afterDetails(order, sku)" v-if="current === 1 || current === 2" class="rebuy-btn">
                After-sale details
              </view>
            </view>
          </view>
        </view>
        <view v-if="
            current === 0 && order.groupAfterSaleStatus &&
            order.groupAfterSaleStatus !='ALREADY_APPLIED' &&
            order.orderItems.length >= 1
          " class="btn-view u-flex u-row-between">
          <!-- Display the total price of the order for multiple products -->
          <view class="cannot_apply">
            Total order amount: <span class="countMoney">￥{{ order.flowPrice | unitPrice }}</span>
          </view>
        </view>
      </view>
      <u-loadmore bg-color="#f8f8f8" :status="status" />
    </scroll-view>
    <u-modal v-model="tipsShow"
             content="When the order is not confirmed to receive the goods|The after-sales service validity period has expired|When the after-sales service has been applied for, you cannot apply for after-sales service"></u-modal>
  </view>
</template>

<script>
import uniLoadMore from'@/components/uni-load-more/uni-load-more.vue';
import {getAfterSaleList} from'@/api/after-sale.js';
import {getOrderList} from'@/api/order.js';

export default {
  components: {
    uniLoadMore
  },
  data() {
    return {
      list: [
        //tab header
        {
          name:'After-sales application'
        },
        {
          name:'Applying'
        },
        {
          name:'application record'
        }
      ],
      current: 0, //Current header index
      tipsShow: false, //tip switch
      orderList: [], //Order collection
      params: {
        pageNumber: 1,
        pageSize: 10,
        sort:'createTime',
        order:'desc'
      },

      logParams: {
        pageNumber: 1,
        pageSize: 10
      },
      status:'loadmore'
    };
  },
  onLoad(options) {
    this.orderList = [];
    this.params.pageNumber = 1;
    if (options.orderSn) this.params.orderSn = options.orderSn;
    this.getOrderList(this.current);
  },
  onPullDownRefresh() {
    this.change(this.current);
  },
  methods: {
    handleGetOrderList(current) {
      this.orderList = [];
      this.getOrderList(current);
    },
    /**
     * When switching the tab page, initialize the data
     */
    change(index) {
      this.current = index;
      this.params = {
        pageNumber: 1,
        pageSize: 10
      };
      this.orderList = [];
      //If it is 2, read the after-sales application record list
      if (index == 0) {
        this.getOrderList(index);
      } else {
        this.logParams = {
          pageNumber: 1,
          pageSize: 10
        };
        if (index === 1) {
          this.logParams.serviceStatus ='APPLY';
        }
        this.orderList = [];
        this.getAfterSaleLogList();
      }
      uni.stopPullDownRefresh();
    },

    /**
     * Get order list
     */
    getOrderList(index) {
      uni.showLoading({
        title:'Loading',
        mask: true
      });
      getOrderList(this.params).then((res) => {
        uni.hideLoading();
        const orderlist = res.data.result.records;
        if (orderlist.length> 0) {
          this.orderList = this.orderList.concat(orderlist);
          this.params.pageNumber += 1;
        }
        if (orderlist.length <10) {
          this.status ='nomore';
        } else {
          this.status ='loading';
        }
      });
    },

    /**
     * After-sale details
     */
    afterDetails(order) {
      uni.navigateTo({
        url:'./applyDetail?sn=' + order.sn
      });
    },

    /**
     * List of application records
     */
    getAfterSaleLogList() {
      getAfterSaleList(this.logParams).then((res) => {
        let afterSaleLogList = res.data.result.records;

        afterSaleLogList.forEach((item) => {
          item.orderItems = [
            {
              image: item.goodsImage,
              skuId: item.skuId,
              name: item.goodsName,
              num: item.num,
              price: item.flowPrice
            }
          ];
        });

        this.orderList = this.orderList.concat(afterSaleLogList);

        if (afterSaleLogList.length <10) {
          this.status ='nomore';
        } else {
          this.status ='loading';
        }
      });
    },

    /**
     * Apply for after-sales
     */
    applyService(sn, order, sku) {
      let data = {
        ...order,
        ...sku
      };

      uni.navigateTo({
        url: `/pages/order/afterSales/afterSalesSelect?sn=${ sn }&sku=${ encodeURIComponent(
            JSON.stringify(data)
        ) }`
      });
    },

    /**
     * Submit logistics information
     */
    onExpress(order, sku) {
      sku.storeName = order.storeName;

      uni.navigateTo({
        url: `./afterSalesDetailExpress?serviceSn=${
            order.sn
        }&sku=${ encodeURIComponent(JSON.stringify(sku)) }`
      });
    },

    /**
     * see details
     */
    onDetail(sku) {
      if (!this.$u.test.isEmpty(sku.skuId)) {
        uni.navigateTo({
          url: `/pages/product/goods?id=${ sku.skuId }&goodsId=${ sku.goodsId }`
        });
      }
    },

    /**
     * Load data at the bottom
     */
    renderDate() {
      if (this.current === 0) {
        this.params.pageNumber += 1;
        this.getOrderList();
      } else {
        this.logParams.pageNumber += 1;
        this.getAfterSaleLogList();
      }
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

.body-view {
  overflow-y: auto;
  height: calc(100vh - 44px - 80rpx - 104rpx);
}

.u-tabs-search {
  padding: 20 rpx;
  background: #fff;
}

.countMoney {
  margin-left: 7 rpx;
  color: $main-color;
  font-size: 28 rpx;
}

.seller-view {
  background-color: #fff;
  margin: 20 rpx 0 rpx;
  padding: 0 rpx 20 rpx;
  border-radius: 20 rpx;

  .seller-info {
    height: 70 rpx;

    .seller-name {
      font-size: 28 rpx;
      display: flex;
      flex-direction: row;

      .name {
        margin-left: 15 rpx;
        margin-top: -2rpx;
      }
    }

    .order-sn {
      font-size: 22 rpx;
      color: #909399;
    }
  }

  .goods-item-view {
    display: flex;
    flex-direction: row;
    padding: 10 rpx 10 rpx;

    .goods-img {
      width: 131 rpx;
      height: 131 rpx;
    }

    .goods-info {
      padding-left: 30 rpx;
      flex: 1;

      .goods-title {
        margin-bottom: 10 rpx;
        color: #333333;
      }

      .goods-specs {
        font-size: 24 rpx;
        margin-bottom: 10 rpx;
        color: #cccccc;
      }

      .goods-price {
        font-size: 28 rpx;
        margin-bottom: 10 rpx;
        color: #ff5a10;
      }
    }

    .goods-num {
      width: 60 rpx;
      color: $main-color;
    }
  }

  .btn-view {
    padding: 16 rpx 0;

    .after-line {
      display: flex;
      line-height: 90 rpx;
    }
  }
}

.description {
  color: #909399;
  size: 25 rpx;
}

.cannot_apply {
  text-align: center;
  font-size: 22 rpx;

  color: #999999;
  height: 70 rpx;
  line-height: 70 rpx;
}

.icon {
  margin-right: 10 rpx;
}

.cancel-btn {
  color: #999999;
  border-color: #999999;
  margin-left: 15 rpx;
  height: 60 rpx;
}

.pay-btn {
  background-color: #1abc9c;
  color: #ffffff;
  margin-left: 15 rpx;
  height: 60 rpx;
}

.rebuy-btn {
  background-color: #ffffff;
  margin-left: 15 rpx;
  height: 60 rpx;
  line-height: 60 rpx;
  text-align: center;
  font-size: 24 rpx;
  border: 2 rpx solid $light-color;
  color: $light-color;
  padding: 0 24 rpx;
  border-radius: 200px;
}
</style>

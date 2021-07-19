<template>
  <view class="content">
    <view class="navbar">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index) ">{{ item.text }}</view>
    </view>
    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
      <swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData(tabIndex)">
          <!-- Blank page -->
          <u-empty text="No orders yet" mode="list" v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></u-empty>
          <!-- Order list -->
          <view class="seller-view" :key="oderIndex" v-for="(order, oderIndex) in tabItem.orderList">
            <!-- shop name -->
            <view class="seller-info u-flex u-row-between">
              <view class="seller-name" @click="navigateToStore(order)">
                <view class="name">{{ order.storeName }}</view>
              </view>
              <view class="order-sn">{{
                order.orderStatus | orderStatusList
              }}</view>
            </view>
            <view>
              <view>
                <view class="goods-item-view" @click="navigateToOrderDetail(order.sn)">
                  <view class="goods-img" v-for="(goods, goodsIndex) in order.orderItems" :key="goodsIndex">
                    <u-image border-radius="6" width="100%" height="100%" :src="goods.image"></u-image>
                  </view>
                  <view class="goods-info">
                    <view v-if="order.orderItems.length <= 1" class="goods-title u-line-2">{{ order.groupName }}</view>
                    <view v-if="order.orderItems.length <= 1" class="goods-price">
                      ￥{{ order.flowPrice | unitPrice }}
                    </view>
                  </view>
                  <view v-if="order.orderItems.length <= 1" class="goods-num">
                    <view>x{{ order.groupNum }}</view>
                  </view>
                </view>
              </view>
              <view class="btn-view u-flex u-row-between">
                <view class="description">
                  <!-- Waiting for payment -->
                  <div v-if="order.payStatus ==='PAID'">Amount paid:</div>
                  <div v-else>Amount payable:</div>
                  <div class="price">￥{{ order.flowPrice | unitPrice }}</div>
                </view>
                <view>
                  <!-- All -->
                  <u-button ripple class="pay-btn" shape="circle" size="mini" v-if="order.allowOperationVO.pay" @click="waitPay(order)">Pay now</u-button >
                  <!-- Cancel order -->
                  <u-button ripple class="cancel-btn" shape="circle" size="mini" v-if="order.allowOperationVO.cancel" @click="onCancel(order.sn)">
                    cancel order
                  </u-button>
                  <!-- Waiting for receipt -->
                  <u-button ripple shape="circle" class="rebuy-btn" size="mini" v-if="order.allowOperationVO.showLogistics" @click="navigateToLogistics(order)">
                    View Logistics
                  </u-button>
                  <u-button ripple :customStyle="{'background':lightColor,'color':'#fff' }" shape="circle" class="pay-btn" size="mini" v-if="order. allowOperationVO.rog" @click="onRog(order.sn)">
                    Confirm receipt
                  </u-button>
                  <u-button ripple shape="circle" class="cancel-btn" size="mini" v-if="order.groupAfterSaleStatus=='NOT_APPLIED'" @click="applyService(order)">
                    Refund/After-sale
                  </u-button>
                  <!-- TODO follow-up improvement -->
                  <!-- <u-button ripple shape="circle" class="rebuy-btn" size="mini" v-if="
                      order.orderStatus ==='CANCELLED' ||
                      order.orderStatus ==='COMPLETE'
                    "@click="reBuy(order)">
                    buy again
                  </u-button> -->
                </view>
              </view>
            </view>
          </view>
          <uni-load-more :status="tabItem.loadStatus"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
    <u-popup class="cancel-popup" v-model="cancelShow" mode="bottom" length="60%">
      <view class="header">Cancel order</view>
      <view class="body">
        <view class="title">After canceling the order, the discounts enjoyed by this order may also be cancelled. Do you want to continue? </view>
        <view>
          <u-radio-group v-model="reason">
            <view class="value">
              <view class="radio-view" :key="index" v-for="(item, index) in cancelList">
                <u-radio :active-color="lightColor" label-size="25" shape="circle" :name="item.reason" @change="reasonChange">{{ item.reason }}</u- radio>
              </view>
            </view>
          </u-radio-group>
        </view>
      </view>
      <view class="footer">
        <u-button size="medium" ripple v-if="reason" shape="circle" @click="submitCancel">Submit</u-button>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
    <u-modal :confirm-color="lightColor" v-model="rogShow" :show-cancel-button="true" :content="'Are you sure to receive the goods?'" @confirm="confirmRog"></ u-modal>
  </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import { getOrderList, cancelOrder, confirmReceipt } from "@/api/order.js";
import { getClearReason } from "@/api/after-sale.js";
import LiLiWXPay from "@/js_sdk/lili-pay/wx-pay.js";
export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      lightColor: this.$lightColor,
      tabCurrentIndex: 0, //Navigation bar index
      navList: [
        //Navigation bar list
        {
          state: 0,
          text: "All",
          loadStatus: "more",
          orderList: [],
          pageNumber: 1,
        },
        {
          state: 1,
          text: "Pending Payment",
          loadStatus: "more",
          orderList: [],
          pageNumber: 1,
        },
        {
          state: 2,
          text: "Pending Shipment",
          loadStatus: "more",
          orderList: [],
          pageNumber: 1,
        },
        {
          state: 3,
          text: "To be received",
          loadStatus: "more",
          orderList: [],
          pageNumber: 1,
        },
        {
          state: 4,
          text: "Completed",
          loadStatus: "more",
          orderList: [],
          pageNumber: 1,
        },
        {
          state: 5,
          text: "Cancelled",
          loadStatus: "more",
          orderList: [],
          pageNumber: 1,
        },
      ],
      status: "", //Receive the status of the navigation bar
      params: {
        pageNumber: 1,
        pageSize: 10,
        tag: "ALL",
      },
      orderStatus: [
        //Order Status
        {
          orderStatus: "ALL", //All
        },
        {
          orderStatus: "WAIT_PAY", //Payment
        },
        {
          orderStatus: "WAIT_SHIP",
        },
        {
          orderStatus: "WAIT_ROG", //To be received
        },
        {
          orderStatus: "COMPLETE", //Completed
        },
        {
          orderStatus: "CANCELLED", //Cancelled
        },
      ],
      cancelShow: false, //Whether to display cancellation
      orderSn: "", //ordersn
      reason: "", //Reason for cancellation
      cancelList: "", //Cancel the list
      rogShow: false, //Show whether the goods are received
    };
  },

  /**
   * Jump to personal center
   */
  onBackPress(e) {
    if (e.from == "backbutton") {
      uni.reLaunch({
        url: "/pages/tabbar/user/my",
      });
      return true; //Prevent the default return behavior
    }
  },
  onPullDownRefresh() {
    this.loadData(this.status);
  },



  onLoad(options) {
    /**
     * Fix the problem that data is not loaded when clicking on the button except all orders on the app side
     * Replace the code under onLoad
     */
    let status = Number(options.status);
    this.status = status;
    this.tabCurrentIndex = status;
    if (status == 0) {
      this.loadData(status);
    }
  },

  watch: {
    /**Monitor change request data */
    tabCurrentIndex(val) {
      this.params.tag = this.orderStatus[val].orderStatus;
      //Switch tabs to reset all pages to 1
      this.navList.forEach((res) => {
        res.pageNumber = 1;
        res.loadStatus = "more";
        res.orderList = [];
      });
      this.loadData(val);
    },
  },
  methods: {


    // After sale
    applyService(order){


      uni.navigateTo({
         url: `/pages/order/afterSales/afterSales?orderSn=${order.sn}`
      });

    },

    // shop details
    navigateToStore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },

    /**
     * cancel order
     */
    onCancel(sn) {
      this.orderSn = sn;
      this.cancelShow = true;
      uni.showLoading({
        title: "Loading",
      });
      getClearReason().then((res) => {
        if (res.data.result.length >= 1) {
          this.cancelList = res.data.result;
        }
        uni.hideLoading();
      });
    },

    /**
     * Initialization data
     */
    initData(index) {
      this.navList[index].pageNumber = 1;
      this.navList[index].loadStatus = "more";
      this.navList[index].orderList = [];
      this.loadData(index);
    },

    /**
     * wait for payment
     */
    waitPay(val) {
      this.$u.debounce(this.pay(val), 3000);
    },

    /**
     * Pay
     */
    pay(val) {
      if (val.sn) {
        // #ifdef MP-WEIXIN
        new LiLiWXPay({
          sn: val.sn,
          price: val.flowPrice,
          orderType: "ORDER",
        }).pay();
        // #endif
        // #ifndef MP-WEIXIN
        uni.navigateTo({
          url: "/pages/cart/payment/payOrder?order_sn=" + val.sn,
        });
        // #endif
      }
    },

    /**
     * Get order list
     */
    loadData(index) {
      this.params.pageNumber = this.navList[index].pageNumber;
      getOrderList(this.params).then((res) => {
        uni.stopPullDownRefresh();
        if (!res.data.success) {
          this.navList[index].loadStatus = "noMore";
          return false;
        }
        let orderList = res.data.result.records;
        if (orderList.length == 0) {
          this.navList[index].loadStatus = "noMore";
        } else if (orderList.length <10) {
          this.navList[index].loadStatus = "noMore";
        }
        if (orderList.length> 0) {
          this.navList[index].orderList =
            this.navList[index].orderList.concat(orderList);
          this.navList[index].pageNumber += 1;
        }
      });
    },
    //swiper switch monitor
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
    },
    //Top tab click
    tabClick(index) {
      this.tabCurrentIndex = index;
    },
    //Delete order
    deleteOrder(index) {
      uni.showLoading({
        title: "Please wait",
      });
      setTimeout(() => {
        this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
        uni.hideLoading();
      }, 600);
    },
    //cancel order
    cancelOrder(item) {
      uni.showLoading({
        title: "Please wait",
      });
      setTimeout(() => {
        let {stateTip, stateTipColor} = this.orderStateExp(9);
        item = Object.assign(item, {
          state: 9,
          stateTip,
          stateTipColor,
        });

        //Delete the item pending payment after canceling the order
        let list = this.navList[1].orderList;
        let index = list.findIndex((val) => val.id === item.id);
        index !== -1 && list.splice(index, 1);
        uni.hideLoading();
      }, 600);
    },

    //Order status text and color
    orderStateExp(state) {
      let stateTip = "",
        stateTipColor = this.$lightColor;
      switch (+state) {
        case 1:
          stateTip = "Pending Payment";
          break;
        case 2:
          stateTip = "To be shipped";
          break;
        case 9:
          stateTip = "Order has been closed";
          stateTipColor = "#909399";
          break;

        //More customization
      }
      return {
        stateTip,
        stateTipColor,
      };
    },

    /**
     * Jump to order details
     */
    navigateToOrderDetail(sn) {
      uni.navigateTo({
        url: "./orderDetail?sn=" + sn,
      });
    },

    /**
     * Select the reason for cancellation
     */
    reasonChange(reason) {
      this.reason = reason;
    },

    /**
     * Submit cancellation order (unpaid)
     */
    submitCancel() {
      cancelOrder(this.orderSn, {reason: this.reason }).then((res) => {
        if (res.statusCode == 200) {
          uni.showToast({
            title: "Order has been cancelled",
            duration: 2000,
            icon: "none",
          });
          this.initData(0);

          this.cancelShow = false;
        } else {
          uni.showToast({
            title: res.data.message,
            duration: 2000,
            icon: "none",
          });
          this.cancelShow = false;
        }
      });
    },

    /**
     * Confirm receipt display
     */
    onRog(sn) {
      this.orderSn = sn;
      this.rogShow = true;
    },

    /**
     * Click to confirm receipt
     */
    confirmRog() {
      confirmReceipt(this.orderSn).then((res) => {
        if (res.data.code == 200) {
          uni.showToast({
            title: "Receipt Confirmed",
            duration: 2000,
            icon: "none",
          });
          this.initData(this.tabCurrentIndex);
          this.rogShow = false;
        }
      });
    },

    /**
     * Review products
     */
    onComment(sn) {
      uni.navigateTo({
        url: "./evaluate/myEvaluate",
      });
    },

    /**
     * repurchase
     */
    reBuy(order) {
      console.log(order);
      return;
      uni.navigateTo({
        url:
          "/pages/product/goods?id=" + order.id + "&goodsId=" + order.goodsId,
      });
    },

    /**
     * View Logistics
     */
    navigateToLogistics(order) {
      uni.navigateTo({
        url:
          "/pages/mine/msgTips/packageMsg/logisticsDetail?order_sn=" + order.sn,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.swiper-box {
  height: calc(100vh - 40px);
}

.list-scroll-content {
  height: 100%;
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
    color: $font-color-light;
    position: relative;

    &.current {
      color: $main-color;

      &:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 44px;
        height: 0;
        border-bottom: 2px solid $main-color;
      }
    }
  }
}

.uni-swiper-item {
  height: auto;
}

.seller-view {
  border-radius: 20rpx;
  background-color: #fff;
  margin: 20rpx 0rpx;

  .seller-info {
    height: 70rpx;
    padding: 0 20rpx;

    .seller-name {
      font-size: 28rpx;
      font-weight: 600;
      display: flex;
      flex-direction: row;

      .name {
        margin-left: 15rpx;
        margin-top: -2rpx;
      }
    }

    .order-sn {
      color: $aider-light-color;
      font-size: 26rpx;
    }
  }

  .goods-item-view {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10rpx 20rpx;

    .goods-img {
      width: 131rpx;
      height: 131rpx;
      margin-right: 10rpx;
      margin-bottom: 10rpx;
    }

    .goods-info {
      padding-left: 30rpx;
      flex: 1;

      .goods-title {
        margin-bottom: 10rpx;
        color: #333333;
      }

      .goods-specs {
        font-size: 24rpx;
        margin-bottom: 10rpx;
        color: #cccccc;
      }

      .goods-price {
        font-size: 28rpx;
        margin-bottom: 10rpx;
        color: $aider-light-color;
      }
    }

    .goods-num {
      width: 60rpx;
      color: $main-color;
    }
  }

  .btn-view {
    padding: 25rpx 30rpx;
    font-size: 26rpx;

    .description {
      display: flex;
      color: #909399;
      size: 24rpx;
      flex: 1;
      .price {
        color: $main-color;
      }
    }
  }
}

.cancel-popup {
  .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 15rpx 0rpx;
  }

  .body {
    padding: 30rpx;

    .title {
      font-weight: 600;
    }

    .value {
      display: flex;
      flex-direction: column;
      margin: 20rpx 0;
      .radio-view {
        margin: 20rpx 0rpx;
      }
    }
  }

  .footer {
    text-align: center;
  }
}

.cancel-btn {
  color: #999999 !important;
  border-color: #999999 !important;
  margin-left: 15rpx;
  height: 60rpx;
}

.pay-btn {
  // #ifndef MP-WEIXIN
  background-color: $light-color !important;
  // #endif
  color: #ffffff !important;
  margin-left: 15rpx;
  height: 60rpx;
}

.rebuy-btn {
  color: $light-color !important;
  border-color: $light-color !important;
  background-color: #ffffff !important;
  margin-left: 15rpx;
  height: 60rpx;
}
</style>

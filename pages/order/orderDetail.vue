<template>
  <view>
    <!-- Order status -->
    <div class="info-view order-view">
      <div class="order-status" v-if="orderStatusList[order.orderStatus]">
        {{ orderStatusList[order.orderStatus].title }}
        <div>{{ orderStatusList[order.orderStatus].value }}</div>
      </div>

    </div>
    <!-- Logistics information -->
    <view class="info-view logi-view">
      <view class="logi-List" v-if="logiList && logiList.traces.length != 0">
        <view class="logi-List-title">
          {{logiList.traces[logiList.traces.length-1].AcceptStation}}
        </view>
        <view class="logi-List-time">
          {{logiList.traces[logiList.traces.length-1].AcceptTime}}
        </view>
      </view>

      <view class="logi-List" v-else>
        <view class="verificationCode" v-if="order.verificationCode ">
          Coupon code: {{order.verificationCode}}
        </view>
        <view v-else class="logi-List-title">
          {{'No logistics information temporarily'}}
        </view>
      </view>

    </view>
    <!-- Address -->
    <view class="info-view">
      <view class="address-view">
        <view>
          <view class="address-title">
            <span>{{ order.consigneeName || "nickname not filled in" }}</span>
            <span>{{ order.consigneeMobile || "Mobile phone number not filled in" | secrecyMobile }}</span>
          </view>
          <view class="address">Address: {{ order.consigneeAddressPath }}
            {{ order.consigneeDetail }}</view>
        </view>
      </view>
    </view>
    <!-- Commodity information -->
    <view>
      <view class="seller-view">
        <!-- shop name -->
        <view class="seller-info u-flex u-row-between">
          <view class="seller-name" @click="tostore(order)">
            <view class="name">{{ order.storeName }}</view>
            <view class="status" v-if="orderStatusList[order.orderStatus]"> {{ orderStatusList[order.orderStatus].title }}</view>
          </view>
          <view class="order-sn"></view>
        </view>
        <view>
          <view v-for="(sku, skuIndex) in orderGoodsList" :key="skuIndex">
            <view class="goods-item-view">
              <view class="goods-img" @click="gotoGoodsDetail(sku)">
                <u-image border-radius="6" width="131rpx" height="131rpx" :src="sku.image"></u-image>
              </view>
              <view class="goods-info" @click="gotoGoodsDetail(sku)">
                <view class="goods-title u-line-2">{{ sku.goodsName }}</view>
                <view class="goods-price">
                  ￥{{ sku.goodsPrice | unitPrice }}
                  <!-- <span v-if="sku.point">+{{ sku.point }}Points</span> -->
                </view>
              </view>
              <view class="goods-num">
                <view>x{{ sku.num }}</view>

                <view class="good-complaint">
                  <u-tag size="mini" mode="plain" @click="complaint(sku)" v-if="sku.complainStatus =='NO_APPLY'" text="complaint" type="info" />
                </view>
              </view>
            </view>

          </view>
        </view>
      </view>
    </view>
    <view class="info-view">
      <view>
        <view class="order-info-view">
          <view class="title">Total price of the product:</view>
          <view class="value">￥{{ order.goodsPrice | unitPrice }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">Shipping:</view>
          <view class="value">￥{{ order.freightPrice | unitPrice }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">Coupon:</view>
          <view class="value">￥{{ order.couponPrice | unitPrice }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">Activity offer:</view>
          <view class="value">￥{{ order.discountPrice | unitPrice }}</view>
        </view>
        <!-- <view class="order-info-view" v-if="order.use_point">
<view class="title">Use points:</view>
<view class="value">{{ order.use_point }}</view>
</view> -->
      </view>
    </view>
    <!-- Customer service, after-sales service, cancel order, check logistics, complaint, etc. -->
    <view class="info-view"
      v-if="orderDetail.allowOperationVO && orderDetail.allowOperationVO.cancel == true || order.orderStatus =='DELIVERED' || order.orderStatus !='UNPAID' && order.orderPromotionType =='PINTUAN'">
      <view style="width: 100%">
        <view class="order-info-view">
          <view class="title">Service</view>
        </view>
        <view class="customer-list">
          <view class="customer-service" v-if="orderDetail.allowOperationVO && orderDetail.allowOperationVO.cancel == true" @click="onCancel(order.sn)">Cancel order</view>
          <view class="customer-service" v-if="order.orderStatus =='DELIVERED'" @click="onLogistics(order)">View logistics</view>
          <view class="customer-service" v-if="order.orderStatus !='UNPAID' && order.orderPromotionType =='PINTUAN' "@click="ByUserMessage(order)">View join group information</view>
        </view>
      </view>
    </view>
    <view class="info-view">
      <view style="width: 100%">
        <view class="order-info-view">
          <view class="title">Order ID:</view>
          <view class="value">
            {{ order.sn }}
            <u-tag class="copy" text="copy" type="info" size="mini" @click="onCopy(order.sn)" />
          </view>
        </view>
        <view class="order-info-view">
          <view class="title">Order time:</view>
          <view class="value">{{
            order.createTime
          }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">Payment status:</view>
          <view class="value">
            {{
              order.payStatus == "UNPAID"
                ? "Unpaid"
                : order.payStatus == "PAID"
                ? "Paid"
                : ""
            }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">Payment method:</view>
          <view class="value">{{ orderDetail.paymentMethodValue }}</view>
        </view>
      </view>
    </view>

    <view class="info-view" v-if="order.payStatus =='PAID'">
      <view>
        <view class="invoice-info-view">
          <view class="ltitle">Invoice information:</view>
          <view v-if="!order.needReceipt" class="value">No invoice required</view>
          <view v-else class="value" @click="onReceipt(order.receiptVO)">View invoice</view>
        </view>
      </view>
    </view>
    <view style="padding-bottom: 150rpx"></view>

    <view class="bottom_view">
      <view class="btn-view u-flex u-row-between">
        <view class="description">
          <!-- All -->
          <!-- Waiting for payment -->

          <text v-if="order.payStatus ==='PAID'">Amount paid:</text>
          <text v-else>Amount payable:</text>

          <text class="price" v-if="order.priceDetailDTO">￥{{ order.priceDetailDTO.flowPrice | unitPrice }}</text>
        </view>
        <view>
          <!-- All -->
          <!-- Waiting for payment -->
          <u-button type="error" ripple size="mini" v-if=" order.allowOperationVO && order.allowOperationVO.pay" @click="toPay(order)">Pay now</u-button>

          <!-- <u-button class="rebuy-btn" size="mini" v-if="order.order_operate_allowable_vo.allow_service_cancel"> Remind delivery</u-button> -->
          <!-- <div class="pay-btn">Confirm receipt</div> -->
          <u-button shape="circle" ripple type="warning" size="mini" v-if="order.orderStatus =='DELIVERED'" @click="onRog(order.sn)">Confirm receipt< /u-button>
          <!-- Transaction completed, not evaluated -->
          <u-button shape="circle" ripple size="mini" v-if="order.orderStatus =='COMPLETE'" @click="onComment(order.sn)">Review the product</u-button>
        </view>
      </view>
    </view>
    <u-popup class="cancel-popup" v-model="cancelShow" mode="bottom" length="60%">
      <view class="header">Cancel order</view>
      <view class="body">
        <view class="title">After canceling the order, the discounts enjoyed by this order may also be cancelled. Do you want to continue? </view>
        <view>
          <u-radio-group v-model="reason">
            <view class="value">
              <view class="radio-view" v-for="(item, index) in cancelList" :key="index">
                <u-radio :active-color="lightColor" label-size="25" shape="circle" :name="item.reason" @change="reasonChange">{{ item.reason }}</u-radio>
              </view>
            </view>
          </u-radio-group>
        </view>
      </view>
      <view class="footer">
        <u-button size="medium" v-if="reason" shape="circle" @click="submitCancel">Submit</u-button>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
    <u-modal v-model="rogShow" :show-cancel-button="true" :content="'Are you sure to receive the goods?'" :confirm-color="lightColor" @confirm="confirmRog"></ u-modal>

    <!-- Share -->
    <shares v-if="shareFlage" :thumbnail="orderDetail.orderItems[0].image" :goodsName="orderDetail.orderItems[0].goodsName" @close="shareFlage = false" />
  </view>
</template>

<script>
import { getExpress } from "@/api/trade.js";
import { cancelOrder, confirmReceipt, getOrderDetail } from "@/api/order.js";

import { h5Copy } from "@/js_sdk/h5-copy/h5-copy.js";
import shares from "@/components/m-share/index"; //分享

import { getClearReason } from "@/api/after-sale.js";

export default {
  components: {
    shares,
  },
  data() {
    return {
      lightColor: this.$lightColor,
      logiList: "", //Logistics information
      shareFlage: false, //Join group sharing switch
      orderStatusList: {
        UNPAID: {
          title: "Unpaid",
          value: "The goods have not yet been paid for",
        },
        PAID: {
          title: "paid",
          value: "Buyer has paid",
        },
        UNDELIVERED: {
          title: "Pending Shipment",
          value: "The product is waiting to be shipped",
        },
        DELIVERED: {
          title: "Delivered",
          value: "The product has been shipped, please wait patiently",
        },
        CANCELLED: {
          title: "Cancelled",
          value: "Order has been cancelled",
        },
        COMPLETED: {
          title: "Completed",
          value: "The order has been completed, I wish you a happy life",
        },
        TAKE: {
          title: "Pending Verification",
        },
      },
      order: {},
      cancelShow: false, //Cancel the order
      orderSn: "",
      orderGoodsList: "", //The collection of goods in the order
      orderDetail: "", //Order details
      sn: "",
      cancelList: "",
      rogShow: false,
      reason: "",
    };
  },
  onLoad(options) {
    this.loadData(options.sn);
    this.loadLogistics(options.sn);
    this.sn = options.sn;
  },
  methods: {
    tostore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },
    // Obtain logistics information
    loadLogistics(sn) {
      getExpress(sn).then((res) => {
        this.logiList = res.data.result;
      });
    },

    // Share the current join group information
    inviteGroup() {
      this.shareFlage = true;
    },
    // #TODO This piece needs to be written. There is no detailed information about group joining.
    ByUserMessage(order) {
      uni.navigateTo({
        url:
          "/pages/cart/payment/shareOrderGoods?sn=" +
          order.sn +
          "&sku=" +
          this.orderGoodsList[0].skuId +
          "&goodsId=" +
          this.orderGoodsList[0].goodsId,
      });
    },
    loadData(sn) {
      uni.showLoading({
        title: "Loading",
      });
      getOrderDetail(sn).then((res) => {
        const order = res.data.result;
        this.order = order.order;
        this.orderGoodsList = order.orderItems;
        this.orderDetail = res.data.result;

        uni.hideLoading();
      });
    },
    onReceipt(val) {
      uni.navigateTo({
        url: "/pages/order/invoice/invoiceDetail?id=" + val.id,
      });
    },
    gotoGoodsDetail(sku) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${sku.id}&goodsId=${sku.goodsId}`,
      });
    },
    onCopy(sn) {
      // #ifdef H5
      if (sn === null || sn === undefined) {
        sn = "";
      } else sn = sn + "";
      const result = h5Copy(sn);
      if (result === false) {
        uni.showToast({
          title: "Not supported",
        });
      } else {
        uni.showToast({
          title: "Copy successful",
          icon: "none",
        });
      }
      // #endif

      // #ifndef H5
      uni.setClipboardData({
        data: sn,
        success: function () {
          uni.showToast({
            title: "Copy successful!",
            duration: 2000,
            icon: "none",
          });
        },
      });
      // #endif
    },

    /**
     * Complaint
     */
    complaint(sku) {
      uni.navigateTo({
        url:
          "/pages/order/complain/complain?sn=" +
          this.sn +
          "&skuId=" +
          sku.skuId,
      });
    },
    //After-sales button
    onAfterSales(sn, sku) {
      uni.navigateTo({
        url: `./afterSales/afterSalesSelect?sn=${sn}&sku=${encodeURIComponent(
          JSON.stringify(sku)
        )}`,
      });
    },
    // to pay
    toPay(val) {
      val.sn
        ? uni.navigateTo({
            url: "/pages/cart/payment/payOrder?order_sn=" + val.sn,
          })
        : false;
    }, //Delete order
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
    onCancel(sn) {
      this.orderSn = sn;

      uni.showLoading({
        title: "Loading",
      });
      getClearReason().then((res) => {
        if (res.data.result.length >= 1) {
          this.cancelList = res.data.result;
        }
        uni.hideLoading();
      });

      this.cancelShow = true;
    },

    //Submit cancellation order (unpaid)
    submitCancel() {
      cancelOrder(this.orderSn, {reason: this.reason }).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "Cancelled",
            duration: 2000,
            icon: "none",
          });
          this.cancelShow = false;
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/order/myOrder?status=0",
            });
          }, 500);
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

    //Confirm receipt
    onRog(sn) {
      this.orderSn = sn;
      this.rogShow = true;
    },
    confirmRog() {
      confirmReceipt(this.orderSn).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "Receipt Confirmed",
            duration: 2000,
            icon: "none",
          });
          this.rogShow = false;
          this.loadData(this.sn);
        }
      });
    },
    //Evaluate the product
    onComment(sn) {
      uni.navigateTo({
        url: "./evaluate/myEvaluate",
      });
    }, //View Logistics
    onLogistics(order) {
      uni.navigateTo({
        url:
          "/pages/mine/msgTips/packageMsg/logisticsDetail?logi_id=" +
          order.logi_id +
          "&ship_no=" +
          order.ship_no +
          "&order_sn=" +
          order.sn,
      });
    },

    //Select the reason for cancellation
    reasonChange(reason) {
      this.reason = reason;
    },
    reBuy(order) {
      uni.navigateTo({
        url:
          "/pages/product/goods?id=" + order.id + "&goodsId=" + order.goodsId,
      });
    },
  },
};
</script>

<style lang="scss">
@import "./goods.scss";
.empty {
  width: 100%;
}
.customer-service {
  background: #ededed;
  // padding: 12rpx 40rpx;
  width: 48%;
  margin: 0 1%;
  height: 55rpx;
  line-height: 55rpx;
  margin-bottom: 10rpx;
  text-align: center;
  font-size: 24rpx;
  border-radius: 10rpx;
}
.customer-list {
  display: flex;
  flex-wrap: wrap;
}
.logi-view {
  justify-content: space-between;
  padding: 30rpx !important;
  margin: 0 !important;
  transform: translateY(-10px);
}
.order-status {
  color: #fff;
  width: 100%;
  text-align: center;
  font-size: 36rpx;
  margin-top: 40rpx;
  > div {
    font-size: 24rpx;
    margin-top: 10rpx;
  }
}
.logi-List-title {
  margin-bottom: 10rpx;
  font-size: 26rpx;
}
.logi-List-time {
  font-size: 24rpx;
  color: #999;
}
.info-detail {
  margin-right: 30rpx;
  color: #333;
}
.order-view {
  margin: 0 !important;
  border-radius: 0 !important;
  width: 100%;
  height: 200rpx;
  padding: 0 !important;
  background-image: linear-gradient(
    to right,
    $light-color 0%,
    $aider-light-color 100%
  ) !important;
}
page,
.content {
  background: #f1f1f1;
  height: 100%;
}

.info-line {
  align-items: center;
  display: flex;
  border-radius: 30rpx;
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
  width: 100%;
  height: 110rpx;
  color: #333333;
  font-size: 28rpx;
  border-bottom: 1rpx solid #eeeeee;

  .info-title {
    margin: 0 30rpx;
    padding: 16rpx 0rpx;
  }
}
.seller-view {
  margin: 20rpx 0;
  padding: 15rpx 0;
  border-radius: 30rpx;
}
.address-title {
  font-size: 26rpx;
  font-weight: bold;
  > span {
    margin-right: 20rpx;
  }
}
.info-view {
  display: flex;
  margin: 0 0 20rpx 0;
  border-radius: 30rpx;
  flex-direction: row;
  padding: 15rpx 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;

  .address-view {
    display: flex;
    flex-direction: row;
    padding: 16rpx 0;

    .address {
      color: $font-color-light;
      overflow: hidden;
      line-height: 1.75;
      font-size: 22rpx;
    }
  }

  .order-info-view {
    line-height: 60rpx;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 10rpx 0rpx;

    .title {
      color: #666;
      width: 140rpx;
      font-size: 24rpx;
      font-weight: 600;
    }

    .value {
      color: #666;
      font-size: 24rpx;
    }

    .copy {
      font-size: 20rpx;
      color: #333;
      border: 1px solid #dddddd;
      margin-left: 30rpx;
    }
  }

  .invoice-info-view {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 10rpx 0rpx;

    .ltitle {
      width: 550rpx;
      font-size: 28rpx;
      color: #333333;
    }

    .value {
      color: $font-color-light;
    }
  }
}
.verificationCode {
  font-weight: bold;
  letter-spacing: 2rpx;
}
.bottom_view {
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;

  .btn-view {
    padding: 0 30rpx;
    line-height: 100rpx;
    font-size: 26rpx;

    .description {
      color: #909399;
      size: 25rpx;

      .price {
        color: $main-color;
      }
    }
  }

  .cancel-btn {
    color: #999999;
    border-color: #999999;
    margin-left: 15rpx;
    height: 60rpx;
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

      .radio-view {
        margin: 10rpx 0rpx;
      }
    }
  }

  .footer {
    text-align: center;
  }
}
</style>

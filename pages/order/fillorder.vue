<template>
  <div class="wrapper">
    <!-- Select address -->
    <div class="box1 box">
      <u-row style="margin-top: 32rpx">
        <u-col style="padding: 0 !important" :offset="0" :span="11" @click.native="clickToAddress()">
          <div v-if="!address.id">Please select an address</div>
          <div v-else>
            <div class="userClass">
              {{ address.name }}
              <span>
                {{ address.mobile | secrecyMobile }}
                <u-tag v-if="address.isDefault" text="default" style="margin-left: 24rpx" mode="plain" type="error" size="mini" />
              </span>
            </div>
            <div class="userAdress">
              <span v-if="address.consigneeAddressPath[0]">{{
                address.consigneeAddressPath[0]
              }}</span>

              <span v-if="address.consigneeAddressPath[1]">{{
                address.consigneeAddressPath[1]
              }}</span>
              <span v-if="address.consigneeAddressPath[2]">{{
                address.consigneeAddressPath[2]
              }}</span>

              <span v-if="address.consigneeAddressPath[3]">{{
                address.consigneeAddressPath[3]
              }}</span>
              <span>
                {{ address.detail }}
              </span>
            </div>
          </div>
        </u-col>
        <u-col :span="1" @click.native="
            navigateTo('/pages/mine/address/address?way=' + routerVal.way)
          "style="text-align: right">
          <u-icon name="arrow-right" style="color: #bababa"></u-icon>
        </u-col>
      </u-row>
    </div>
    <!-- Background -->
    <div class="bar"></div>

    <!-- Group opening information -->
    <view class="group-box" v-if="isAssemble">
      <view class="group-title">
        <span v-if="pintuanFlage">You are starting a group purchase</span>
        <span v-else>Join you only a group purchase of <span>{{routerVal.parentOrder.toBeGroupedNum }}</span>
      </view>
      <view class="group">
        <view>
          <u-image borderRadius="50%" shape="square" class="head-img" width="81rpx" height="81rpx" :src="masterWay.face ||'/static/missing-face.png '"></u-image>
          <view class="btn-one">Leader</view>
        </view>
        <view class="line"> </view>
        <view>
          <!-- If there is the last one, display the last one, if there is no last one, display waiting to join the group -->
          <u-image class="head-img" v-if="endWay.face" :src="endWay.face" borderRadius="50%" shape="square" width="81rpx" height="81rpx">
            <view slot="loading"></view>
          </u-image>

          <u-image class="head-img" borderRadius="50%" shape="square" v-else width="81rpx" height="81rpx" :src="endWay.face ||'/static/missing- face.png'"></u-image>

          <view class="wait">{{ endWay.nickname || "Waiting to join the group" }}</view>
        </view>
      </view>
    </view>

    <!-- Store product information -->
    <div class="box box2" v-for="(item, index) in orderMessage.cartList" :key="index">
      <u-row class="tab1" @click="navigateToStore(item)">
        <u-col :offset="0">
          <span class="ybname">{{ item.storeName }}</span>
        </u-col>
      </u-row>
      <div class="promotionNotice">{{ item.promotionNotice }}</div>
      <u-row class="goodsBorder" v-for="(val, i) in item.skuList" :key="i">
        <u-col class="tabL" :offset="0" @click="navigateTo('/pages/product/goods?id=' + val.goodsSku.id+'&goodsId='+val.goodsSku.goodsId)" :span="3">
          <u-image borderRadius="10rpx" :src="val.goodsSku.thumbnail" alt />
        </u-col>
        <u-col :span="9" @click="navigateTo('/pages/product/goods?id=' + val.goodsSku.id+'&goodsId='+val.goodsSku.goodsId)" class="tabC" >
          <div style="overflow: hidden">
            <p class="sp_name">{{ val.goodsSku.goodsName }}</p>
            <p class="sp_promotion" v-if="val.promotion_tags">
              <view class="sp_tag sp_tag_plain" v-for="(promotion_item, promotion_index) in val.promotion_tags" :key="promotion_index">{{ promotion_item }}</view>
            </p>
            <span class="nums">x{{ val.num }}</span>
          </div>

          <p class="sp_number">￥{{ val.goodsSku.price | unitPrice }}</p>
        </u-col>
      </u-row>

      <u-row>
        <u-col :offset="0" :span="4" class="tl" style="text-align: left">Remarks information</u-col>
        <u-col :span="8" textAlign="right">
          <u-input style="text-align:right;" class="uinput" v-model="remarkVal[index].remark" />
        </u-col>
      </u-row>
    </div>
    <!-- Order information -->
    <div class="box box3">
      <u-row>
        <u-col :offset="0" :span="4">Invoice information</u-col>
        <u-col :span="8" class="tipsColor" textAlign="right" @click.native="invoice()">
          <span v-if="receiptList">{{receiptList.receiptTitle}}-{{receiptList.receiptContent}}</span>
          <span v-else>No invoice is issued</span>
        </u-col>
      </u-row>
    </div>

    <!-- Invoice information -->
    <invoices :res="receiptList" @callbackInvoice="callbackInvoice" v-if="invoiceFlag" />
    <u-select v-model="shippingFlag" :list="shippingMethod"></u-select>

    <!-- Coupon -->
    <div class="box box4">
      <u-row>
        <u-col v-if="orderMessage.cartTypeEnum !='VIRTUAL'" :offset="0" :span="9" @click="shippingFlag = true">Delivery method</u-col>
        <u-col v-if="orderMessage.cartTypeEnum !='VIRTUAL'" :span="3" textAlign="right" @click="shippingFlag = true">
          {{ shippingMethod.find(e=>{ return e.value == shippingText; }).label }}
        </u-col>
      </u-row>
      <u-row>
        <u-col :offset="0" :span="9" @click="GET_Discount()">Coupon</u-col>

        <u-col :span="3" v-if="orderMessage.priceDetailDTO && orderMessage.priceDetailDTO.couponPrice" textAlign="right" @click="GET_Discount()">
          <span class="main-color">-{{orderMessage.priceDetailDTO.couponPrice | unitPrice}}</span>
        </u-col>
        <!-- orderMessage.priceDetailDTO.couponPrice | unitPrice -->
        <u-col :span="3" v-else textAlign="right" @click="GET_Discount()">
          {{ couponNums || "0" }} available
          <u-icon name="arrow-right"></u-icon>
        </u-col>
      </u-row>

    </div>

    <div class="box box5" v-if="orderMessage.priceDetailDTO">
      <div>
        <u-row>
          <u-col :span="9">Commodity total</u-col>
          <u-col :span="3" textAlign="right">
            <span>￥{{ orderMessage.priceDetailDTO.goodsPrice | unitPrice }}</span>
          </u-col>
        </u-row>
      </div>
      <div>
        <u-row>
          <u-col v-if="orderMessage.cartTypeEnum !='VIRTUAL'" :span="7">Shipping fee</u-col>
          <u-col v-if="orderMessage.cartTypeEnum !='VIRTUAL'" :span="5" class="tr tipsColor" textAlign="right">
            <u-tag v-if="orderMessage.priceDetailDTO.freightPrice == 0" style="margin-right: 20rpx" color="#FF6262" text="Free shipping" type="warning" size="mini" mode ="plain" shape="circle" />
            <span>￥{{
                orderMessage.priceDetailDTO.freightPrice | unitPrice
              }}</span>
          </u-col>
        </u-row>
      </div>

      <div>
        <u-row>
          <u-col :span="9">Discount amount</u-col>
          <u-col :span="3" textAlign="right">-￥{{ orderMessage.priceDetailDTO.couponPrice | unitPrice }}</u-col>
        </u-row>
      </div>
      <div>
        <u-row>
          <u-col :span="6">Activity discount</u-col>
          <u-col :span="6" class="tr tipsColor" textAlign="right">
            <u-tag style="margin-right: 20rpx" v-if="orderMessage.priceDetailDTO.discountPrice != 0" color="#FF6262" :text="`Offer ${orderMessage.priceDetailDTO.discountPrice} Yuan`" type="warning"
              size="mini" mode="plain" shape="circle" />
            <span>{{
              orderMessage.priceDetailDTO.discountPrice | unitPrice
            }}</span>
          </u-col>
        </u-row>
      </div>
    </div>

    <!-- There is no prompt for delivery area -->
    <div class="notSupportFreight" v-if="notSupportFreight.length !=0">
      <u-notice-bar style="width:100%" :volume-icon="false" mode="horizontal" :list="notSupportFreightGoodsList"></u-notice-bar>
    </div>

    <!-- Checkout -->
    <div class="box6 mp-iphonex-bottom" v-if="orderMessage.priceDetailDTO">
      <div class="tabbar-left">
        total:
        <span class="number">
          ¥
          <span>{{ orderMessage.priceDetailDTO.billPrice | unitPrice }}</span>
        </span>
      </div>
      <div class="navRiv" @click="createTradeFun()">
        <!-- #ifndef MP-WEIXIN -->
        <div class="tabbar-right">Submit an order</div>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <div class="tabbar-right">WeChat Pay</div>
        <!-- #endif -->

      </div>
    </div>
  </div>
</template>
<script>
import * as API_Trade from "@/api/trade";
import * as API_Address from "@/api/address";
import * as API_Order from "@/api/order";
import invoices from "@/pages/order/invoice/setInvoice";

import LiLiWXPay from "@/js_sdk/lili-pay/wx-pay.js";

export default {
  onLoad: function (val) {
    this.routerVal = val;
  },
  components: {
    invoices,
  },

  watch: {},
  data() {
    return {
      invoiceFlag: false, //Invoice switch
      shippingText: "LOGISTICS",
      shippingFlag: false,
      shippingMethod: [
        {
          value: "LOGISTICS",
          label: "Logistics",
        },
      ],
      isAssemble: false, //Whether to join the group
      couponNums: "", //Number of coupons on the checkout page
      selectAddressId: "",
      routerVal: "",
      params: {},
      // coupon
      couponList: "",
      // selected address
      address: "",
      // Invoice Information
      receiptList: "",
      // Store Information
      orderMessage: "",
      data: "",
      // Store notes
      remarkVal: [],
      detail: "", //All data returned
      endWay: "", //The last participant
      masterWay: "", //group leader information
      pintuanFlage: true, //Whether to start a group or join a group
      notSupportFreight: [], //Freight is not supported
      notSupportFreightGoodsList: ["The following products are out of delivery scope:"],
    };
  },
  filters: {
    /**
     * Invoice receipt type
     */
    receiptType(type) {
      switch (type) {
        case "VATORDINARY":
          return "General VAT Invoice";
        case "ELECTRO":
          return "Electronic General Invoice";
        case "VATOSPECIAL":
          return "Special Value Added Tax Invoice";
        default:
          return "Not invoiced";
      }
    },
  },

  /**
   * Monitor return
   */
  onBackPress(e) {
    if (e.from == "backbutton") {
      let routes = getCurrentPages();
      let curRoute = routes[routes.length-1].options;
      routes.forEach((item) => {
        if (
          item.route == "pages/tabbar/cart/cartList" ||
          item.route.indexOf("pages/product/goods") != -1
        ) {
          uni.redirectTo({
            url: item.route,
          });
        }
      });

      if (curRoute.addId) {
        uni.reLaunch({
          url: "/pages/tabbar/cart/cartList",
        });
      } else {
        uni.navigateBack();
      }
      return true; //Prevent the default return behavior
    }
  },

  onShow() {
    uni.showLoading({
      mask: true,
    });
    this.getOrderList();
    uni.hideLoading();
    if (this.routerVal.way == "PINTUAN") {
      this.isAssemble = true;
      this.routerVal.parentOrder = JSON.parse(
        decodeURIComponent(this.routerVal.parentOrder)
      );
      this.pintuanWay();
    }
  },
  mounted() {},

  methods: {
    //Invoice callback refresh the shopping cart after selecting the invoice
    async callbackInvoice(val) {
      this.invoiceFlag = false;
      this.receiptList = val;
      if (val) {
        let submit = {
          way: this.routerVal.way,
          ...this.receiptList,
        };
        let receipt = await API_Order.getReceipt(submit);
        if (receipt.data.success) {
          this.shippingFlag = false;
          this.getOrderList();
        }
      }
    },

    // Jump to the shop
    navigateToStore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },
    // Click the jump address
    clickToAddress() {
      this.navigateTo(
        `/pages/mine/address/address?from=cart&way=${
          this.routerVal.way
        }&parentOrder=${encodeURIComponent(
          JSON.stringify(this.routerVal.parentOrder)
        )}`
      );
    },

    // Judging the leader and member information
    pintuanWay() {
      const {memberId} = this.routerVal.parentOrder;

      const userInfo = this.$options.filters.isLogin();
      if (memberId) {
        this.endWay = userInfo;
        this.masterWay = this.routerVal.parentOrder;
        this.pintuanFlage = false;
      } else {
        this.pintuanFlage = true;
        this.masterWay = userInfo;
      }
    },
    // Judging the invoice
    invoice() {
      this.invoiceFlag = true;
    },

    // Receive coupon
    GET_Discount() {
      // Cycle shop id, product id to get coupon
      let store = [];
      let skus = [];
      this.orderMessage.cartList.forEach((item) => {
        item.skuList.forEach((sku) => {
          store.push(sku.storeId);
          skus.push(sku.goodsSku.id);
        });
      });
      store = Array.from(new Set(store));
      skus = Array.from(new Set(skus));
      uni.setStorage({
        key: "totalPrice",
        data: this.orderMessage.priceDetailDTO.goodsPrice,
      });
      this.navigateTo(
        `/pages/cart/coupon/index?way=${this.routerVal.way}&storeId=${store}&skuId=${skus}`
      );
    },

    /**
     * Jump
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    /**
     * Submit the order and prepare to pay
     */

    // Create Order
    createTradeFun() {
      // Anti-shake
      this.$u.throttle(() => {
        if (!this.address.id) {
          uni.showToast({
            title: "Please select an address",
            duration: 2000,
            icon: "none",
          });
          return false;
        }
        //  Create Order
        let client;
        // #ifdef H5
        client = "H5";
        // #endif
        // #ifdef MP-WEIXIN
        client = "WECHAT_MP";
        // #endif
        // #ifdef APP-PLUS
        client = "APP";
        // #endif

        let submit = {
          client,
          way: this.routerVal.way,
          remark: this.remarkVal,
          parentOrderSn: "",
        };
        // If it is a group join and the current user is not the group leader
        this.routerVal.parentOrder && this.routerVal.parentOrder.orderSn
          ? (submit.parentOrderSn = this.routerVal.parentOrder.orderSn)
          : delete submit.parentOrderSn;

        /**
         * Create Order
         */
        API_Trade.createTrade(submit).then((res) => {
          if (res.data.success) {
            uni.showToast({
              title: "The order was created successfully!",
              duration: 2000,
              icon: "none",
            });
            // If the current price is 0, jump to the order list
            if (this.orderMessage.priceDetailDTO.billPrice == 0) {
              uni.redirectTo({
                url: "/pages/order/myOrder?status=0",
              });
            } else {
              // #ifdef MP-WEIXIN
              // Click Create Order in WeChat Mini Program to start payment directly
              this.pay(res.data.result.sn);
              // #endif

              // #ifndef MP-WEIXIN
              this.navigateTo(
                `/pages/cart/payment/payOrder?trade_sn=${res.data.result.sn}`
              );
              // #endif
            }
          } else {
            uni.showToast({
              title: res.data.message,
              duration: 2000,
              icon: "none",
            });
          }
        });
      }, 3000);
    },

    /**
     * Direct payment in WeChat Mini Program
     */
    async pay(sn) {
      new LiLiWXPay({
        sn: sn,
        price: this.orderMessage.priceDetailDTO.billPrice,
      }).pay();
    },

    /**
     * Get user address
     */
    getUserAddress() {
      // If there is no product selection address, select the default address
      API_Address.getAddressDefault().then((res) => {
        if (res.data.result) {
          res.data.result.consigneeAddressPath =
            res.data.result.consigneeAddressPath.split(",");
          this.address = res.data.result;
        }
      });
    },

    // Get settlement parameters
    getOrderList() {
      // Get coupons available in the shopping cart
      this.getCartsCouponNums();
      // Get settlement parameters
      API_Trade.getCheckoutParams(this.routerVal.way).then((res) => {
        res.data.result.cartList.forEach((item, index) => {
          this.remarkVal[index] = {
            remark: item.remark,
            storeId: item.storeId,
          };
        });
        this.orderMessage = res.data.result;

        if (!res.data.result.memberAddress.id) {
          // Get member default address
          this.getUserAddress();
        } else {
          this.address = res.data.result.memberAddress;
          res.data.result.memberAddress.consigneeAddressPath =
            res.data.result.memberAddress.consigneeAddressPath.split(",");
        }

        if (
          res.data.result.notSupportFreight &&
          res.data.result.notSupportFreight.length != 0
        ) {
          this.notSupportFreight = res.data.result.notSupportFreight;

          res.data.result.notSupportFreight.forEach((item) => {
            this.notSupportFreightGoodsList[0] += item.goodsSku.goodsName;
          });
        }
      });
    },

    /**Coupons available for shopping cart */
    getCartsCouponNums() {
      API_Trade.getCartCouponNum(this.routerVal.way).then((res) => {
        if (res.data.success) {
          this.couponNums = res.data.result;
        }
      });
    },

    //
  },
};
</script>
<style scoped lang="scss">
.main-color {
  font-weight: bold;
}
.uinput {
  /deep/ input {
    text-align: right;
  }
}
.promotionNotice {
  font-size: 24rpx;
  color: $aider-light-color;
}
.nums {
  color: $light-color;
  float: right;
  width: 15%;
  text-align: center;
}
.wait {
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #cccccc;
  text-align: center;
}

.line {
  margin-left: 14rpx;
  margin-right: 14rpx;
  margin-bottom: 50rpx;
  width: 143rpx;
  border-bottom: 2px dotted #999;
}
.tabbar-left {
  margin-left: 32rpx;
}

.btn-one,
.wait {
  margin-top: 14rpx;
}

.btn-one {
  width: 100rpx;
  height: 40rpx;
  background: $light-color;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  text-align: center;
  line-height: 40rpx;
}

.head-img {
  width: 81rpx;
  height: 81rpx;
  margin: 0 auto;
}

.group-title {
  text-align: center;

  font-size: 28rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;

  color: $light-color;
}

.group-box {
  height: 242rpx;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.group {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
.tr {
  text-align: right;
}

.tl {
  text-align: left;
}

/deep/ .u-col-3 {
  text-align: right;
}

.bar {
  height: 4rpx;
  overflow: hidden;
  width: 100%;
  background: url("/pages/floor/imgs/line.png") no-repeat;
}

.tabC {
  > p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.box2 {
  margin-top: 20rpx;
}
.notSupportFreight {
  position: fixed;

  bottom: calc(100rpx + env(safe-area-inset-bottom));
  // #ifdef H5
  bottom: 100rpx;
  // #endif
  display: flex;
  align-items: center;
  left: 0;
  background: #fdf6ec;
  height: 100rpx;
  width: 100%;
  transition: 0.35s;

  > .tips {
    margin: 0 32rpx;
  }
}
/deep/ .u-notice-bar-wrap {
  width: 100% !important;
}

.userClass {
  font-weight: bold;
  font-size: 32rpx;
  color: $u-content-color;
  > span {
    margin-left: 20rpx;
  }
}

.userAdress {
  margin: 20rpx 0;
  color: $u-tips-color;
  font-size: 26rpx;
}

.box6 {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  line-height: 100rpx;
  margin-bottom: 0px !important;
  background: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.tabbar-right {
  margin-top: 10rpx;
  height: 80rpx;
  color: #fff;
  line-height: 80rpx;
  background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
  padding: 0 44rpx;
  text-align: center;
  border-radius: 400px;
  margin-right: 32rpx;
}

.sp_tag {
  display: inline;
  background: #f2f2f2;
  padding: 0 20rpx 0 10rpx;
  height: 20rpx;
  line-height: 20rpx;
  font-size: 24rpx;
  color: #262626;
  border-radius: 0.4em;
}

.sp_promotion {
  float: left;
  width: 75%;
  margin: 4rpx 0;
}

.sp_tag_plain {
  margin-left: 8rpx;
  padding: 0 6rpx 0 6rpx;
  background: #fff;
  border: 1px solid $main-color;
  font-size: 24rpx;
  color: $main-color;
  border-radius: 50px;
}

.sp_tag_plain:nth-of-type(1) {
  margin-left: 0;
}

.sp_name {
  float: left;
  width: 75%;
  font-size: 28rpx;
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.sp_type {
  color: $u-tips-color;
  padding: 8rpx 0;
  font-size: 24rpx;
}

.number {
  color: $main-color;
  font-size: 26rpx;
  margin-left: 10rpx;

  > span {
    font-size: 36rpx;
  }
}

.sp_number {
  color: $light-color;
  font-size: 28rpx;
}

.box1 {
  background: #f6f6f6 !important;
  min-height: 166rpx;
  // height: 200rpx;

  /deep/ .u-row {
    border: none;
  }

  margin-bottom: 0 !important;
}

.box {
  border-radius: 40rpx;
  overflow: hidden;
  background: #fff;
  margin-bottom: 20rpx;
  padding: 0 32rpx;
}

.wrapper {
  background: #f9f9f9;
  height: auto;
  padding-bottom: 200rpx;
  overflow: auto !important;
}

.ybname {
  margin-left: 20rpx;
  font-weight: 400;
  color: #333333;
}

/deep/ .u-col {
  padding: 36rpx 0 !important;
}

/deep/ .u-col-3,
.tipsColor {
  color: $u-tips-color;
}

.tabL {
  text-align: left;
  overflow: hidden;

  /deep/ .u-image,
  .u-image__image {
    width: 132rpx !important;
    height: 132rpx !important;
    border-radius: 0.4em !important;
  }
}
</style>

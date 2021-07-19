<template>
  <div class="wrapper">
    <div class="box">
      <div class="block block-1">
        <image class="img" src="@/pages/cart/static/pay.png" />
        <p class="ptips">Cashier counter</p>

        <p class="ptips">Remaining payment time:
          <u-count-down :show-days="false" :show-border="true" font-size="28" color="#008ffa"
                        border-color="#008ffa" ref="uCountDown" :timestamp="autoCancel"></u-count-down>
        </p>
        <p class="ptips">
          Payment amount
          <span>¥{{ cashierParams.price | unitPrice }}</span>
        </p>
      </div>
    </div>
    <div class="__pay_form__">
    </div>
    <div class="block-4" v-if="cashierParams.price> 0">
      <div class="payItem">Payment method</div>
      <div class="payItem" v-for="(item, index) in payList" :key="index">
        <u-row class="row">
          <div class="col1" @click="awaitPay(item, index)" size="100" style="text-align:left;">
            <div v-if="item =='ALIPAY'">
              <u-icon class="method_icon" name="zhifubao-circle-fill" color="#008ffa" size="80"></u-icon>
              <span class="method_name">Alipay</span>
            </div>
            <div v-if="item =='WECHAT'">
              <u-icon class="method_icon" name="weixin-circle-fill" color="#00c98b" size="80"></u-icon>
              <span class="method_name">WeChat</span>
            </div>
            <div v-if="item =='WALLET'">
              <u-icon class="method_icon" name="red-packet-fill" color="#dd6161" size="80"></u-icon>
              <span class="method_name">Balance payment (current balance: ¥{{ walletValue | unitPrice }})</span>
            </div>
          </div>
          <div class="col3" @click="awaitPay(item)" textAlign="right">
            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
          </div>
        </u-row>
      </div>
    </div>
  </div>
</template>
<script>
import * as API_Trade from '@/api/trade';
import { payCallback } from '@/api/members';

export default {
  data() {
    return {
      //Path parameter
      routerVal: '',
      //Cashier parameters
      cashierParams: '',
      //Collection of payment methods
      payList: '',
      //Pay sn
      sn: '',
      //Order Type
      orderType: '',
      //Payment exception
      exception: {},
      //Payment form
      payForm: {},
      //Payment type APP/WECHAT_MP/H5/NATIVE app/WeChat applet/h5/ QR code
      paymentType: '',
      // Payment client APP/NATIVE/JSAPI/H5
      paymentClient: '',
      //Balance
      walletValue: 0.0,
      // Countdown to payment
      autoCancel: 0

    };
  },
  onLoad(val) {
    this.routerVal = val;

    //Initialization parameters
    // #ifdef APP-PLUS
    this.paymentType = 'APP';
    this.paymentClient = 'APP';
    //#endif
    // #ifdef MP-WEIXIN
    this.paymentType = 'WECHAT_MP';
    this.paymentClient = 'MP';
    //#endif
    // #ifdef H5
    this.paymentType = 'H5';
    //If it is a WeChat browser, use the official account to pay, otherwise use h5,
    // The difference is: h5 calls the WeChat app to pay through the outside of the browser, while JSAPI is inside the WeChat browser, or the applet calls WeChat payment
    this.paymentClient = this.isWeiXin() ? 'JSAPI' : 'H5';
    //#endif


    //
  },
  onBackPress(e) {
    if (e.from == 'backbutton') {
      if (this.routerVal.recharge_sn) {
        uni.switchTab({
          url: '/pages/tabbar/user/my'
        });
      } else {
        uni.redirectTo({
          url: '/pages/order/myOrder?status=0'
        });
      }
      return true; //Prevent the default return behavior
    }
  },
  mounted() {
    this.cashierData();
  },
  methods: {

    /**
     * Jump after payment is successful
     */
    callback(paymentMethod) {
      uni.navigateTo({
        url: '/pages/cart/payment/success?paymentMethod=' +
            paymentMethod +
            '&payPrice=' +
            this.cashierParams.price +
            '&orderType=' + this.orderType
      });
    },

    /**
     * Get cashier details
     */
    cashierData() {
      let parms = {};

      if (this.routerVal.recharge_sn) {
        // Determine whether it is a recharge
        this.sn = this.routerVal.recharge_sn;
        this.orderType = 'RECHARGE';
      } else if (this.routerVal.trade_sn) {
        this.sn = this.routerVal.trade_sn;
        this.orderType = 'TRADE';
      } else {
        this.sn = this.routerVal.order_sn;
        this.orderType = 'ORDER';
      }
      parms.sn = this.sn;
      parms.orderType = this.orderType;
      parms.clientType = this.paymentType;

      API_Trade.getCashierData(parms).then((res) => {
        this.cashierParams = res.data.result;

        // #ifdef MP-WEIXIN
        this.payList = res.data.result.support.filter((item) => {
          return item != 'ALIPAY';
        });
        // #endif


        // #ifndef MP-WEIXIN
        if (this.routerVal.recharge_sn) {
          this.payList = res.data.result.support.filter((item) => {
            return item != 'WALLET';
          });
        } else {
          this.payList = res.data.result.support;
        }

        // #endif
        this.walletValue = res.data.result.walletValue;
        this.autoCancel =
            (res.data.result.autoCancel - new Date().getTime()) / 1000;
      });
    },


    awaitPay(payment) {
      this.$u.throttle(() => {
        this.pay(payment);
      }, 2000);
    },

    //s
    async pay(payment) {

      // Payment number
      const sn = this.sn;
      // Transaction type [transaction number|order number]
      const orderType = this.orderType;

      const clientType = this.paymentType;
      let params = {
        sn,
        orderType,
        clientType
      };

      //Payment method WECHAT/ALIPAY
      const paymentMethod = payment;
      // Client type APP/NATIVE/JSAPI/H5
      const paymentClient = this.paymentClient;

      // #ifdef APP-PLUS
      //APP pay
      // Initialize payment signature
      await API_Trade.initiatePay(paymentMethod, paymentClient, params).then(
          (signXml) => {

            //If the payment is abnormal
            if (!signXml.data.success) {
              uni.showToast({
                title: signXml.data.message,
                duration: 2000
              });
              return;
            }

            let payForm = signXml.data.result;

            let paymentType = paymentMethod === 'WECHAT' ? 'wxpay' : 'alipay';
            uni.requestPayment({
              provider: paymentType,
              orderInfo: payForm,
              success: (e) => {
                console.log(e);
                uni.showToast({
                  icon: 'none',
                  title: 'Payment successful!'
                });

                this.callback(paymentMethod);


              },
              fail: (e) => {
                console.log(e);
                this.exception = e;
                uni.showModal({
                  content: 'Payment failed, if you have already paid, please do not pay repeatedly',
                  showCancel: false
                });
              }
            });
          }
      );
      //APP pay
      // #endif

      //#ifdef H5
      //H5 pay
      await API_Trade.initiatePay(paymentMethod, paymentClient, params).then(
          (res) => {
            let response = res.data;
            //If it is not paid by Alipay, it needs to be judged, because Alipay h5 payment is directly output and does not return the so-called message status
            if (paymentMethod !== 'ALIPAY') {
              //If the payment is abnormal
              if (!response.success) {
                uni.showToast({
                  title: response.message,
                  duration: 2000,
                  icon: 'none'
                });
                return;
              }
            }
            if (paymentMethod === 'ALIPAY') {
              document.write(response);
            } else if (paymentMethod === 'WECHAT') {
              if (this.isWeiXin()) {
                //WeChat official account payment
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',
                    response.result,
                    function (res) {
                      if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        // Use the above method to determine the front-end return, and the WeChat team solemnly reminds:
                        //res.err_msg will return ok after the user has successfully paid, but it does not guarantee that it is absolutely reliable.
                        uni.showToast({
                          icon: 'none',
                          title: 'Payment successful!'
                        });
                        this.callback(paymentMethod);

                      } else {
                        uni.showModal({
                          content: 'Payment failed, if you have already paid, please do not pay repeatedly',
                          showCancel: false
                        });
                      }
                    }
                );
              } else {
                window.location.href = JSON.parse(response.result).h5_url;
              }
            } else if (paymentMethod === 'WALLET') {
              uni.showToast({
                title: response.message,
                icon: 'none'
              });
              if (response.success) {
                this.callback(paymentMethod);
              }
            }
          }
      );
      //H5pay
      // #endif

      //#ifdef MP-WEIXIN
      //WeChat Mini Program
      await API_Trade.initiatePay(paymentMethod, paymentClient, params).then(
          (res) => {
            let response = res.data.result;
            //If the payment is abnormal
            if (!res.data.success) {
              uni.showModal({
                content: res.data.message,
                showCancel: false
              });
              return;
            }
            if (paymentMethod === 'WECHAT') {
              uni.requestPayment({
                provider: 'wxpay',
                appid: response.appid,
                timeStamp: response.timeStamp,
                nonceStr: response.nonceStr,
                package: response.package,
                signType: response.signType,
                paySign: response.paySign,
                success: (e) => {
                  console.log(e);
                  uni.showToast({
                    icon: 'none',
                    title: 'Payment successful!'
                  });
                  this.callback(paymentMethod);

                },
                fail: (e) => {
                  console.log(e);
                  this.exception = e;
                  uni.showModal({
                    content: 'Payment failed, if you have already paid, please do not pay repeatedly',
                    showCancel: false
                  });
                }
              });
            } else {
              uni.showToast({
                icon: 'none',
                title: 'Payment successful!'
              });
              this.callback(paymentMethod);

            }
          }
      );
      // #endif
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.method_icon {
  vertical-align: middle;
}

.method_name {
  font-size: 28 rpx;
  color: #999;
  padding-left: 24 rpx;
}

.row {
  display: flex;
  width: 100%;
}

/deep/ .u-row {
  width: 100% !important;
  display: flex;
  justify-content: space-between !important;
}

.method_name,
.col1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col1 {
  text-align: center;
  flex: 99;
}

.col3 {
  text-align: right;
  flex: 1;
}

.payItem {
  padding: 13px 25 rpx;
  border-top: 1px solid #f9f9f9;

  line-height: 100 rpx;
  font-size: 36 rpx;
  color: #333;
}

.ptips {
  font-size: 32 rpx;
  margin: 20 rpx 0;
  color: #333;

  > span {
    font-size: 40 rpx;
    color: #df5a52;
    margin-left: 10 rpx;
  }
}

.img {
  width: 392 rpx !important;
  height: 296 rpx !important;
}

.wrapper {
  min-height: 100vh;
  height: auto;
  background: #f9f9f9;
}

.block-4 {
  background: #fff;
  color: $u-tips-color;

  > p {
    padding: 8 rpx;
  }
}

.box {
  background: #fff;
  padding: 40 rpx 0;
  //   justify-content: center; //这个是X轴居中
  //   align-items: center; //这个是 Y轴居中
}

.block {
  text-align: center;
  display: block;
  width: 100%;

  image {
    width: 200 rpx;
    height: 200 rpx;
  }
}

.block-1 {
  margin-top: 80 rpx;
}

.btns {
  margin: 0 20 rpx;
}
</style>

import {initiatePay} from "@/api/trade";
class LiLiWXPay {
  constructor(...payList) {
    this.data = payList[0];
    // call payment
    this.pay = () => {
      uni.showLoading({
        title: "Loading",
      });

      let submitData = {
        sn: this.data.sn,
        orderType: this.data.orderType || "TRADE",
        clientType: "WECHAT_MP",
      };
      const paymentMethod = "WECHAT";
      const paymentClient = "MP";
      // call payment
      initiatePay(paymentMethod, paymentClient, submitData).then((res) => {
        let response = res.data.result;
        uni.hideLoading();
        uni.requestPayment({
          provider: "wxpay",
          appid: response.appid,
          timeStamp: response.timeStamp,
          nonceStr: response.nonceStr,
          package: response.package,
          signType: response.signType,
          paySign: response.paySign,
          success: (e) => {
            uni.showToast({
              icon: "none",
              title: "Payment successful!",
            });
            // After success, jump to the payment success page
            uni.redirectTo({
              url:
                "/pages/cart/payment/success?paymentMethod=WECHAT" +
                "&payPrice=" +
                this.data.price,
            });
          },
          fail: (e) => {
            this.exception = e;
            // Jump to the order page after payment is abnormal or failed
            uni.showModal({
              content: "Payment failed, if you have already paid, please do not pay repeatedly",
              showCancel: false,
              success: () => {
                uni.redirectTo({
                  url: "/pages/order/myOrder?status=0",
                });
              },
            });
          },
        });
      });
    };
  }
}

export default LiLiWXPay;

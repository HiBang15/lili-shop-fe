<template>
  <view>
    <chat></chat>
  </view>
</template>
<script>
var chat = requirePlugin('myPlugin');
export default {
  data() {
    return {
      To
    };
  },
  methods: {
    To
  },
  onLoad(e) {
    const params = JSON.parse((decodeURIComponent(e.params)));
    chat.init({
      sign: params.mpSign, //Must pass, the company's unique identification of the channel, after the Tencent Cloud Smart Service background system creates the "small program plug-in" channel, it can be obtained from the "channel management"
      token: params.token, //not required
      uid: params.uuid, //The unique user ID, if there is none, leave it blank, the default is blank
      title: params.storageName, //not required, if not filled in, the configuration title will be obtained by default
      isRMB: '', //Whether the product displays RMB ¥, the default display, false does not display
      data: {//Parameters c1,c2,c3,c4,c5 are used to pass user information, parameters d1,d2,d3,d4,d5,d6 are used to pass product information, the default is empty
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: '',
        d1: params.goodsName, //product description
        d2: params.price, //price
        d3: '', //Original price
        d4: params.goodsImg, //Show product image link
        d5: '', //Commodity jump link
        d6: params.goodsId, //goods id
        data: ''//Encrypted string, optional
      },
      viewUrl(res) { //If you need to jump to an external link, you need to configure a web-view
        if (res) {
          wx.navigateTo({
            url: '/pages/webview/index?href=' + res
          });
        }
      },
      setTitle(res) { //Set the title
        if (res) {
          wx.setNavigationBarTitle({
            title: res
          });
        }
      },
      setBarColor(res) {//Set the background color of the navigation bar
        if (res) {
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res
          });
        }
      },
      success(res) { //Called when initialization is successful
        if (res.data == 'success') {
          console.log('success');
        }
      },
      fail(res) { //Called when initialization fails
        if (res.data == 'initError') {
          console.log(res.message);
        }
      },
      leave(res) { //Leave the session page
        if (res) {
          console.log(res);
        }
      }
    });
  }
};
</script>

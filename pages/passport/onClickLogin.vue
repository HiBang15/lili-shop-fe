<template>
   <div class="form">
     <u-form ref="validateCodeForm">
       <div class="login-list">
         <!-- Loop out the currently available third-party login mode -->
         <div class="login-item" v-for="(item,index) in loginList" :key="index">
           <u-icon :color="item.color" size="80" :name="item.icon" @click="navigateLogin(item)"></u-icon>
         </div>
       </div>
       <view class="text-tips cell" @click="clickCodeLogin">Account password login</view>
     </u-form>
   </div>
</template>

<script>
import {  openIdLogin } from "@/api/connect.js";
import { whetherNavigate } from "@/utils/Foundation"; //Login Jump
import { getUserInfo } from "@/api/members";
import storage from "@/utils/storage.js";
import api from "@/config/api.js";

export default {
  data() {
    return {
      loginList: [
        {
          icon: "weixin-circle-fill",
          color: "#00a327",
          title: "微信",
          code: "WECHAT",
        },
        {
          icon: "qq-circle-fill",
          color: "#38ace9",
          title: "QQ",
          code: "QQ",
        },
        {
          icon: "apple-fill",
          color: "#000000",
          title: "Apple",
          code: "APPLE",
        },
      ],
      tips: "",
    };
  },
  props: ["status"],
  mounted() {
    //#ifdef APP-PLUS
    /**If it is a login method supported by app loading*/
    let _this = this;
    uni.getProvider({
      service: "oauth",
      success: (result) => {
        _this.loginList = result.provider.map((value) => {
          //Display title
          let title = "";
          //System code
          let code = "";
          //colour
          let color = "#8b8b8b";
          //icon
          let icon = "";
          //uni joint login code
          let appcode = "";
          switch (value) {
            case "weixin":
              icon = "weixin-circle-fill";
              color = "#00a327";
              title = "WeChat";
              code = "WECHAT";
              break;
            case "qq":
              icon = "qq-circle-fill";
              color = "#38ace9";
              title = "QQ";
              code = "QQ";
              break;
            case "apple":
              icon = "apple-fill";
              color = "#000000";
              title = "Apple";
              code = "APPLE";
              break;
          }
          return {
            title: title,
            code: code,
            color: color,
            icon: icon,
            appcode: value,
          };
        });
      },
      fail: (error) => {
        uni.showToast({
          title: "Failed to obtain login channel" + error,
          duration: 2000,
          icon: "none",
        });
      },
    });
    //#endif

    //Special platform, login method needs to be filtered
    // #ifdef H5
    this.methodFilter(["QQ"]);
    // #endif

    //WeChat applet, only supports WeChat login
    // #ifdef MP-WEIXIN
    this.methodFilter(["WECHAT"]);
    // #endif
  },

  methods: {
    /** Display the login module according to the parameters */
    methodFilter(code) {
      // let way = [];
      // this.loginList.forEach((item) => {
      // if (code.length != 0) {
      // code.forEach((val) => {
      // if (item.code == val) {
      // way.push(item);
      //}
      // });
      //} else {
      // uni.showToast({
      // title:'Please contact the administrator if the configuration is incorrect',
      // duration: 2000,
      // icon: "none"
      // });
      //}
      // });
      // this.loginList = way;
    },
    /** Jump to the login page */
    navigateLogin(connectLogin) {
      if (!this.status) {
        uni.showToast({
          title: "Please read and agree to the user agreement and privacy policy",
          duration: 2000,
          icon: "none",
        });
        return false;
      }

      // #ifdef H5
      let code = connectLogin.code;
let buyer = api.buyer;
      window.open(buyer+`/connect/login/web/`+code, "_self");
      // #endif
      // #ifdef APP-PLUS
      this.nonH5OpenId(connectLogin);
      // #endif
    },

    // Jump to one-click login
    clickCodeLogin() {
      this.$emit("open", "code");
    },

    //Non-h5 get openid
    async nonH5OpenId(item) {
      let _this = this;
      //Get each openid
      await uni.login({
        provider: item.appcode,
        // #ifdef MP-ALIPAY
        scopes: "auth_user", //Alipay applet needs to set the authorization type
        // #endif
        success: function (res) {
          uni.setStorageSync("type", item.code);
          //Other unexpected ways of WeChat applet write openid directly in storage
          // #ifndef MP-WEIXIN
          uni.setStorageSync("openid", res.authResult.openid);
          // #endif
        },
        fail(e) {
          uni.showToast({
            title: "Third-party login is temporarily unavailable!",
            icon: "none",
            duration: 3000,
          });
        },
        complete(e) {
          //Get user information
          uni.getUserInfo({
            provider: item.appcode,
            success: function (infoRes) {
              //Write user information
              uni.setStorageSync("nickname", infoRes.userInfo.nickName);
              uni.setStorageSync("avatar", infoRes.userInfo.avatarUrl);

              // #ifdef MP-WEIXIN
              //WeChat applet to obtain openid requires special handling. To obtain openid, please refer to uni-id: https://uniapp.dcloud.net.cn/uniCloud/uni-id
              _this.weixinMPOpenID(res).then((res) => {
                //Here you need to obtain openid first, and then log in with openid. Mini program login requires two steps, so here is a special compilation
                _this.goOpenidLogin("WECHAT_MP");
              });
              // #endif

              // #ifndef MP-WEIXIN
              _this.goOpenidLogin("APP");
              //#endif
            },
          });
        },
      });
    },
    //openid login
    goOpenidLogin(clientType) {
      let _this = this;
      // Get the prepared parameters and log in to the system
      let params = {
        uuid: uni.getStorageSync("openid"), //joint login id
        source: uni.getStorageSync("type"), //joint login type
        nickname: uni.getStorageSync("nickname"), // nickname
        avatar: uni.getStorageSync("avatar"), // Avatar
        uniAccessToken: uni.getStorageSync("uni_access_token"), //third-party token
      };
      openIdLogin(params, clientType).then((res) => {
        if (!res.data.success) {
          let errormessage = "Third-party login is temporarily unavailable";
          uni.showToast({
            // title:'Unbound third-party account',
            title: errormessage,
            icon: "none",
            duration: 3000,
          });
          return;
        } else {
          storage.setAccessToken(res.data.result.accessToken);
          storage.setRefreshToken(res.data.result.refreshToken);
          // login successful
          uni.showToast({
            title: "The third-party login is successful!",
            icon: "none",
          });
          // Perform login
          getUserInfo().then((user) => {
            storage.setUserInfo(user.data.result);
            storage.setHasLogin(true);
          });
          whetherNavigate()
        }
      });
    },
    //WeChat applet to get openid
    async weixinMPOpenID(res) {
      await miniProgramLogin(res.code).then((res) => {
        uni.setStorageSync("openid", res.data);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("./login.scss");

.submit {
  margin: 80rpx 0 40rpx 0;
}

.login-list {
  display: flex;
  padding: 40rpx 0;
  justify-content: space-between;

  .login-item {
    font-size: 24rpx;
    text-align: center;

    > * {
      margin: 4rpx 0;
    }
  }
}
</style>

<template>
  <view class="container">
    <u-navbar :custom-back="back" title="Mini Program Login"></u-navbar>
    <u-modal v-model="phoneAuthPopup" :mask-close-able="true" :title="projectName+'Mall'" :show-confirm-button="false">
      <div class="tips">
        In order to have a better user experience, you need to authorize your phone number
      </div>
      <button class="register" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
        To authorize
      </button>
    </u-modal>
    <view class="wx-auth-container">
      <div class="box">
        <view class="logo-info">
          <text class="title">Welcome to the {{ projectName }} mall</text>
        </view>
        <view class="small-tips">
          <view>To provide you with quality services, {{ projectName }} needs to obtain the following information</view>
          <view>Your public information (nickname, profile picture)</view>
        </view>
        <view class="btns">
          <button type="primary" bindtap="getUserProfile" @click="getUserProfile()" class="btn-auth">Confirm WeChat authorization</button>
        </view>
      </div>
    </view>
  </view>
</template>

<script>
import {mpAutoLogin} from "@/api/connect.js";

import {whetherNavigate} from "@/utils/Foundation"; //Login jump
import {getUserInfo} from "@/api/members";
import storage from "@/utils/storage.js";
export default {
  data() {
    return {
      // Whether to display the mobile phone number authorization pop-up window, the default first step is not to display, you must first obtain the user's basic information
      phoneAuthPopup: false,
      // Authorization information display, mall name
      projectName: "LiLi",
      //WeChat return information, used to reveal the secret information and get the sessionkey
      code: "",
      //WeChat nickname
      nickName: "",
      //WeChat avatar
      image: "",
    };
  },

  //Wechat applet enters the page, first get the code, otherwise there is a chance that the code does not correspond to the subsequent interactive data
  mounted() {

    // Mini Programs are shared by default
    uni.showShareMenu({ withShareTicket: true });

    let that = this;
    //Get code
    uni.login({
      success: (res) => {
        that.code = res.code;
      },
    });
  },
  methods: {
    /**
     * TODO This method is not necessarily the optimal solution. If there is a better solution, please submit it in https://gitee.com/beijing_hongye_huicheng/lilishop/issues
     * Mini program returns bug
     * 1. Because the WeChat login is based on login.vue as a judgment jump
     * So the fallback path will be automatically recorded in the page stack, so every time the WeChat applet clicks on the fallback, it will automatically return to the login page
     * Of course, the judgment of the login page is to jump to the WeChat applet page without logging in, resulting in the inability to return to the previous page
     * 2. Solution: Try to judge the address when rolling back, and let the rolling back one more level so that it is avoided
     */

    back() {
      whetherNavigate('wx');
    },
    //Get user information
    getUserProfile(e) {
      let that = this;
      // It is recommended to use wx.getUserProfile to obtain user information. Developers need to confirm the user every time they obtain user personal information through this interface
      uni.getUserProfile({
        desc: "Used to improve member information", // Declare the purpose of obtaining the user's personal information, which will be displayed in the pop-up window later, please fill in carefully
        success: (res) => {
          that.nickName = res.userInfo.nickName;
          that.image = res.userInfo.avatarUrl;
          //Show mobile phone number to get authorization
          this.phoneAuthPopup = true;
        },
        fail: (res) => {
          that.nickName = "WeChat User";
          that.image =
            "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132";
          //Show mobile phone number to get authorization
          this.phoneAuthPopup = true;
        },
      });
    },
    //Get mobile phone number authorization
    getPhoneNumber(e) {
      let iv = e.detail.iv;
      let encryptedData = e.detail.encryptedData;
      if (!e.detail.encryptedData) {
        uni.showToast({
          title: "Please grant the mobile phone number permission, the mobile phone number will be bound to the member system user!",
          icon: "none",
        });
        return;
      }

      let code = this.code;
      let image = this.image;
      let nickName = this.nickName;
      mpAutoLogin({
        encryptedData,
        iv,
        code,
        image,
        nickName,
      }).then((res) => {
        storage.setAccessToken(res.data.result.accessToken);
        storage.setRefreshToken(res.data.result.refreshToken);
        // login successful
        uni.showToast({
          title: "Login successful!",
          icon: "none",
        });
        //Get user information
        getUserInfo().then((user) => {
          storage.setUserInfo(user.data.result);
          storage.setHasLogin(true);
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });
          }, 500);
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/*WeChat authorization*/
page {
  background-color: #ffffff;
}

.wx-auth-container {
  width: 100%;
  margin-top: 20%;
}

.logo-info {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  padding: 20rpx;

  flex-direction: column;
  font-weight: bold;
}

image {
  width: 100px;
  height: 100px;
  text-align: center;
  -webkit-transform: scale(2.5);
  transform: scale(2.5);
}

.logo-info-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: none;
}

text.title,
text.shop {
  display: inline-block;
  font-size: 60rpx;
  color: #333;
}

text.shop {
  display: inline-block;
  font-size: 55rpx;
  color: #333;
}

.box {
  margin: 0 32rpx;
}

/* 文字提示*/
.small-tips {
  width: 94%;
  padding: 20rpx;
  font-size: 24rpx;
  margin: 0 0 20rpx;
  color: #999;
}

.auth-button {
  padding: 10px 20px;
  width: calc(100% - 20 * 4rpx);
}

.tips {
  width: 80%;
  text-align: left;
  margin: 6% 10%;
  margin-top: 48rpx;
  line-height: 1.75;
}

.register {
  color: #00a327 !important;
  border: none !important;
  background: #fff !important;
}

.btn {
  width: 100%;
  text-align: center;
}

.btn-auth {
  width: 92%;
  margin: 0 auto 100rpx;

  border-radius: 100px;
}

.btns {
  margin-top: 100rpx;
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>

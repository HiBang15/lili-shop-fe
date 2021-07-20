<template>
  <view v-if="mpWechatLogin">
    <!-- Background -->
    <view class="login-ball small"></view>

    <view class="logo-cell">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
    </view>
    <view class="title">LiLi Mall</view>

    <!-- Verification code login -->
    <codeLogin @open="open" :status="value" v-if="login && loginData.code" />
    <!-- Account password login -->
    <onClickLogin @open="open" :status="value" v-if="login && loginData.click" />
    <view class="form"> </view>

    <!-- Privacy Policy -->
    <div class="privacy">
      <u-checkbox-group :icon-size="24" width="45rpx">
        <u-checkbox v-model="value" active-color="rgb(255, 107, 53)"></u-checkbox>

      </u-checkbox-group>
      Agree to <span @click="handleClick('user')">"User Agreement"</span> and <span @click="handleClick('privacy')">"Privacy Policy"</span>
    </div>
  </view>
</template>
<script>
import codeLogin from "./codeLogin";
import onClickLogin from "./onClickLogin";
import {getUserInfo} from "@/api/members";
import storage from "@/utils/storage.js";
import {loginCallback} from "@/api/connect.js";
import {webConnect} from "@/api/connect.js";
export default {
  onShow() {
    // #ifdef MP-WEIXIN
    this.mpWechatLogin = false;
    if (this.$options.filters.isLogin("auth")) {
      getCurrentPages().length> 1
        ? uni.navigateBack({
            delta: getCurrentPages().length-2,
          })
        : uni.switchTab({
            url: "/pages/tabbar/home/index",
          });
    } else {
      uni.navigateTo({
        url: "/pages/passport/wechatMPLogin",
      });
    }
    // #endif

    //#ifdef H5
    let isWXBrowser = /micromessenger/i.test(navigator.userAgent);
    if (isWXBrowser) {
      webConnect("WECHAT").then((res) => {
        let data = res.data;
        if (data.success) {
          window.location = data.result;
        }
      });
    }
    //#endif
  },
  data() {
    return {
      mpWechatLogin: true, //Whether to load Wechat login
      value: true, //Privacy Policy
      loginData: {
        code: true, //Verification code login
        click: false,
      },
      login: true, //login
    };
  },
  watch: {},
  components: {
    codeLogin,
    onClickLogin,
  },

  onLoad(options) {
    if (options && options.state) {
      this.stateLogin(options.state);
    }
  },
  methods: {
    handleClick(val) {
      uni.navigateTo({
        url: "/pages/mine/help/tips?type=" + val,
      });
    },
    // open opens another template
    open(val) {
      Object.keys(this.loginData).forEach((item) => {
        this.$set(this.loginData, item, false);
      });
      this.$set(this.loginData, val, true);
    },
    //Join information return login
    stateLogin(state) {
      loginCallback(state).then((res) => {

        let data = res.data;
        if (data.success) {
          storage.setAccessToken(data.result.accessToken);
          storage.setRefreshToken(data.result.refreshToken);
          // login successful
          uni.showToast({
            title: "Login successful!",
            icon: "none",
          });
          getUserInfo().then((user) => {
            storage.setUserInfo(user.data.result);
            storage.setHasLogin(true);
          });
          getCurrentPages().length> 1
            ? uni.navigateBack({
                delta: getCurrentPages().length-2,
              })
            : uni.switchTab({
                url: "/pages/tabbar/home/index",
              });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("./login.scss");
</style>

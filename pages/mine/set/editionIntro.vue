<template>
  <view class="edition-intro">
    <image src="https://lilishop-oss.oss-cn-beijing.aliyuncs.com/4c864e133c2944efad1f7282ac8a3b9e.png" class="logo" />
    <h1> {{config.name}}</h1>
    <view class='version'>
      <!-- #ifdef APP-PLUS -->
      Version {{localVersion.version}}
      <!-- #endif -->
    </view>

    <!-- {{localVersion}} -->
    <u-cell-group class="cell" :border="false">
      <!-- #ifdef APP-PLUS -->
      <u-cell-item v-if="IosWhether" @click="checkStar" title="Go to rate"></u-cell-item>
      <u-cell-item title="Function Introduction" @click="navigateTo('/pages/mine/set/versionFunctionList')"></u-cell-item>
      <u-cell-item title="Check for updates" @click="checkUpdate"></u-cell-item>
      <!-- #endif -->
      <u-cell-item title="license information" @click="navigateTo('/pages/mine/help/tips?type=message')"></u-cell-item>
      <u-cell-item title="Service Agreement" @click="navigateTo('/pages/mine/help/tips?type=user')"></u-cell-item>
      <u-cell-item title="Privacy Agreement" @click="navigateTo('/pages/mine/help/tips?type=privacy')"></u-cell-item>
      <u-cell-item title="About us" :border-bottom="false" @click="navigateTo('/pages/mine/help/tips?type=about')"></u-cell-item >

    </u-cell-group>

    <view class="intro">
      <view>Customer Service Hotline: 13161366885</view>
      <view style="margin:20rpx 0 0 0;">Customer Service Email: lili@lili.com</view>

      <view>
        <view style="margin:20rpx 0; color:#003a8c;" @click="navigateTo('/pages/mine/help/tips?type=user')">"lili Mall User Agreement"</view>
        <view>CopyRight @{{config.name}} </view>
      </view>
    </view>
  </view>
</template>

<script>
import APPUpdate from "@/plugins/APPUpdate";
import config from "@/config/config";
import {getAppVersion} from "@/api/message.js";
export default {
  data() {
    return {
      config,
      IosWhether: false, //Is it ios
      editionHistory: [], //Version history
      versionData: {}, //Version information
      localVersion: "", //Current version information
      params: {
        pageNumber: 1,
        pageSize: 5,
      },
    };
  },
  onLoad() {
    const platform = uni.getSystemInfoSync().platform;
    /**
     * Get whether it is Android
     */
    if (platform === "android") {
      this.params.type = 0;
    } else {
      this.IosWhether = true;
      this.params.type = 1;
    }
    this.getVersion(platform);

    plus.runtime.getProperty(plus.runtime.appid, (inf) => {
      this.localVersion = {
        versionCode: inf.version.replace(/\./g, ""),
        version: inf.version,
      };
    });
  },

  methods: {
    async getVersion(platform) {
      let type;
      platform == "android"? (type = "ANDROID"): (type = "IOS");

      let res = await getAppVersion(type);
      if (res.data.success) {
        this.versionData = res.data.result;
      }
    },

    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    /**
     * ios click to rate
     */
    checkStar() {
      plus.runtime.launchApplication({
        action: `itms-apps://itunes.apple.com/app/${config.iosAppId}?action=write-review`,
      });
    },

    /**
     * Check for updates
     */
    checkUpdate() {
      if (
        this.versionData.version.replace(/\./g, "") <
        this.localVersion.versionCode
      ) {
        APPUpdate();
      } else {
        uni.showToast({
          title: "The current version is the latest version",
          duration: 2000,
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #fff !important;
}
.cell {
  width: 90%;
  margin: 0 auto;
}
.edition-intro {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > h1 {
    margin: 20rpx 0 20rpx 0;
    letter-spacing: 2rpx;
  }
  > .version {
    font-size: 30rpx;
    margin-bottom: 100rpx;
  }
}
.intro {
  margin-top: 100rpx;
  font-size: 24rpx;
  letter-spacing: 2rpx;
}
.logo {
  width: 200rpx;
  height: 200rpx;
}
</style>

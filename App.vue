

<script>
/**
 * vuex管理登录状态，具体可以参考官方登录模板示例
 */
import { mapMutations } from "vuex";
import APPUpdate from "@/plugins/APPUpdate";
import { getClipboardData } from "@/js_sdk/h5-copy/h5-copy.js";
import config from "@/config/config";
// 悬浮球

export default {
  data() {
    return {
      config,
    };
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
  methods: {
    ...mapMutations(["login"]),
  },
  onLaunch: function () {
    // #ifdef APP-PLUS
    this.checkArguments(); // check startup parameters
    APPUpdate();

    // The key points are the following: Be sure to monitor the background recovery! must
    plus.globalEvent.addEventListener("newintent", (e) => {
      this.checkArguments(); // check startup parameters
    });
    // #endif

    // #ifdef MP-WEIXIN
    this.applyUpdateWeChat();
    // #endif
  },

  onShow() {
    // #ifndef H5
    this.getClipboard();
    // #endif
  },
  methods: {
    /**
     * WeChat applet version submitted updated version to solve the cache problem
     */
    applyUpdateWeChat() {
      const updateManager = uni.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {
        // Callback after requesting new version information
      });

      updateManager.onUpdateReady(function (res) {
        uni.showModal({
          title: "Update Prompt",
          content: "A new version is found, do you want to restart the application?",
          success(res) {
            if (res.confirm) {
              // The new version has been downloaded, call applyUpdate to apply the new version and restart
              updateManager.applyUpdate();
            }
          },
        });
      });
      updateManager.onUpdateFailed(function (res) {
        // failed to download the new version
      });
    },

    // TODO on-screen advertising, subsequent optimization and addition
    launch() {
      try {
        // Get the launchFlag logo in the local storage. Open the screen ad
        const value = uni.getStorageSync("launchFlag");
        if (!value) {
          // this.$u.route("/pages/index/agreement");
        } else {
          //Open the startup advertisement page when the app starts
          var w = plus.webview.open(
            "/hybrid/html/advertise/advertise.html",
            "Local Address",
            {
              top: 0,
              bottom: 0,
              zindex: 999,
            },
            "fade-in",
            500
          );
          //Set the timer, close and start the ad page after 4s
          setTimeout(function () {
            plus.webview.close(w);
            APPUpdate();
          }, 3000);
        }
      } catch (e) {
        // error
        uni.setStorage({
          key: "launchFlag",
          data: true,
          success: function () {
            console.log("Store launchFlag when error");
          },
        });
      }
    },

    /**
     * Get pasteboard data
     */
    async getClipboard() {
      let res = await getClipboardData();
      /**
       * Analyze pasteboard data
       */
      if (res.indexOf(config.shareLink) != -1) {
        uni.showModal({
          title: "Reminder",
          content: "Is a shared link detected to jump?",
          confirmText: "Jump",
          success: function (callback) {
            if (callback.confirm) {
              const path = res.split(config.shareLink)[1];
              if (path.indexOf("tabbar") != -1) {
                uni.switchTab({
                  url: path,
                });
              } else {
                uni.navigateTo({
                  url: path,
                });
              }
            }
          },
        });
      }
    },

    /**
     * Open the app in h5 to get the link of the jump app and jump
     */
    checkArguments() {
      // #ifdef APP-PLUS
      setTimeout(() => {
        const args = plus.runtime.arguments;
        if (args) {
          const argsStr = decodeURIComponent(args);
          const path = argsStr.split("//")[1];
          if (path.indexOf("tabbar") != -1) {
            uni.switchTab({
              url: `/${path}`,
            });
          } else {
            uni.navigateTo({
              url: `/${path}`,
            });
          }
        }
      });
      // #endif
    },
  },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import "./static/font/iconfont/iconfont.css";
// -------适配底部安全区  苹果x系列刘海屏

// #ifdef MP-WEIXIN
.mp-iphonex-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  height: auto !important;
  padding-top: 10rpx;
}
// #endif

body {
  background-color: $bg-color;
}
/************************ */
.w200 {
  width: 200rpx !important;
}
.flex1 {
  flex: 1; //必须父级设置flex
}
</style>

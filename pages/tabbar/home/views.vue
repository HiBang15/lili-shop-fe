<template>
  <div class="wrapper">
    <!-- vue component cannot be used in uni, so use if to judge each component -->
    <div v-for="(item,index) in pageData.list" :key="index">
      <!-- The search bar, if it is on the top of the floor decoration, it will automatically float, otherwise it will not float -->
      <u-navbar class="navbar" v-if="item.type =='search'" :is-back="false" :is-fixed="index ===1? false: true">
        <search style="width:100%" :res="item.options" />
        <!-- #ifndef H5 -->
        <!-- Scan code function is not compatible with h5. Detailed documentation: https://uniapp.dcloud.io/api/system/barcode?id=scancode -->
        <div slot="right" class="navbar-right">
          <u-icon name="scan" @click="scan()" color="#666" size="50"></u-icon>
        </div>
        <!-- #endif -->
      </u-navbar>
      <carousel v-if="item.type =='carousel'" :res="item.options" />
      <titleLayout v-if="item.type =='title'" :res="item.options" />
      <leftOneRightTwo v-if="item.type =='leftOneRightTwo'" :res="item.options" />
      <leftTwoRightOne v-if="item.type =='leftTwoRightOne'" :res="item.options" />
      <topOneBottomTwo v-if="item.type =='topOneBottomTwo'" :res="item.options" />
      <topTwoBottomOne v-if="item.type =='topTwoBottomOne'" :res="item.options" />
      <flexThree v-if="item.type =='flexThree'" :res="item.options" />
      <flexFive v-if="item.type =='flexFive'" :res="item.options" />
      <flexFour v-if="item.type =='flexFour'" :res="item.options" />
      <flexTwo v-if="item.type =='flexTwo'" :res="item.options" />
      <textPicture v-if="item.type =='textPicture'" :res="item.options" />
      <menuLayout v-if="item.type =='menu'" :res="item.options" />
      <flexOne v-if="item.type =='flexOne'" :res="item.options" />
      <goods v-if="item.type =='goods'" :res="item.options" />
      <group v-if="item.type =='group'" :res="item.options" />
      <!-- <joinGroup v-if="item.type =='joinGroup'" :res="item.options" /> -->
      <!-- <integral v-if="item.type =='integral'" :res="item.options" /> -->
      <!-- <spike v-if="item.type =='spike'" :res="item.options" /> -->

    </div>
    <u-no-network></u-no-network>
  </div>
</template>

<script>
// reference component
import tpl_banner from '@/pages/tabbar/home/template/tpl_banner'; //Navigation bar module
import tpl_title from '@/pages/tabbar/home/template/tpl_title'; //title bar module
import tpl_left_one_right_two from '@/pages/tabbar/home/template/tpl_left_one_right_two'; //left one right two module
import tpl_left_two_right_one from '@/pages/tabbar/home/template/tpl_left_two_right_one'; //left two right one module
import tpl_top_one_bottom_two from '@/pages/tabbar/home/template/tpl_top_one_bottom_two'; //Up and down two modules
import tpl_top_two_bottom_one from '@/pages/tabbar/home/template/tpl_top_two_bottom_one'; //Upper two next module
import tpl_flex_one from '@/pages/tabbar/home/template/tpl_flex_one'; //Single line image module
import tpl_flex_two from '@/pages/tabbar/home/template/tpl_flex_two'; //Two horizontal picture modules
import tpl_flex_three from '@/pages/tabbar/home/template/tpl_flex_three'; //Three-column single-line image module
import tpl_flex_five from '@/pages/tabbar/home/template/tpl_flex_five'; // five-column single-line image module
import tpl_flex_four from '@/pages/tabbar/home/template/tpl_flex_four'; //four-column single-line image module
import tpl_text_picture from '@/pages/tabbar/home/template/tpl_text_picture'; //text picture template
import tpl_menu from '@/pages/tabbar/home/template/tpl_menu'; //Five column menu module
import tpl_search from '@/pages/tabbar/home/template/tpl_search'; //search bar
import tpl_group from '@/pages/tabbar/home/template/tpl_group'; //
import tpl_goods from '@/pages/tabbar/home/template/tpl_goods'; //commodity classification and goods in the classification
// end reference component
import { getFloorData } from '@/api/home'; //Get floor decoration interface
import permision from '@/js_sdk/wa-permission/permission.js'; //Permission tool class
import config from '@/config/config';
// TODO follow-up development
// import tpl_join_group from "@/pages/tabbar/home/template/tpl_join_group";
// import tpl_integral from "@/pages/tabbar/home/template/tpl_integral";
// import tpl_spike from "@/pages/tabbar/home/template/tpl_spike";

export default {
  data() {
    return {
      config,
      pageData: '', //Floor page data
      isIos: ''
    };
  },
  components: {
    carousel: tpl_banner,
    titleLayout: tpl_title,
    leftOneRightTwo: tpl_left_one_right_two,
    leftTwoRightOne: tpl_left_two_right_one,
    topOneBottomTwo: tpl_top_one_bottom_two,
    topTwoBottomOne: tpl_top_two_bottom_one,
    flexThree: tpl_flex_three,
    flexFive: tpl_flex_five,
    flexFour: tpl_flex_four,
    flexTwo: tpl_flex_two,
    textPicture: tpl_text_picture,
    menuLayout: tpl_menu,
    search: tpl_search,
    flexOne: tpl_flex_one,
    goods: tpl_goods,
    group: tpl_group
    // spike: tpl_spike,
    // joinGroup: tpl_join_group,
    // integral: tpl_integral,
  },

  mounted() {


    this.init();
    // #ifdef MP-WEIXIN
    // Mini Programs are shared by default
    uni.showShareMenu({withShareTicket: true});
    // #endif
  },

  methods: {
    /**
     * Instantiate the homepage data floor
     */
    init() {
      getFloorData().then((res) => {
        if (res.data.success) {
          this.pageData = JSON.parse(res.data.result.pageData);
        }
      });
    },

    /**
     * TODO scan code function will be added in the future
     * The functions that should be implemented are currently planned as follows:
     * Scan the product to jump to the product page
     * Scan activity to jump to the activity page
     * Scan the QR code to log in
     * Scan other station information. A prompt will pop up and return to the home page.
     */
    seacnCode() {
      uni.scanCode({
        success: function (res) {
          let path = encodeURIComponent(res.result);
          config.scanAuthNavigation.forEach((src) => {
            if (res.result.indexOf(src) != -1) {
              uni.navigateTo({
                url: `/${ res.result.substring(src.length) }`
              });
            } else {
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/tabbar/home/web-view?src=' + path
                });
              }, 100);
            }
          });
        }
      });
    },

    /**
     * Prompt for permission
     */
    tipsGetSettings() {
      uni.showModal({
        title: 'Prompt',
        content: 'You have turned off camera permissions, go to settings',
        success: function (res) {
          if (res.confirm) {
            if (this.isIos) {
              plus.runtime.openURL('app-settings:');
            } else {
              permision.gotoAppPermissionSetting();
            }
          }
        }
      });
    },

    /**
     * Wake up the client to scan the code
     * No permission to apply for permission, and permission to get scan code function
     */
    async scan() {
      // #ifdef APP-PLUS
      this.isIos = plus.os.name == 'iOS';
      // Determine whether it is Ios
      if (this.isIos) {
        const iosFirstCamera = uni.getStorageSync('iosFirstCamera'); //Is the camera turned on for the first time
        if (iosFirstCamera !== 'false') {
          uni.setStorageSync('iosFirstCamera', 'false'); //Set to false means it is not the first time the camera is turned on
          this.seacnCode();
        } else {
          if (permision.judgeIosPermission('camera')) {
            this.seacnCode();
          } else {
            // There is no permission to remind whether to apply for permission
            this.tipsGetSettings();
          }
        }
      } else {
        /**
         * TODO Android permissions have been authorized, calling the api always shows that the user has permanently rejected the application. Stupid
         * TODO If there is a better way for xdm, please mention it at https://gitee.com/beijing_hongye_huicheng/lilishop/issues Thank you
         */
        this.seacnCode();
      }

      // #endif

      // #ifdef MP-WEIXIN
      this.seacnCode();
      // #endif
    }
  }
};
</script>

<style scoped lang="scss">
.navbar-right {
  padding: 0 16 rpx 0 0;
}
</style>

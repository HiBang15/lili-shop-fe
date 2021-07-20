<template>
  <div class="page">
    <u-navbar back-icon-color="#fff" :background="background" :border-bottom="false" title=""></u-navbar>

    <div class="wrapper">
      <!-- Bargain List -->
      <div class="box box1">
        <div class="bargain">
          <div class="flex bargain-item">
            <div class="goods-img">
              <u-image width="200" height="200" :src="bargainDetail.thumbnail"></u-image>
            </div>
            <div class="goods-config">
              <div class="goods-title wes-2">
                {{ bargainDetail.goodsName }}
              </div>
              <div class="flex price-box">
                <div class="purchase-price">
                  Currently:<span>￥{{
                    activityData.surplusPrice == 0 ? this.bargains.purchasePrice : activityData.surplusPrice | unitPrice
                  }}</span>
                </div>
                <div class="max-price">Original price: <span>￥{{ bargainDetail.price | unitPrice }}</span>

                </div>
              </div>
              <div class="tips">{{ bargainDetail.sellingPoint }}</div>
            </div>
          </div>
          <!-- Bargaining progress -->
          <div class="bargain-progress">
            <u-line-progress class="line" :active-color="lightColor" striped striped-active
                             :percent="totalPercent"></u-line-progress>
            <div class="flex tips">
              <div>{{ cutPrice }} yuan has been cut</div>
              <div>{{ activityData.surplusPrice }} yuan left</div>
            </div>
          </div>
          <!-- Participate in bargaining -->
          <div class="bargaining" v-if="!activityData.pass" @click="shareBargain">
            Invite bargaining
          </div>
          <!-- Buy now -->

          <div class="buy" v-else @click="getGoodsDetail">
            Buy now
          </div>
        </div>
      </div>
      <!-- Help cut list -->
      <div class="box box2">
        <div class="bargain">
          <div class="bargain-title">Help cut</div>
          <div class="user-item flex" v-if="logData.length !=0 " v-for="(item,index) in logData" :key="index">
            <div>
              <u-image width="75" shape="circle" height="75" :src="item.kanjiaMemberFace"></u-image>
            </div>
            <div class="user-config flex">
              <div class="user-name">
                <div>{{ item.kanjiaMemberName | noPassByName }}</div>
                <div>Exercise the milk to eat</div>
              </div>
              <div class="save">Cut off: <span>￥{{ item.kanjiaPrice | unitPrice }}</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Product details -->
      <div class="box box3">
        <div class="bargain">
          <div class="bargain-title">Product details</div>
          <view class="u-content">
            <u-parse :html="bargainDetail.mobileIntro"></u-parse>
          </view>

        </div>
      </div>

      <!-- Bargaining -->
      <u-modal title="Congratulations on cutting off" v-model="Bargaining" mask-close-able :show-confirm-button="false"
               :title-style="{color: lightColor}">
        <view class="slot-content">
          <u-count-to :start-val="0" ref="uCountTo" font-size="100" :color="lightColor" :end-val="kanjiaPrice"
                      :decimals="2" :autoplay=" autoplay"></u-count-to>
          <span class="price">yuan</span>
        </view>
      </u-modal>
      <!-- Help chop -->

      <u-modal :show-title="false" v-model="helpBargainFlage" :show-confirm-button="false">
        <view class="help-bargain" @click="handleClickHelpBargain">
          <u-image width="100%" height="600rpx" src="/pages/promotion/static/bargain.jpeg"></u-image>
          <u-image class="help" width="300rpx" height="80rpx" src="/pages/promotion/static/help-bargain.png"></u-image>
        </view>
      </u-modal>

      <!-- Share -->
      <shares @close="closeShare"
              :link="'/pages/promotion/bargain/detail?id='+routerVal.id+'&activityId='+activityData.id" type="kanjia"
              :thumbnail="bargainDetail.thumbnail "
              :goodsName="bargainDetail.goodsName" v-if="shareFlage" />

      <!-- Purchase -->

      <popupGoods :addr="addr" ref="popupGoods" :buyMask="maskFlag" @closeBuy="closePopupBuy"
                  :goodsDetail="bargainDetail" :goodsSpec="goodsSpec" v-if="bargainDetail.id "
                  @handleClickSku="getGoodsDetail" />

      <!-- Product details -->
      <div class=" box4">

      </div>
    </div>
  </div>
</template>

<script>
import popupGoods from '@/pages/cart/payment/popup/goods'; //Module of shopping cart goods
import {
  getBargainDetail,
  getBargainActivity,
  openBargain,
  getBargainLog,
  helpBargain
} from '@/api/promotions';
import { getGoods } from '@/api/goods.js';
import shares from '@/components/m-share/index';

export default {
  components: {
    shares,
    popupGoods
  },
  data() {
    return {
      background: {
        backgroundColor: 'transparent'
      },
      maskFlag: false, //Commodity bullet frame
      shareFlage: false,
      lightColor: this.$lightColor,
      bargains: {},
      bargainDetail: {}, //Bargain product details
      Bargaining: false, //Bargaining pop-up box
      helpBargainFlage: false, //Help cut the pop-up box
      autoplay: false, //Bargaining amount rolls
      kanjiaPrice: 0, //Amount of bargaining
      totalPercent: 0, //Half-point bargaining ratio
      activityData: '', //Bargaining activity
      cutPrice: 0, //Amount already cut
      params: {
        // id: "", //Bargaining activity ID
        // kanjiaActivityGoodsId: "", //Bargain Goods SkuID
        // kanjiaActivityId: "", //Invitation activity ID, with a value indicating that it is the invitee
        // status: "", //status
      },

      logData: [], // Help cut records
      //Get help record parameters
      logParams: {
        pageNumber: 1,
        pageSize: 20,
        kanJiaActivityId: ''
      },

      goodsDetail: {}, //Product details
      goodsSpec: {}, //Product specification
      selectedGoods: '' //selected goods
    };
  },
  onLoad(options) {
    this.routerVal = options;
    if (options.activityId) {
      this.params.kanjiaActivityId = options.activityId;
    }
  },
  onShow() {
    this.init();
  },
  watch: {
    // Bargaining pop-up window
    Bargaining(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.uCountTo.start();
        });
      }
    },
    // Monitor the amount of bargaining activities
    activityData: {
      handler(val) {
        if (val) {
          // Calculate the percentage of bargaining
          this.totalPercent =
              100 -
              Math.floor((val.surplusPrice / this.bargainDetail.price) * 100);
          this.cutPrice = (
              this.bargainDetail.price - this.activityData.surplusPrice
          ).toFixed(2);
          // Get the bargaining log
          this.logParams.kanJiaActivityId = val.id;

          // Determine if it is a chop
          if (this.params.kanjiaActivityId && val.help) {
            this.helpBargainFlage = true;
          }

          this.getBargainLogList();
        }
      },
      immediate: true
    }
  },
  methods: {
    closePopupBuy(val) {
      this.maskFlag = false;
    },
    closeShare() {
      this.shareFlage = false;
    },
    // invite bargaining
    shareBargain() {
      this.shareFlage = true;
    },

    // Get product details
    getGoodsDetail() {
      uni.showLoading({
        title: 'Loading',
        mask: true
      });

      this.$refs.popupGoods.buy({
        skuId: this.bargainDetail.id,
        num: 1,
        cartType: 'KANJIA'
      });
      // getGoods(this.bargainDetail.id, this.bargainDetail.goodsId).then(
      // (response) => {
      // this.goodsDetail = response.data.result.data;
      // this.selectedGoods = response.data.result.data;
      // this.goodsSpec = response.data.result.specs;
      // uni.hideLoading();

      // // this.maskFlag = true;
      //}
      // );
    },

    // Initialize products and bargaining activities
    async init() {
      // Get the product
      let res = await getBargainDetail(this.routerVal.id);
      if (res.data.success) {
        this.bargainDetail = res.data.result.goodsSku;
        this.bargains = res.data.result;
        // Invited event id
        if (this.params.kanjiaActivityId) {
        } else {
          this.params.kanjiaActivityGoodsId = this.routerVal.id;
        }
        // Get bargaining activities
        this.activity();
      }
    },
    // Get bargaining activities
    async activity() {
      let res = await getBargainActivity(this.params);
      // Determine whether it is the first time to enter, if it is the first time to enter, the default is to cut a knife
      res.data.success
          ? res.data.result
          ? (this.activityData = res.data.result)
          : this.openActivity()
          : '';
    },
    // Get bargaining activity by page-help cut records
    async getBargainLogList() {
      let res = await getBargainLog(this.logParams);
      if (res.data.success) {
        this.logData = res.data.result.records;
      }
    },
    // Help cut a knife
    async handleClickHelpBargain() {
      let res = await helpBargain(this.params.kanjiaActivityId);
      if (res.data.success) {
        this.helpBargainFlage = false;
        this.kanjiaPrice = res.data.result.kanjiaPrice;
        this.Bargaining = true;
        // After the help cut is completed, query the help cut record
        this.init();
      } else {
        this.helpBargainFlage = false;
      }
    },
    // initiate bargaining activities
    async openActivity(data) {
      let res = await openBargain({id: this.routerVal.id});
      if (res.data.success) {
        this.kanjiaPrice = res.data.result.kanjiaPrice;
        this.Bargaining = true;
        // Query help cut records
        this.init();
      }
    }
  }
};
</script>
<style lang="scss">
page {
  background-color: $light-color !important;
}
</style>
<style lang="scss" scoped>
.slot-content {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 20 rpx 0 80 rpx 0;
}

.price {
  margin-left: 10 rpx;
  color: $light-color;
}

.price-box {
  align-items: center;
  padding: 10 rpx 0;
}

.wrapper {
  background: url("../static/Bargaining.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 700 rpx;
  width: 100%;
}

.box {
  background: #fff;
  border-radius: 20 rpx;
  position: relative;
  width: 94%;
  margin: 0 auto;

  > .bargain {
    padding: 32 rpx;
  }
}

.box1 {
  top: 750 rpx;
}

.box2 {
  top: 770 rpx;
}

.box3 {
  top: 790 rpx;
}

.box4 {
  top: 810 rpx;
  height: 200 rpx;
}

.bargain-item {
  align-items: center;
}

.goods-config {
  margin-left: 20 rpx;

  > .goods-title {
    font-weight: bold;
  }
}

.max-price,
.purchase-price {
  font-size: 24 rpx;
  color: #999;
}

.max-price {
  margin-left: 10 rpx;
  text-decoration: line-through;
}

.purchase-price {
  color: $main-color;

  > span {
    font-size: 32 rpx;
    font-weight: bold;
  }
}

.bargaining,
.buy {
  font-size: 24 rpx;
  color: #fff;
  width: 80%;
  margin: 50 rpx auto 0 auto;
  text-align: center;
  font-size: 30 rpx;
  background-image: linear-gradient(
          25deg,
          $main-color,
          $light-color,
          $aider-light-color
  );

  padding: 18 rpx;
  border-radius: 100px;
  animation: mymove 5s infinite;
  -webkit-animation: mymove 5s infinite; /*Safari and Chrome*/
  animation-direction: alternate; /*轮流反向播放动画。*/
  animation-timing-function: ease-in-out; /*动画的速度曲线*/
  /* Safari 和 Chrome */
  -webkit-animation: mymove 5s infinite;
  -webkit-animation-direction: alternate; /*轮流反向播放动画。*/
  -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
}

@keyframes mymove {
  0% {
    transform: scale(1); /*开始为原始大小*/
  }
  25% {
    transform: scale(1.1); /*放大1.1倍*/
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
}

.line {
  margin: 20 rpx 0;
}

.tips {
  font-size: 24 rpx;
  color: #999;
  justify-content: space-between;
}

.bargain-progress {
  margin: 20 rpx 0;
}

.bargain-title {
  font-size: 32 rpx;
  font-weight: bold;
  color: $light-color;
  text-align: center;
  margin-bottom: 40 rpx;
}

.user-item {
  margin: 40 rpx 0;
  align-items: center;
}

.user-config {
  margin-left: 20 rpx;
  flex: 8;
  align-items: center;
  justify-content: space-between;

  > .user-name {
    > div:nth-of-type(1) {
      font-size: 28 rpx;
    }

    > div:nth-last-of-type(1) {
      font-size: 24 rpx;
      color: #999;
    }
  }
}

.save {
  color: $light-color;

  > span {
    font-weight: bold;
  }
}

.mobile-intro {
  overflow: hidden;
  max-width: 100%;
}

@keyframes fontMove {
  0% {
    transform: scale(1); /*开始为原始大小*/
  }
  25% {
    transform: scale(1.1); /*放大1.1倍*/
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
}

.help-bargain {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  > .help {
    margin-bottom: 40 rpx;
    border-radius: 20 rpx;

    margin-top: 40 rpx;
    animation: fontMove 5s infinite;
    -webkit-animation: fontMove 5s infinite; /*Safari and Chrome*/
    animation-direction: alternate; /*轮流反向播放动画。*/
    animation-timing-function: ease-in-out; /*动画的速度曲线*/
    /* Safari 和 Chrome */
    -webkit-animation: fontMove 5s infinite;
    -webkit-animation-direction: alternate; /*轮流反向播放动画。*/
    -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
  }
}
</style>

<template>
  <view class="wrapper" v-if="flage">
    <div class='goods' v-if="selectedGoods">
      <image class="goods-image" :src="selectedGoods.thumbnail" alt="">
        <p class="goodsName">{{ selectedGoods.goodsName }}</p>
        <div class="goodsPrice">{{ (selectedGoods.promotionPrice || selectedGoods.price) | unitPrice('￥') }}</div>
    </div>
    <div>
      <div class="tips">

        <span v-if="master.toBeGroupedNum">
          Not enough <span class="num">{{ master.toBeGroupedNum || 0 }}</span> people, hurry up and invite friends to put together orders
        </span>
        <span v-if="isBuy &&!master.toBeGroupedNum >0">
          Successfully joined the group
        </span>
      </div>

      <div v-if="isMaster && !isOver">
        <div class="share-user" v-if="master.toBeGroupedNum" @click="share()">
          Invite friends to join a group
        </div>
        <div class="home" @click="handleClickHome()">
          Go to the home page
        </div>
      </div>
      <div v-if="!isMaster && !isOver && !isBuy">
        <div class="share-user" @click="toBuy">
          Participate in the group
        </div>
      </div>
      <div v-if="!isMaster && !isOver && isBuy">
        <div class="share-user disabled">
          The product has been purchased
        </div>
      </div>
      <div v-if="isOver">
        <!-- <div class="share-user disabled">
          The group has ended
        </div> -->
        <div class="home" @click="handleClickHome()">
          Go to the home page
        </div>
      </div>
    </div>

    <!-- Countdown -->
    <div class="count-down" v-if="!isOver">
      <u-count-down bg-color="#ededed" :hide-zero-day="true" @end="isOver" :timestamp="timeStamp"></u-count-down>
    </div>

    <div class="user-list" v-if="data.pintuanMemberVOS">
      <div class="user-item" v-for="(item,index) in data.pintuanMemberVOS" :key="index">
        <span class="master" v-if="item.orderSn ==''">Team leader</span>
        <image class="img" :src="item.face" alt="">
      </div>
    </div>

    <popupGoods :addr="addr" ref="popupGoods" :buyMask="maskFlag" @closeBuy="closePopupBuy" :goodsDetail="goodsDetail"
                :goodsSpec="goodsSpec" v-if="goodsDetail.id " @handleClickSku=" getGoodsDetail" />
    <shares @close="closeShare"
            :link="'/pages/cart/payment/shareOrderGoods?sn='+this.routers.sn+'&sku='+this.routers.sku+'&goodsId='+this.routers. goodsId"
            type="pintuan"
            :thumbnail="data.promotionGoods.thumbnail" :goodsName="data.promotionGoods.goodsName" v-if="shareFlage" />
  </view>
</template>

<script>
import { getGoods } from '@/api/goods.js';
import { getPinTuanShare } from '@/api/order';
import shares from '@/components/m-share/index';
import storage from '@/utils/storage.js';
import popupGoods from './popup/goods'; //Module for shopping cart items

export default {
  data() {
    return {
      flage: false, //Determine whether the interface is a normal request
      addr: {
        id: ''
      },
      maskFlag: false, //Commodity bullet frame
      timeStamp: 0,
      shareFlage: false,
      data: '',
      isMaster: true,
      selectedGoods: '', //The nickname of the selected product specification
      routers: '', //pass parameter data
      goodsDetail: '', //product details
      goodsSpec: '',
      master: '', // Head of the team
      PromotionList: '', //Promotion collection
      isGroup: false, //Whether to join a group
      isOver: false, //Whether to end the activity
      isBuy: false //whether the current user buys
    };
  },
  components: {
    shares,
    popupGoods
  },
  watch: {
    isGroup(val) {
      if (val) {
        let timer = setInterval(() => {
          this.$refs.popupGoods.buyType = 'PINTUAN';
          clearInterval(timer);
        }, 100);
      } else {
        this.$refs.popupGoods.buyType = '';
      }
    }
  },
  onLoad(options) {
    this.routers = options;
  },
  mounted() {
    this.init(this.routers.sn, this.routers.sku);
  },
  methods: {
    closeShare() {
      this.shareFlage = false;
    },
    // If you are here, you have to skip to the product details before you can purchase the product
    toBuy() {
      this.maskFlag = true;
      this.$refs.popupGoods.parentOrder = {
        ...this.master,
        orderSn: this.routers.sn
      };
      this.$refs.popupGoods.isMask = true;
      this.$refs.popupGoods.isClose = true;
      this.$refs.popupGoods.buyType = 'PINTUAN';
    },
    // share it
    share() {
      this.shareFlage = true;
    },
    closePopupBuy(val) {
      this.maskFlag = false;
    },
    // instantiate this page
    async init(sn, sku) {
      let res = await getPinTuanShare(sn, sku);
      if (res.data.success && res.data.result.promotionGoods) {
        this.flage = true;
        this.data = res.data.result;
        this.selectedGoods = res.data.result.promotionGoods;
        let endTime = Date.parse(
            res.data.result.promotionGoods.endTime.replace(/-/g, '/')
        );
        // Get the current remaining group product time
        let timeStamp = Date.parse(new Date(endTime)) / 1000;

        // Get the current time stamp
        let dateTime = Date.parse(new Date()) / 1000;

        this.timeStamp = parseInt(timeStamp - dateTime);

        this.timeStamp <= 0 ? (this.isOver = true) : (this.isOver = false);

        // Get the remaining number of participants
        this.master =
            res.data.result.pintuanMemberVOS.length != 0 &&
            res.data.result.pintuanMemberVOS.filter((item) => {
              return item.orderSn == '';
            })[0];

        // Get whether you are currently joining the group
        if (
            storage.getUserInfo(this.routers.sku, this.routers.goodsId).id ==
            this.master.memberId
        ) {
          this.isMaster = true;
        } else {
          this.isMaster = false;
          // Get product details
          this.getGoodsDetail(this.routers.sku, this.routers.goodsId);
        }

        // Get whether the current product has been purchased
        if (storage.getUserInfo().id) {
          let isBuy = res.data.result.pintuanMemberVOS.filter((item) => {
            return item.memberId == storage.getUserInfo().id;
          });
          isBuy.length != 0 ? (this.isBuy = true) : (this.isBuy = false);
        }
      } else {
        uni.showToast({
          title: 'The current group order is wrong! Please contact the administrator to try again',
          duration: 2000,
          icon: 'none'
        });
      }
    },
    // Get product details
    getGoodsDetail(id, goodsId) {
      uni.showLoading({
        title: 'Loading',
        mask: true
      });
      getGoods(id, goodsId).then((response) => {
        this.goodsDetail = response.data.result.data;
        this.selectedGoods = response.data.result.data;
        this.goodsSpec = response.data.result.specs;
        uni.hideLoading();
        this.PromotionList = response.data.result.promotionMap;

        // Determine whether to join the group activity, if there is, display the group activity information
        this.PromotionList &&
        Object.keys(this.PromotionList).forEach((item) => {
          if (item.indexOf('PINTUAN') == 0) {
            this.isGroup = true;
          }
        });
      });
    },
    handleClickHome() {
      uni.switchTab({
        url: '/pages/tabbar/home/index'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background: #fff;
}

.over {
  margin: 10% 0;
}

.goods {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  width: 80%;
  margin: 0 auto;
}

.goods-image {
  margin: 40 rpx auto;
  width: 400 rpx;
  height: 400 rpx;
}

.goodsName {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 30 rpx;
  font-weight: bold;
}

.goodsPrice {
  margin-top: 10 rpx;
  font-weight: bold;
  font-size: 40 rpx;
  color: $main-color;
}

.master {
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  background: $light-color;
  padding: 0 8 rpx;
  border-radius: 10 rpx;
  color: #fff;
}

.user-item {
  position: relative;
  margin: 20 rpx;
}

.count-down {
  margin: 40 rpx 0;
  text-align: center;
}

.img {
  border-radius: 50%;
  border: 2 rpx solid $light-color;
  width: 100 rpx;
  height: 100 rpx;
}

.user-list {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.tips {
  margin-top: 10%;
  text-align: center;
  font-size: 40 rpx;
  font-weight: bold;
  margin-bottom: 100 rpx;
}

.num {
  color: $main-color;
  font-size: 60 rpx;
  margin: 0 10 rpx;
}

.home,
.share-user {
  height: 80 rpx;
  line-height: 80 rpx;
  text-align: center;
  width: 80%;
  margin: 30 rpx auto 0 auto;
  color: #fff;
  border-radius: 0.4em;
}

.share-user {
  background: $main-color;
}

.disabled {
  background: rgba($main-color, $alpha: 0.2);
}

.home {
  color: $main-color;
  border: 2 rpx solid $main-color;
}
</style>

<template>
  <div class="page">
    <u-navbar back-icon-color="#fff" :background="background" :border-bottom="false" title=""></u-navbar>
    <div class="wrapper">
      <!-- Bargain List -->
      <div class="box">
        <div class="bargain" v-if="bargainList.length!=0">
          <div class="flex bargain-item" v-for="(item,index) in bargainList" :key="index">
            <div class="goods-img">
              <u-image width="150" height="150" :src="item.thumbnail"></u-image>
            </div>
            <div class="goods-config">
              <div class="goods-title wes-2">
                {{ item.goodsName }}
              </div>
              <div class="flex goods-buy">
                <div class="max-price">Minimum: <span>￥{{ item.purchasePrice | unitPrice }}</span></div>
                <div class="bargaining" @click="navigateToBargainDetail(item)">Participate in bargaining</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bargain empty" v-else>
          <u-empty text="No activity yet" mode="list"></u-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBargainList } from '@/api/promotions';

export default {
  data() {
    return {
      background: {
        backgroundColor: 'transparent'
      },
      params: {
        promotionStatus: 'START', //Start/Release
        pageNumber: 1,
        pageSize: 20
      },
      bargainList: [] //List of bargaining activities
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    /**
     * Initialize the bargaining list
     */
    async init() {
      let res = await getBargainList(this.params); //Bargain list
      if (res.data.success) {
        this.bargainList = res.data.result.records;
      }
    },

    // Jump to bargain details
    navigateToBargainDetail(val) {
      uni.navigateTo({
        url: `/pages/promotion/bargain/detail?id=${ val.id }`
      });
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
  top: 750 rpx;
  width: 94%;
  margin: 0 auto;

  > .bargain {
    padding: 32 rpx;
  }
}

.bargain-item {
  align-items: center;

  border-bottom: 1 rpx solid #f6f6f6;
  padding: 32 rpx 0;
}

.goods-config {
  flex: 8;
  margin-left: 20 rpx;

  > .goods-title {
    height: 80 rpx;
    font-weight: bold;
  }
}

.max-price {
  color: $main-color;
  font-size: 24 rpx;

  > span {
    font-size: 32 rpx;
    font-weight: bold;
  }
}

.goods-buy {
  margin: 10 rpx 0;
  align-items: center;
  justify-content: space-between;
}

.bargaining {
  font-size: 24 rpx;
  color: #fff;
  background: $light-color;
  padding: 10 rpx 24 rpx;
  border-radius: 100px;
}

.empty {
  height: 400 rpx;
}
</style>

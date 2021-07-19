<template>
  <view>
    <view class="seller-view" v-for="(item, index) in complaionData" :key="index">
      <view class="seller-info u-flex u-row-between">
        <view class="seller-name">
          <view class="name">{{ item.storeName }}</view>
        </view>
        <view class="order-sn">{{ statusData[item.complainStatus] }}</view>
      </view>
      <u-line color="#DCDFE6"></u-line>
      <view class="goods-item-view">
        <view class="goods-img" @click="handleToGoods(item)">
          <u-image border-radius="6" width="131rpx" height="131rpx" :src="item.goodsImage"></u-image>
        </view>
        <view class="goods-info" @click="handleToGoods(item)">
          <view class="goods-title u-line-2">{{ item.goodsName }}</view>
          <view class="goods-price">
            ￥{{ item.goodsPrice | unitPrice }}
            <!-- <span>+{{ '1' }}Points</span> -->
          </view>
        </view>
        <view class="goods-num">
          <view>x{{ item.num }}</view>
        </view>
      </view>
      <view class="complain-item-view">
        <view class="complain-time"> {{ item.createTime }} </view>
        <view class="complain-speak"> {{ item.complainTopic }} </view>
      </view>
      <view class="complain-btn">
        <u-tag mode="plain" @click="handleClear(item)" class="complain-tag" text="Cancel complaint" type="info" v-if="
            item.complainStatus !='EXPIRED' && item.complainStatus !='CANCEL'
          "/>
        <u-tag mode="plain" @click="handleInfo(item)" class="complain-tag" text="Complaint details" type="info" />
      </view>
    </view>

    <u-empty v-if="empty" :style="{'marginTop':complaionDetail.total == 0? '200rpx':'0rpx'}" class="empty" style="" text="No Complaint list" mode="list"></u-empty>

    <u-modal show-cancel-button @confirm="handleClearConfirm" v-model="show" :content="content"></u-modal>
  </view>
</template>

<script>
import {getComplain, clearComplain} from "@/api/after-sale";

export default {
  data() {
    return {
      statusData: {
        NEW: "New Order",
        NO_APPLY: "Not applied",
        APPLYING: "Applying",
        COMPLETE: "Completed",
        EXPIRED: "Expired",
        CANCEL: "Cancelled",
      },
      show: false,
      content: "Do you want to withdraw the complaint?",
      params: {
        pageNumber: 1,
        pageSize: 20,
      },
      complaionDetail: "", //The entire response returned
      complaionData: [], //Complaint list
      empty: false,
      checkComplainData: "", //Store complaint information
    };
  },
  mounted() {
    this.init();
  },
  /**
   * Bottom loading
   */
  onReachBottom() {
    if (
      this.complaionDetail &&
      this.complaionDetail.total <this.params.pageNumber * this.params.pageSize
    ) {
      this.params.pageNumber++;
      this.init();
    }
  },

  methods: {
    // Click to jump to the product
    handleToGoods(val) {
      uni.navigateTo({
        url: "/pages/product/goods?id=" + val.skuId + "&goodsId=" + val.goodsId,
      });
    },

    /**
     * Click to cancel the complaint
     */
    handleClear(val) {
      this.show = true;
      this.checkComplainData = val;
    },
    /**
     * Execute revocation
     */
    handleClearConfirm() {
      clearComplain(this.checkComplainData.id).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "Revocation successful",
            duration: 2000,
            icon: "none",
          });
          this.complaionData = [];
          this.params.pageNumber = 1;
          this.init();
        }
      });
    },

    /**
     * see details
     */
    handleInfo(val) {
      uni.navigateTo({
        url: "./complainInfo?id=" + val.id,
      });
    },

    /**
     * Initialize complaint list
     */
    init() {
      uni.showLoading({
        title: "Loading",
      });
      getComplain(this.params).then((res) => {
        this.complaionDetail = res.data.result;
        if (res.data.result.records.length >= 1) {
          this.complaionData.push(...res.data.result.records);
        } else {
          this.empty = true;
        }
        uni.hideLoading();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../goods.scss";

.complain-item-view {
  border-bottom: 2rpx solid #f5f7fa;
  border-top: 2rpx solid #f5f7fa;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.complain-time {
  font-size: 24rpx;
  color: #999;
}
/deep/ .seller-name {
  width: auto !important;
}
.complain-btn {
  padding: 20rpx 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30rpx;
}
.complain-tag {
  margin-left: 10rpx;
}
.empty {
  margin-top: 40rpx;
}
</style>

<template>
  <view class="wrapper">
    <view class="tips">My complaint information</view>
    <u-cell-group>
      <u-cell-item :arrow="false" :value="complainDetail.goodsName" title="complaining goods"></u-cell-item>
      <u-cell-item :arrow="false" :value="statusData[complainDetail.complainStatus]" title="Complaint Status"></u-cell-item>
      <u-cell-item :arrow="false" :value="complainDetail.createTime" title="complain time"></u-cell-item>
      <u-cell-item :arrow="false" :value="complainDetail.complainTopic" title="complain Topic"></u-cell-item>
      <u-cell-item :arrow="false" :value="complainDetail.content" title="complaint content"></u-cell-item>
      <view class="row" v-if="complainDetail.orderComplaintImages">
        <u-image width="100rpx" height="100rpx" border-radius="10" style="margin: 0 10rpx" v-for="(item, index) in complainDetail.orderComplaintImages" :key="index" :src="item"
          @click="preview(complainDetail.orderComplaintImages, index)" />
      </view>
    </u-cell-group>
    <view class="tips">Business appeal information</view>
    <u-cell-group>
      <u-cell-item :arrow="false" :value="complainDetail.appealTime ||'Nothing for now'" title="appeal time"></u-cell-item>
      <u-cell-item :arrow="false" :value="complainDetail.appealContent ||'Nothing for now'" title="appeal content"></u-cell-item>
      <view class="row" v-if="complainDetail.appealImagesList">
        <u-image width="100rpx" height="100rpx" border-radius="10" style="margin: 0 10rpx" v-for="(item, index) in complainDetail.appealImagesList"
          @click="preview(complainDetail.appealImagesList, index)" :key="index" :src="item" />
      </view>
    </u-cell-group>
    <view class="tips">Dialog details</view>
    <view class="speak-way" v-if="complainDetail.orderComplaintCommunications">
      <view class="speak-msg seller" :key="i" v-for="(complaint, i) in complainDetail.orderComplaintCommunications">
        {{
          complaint.owner == "PLATFORM"
            ? "Platform"
            : complaint.owner == "BUYER"
            ? "Buyer"
            : "Seller"
        }}:
        <span>{{ complaint.content }}</span>
      </view>
    </view>
    <view class="speak-way" v-else>No conversations yet</view>
    <view class="tips">Platform arbitration</view>
    <u-cell-group>
      <u-cell-item :arrow="false" title="Arbitration Opinion" :value="complainDetail.arbitrationResult ||'Nothing'"></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script>
import {getComplainDetail} from "@/api/after-sale";
export default {
  data() {
    return {
      complainDetail: "", //Complaint details
      statusData: {
        NO_APPLY: "Not applied",
        APPLYING: "Applying",
        COMPLETE: "Completed, you can apply now",
        EXPIRED: "It has expired and cannot be applied for",
        CANCEL: "Cancelled",
      },
    };
  },

  onLoad(option) {
    this.init(option.id);
  },
  methods: {
    /**
     * Click the picture to enlarge or save
     */
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ["Save Picture"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
    /**
     * Initialize complaint details
     */
    init(id) {
      uni.showLoading({
        title: "Loading",
      });
      getComplainDetail(id).then((res) => {
        if (res.data.success) {
          this.complainDetail = res.data.result;
        } else {
          uni.showToast({
            title: res.data.message,
            duration: 2000,
            icon: "none",
          });
        }
        uni.hideLoading();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  flex-wrap: wrap;
}
.speak-msg {
  padding: 26rpx 32rpx;
  > span {
    color: #999 !important;
  }
}
.admin {
  color: $main-color;
}
.speak-way {
  background: #fff;
}
.wrapper {
  padding: 16rpx;
}
.tips {
  margin: 40rpx 0;
}
</style>

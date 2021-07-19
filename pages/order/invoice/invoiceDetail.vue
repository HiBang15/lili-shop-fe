<template>
  <view class="invoice-detail">
    <view class="block-item flex-center">
      <view>
        <view>
          {{'General VAT Invoice'}}
          <view class="circle">
            <view></view>
          </view>
        </view>
        <view>{{order.receiptPrice | unitPrice('￥')}}</view>
      </view>
    </view>
    <view class="common-msg flex-center">
      <view>
        <view>Header type</view>
        <view>{{order.receiptTitle}}</view>
      </view>
      <view>
        <view>Invoice status</view>
        <view class="invoice_status">{{order.receiptStatus === 1?'Issued':'Not yet issued'}}</view>
      </view>
    </view>
    <u-cell-group :border="false">
      <u-cell-item title="Invoice type" :border-top="false" :value="'VAT general invoice'" :arrow="false"></u-cell-item>
      <u-cell-item title="Invoice content" :value="order.receiptContent" :arrow="false"></u-cell-item>
      <u-cell-item title="Invoice header" :value="order.receiptTitle" :arrow="false"></u-cell-item>
      <u-cell-item title="taxpayer identification number" v-if="order.taxpayerId" :value="order.taxpayerId" :arrow="false"></u-cell-item>
    </u-cell-group>
    <!-- <u-cell-group :border="false" style="margin-top: 20rpx;">
      <u-cell-item title="Order Status" :border-top="false" :value="order.order_status_text" :arrow="false"></u-cell-item>
      <u-cell-item title="Order Number" :value="order.sn" :arrow="false"></u-cell-item>
    </u-cell-group> -->
    <!-- <view class="show-pic" @click="preview">

      <text>Click to preview invoice</text>
    </view>
    <button class="btn" @click="download">Download electronic invoice</button>
    <view class="block-2-view" v-for="(item,index) in order.elec_file_list" :key="index">
      <u-image width="300" height="150" :src="item"></u-image>
    </view> -->
  </view>
</template>

<script>
import {getReceiptDetail} from "@/api/order.js";

export default {
  data() {
    return {
      order: {},
      order: {},
      title_type: "",
    };
  },
  onLoad(options) {
    this.loadData(options.id);
  },
  methods: {
    loadData(id) {
      getReceiptDetail(id).then((res) => {
        let order = res.data.result;
        this.order = order;
      });
    },
    /**
     * Click the picture to enlarge or save
     */
    preview() {
      //Preview the invoice
      if (this.order.elec_file_list.length) {
        uni.previewImage({
          current: 0,
          urls: this.order.elec_file_list,
          longPressActions: {
            itemList: ["Send to Friend", "Save Picture", "Favorite"],
            success: function (data) {},
            fail: function (err) {},
          },
        });
      } else {
        this.$api.msg("No invoices to preview temporarily");
      }
    },
    download() {
      //Download invoice
      let _this = this;
      if (this.order.elec_file_list.length) {
        this.order.elec_file_list.forEach((item) => {
          uni.downloadFile({
            url: item,
            success: (res) => {
              if (res.statusCode === 200) {
                let tempFilePath = res.tempFilePath;
                uni.saveFile({
                  tempFilePath: tempFilePath,
                  success: function (res) {
                    _this.$api.msg("The invoice has been downloaded to" + res.savedFilePath);
                  },
                });
              }
            },
          });
        });
      } else {
        this.$api.msg("No invoices to download temporarily");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.block-item {
  height: 217rpx;
  width: 100%;
  position: relative;
  > view {
    color: #ff6262;
  }
  > view:first-child {
    text-align: center;
    line-height: 3em;
    > view:first-child {
      position: relative;
      .circle {
        width: 166rpx;
        height: 65rpx;
        border: 1px solid #ff6262;
        border-radius: 100%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        margin: auto;
        view {
          width: 130rpx;
          height: 40rpx;
          border: 1px solid #ff6262;
          border-radius: 100%;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
          position: absolute;
        }
      }
    }
    > view:last-child {
      font-size: 40rpx;
    }
  }
}

.common-msg {
  flex-direction: row;
  padding: 20rpx;
  height: 118rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;

  > view {
    width: 50%;
    text-align: center;
    color: #666666;
    line-height: 1.5em;
    view {
      font-size: 24rpx;
    }
    .invoice_status {
      color: #ff6262;
    }
  }

  > view:first-child {
    border-right: 1px solid #eee;
  }
}
.show-pic {
  text-align: center;
  margin-top: 40rpx;
  image {
    width: 27rpx;
    height: 27rpx;
    margin-right: 10rpx;
    vertical-align: middle;
  }
  text {
    color: $main-color;
    font-size: $font-sm;
  }
}

.btn {
  font-size: 34rpx;
  margin: 60rpx 20rpx;
  &::after {
    border: none;
  }
}
.u-cell {
  padding: 35rpx 20rpx;
  height: 110rpx;
  color: #333333;
}
</style>

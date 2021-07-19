<template>
  <view>
    <!-- Commodity module -->
    <view class="seller-view">
      <view class="seller-info u-flex u-row-between">
        <view class="seller-name">
          <view class="name">{{ order.storeName || '' }}</view>
          <view class="status">{{ orderStatusList[order.orderStatus] }}</view>
        </view>
        <view class="order-sn"></view>
      </view>
      <u-line color="#DCDFE6"></u-line>
      <view class="goods-item-view" v-for="(sku, index) in orderGoodsList" :key="index" v-if="sku.skuId == skuId">
        <view class="goods-img">
          <u-image border-radius="6" width="131rpx" height="131rpx" :src="sku.image"></u-image>
        </view>
        <view class="goods-info">
          <view class="goods-title u-line-2">{{ sku.goodsName }}</view>
          <view class="goods-price">
            ￥{{ sku.flowPrice | unitPrice }}
          </view>
        </view>
        <view class="goods-num">
          <view>x{{ sku.num }}</view>
        </view>
      </view>
    </view>

    <!-- Subject of complaint -->
    <u-select @confirm="confirmComplain" v-model="complainShow" :list="complainList"></u-select>
    <!-- Complaint module -->
    <view class="cell">
      <view class="cell-item between" @click="complainShow = true">
        <view class="cell-title"> Complaint subject</view>
        <view class="cell-view"> {{ complainTopic }}</view>
        <u-icon style="margin-left: 20rpx" name="arrow-down"></u-icon>
      </view>

      <view class="cell-item complain-content">
        <view class="cell-title title"> Complaint content</view>
        <view class="cell-view content">
          <u-input type="textarea" height="70rpx" auto-height v-model="complainValue" />
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-title"> Complaint certificate</view>
        <view class="cell-view">
          <u-upload ref="uUpload" :header=" {accessToken: storage.getAccessToken() }" upload-text=""
                    :show-progress="false" :action="action" width="100" @on -uploaded="onUploaded" :max-count="5">
          </u-upload>
        </view>
      </view>
    </view>

    <view class="submit-btn" @click="handleSumit">Submit</view>
  </view>
</template>

<script>
import storage from '@/utils/storage.js';
import { getOrderDetail } from '@/api/order.js';
import { getComplainReason, addComplain } from '@/api/after-sale.js';
import { upload } from '@/api/common.js';

export default {
  data() {
    return {
      storage,
      action: upload, //Upload image address
      orderStatusList: {
        //Order status list
        UNDELIVERED: 'Pending Shipment',
        UNPAID: 'Unpaid',
        PAID: 'paid',
        DELIVERED: 'Delivered',
        CANCELLED: 'Cancelled',
        COMPLETE: 'Completed',
        TAKE: 'Completed'
      },
      complainValue: '', //Complaint content
      complainShow: false, //Complaint subject switch
      complainTopic: '', //Complaint topic
      complainList: [], // complaint list
      images: [], //Complaint content image
      order: '', //Order
      orderGoodsList: '', //order goods
      orderDetail: '', //Order details
      sn: '',
      skuId: '' //Commodity skuid
    };
  },

  onLoad(option) {
    this.loadData(option.sn);
    this.sn = option.sn;
    this.skuId = option.skuId;
    this.getReasion();
  },

  methods: {
    /**
     * upload completed
     */
    onUploaded(lists) {
      let images = [];
      lists.forEach((item) => {
        images.push(item.response.result);
      });
      this.images = images;
    },
    /**
     * Submit
     */
    handleSumit() {
      // Loop out the product
      let goods = this.orderGoodsList.filter((item) => {
        return item.skuId == this.skuId;
      });
      //Data assignment
      let data = {
        complainTopic: this.complainTopic, //Complain Topic,
        content: this.complainValue, //Complaint content
        goodsId: goods[0].goodsId, //goods id
        images: this.images, //picture
        orderSn: this.sn, //order number
        skuId: this.skuId //skuid
      };
      addComplain(data).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: 'Submitted successfully!',
            duration: 2000,
            icon: 'none'
          });

          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/order/complain/complainList'
            });
          }, 1000);
        }
      });
    },

    /**
     * Get the reason for the complaint
     */
    getReasion() {
      getComplainReason().then((res) => {
        if (res.data.result.length >= 1) {
          res.data.result.forEach((item) => {
            let way = {
              value: item.reason,
              label: item.reason
            };
            this.complainList.push(way);
          });
          this.complainTopic = res.data.result[0].reason;
        }
      });
    },

    /**
     * Load order details
     */
    loadData(sn) {
      uni.showLoading({
        title: 'Loading'
      });
      getOrderDetail(sn).then((res) => {
        const order = res.data.result;
        this.order = order.order;
        this.orderGoodsList = order.orderItems;
        this.orderDetail = res.data.result;
        uni.hideLoading();
      });
    },

    /**
     * Confirm complaint
     */
    confirmComplain(e) {
      this.complainTopic = e[0].label;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../goods.scss";

.cell {
  width: 100%;
  background: #fff;
  padding: 26 rpx;
}

.cell-item {
  padding: 30 rpx 0;
  border-bottom: 2 rpx solid #f5f7fa;
  display: flex;
  align-items: center;
}

.complain-content {
  display: flex;
  align-items: center;

  .content {
    width: 100%;
  }

  .title {
    width: 140 rpx;
  }
}

/deep/ .u-input__textarea {
  padding: 0;
}

.cell-title {
  font-weight: bold;
  margin-right: 20 rpx;
}

.submit-btn {
  width: 70%;
  margin: 0 auto;
  height: 80 rpx;
  line-height: 80 rpx;
  color: #fff;
  text-align: center;
  background: $light-color;
  margin-top: 20px;
  border-radius: 200px;
}
</style>

<template>
  <view v-if="serviceDetail">
    <view class="after-sales-goods-detail-view">
      <view class="header">
        <view>
          本次售后服务将由
          <text class="seller-name">{{ serviceDetail.storeName }}</text>
          为您提供
        </view>
      </view>
      <view class="apply-info-view">
        <view class="status-info">
          <view class="status-info-box">
            <view class="status-val">{{
                serviceDetail.serviceStatus | serviceStatusList
              }}
            </view>

            <view class="status-tip">{{
                serviceDetail.serviceStatus | statusFilter
              }}
            </view>
          </view>
        </view>
        <view class="log-box-bottom"></view>
        <view class="log-box-top" @click="onProgress()">
          <view class="top01">
            <view>审核日志</view>
            <view class="log-first-show" v-if="logs[0]">{{
                logs[0].message
              }}
            </view>
          </view>
          <uni-icons type="arrowright" style="margin-right: 5px"></uni-icons>
        </view>
      </view>
      <view class="goods-info">
        <view class="info-box">
          <view class="goods-item-view" @click="navgiateToGoodsDetail(serviceDetail)">
            <view class="goods-img">
              <u-image border-radius="6" width="131rpx" height="131rpx" :src="serviceDetail.goodsImage"></u-image>
            </view>
            <view class="goods-info">
              <view class="goods-title u-line-2">{{
                  serviceDetail.goodsName
                }}
              </view>

              <view class="goods-price">
                <view class="price"> ￥{{ serviceDetail.flowPrice | unitPrice }}</view>
                <view>
                  <view>Apply for after-sales quantity: {{ serviceDetail.num }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="apply-detail-view">
      <view class="detail-item">
        <view class="title">Service order number:</view>
        <view class="value">{{ serviceDetail.sn }}</view>
      </view>
      <view class="detail-item">
        <view class="title">Order number:</view>
        <view class="value">{{ serviceDetail.orderSn }}</view>
      </view>
      <view class="detail-item" v-if="serviceDetail.new_order_sn">
        <view class="title">New order number:</view>
        <view class="value">{{ serviceDetail.new_order_sn }}</view>
      </view>
      <view class="detail-item">
        <view class="title">Service type:</view>
        <view class="value">{{
            serviceTypeList[serviceDetail.serviceType]
          }}
        </view>
      </view>
      <view class="detail-item">
        <view class="title">Reason for application:</view>
        <view class="value">{{ serviceDetail.reason }}</view>
      </view>
      <!-- <view class="detail-item" v-if="serviceDetail.apply_vouchers">
<view class="title">Apply for voucher:</view>
<view class="value">{{ serviceDetail.apply_vouchers }}</view>
</view> -->
      <view class="detail-item" v-if="serviceDetail.problemDesc">
        <view class="title">Problem description:</view>
        <view class="value">{{ serviceDetail.problemDesc }}</view>
      </view>

      <view class="detail-item" v-if="
          serviceDetail.afterSaleImage &&
          serviceDetail.afterSaleImage.split(',').length != 0
        ">
        <image :src="img" @click="preview(serviceDetail.afterSaleImage.split(','), index)"
               v-for="(img, index) in serviceDetail.afterSaleImage.split(',')" :key="index"
               style="width: 50px; height: 50px; margin: 0px 5px"></image>
      </view>
      <!-- If the service type is refund, it will not be displayed -->
      <view class="detail-item"
            v-if="serviceDetail.serviceType !='RETURN_MONEY' && serviceDetail.serviceStatus !='APPLY'">
        <view class="title">Receiving address:</view>
        <view class="value">
          <span v-if="storeAfterSaleAddress.salesConsigneeAddressPath">{{
              storeAfterSaleAddress.salesConsigneeAddressPath
            }}</span>
        </view>
      </view>
      <!-- If the service type is refund, it will not be displayed -->
      <view class="detail-item"
            v-if="serviceDetail.serviceType !='RETURN_MONEY' && serviceDetail.serviceStatus !='APPLY'">
        <view class="title">Contact:</view>
        <view class="value">{{ storeAfterSaleAddress.salesConsigneeName }}</view>
      </view>
      <!-- If the service type is refund, it will not display -->
      <view class="detail-item"
            v-if="serviceDetail.serviceType !='RETURN_MONEY' && serviceDetail.serviceStatus !='APPLY'">
        <view class="title">Contact information:</view>
        <view class="value">{{
            storeAfterSaleAddress.salesConsigneeMobile || '' | secrecyMobile
          }}
        </view>
      </view>
      <view v-if="refundShow">
        <view class="detail-item">
          <view class="title">Refund amount:</view>
          <view class="value">{{
              serviceDetail.flowPrice | unitPrice('￥')
            }}
          </view>
        </view>
        <view class="detail-item" v-if="serviceDetail.agree_price">
          <view class="title">Agree to refund:</view>
          <view class="value">{{
              serviceDetail.agree_price | unitPrice('￥')
            }}
          </view>
        </view>
        <view class="detail-item" v-if="serviceDetail.actual_price">
          <view class="title">Actual refund:</view>
          <view class="value">{{
              serviceDetail.actual_price | unitPrice('￥')
            }}
          </view>
        </view>
        <view class="detail-item" v-if="serviceDetail.actual_price">
          <view class="title">Refund time:</view>
          <view class="value">{{
              serviceDetail.refund_time | unixToDate
            }}
          </view>
        </view>
        <view class="detail-item" v-if="serviceDetail.refund_price !== 0">
          <view class="title">Refund method:</view>
          <view class="value">{{
              serviceDetail.refundWay | refundWayFilter
            }}
          </view>
        </view>
        <view class="detail-item" v-if="accountShow && serviceDetail.refund_price != 0">
          <view class="title">Account type:</view>
          <view class="value">{{
              serviceDetail.accountType | accountTypeFilter
            }}
          </view>
        </view>
        <view class="detail-item" v-if="
            accountShow && !bankShow && serviceDetail.actualRefundPrice != 0
          ">
          <view class="title">Refund account number:</view>
          <view class="value">{{ serviceDetail.bankAccountNumber }}</view>
        </view>
        <view class="detail-item" v-if="bankShow">
          <view class="title">Bank name:</view>
          <view class="value">{{ serviceDetail.bankAccountName }}</view>
        </view>
        <view class="detail-item" v-if="bankShow">
          <view class="title">Bank account number:</view>
          <view class="value">{{ serviceDetail.bankAccountNumber }}</view>
        </view>
        <view class="detail-item" v-if="bankShow">
          <view class="title">Bank account name:</view>
          <view class="value">{{ serviceDetail.bankAccountName }}</view>
        </view>
        <view class="detail-item" v-if="bankShow">
          <view class="title">Bank account opening bank:</view>
          <view class="value">{{ serviceDetail.bankDepositName }}</view>
        </view>
        <view class="detail-item" v-if="serviceDetail.mlogisticsName">
          <view class="title">Return to express:</view>
          <view class="value">{{ serviceDetail.mlogisticsName }}</view>
        </view>
        <view class="detail-item" v-if="serviceDetail.mlogisticsNo">
          <view class="title">Return the waybill number:</view>
          <view class="value">{{ serviceDetail.mlogisticsNo }}</view>
        </view>
        <view class="detail-item" v-if="serviceDetail.mDeliverTime">
          <view class="title">Return time:</view>
          <view class="value">{{ serviceDetail.mDeliverTime }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getServiceDetail,
  getstoreAfterSaleAddress,
  getAfterSaleLog
} from '@/api/after-sale.js';
import UniIcons from '@/components/uni-icons/uni-icons.vue';

export default {
  components: {
    UniIcons
  },
  data() {
    return {
      serviceTypeList: {
        // After-sales type
        CANCEL: 'Cancel',
        RETURN_GOODS: 'Return Goods',
        EXCHANGE_GOODS: 'Exchange goods',
        RETURN_MONEY: 'Refund'
      },
      serviceDetail: {}, // After-sales details
      logs: [], //log
      goodsList: [], //product list
      storeAfterSaleAddress: {}, //After-sale address
      refundShow: false, //Refund switch
      accountShow: false, //Account display
      bankShow: false, //Bank display
      sn: '' //Order sn
    };
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: 'Service Order Details'
    });
    this.sn = options.sn;
    this.loadDetail();
    this.getAddress();
    this.getLog(options.sn);
  },
  filters: {
    /**
     * After-sales status information
     */
    statusFilter(val) {
      switch (val) {
        case'APPLY':
          return 'After-sales service application is successful, waiting for merchant review';
        case'PASS':
          return 'After-sales service application approved';
        case'REFUSE':
          return 'The after-sales service application has been rejected by the merchant, if you have any questions, please contact the merchant in time';
        case'FULL_COURIER':
          return 'The goods applied for after-sales have been sent, waiting for the merchant to receive the goods';
        case'STOCK_IN':
          return 'The merchant has put the after-sale goods into the warehouse';
        case'WAIT_FOR_MANUAL':
          return 'Waiting for a manual refund by the platform';
        case'REFUNDING':
          return 'The merchant is refunding, please wait patiently';
        case'COMPLETED':
          return 'After-sales service has been completed, thank you for your support';
        case'ERROR_EXCEPTION':
          return 'The system generates a new order exception, waiting for the merchant to manually create a new order';
        case'CLOSED':
          return 'After-sales service is closed';
        case'WAIT_REFUND':
          return 'Waiting for the platform to refund';
        default:
          return '';
      }
    },

    /**
     * Refund information
     */
    refundWayFilter(val) {
      switch (val) {
        case'OFFLINE':
          return 'Account refund';
        case'OFFLINE':
          return 'Offline refund';
        case'ORIGINAL':
          return 'Back to the original road';
        default:
          return '';
      }
    },
    /**
     * account information
     */
    accountTypeFilter(val) {
      switch (val) {
        case'WEIXINPAY':
          return 'WeChat';
        case'ALIPAY':
          return 'Alipay';
        case'BANK_TRANSFER':
          return 'Bank Card';
        default:
          return '';
      }
    }
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
          itemList: ['Save Picture'],
          success: function (data) {
          },
          fail: function (err) {
          }
        }
      });
    },

    /**
     * Get address information
     */
    getAddress() {
      getstoreAfterSaleAddress(this.sn).then((res) => {
        if (res.data.success) {
          this.storeAfterSaleAddress = res.data.result;
        }
      });
    },

    /**
     * Get log
     */
    getLog(sn) {
      getAfterSaleLog(sn).then((res) => {
        this.logs = res.data.result;
      });
    },

    /**
     * Initialization details
     */
    loadDetail() {
      uni.showLoading({
        title: 'Loading'
      });
      getServiceDetail(this.sn).then((res) => {
        uni.hideLoading();
        this.serviceDetail = res.data.result;
        if (this.serviceDetail.serviceType == 'RETURN_GOODS') {
          this.refundShow = true;
        }

        this.accountShow =
            (this.serviceDetail.serviceType === 'RETURN_GOODS' ||
                this.serviceDetail.serviceType === 'ORDER_CANCEL') &&
            this.serviceDetail.refundWay === 'OFFLINE';
        this.bankShow =
            (this.serviceDetail.serviceType === 'RETURN_GOODS' ||
                this.serviceDetail.serviceType === 'ORDER_CANCEL') &&
            this.serviceDetail.refundWay === 'OFFLINE' &&
            this.serviceDetail.accountType === 'BANK_TRANSFER';
      });
    },

    /**
     * Access product details
     */
    navgiateToGoodsDetail(item) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${ item.id }&goodsId=${ item.goodsId }`
      });
    },

    /**
     * Progress
     */
    onProgress() {
      uni.navigateTo({
        url: `./applyProgress?sn=${
            this.serviceDetail.sn
        }&createTime=${ encodeURIComponent(this.serviceDetail.createTime) }
         &logs=${ encodeURIComponent(JSON.stringify(this.logs)) }&serviceStatus=${
            this.serviceDetail.serviceStatus
        }`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.after-sales-goods-detail-view {
  background-color: #fff;

  .header {
    background-color: #f7f7f7;
    color: #999999;
    font-size: 22 rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    line-height: 70 rpx;

    .header-text {
      background-color: #999999;
      padding: 10 rpx 30 rpx;
      border-radius: 50 rpx;
    }

    .seller-name {
      color: $main-color;
    }
  }

  .apply-info-view {
    background: $page-color-base;
  }

  .goods-item-view {
    display: flex;
    flex-direction: row;
    padding: 20 rpx 30 rpx;
    background-color: #eef1f2;

    .goods-info {
      padding-left: 30 rpx;
      flex: 1;

      .goods-title {
        margin-bottom: 10 rpx;
        font-size: 28 rpx;
        color: $font-color-dark;
      }

      .goods-specs {
        font-size: 24 rpx;
        margin-bottom: 10 rpx;
        color: #cccccc;
      }

      .goods-price {
        display: flex;
        justify-content: space-between;
        font-size: 24 rpx;
        color: #999999;
      }

      .price {
        color: $light-color;
      }
    }

    .goods-num {
      width: 60 rpx;
      color: $main-color;
    }
  }
}

.apply-detail-view {
  background-color: #f7f7f7;
  margin-top: 10 rpx;
  padding: 20 rpx;
  color: #666666;

  .detail-item {
    padding: 12 rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 24 rpx;

    .title {
      padding-left: 10 rpx;
      width: 140 rpx;
    }

    .value {
      padding-left: 40 rpx;
    }
  }
}

.log-box-bottom {
  height: 120 rpx;
  flex-direction: column;
  background-color: rgb(247, 247, 247);
}

.log-box-top {
  height: 153 rpx;
  display: flex;
  flex-direction: row;
  background-color: rgb(255, 255, 255);
  position: absolute;
  top: 200 rpx;
  left: 0 rpx;
  right: 0 rpx;
  bottom: 0 rpx;
  margin-left: 22 rpx;
  margin-right: 22 rpx;
  margin-top: 22 rpx;
  border-radius: 22 rpx;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 52 rpx;
  padding-top: 52 rpx;
  padding-left: 32 rpx;

  .top01 {
    width: 90%;
    font-family: PingFangSC-Regular;
    font-size: 28 rpx;
    line-height: 30 rpx;
    color: rgb(46, 45, 45);
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;

    .log-first-show {
      flex-direction: row;
      margin-top: 16 rpx;
      margin-right: 44 rpx;
      font-family: PingFangSC-Regular;
      font-size: 22 rpx;
      color: rgb(140, 140, 140);
      line-height: 30 rpx;
    }
  }
}

.status-info {
  flex-direction: row;
  background-color: $light-color;

  .status-info-box {
    height: 180 rpx;
    flex-direction: row;
    padding-left: 54 rpx;
    padding-right: 54 rpx;
    padding-top: 20 rpx;
    font-family: PingFangSC-Regular;
    color: rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0);
    line-height: 50 rpx;

    .status-val {
      font-size: 32 rpx;
    }

    .status-tip {
      font-size: 24 rpx;
    }
  }
}

.info-box {
  padding-right: 40 rpx 0 rpx;
  background-color: #eef1f2;
}
</style>

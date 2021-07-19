<template>
  <view class="content">
    <u-form :model="form" ref="uForm">
      <view class="after-sales-goods-detail-view">
        <view class="header">
          <view>
            This after-sales service will be
            <text class="seller-name">{{ sku.storeName }}</text>
            Provide you with
          </view>
        </view>
        <view>
          <view class="goods-item-view" v-for="(item,index) in sku.orderItems" v-if="item.sn == sn"
                @click="gotoGoodsDetail(sku.goods_id)">
            <view class="goods-img">
              <u-image border-radius="6" width="131rpx" height="131rpx" :src="item.image"></u-image>
            </view>
            <view class="goods-info">
              <view class="goods-title u-line-2">{{ item.name }}</view>
              <view class="goods-price">
                <span>￥{{ applyInfo.applyRefundPrice }}</span>

                <span class="num">Purchase quantity: {{ item.num }}</span>
              </view>
            </view>
          </view>
        </view>
        <view class="after-num">
          <view>Number of applications</view>
          <view>
            <u-number-box :value="parseInt(form.num)" disabled-input :min="1" :max="parseInt(sku.num)" bg-color="#fff"
                          @change="valChange "></u-number-box>
          </view>
        </view>
      </view>

      <view class="body-view">
        <!-- Reason for refund -->
        <view class="opt-view">
          <u-form-item label="Reason for application" :label-width="150">
            <u-input v-model="form.reason" type="select" input-align="right" :select-open="reasonSelectShow"
                     @click="reasonSelectShow = true" placeholder="Please select the reason for application" />
          </u-form-item>
          <u-form-item label="Application Instructions" :label-width="150">
            <u-input input-align="right" type="textarea" v-model="form.problemDesc"
                     placeholder="Please describe the instructions for after-sales application" />
          </u-form-item>
        </view>

        <!-- Upload voucher -->
        <view class="opt-view">
          <view class="img-title">Upload vouchers (up to 5)</view>
          <view class="images-view">
            <u-upload :header=" {accessToken: storage.getAccessToken() }" :action="action" width="150"
                      @on-uploaded="onUploaded" :max-count="5" :show-progress="false"></u-upload>
          </view>
        </view>

        <view class="opt-view">
          <u-form-item label="Refund method" :label-width="150">
            <u-input :value="
                applyInfo.refundWay =='ORIGINAL'?'Original return':'Account refund'
              " type="text" input-align="right" :disabled="true" />
          </u-form-item>
          <view v-if="
              applyInfo.accountType ==='BANK_TRANSFER' &&
              applyInfo.applyRefundPrice != 0">
            <u-form-item label="Bank account opening bank" :label-width="150">
              <u-input v-model="form.bankDepositName" type="text" input-align="right"
                       placeholder="Please enter the bank account bank" />
            </u-form-item>
            <u-form-item label="Bank account name" :label-width="150">
              <u-input v-model="form.bankAccountName" type="text" input-align="right"
                       placeholder="Please enter the bank account name" />
            </u-form-item>
            <u-form-item label="Bank account number" :label-width="150">
              <u-input v-model="form.bankAccountNumber" type="text" input-align="right"
                       placeholder="Please enter the bank account number" />
            </u-form-item>
          </view>

          <u-form-item label="Return method" :label-width="150">
            <u-input type="text" input-align="right" value="Express to a third-party seller" :disabled="true" />
          </u-form-item>
        </view>

        <view class="opt-tip">After submitting the service order, the after-sales specialist may communicate with you on
          the phone, please keep your mobile phone open
        </view>
      </view>
    </u-form>

    <view class="submit-view">
      <u-button type="primary" ripple shape="circle" v-if="applyInfo.refundWay" :custom-style="customStyle"
                @click="onSubmit">Submit application
      </u-button>
    </view>
    <u-select mode="single-column" :list="reasonList" v-model="reasonSelectShow"
              @confirm="reasonSelectConfirm"></u-select>
    <u-select mode="single-column" :list="typeList" v-model="typeSelectShow" @confirm="typeSelectConfirm"></u-select>
    <u-select mode="single-column" :list="returnList" v-model="returnSelectShow"
              @confirm="returnSelectConfirm"></u-select>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import {
  getAfterSaleReason,
  applyReturn,
  getAfterSaleInfo
} from '@/api/after-sale';

import city from '@/components/m-city/m-city';
import { upload } from '@/api/common.js';
import { checkBankno } from '@/utils/Foundation';
import storage from '@/utils/storage.js';

export default {
  component: {
    city
  },
  data() {
    return {
      storage,
      list: [{id: '', localName: 'Please select', children: []}],
      action: upload, //image upload data
      fileList: [],
      sn: '',
      sku: {},
      typeValue: 0,
      value: '',
      type: 'textarea',
      border: true,
      //Refund reason pop-up box
      reasonSelectShow: false,
      reasonList: [],
      //The refund method is account refund account type pop-up box
      typeSelectShow: false,
      typeList: [
        {
          value: 'ALIPAY',
          label: 'Alipay'
        },
        {
          value: 'WEIXINPAY',
          label: 'WeChat'
        },
        {
          value: 'BANK_TRANSFER',
          label: 'Bank Card'
        }
      ],
      //Return method
      returnSelectShow: false,
      returnList: [
        {
          value: 1,
          label: 'Express to third-party sellers'
        }
      ],

      customStyle: {
        backgroundColor: this.$lightColor
      },
      applyInfo: {},
      form: {
        orderItemSn: '', // order sn
        skuId: '',
        reason: '', //Refund reason
        problemDesc: '', //Refund description
        images: [], //Image voucher
        num: 1, //return quantity
        goodsId: '', //goods id
        accountType: '',
        applyRefundPrice: '',
        refundWay: '',
        serviceType: '' //application type
      }
    };
  },

  /**
   * Determine the current content and generate data
   */
  onLoad(options) {
    let navTitle = 'Apply for after-sales service';
    this.form.serviceType = 'RETURN_GOODS';
    if (options.value == 1) {
      navTitle = 'Application for Return';
      this.form.serviceType = 'RETURN_GOODS';
    }
    if (options.value == 2) {
      navTitle = 'Apply for Exchange';
      this.form.serviceType = 'EXCHANGE_GOODS';
    }
    if (options.value == 3) {
      navTitle = 'Request a refund';
      this.form.serviceType = 'RETURN_MONEY';
    }
    this.typeValue = options.value;
    uni.setNavigationBarTitle({
      title: navTitle //Write the title of the page here
    });
    this.sn = options.sn;
    let dsku = decodeURIComponent(options.sku);
    let newSku = JSON.parse(dsku);
    this.sku = newSku;

    this.form.orderItemSn = options.sn;
    this.form.skuId = this.sku.skuId;
    this.form.num = this.sku.num;
    this.form.goodsId = this.sku.goodsId;
    this.getReasonActions(this.form.serviceType);

    this.init(options.sn);
  },

  methods: {
    /** Get application reason drop-down box data */
    async getReasonActions(serviceType) {
      uni.showLoading({
        title: 'Loading'
      });
      await getAfterSaleReason(serviceType).then((res) => {
        if (res.data.success) {
          let action = [];
          res.data.result.forEach((item) => {
            action.push({
              value: item.id,
              label: item.reason
            });
          });

          this.reasonList = action;
        }
      });
      uni.hideLoading();
    },
    //Open the region selector
    showCitySelect() {
      this.$refs.cityPicker.show();
    },

    // Initialization data
    init(sn) {
      getAfterSaleInfo(sn).then((response) => {
        if (response.data.code == 400) {
          uni.showToast({
            title: response.data.message,
            duration: 2000,
            icon: 'none'
          });
        } else {
          this.applyInfo = response.data.result;

          this.form.accountType = response.data.result.accountType;
        }
      });
    },

    //reason for return
    reasonSelectConfirm(e) {
      this.form.reason = e[0].label;
    },
    //Refund method
    typeSelectConfirm(e) {
      this.form.accountType = e[0].value;
      this.form.accountType_label = e[0].label;
    },
    //Return method
    returnSelectConfirm(e) {
    },

    //Modify the number of applications
    valChange(e) {
      this.form.num = e.value;
    },
    //upload picture
    onUploaded(lists) {
      let images = [];

      lists.forEach((item) => {
        images.push(item.response.result);
      });
      this.form.images = images;
    },
    //submit application
    onSubmit() {
      //Check the parameters before submitting the application
      if (!this.handleCheckParams()) {
        return;
      }

      uni.showLoading({
        title: 'Loading'
      });
      this.form.accountType = this.applyInfo.accountType;
      this.form.refundWay = this.applyInfo.refundWay;
      this.form.applyRefundPrice = this.applyInfo.applyRefundPrice;

      applyReturn(this.sn, this.form).then((resp) => {
        uni.hideLoading();
        if (resp.data.success) {
          this.$refs.uToast.show({title: 'Submitted successfully', type: 'success'});
          uni.redirectTo({
            url: '/pages/order/afterSales/applySuccess'
          });
        } else {
          this.$refs.uToast.show({title: resp.data.message, type: 'error'});
        }
      });
    },
    //Detect and submit parameters
    handleCheckParams() {
      if (this.$u.test.isEmpty(this.form.reason)) {
        this.$refs.uToast.show({title: 'Please select the reason for refund', type: 'error'});
        return false;
      }
      if (this.$u.test.isEmpty(this.form.problemDesc)) {
        this.$refs.uToast.show({title: 'Please enter refund instructions', type: 'error'});
        return false;
      }

      if (this.form.accountType == 'BANK_TRANSFER') {
        // Bank account bank verification
        if (this.$u.test.isEmpty(this.form.bankDepositName)) {
          this.$refs.uToast.show({
            title: 'Please enter the bank account opening bank',
            type: 'error'
          });
          return false;
        }
        // Bank account name verification
        if (this.$u.test.isEmpty(this.form.bankAccountName)) {
          this.$refs.uToast.show({
            title: 'Please enter your bank account name',
            type: 'error'
          });
          return false;
        }
        // Bank account verification
        if (this.$u.test.isEmpty(this.form.bankAccountNumber)) {
          this.$refs.uToast.show({
            title: 'Please enter your bank account number',
            type: 'error'
          });
          return false;
        } else if (checkBankno(this.form.bankAccountNumber) === false) {
          this.$refs.uToast.show({
            title: 'The bank card number is incorrect',
            type: 'error'
          });
          return false;
        } else if (this.$u.test.chinese(this.form.bankAccountName) === false) {
          this.$refs.uToast.show({
            title: 'Incorrect bank account name input',
            type: 'error'
          });
          return false;
        } else if (this.$u.test.chinese(this.form.bankDepositName) === false) {
          this.$refs.uToast.show({
            title: 'Incorrect bank account input',
            type: 'error'
          });
          return false;
        }
      }

      return true;
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

.body-view {
  margin-bottom: 150 rpx;
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

  .goods-item-view {
    display: flex;
    flex-direction: row;
    padding: 10 rpx 30 rpx;
    background-color: #eef1f2;

    .goods-info {
      padding-left: 30 rpx;
      flex: 1;

      .goods-title {
        margin-bottom: 10 rpx;
        color: $font-color-dark;
      }

      .goods-specs {
        font-size: 24 rpx;
        margin-bottom: 10 rpx;
        color: #cccccc;
      }

      .goods-price {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 28 rpx;
        margin-bottom: 10 rpx;
        color: $light-color;

        .num {
          font-size: 24 rpx;
          color: #999999;
        }
      }
    }

    .goods-num {
      width: 60 rpx;
      color: $main-color;
    }
  }
}

.after-num {
  margin: 0 rpx 30 rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 80 rpx;
}

.opt-tip {
  margin-top: 20 rpx;
  padding: 10 rpx 30 rpx;
  font-size: 22 rpx;
}

.opt-view {
  background-color: #fff;
  margin-top: 20 rpx;
  padding: 10 rpx 30 rpx;

  .how-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 80 rpx;
    border-bottom: 1px solid $page-color-base;
  }

  .explain-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 150 rpx;
  }

  .img-title {
    height: 80 rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .images-view {
    padding: 20 rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
}

.item-apply-voucher {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.submit-view {
  position: fixed;
  z-index: 999;
  bottom: 0px;
  left: 0px;
  margin-top: 100 rpx;
  border: solid 2 rpx #f2f2f2;
  background-color: #ffffff;
  height: 100 rpx;
  width: 750 rpx;
  align-items: center;
  padding: 0 rpx 20 rpx;
}
</style>

<template>
  <view class="mp-iphonex-bottom content">
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
          <view class="goods-item-view" @click="gotoGoodsDetail(sku.skuId)">
            <view class="goods-img">
              <u-image border-radius="6" width="131rpx" height="131rpx" :src="sku.image"></u-image>
            </view>
            <view class="goods-info">
              <view class="goods-title u-line-2">{{ sku.name }}</view>
              <view class="goods-price">
                <span>￥{{ sku.price | unitPrice }}</span>
                <span class="num">Purchase quantity: {{ sku.num }} </span>
              </view>
            </view>
          </view>
        </view>
      </view>

      <scroll-view scroll-y>
        <!-- Upload voucher -->
        <view class="opt-view">
          <view class="img-title" style="font-size: 30rpx">Fill in logistics information</view>
          <u-form-item label="Return method" :label-width="150">
            <u-input type="text" input-align="right" value="Express to third-party sellers" />
          </u-form-item>
          <u-form-item label="Express company" :label-width="150">
            <u-input v-model="form.courierCompany" type="select" input-align="right" :select-open="companySelectShow" @click="companySelectShow = true" placeholder="Please select a courier company" />
          </u-form-item>
          <u-form-item label="Express Track Number" :label-width="150">
            <u-input input-align="right" v-model="form.logisticsNo" placeholder="Please enter the tracking number" />
          </u-form-item>
          <u-form-item label="shipping time" :label-width="150">
            <u-input input-align="right" type="selects" disabled v-model="form.mDeliverTime" @click="timeshow = true" placeholder="Please select the delivery time" />
          </u-form-item>
        </view>
      </scroll-view>

      <view class="submit-view">
        <u-button ripple :customStyle="{'background':$lightColor,'color':'#fff' }" shape="circle" @click="onSubmit">Submit application</u-button>
      </view>
    </u-form>
    <u-select mode="single-column" :list="companyList" v-model="companySelectShow" @confirm="companySelectConfirm"></u-select>
    <u-calendar v-model="timeshow" :mode="'date'" @change="onTimeChange"></u-calendar>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { getLogistics } from "@/api/address.js";
import { fillShipInfo } from "@/api/after-sale.js";

export default {
  data() {
    return {
      //Express company pop-up box
      companySelectShow: false,
      companyList: [], //Collection of courier companies
      timeshow: false, //delivery time
      form: {
        courierCompany: "", //Express company
        logisticsId: "", //Express company ID
        logisticsNo: "", //Express tracking number
        mDeliverTime: "", //Delivery time
      },
      serviceDetail: {}, //service details
      sku: {}, //sku information
    };
  },
  onLoad(options) {
    this.sku = JSON.parse(decodeURIComponent(options.sku));
    let navTitle = "Service Order Details";
    uni.setNavigationBarTitle({
      title: navTitle, //Write the title of the page here
    });
    this.serviceDetail.sn = options.serviceSn;
    this.Logistics();
  },
  methods: {
    /**
     * Confirm the courier company
     */
    companySelectConfirm(e) {
      this.form.logisticsId = e[0].value;
      this.form.courierCompany = e[0].label;
    },

    /**
     * Obtain a courier company
     */
    Logistics() {
      getLogistics().then((res) => {
        if (res.data.success) {
          res.data.result.forEach((item, index) => {
            this.companyList[index] = {
              value: item.id,
              label: item.name,
            };
          });
        }
      });
    },

    /**
     * Change time
     */
    onTimeChange(e) {
      this.form.mDeliverTime = e.result;
    },

    /**
     * Click submit
     */
    onSubmit() {
      uni.showLoading({
        title: "Loading",
        mask: true,
      });
      delete this.form.courierCompany;
      fillShipInfo(this.serviceDetail.sn, this.form).then((res) => {
        uni.hideLoading();
        if (res.statusCode === 200) {
          this.$refs.uToast.show({
            title: "Submitted successfully",
            type: "success",
            back: true,
            url: "/pages/order/afterSales/afterSales",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page,
.content {
  background: $page-color-base;
  height: 100%;
}
.mp-iphonex-bottom {
  overflow: hidden;
}
.after-sales-goods-detail-view {
  background-color: #fff;
  padding: 10rpx 0rpx;
  .header {
    background-color: #f7f7f7;
    color: #999999;
    font-size: 22rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    line-height: 70rpx;
    .header-text {
      background-color: #999999;
      padding: 10rpx 30rpx;
      border-radius: 50rpx;
    }
    .seller-name {
      color: $main-color;
    }
  }
  .goods-item-view {
    display: flex;
    flex-direction: row;
    padding: 20rpx 30rpx;
    background-color: #eef1f2;

    .goods-info {
      padding-left: 30rpx;
      flex: 1;
      .goods-title {
        margin-bottom: 10rpx;
        color: $font-color-dark;
      }
      .goods-specs {
        font-size: 24rpx;
        margin-bottom: 10rpx;
        color: #cccccc;
      }
      .goods-price {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 28rpx;
        margin-bottom: 10rpx;
        color: $light-color;
        .num {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
    .goods-num {
      width: 60rpx;
      color: $main-color;
    }
  }
}
.opt-view {
  background-color: #fff;
  padding: 40rpx 30rpx 0rpx 30rpx;

  font-size: 26rpx;
  .how-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    border-bottom: 1px solid $page-color-base;
  }
  .explain-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 150rpx;
  }
  .img-title {
    height: 80rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .images-view {
    padding: 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
}
.submit-view {
  position: fixed;
  z-index: 999;
  bottom: 10px;
  left: 0px;
  margin-top: 100rpx;
  height: 100rpx;
  width: 750rpx;
  align-items: center;
  padding: 0rpx 20rpx;
  color: #fff;
}
</style>

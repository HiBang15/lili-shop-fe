<template>
  <u-popup class="popup" v-model="addressFlag" :height="setup.height" :mode="setup.mode" :border-radius="setup.radius"
           @close="closeAddress()" :mask-close-able="setup.close" :mask="false" closeable>
    <view class="header-title">Select address</view>
    <view class="view-box" v-if="addressDetail">
      <view class="view-item" v-for="(item, index) in addressDetail" :key="index" @click="clickAddress(item)">
        <view class="view-box-checkbox">
          <view class="checkbox" :class="{ checked: item.isDefault }">
            <u-icon v-if="item.isDefault" :class="{ active: item.isDefault }" name="checkmark" size="12"></u-icon>
          </view>
        </view>
        <view class="view-box-dress" :class="{'box-dress-blod': item.isDefault }">
          {{ item.consigneeAddressPath | clearStrComma }}
        </view>
      </view>
    </view>
    <view class="view-box" v-else>
      <view class="noMore">
        <u-empty text="No delivery address yet" mode="address"></u-empty>
      </view>
    </view>

    <!-- button -->

    <view class="btns">
      <view class="box-btn light" @click="getpicker">Select another address</view>
      <view class="box-btn" @click="closeAddress()">OK</view>
    </view>
    <m-city :provinceData="cityList" headTitle="area selection" ref="cityPicker" pickerSize="4"></m-city>
  </u-popup>
</template>
<script>
import setup from './popup';
/************Request storage***************/

import * as API_Address from '@/api/address.js';

export default {
  data() {
    return {
      checked: '',
      setup,
      addressDetail: '',
      cityList: [
        {
          id: '',
          localName: 'Please select',
          children: []
        }
      ]
    };
  },
  filters: {},
  watch: {},
  mounted() {
    this.addressFlag = false;
    if (this.$options.filters.isLogin('auth')) {
      this.getShippingAddress();
    } else {
      uni.navigateTo({
        url: 'pages/passport/login'
      });
    }

  },
  props: ['goodsId', 'addressFlag'],

  methods: {
    /**Close address */
    closeAddress() {
      this.$emit('closeAddress', false);
      this.$emit('deliveryData', this.checked);
    },

    getpicker() {
      // this.$refs.cityPicker.show();
      uni.navigateTo({
        url: '/pages/mine/address/add'
      });
      this.closeAddress();
    },

    /**Get address */
    getShippingAddress() {
      if (this.$options.filters.isLogin('auth')) {
        API_Address.getAddressList(1, 50).then((res) => {
          if (res.data.success) {
            this.addressDetail = res.data.result.records;
            let addr = res.data.result.records.filter((item) => {
              return item.isDefault == 1;
            });

            if (addr[0]) {
              this.checked = addr[0];
              this.$emit('deliveryData', this.checked);
            }
            // addr[0]? "": (addr = res.data);

            // /**Get whether the default address is in stock */
            // this.clickAddress(addr[0]);
          }
        });
      }
    },

    /**Click on the address to return to the parent product status */
    clickAddress(val) {
      this.checked = val;

      this.addressDetail.forEach((item) => {
        item.isDefault = false;
      });
      val.isDefault = !val.isDefault;
      this.$emit('deliveryData', this.checked);
    }
  }
};
</script>
<style lang="scss" scoped>
.light {
  background-image: linear-gradient(
          135deg,
          #ffba0d,
          #ffc30d 69%,
          #ffcf0d
  ) !important;
  box-shadow: 0 2px 6px 0 rgba(255, 65, 66, 0.2);
}

.noMore {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-item {
  display: flex;
  align-items: center;
  padding: 22 rpx 0;
}

.view-box-dress {
  letter-spacing: 1 rpx;
  margin-left: 20 rpx;
  line-height: 42 rpx;
  color: #333;
  font-size: 28 rpx;
}

.checked {
  background: $jd-color;
}

.active {
  color: #fff;
}

.checkbox {
  text-align: center;
  line-height: 40 rpx;
  width: 40 rpx;
  height: 40 rpx;
  border-radius: 50%;
  border: 2 rpx solid #ededed;
}

@import "./popup.scss";
.view-box {
  height: 810 rpx;
  // #ifdef MP-WEIXIN
  height: 770 rpx;
  // #endif
  padding: 0 20 rpx;
  overflow-y: auto;
}

.header-title {
  font-weight: bold;
  color: #333;
  text-align: center;
  height: 90 rpx;
  line-height: 90 rpx;
  font-size: 34 rpx;
}
</style>

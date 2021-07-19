<template>
  <view class="address">

    <u-empty class="empty" v-if="empty" text="No delivery address yet" mode="address"></u-empty>
    <view class="list" v-else>
      <view class="item c-content" v-for="(item, index) in addressList" :key="index">
        <view class="basic" @click="selectAddressData(item)">
          <text>{{ item.name }}</text>
          <text>{{ item.mobile }}</text>
          <text class="default" v-show="item.isDefault">default</text>
          <view>
            <div class="region">
              <span v-if="item.consigneeAddressPath[0]">{{ item.consigneeAddressPath[0] }}</span>
              <span v-if="item.consigneeAddressPath[1]">{{ item.consigneeAddressPath[1] }}</span>
              <span v-if="item.consigneeAddressPath[2]">{{ item.consigneeAddressPath[2] }}</span>
              <span v-if="item.consigneeAddressPath[3]">{{ item.consigneeAddressPath[3] }}</span>
              <span>{{ item.detail }}</span>
            </div>
          </view>
        </view>
        <view class="edit">
          <view class="relative" @click="setDefault(item)">
            <view v-if="item.isDefault" class="alifont icon-xuanzhong"></view>
            <text v-else class="unchecked"></text>
            <text>{{ item.isDefault ? 'Default address' : 'Set as default' }}</text>
          </view>
          <view class="relative">
            <view class="alifont icon-bianji-copy"></view>
            <text class="mr-40" @click="addAddress(item.id)">Edit</text>
            <view class="alifont icon-lajitong"></view>
            <text @click="removeAddress(item.id)">remove</text>
          </view>
        </view>
      </view>
      <view style="height: 100px"></view>
    </view>
    <button type="default" class="btn" @click="addAddress(" )
    ">
    <u-icon name="plus-circle"></u-icon>
    Add new consignee
    </button>
    <u-action-sheet :list="removeList" :tips="tips" v-model="showAction" @click="deleteAddressMessage"></u-action-sheet>
  </view>
</template>

<script>
import * as API_Trade from '@/api/trade';
import * as API_Address from '@/api/address.js';

export default {
  data() {
    return {
      addressList: [], //Address list
      showAction: false, //Whether to display the lower frame
      empty: false, //is it empty
      removeList: [
        {
          text: 'OK'
        }
      ],
      tips: {
        text: 'Are you sure you want to delete the consignee information?'
      },
      removeId: '', //removed address id
      routerVal: '',
      params: {
        pageNumber: 1,
        pageSize: 1000
      }
    };
  },

  onLoad: function (val) {
    this.routerVal = val;
  },
  onShow() {
    this.addressList = [];
    this.getAddressList();
  },
  onHide() {
  },
  onBackPress(e) {
    uni.redirectTo({
      url: '/pages/order/fillorder?way=' + this.routerVal.way
    });
    return true;
  },

  methods: {
    async selectAddressData(val) {
      await API_Trade.setAddressId(val.id, this.routerVal.way);

      uni.redirectTo({
        url: `/pages/order/fillorder?way=${ this.routerVal.way }`
      });
    },
    //Get address list
    getAddressList() {
      uni.showLoading();

      API_Address.getAddressList(
          this.params.pageNumber,
          this.params.pageSize
      ).then((res) => {

        if (res.data.result.records.length == 0) {
          this.empty = true;
        } else {
          res.data.result.records.forEach((item) => {
            item.consigneeAddressPath = item.consigneeAddressPath.split(',');
          });

          this.$set(this, 'addressList', res.data.result.records);


        }

        uni.hideLoading();
      });
    },
    //Delete address
    removeAddress(id) {
      this.removeId = id;
      this.showAction = true;
    },
    deleteAddressMessage() {
      API_Address.deleteAddress(this.removeId).then((res) => {
        if (res.statusCode == 200) {
          uni.showToast({
            icon: 'none',
            title: 'Delete successfully'
          });
          this.getAddressList();
        } else {
          uni.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 2000
          });
        }
      });
    },
    //New. Edit address
    addAddress(id) {

      if (id) {
        uni.navigateTo({
          url:
              '/pages/mine/address/add?id=' +
              id +
              '&way=' +
              this.routerVal.way +
              '&type=order'
        });
      } else {
        uni.navigateTo({
          url:
              '/pages/mine/address/add?way=' + this.routerVal.way + '&type=order'
        });
      }
    },
    //set as the default address
    setDefault(item) {
      delete item.updateBy;
      delete item.updateTime;
      delete item.deleteFlag;

      item.isDefault ? '' : (item.isDefault = !item.isDefault);

      API_Address.editAddress(item).then((res) => {
        uni.showToast({
          title: 'Set the default address successfully',
          icon: 'none'
        });
        this.getAddressList();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import './address.scss';
</style>

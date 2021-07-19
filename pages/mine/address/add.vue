<template>
  <view class="add-address">
    <div class="uForm">
      <u-form :border-bottom="false" :model="form" ref="uForm" :error-type="['toast']" :rule="rules">
        <view class="selectAddress" @click="clickUniMap">
          Choose shipping address
        </view>
        <u-form-item class="border" label="Consignee" label-width="130" prop="name">
          <u-input v-model="form.name" clearable placeholder="Please enter the name of the consignee" />
        </u-form-item>

        <u-form-item label="Mobile number" label-width="130" prop="mobile">
          <u-input v-model="form.mobile" type="number" maxlength="11" placeholder="Please enter the recipient’s mobile phone number" />
        </u-form-item>
        <u-form-item label="Area" label-width="130" prop="___path">
          <u-input v-model="form.___path" type="select" @click="showPicker" placeholder="Please select the area" />
        </u-form-item>
        <u-form-item class="detailAddress" label="detailed address" label-width="130" prop="detail">
          <u-input type="textarea" v-model="form.detail" maxlength="100" height="150" placeholder="Street building number, etc." />
        </u-form-item>
        <u-form-item label="Address alias" label-width="130">
          <u-input v-model="form.alias" placeholder="Please enter the address alias" />
        </u-form-item>
        <u-checkbox-group shape="circle" size="30">
          <u-checkbox :active-color="lightColor" v-model="form.isDefault">Set as default address</u-checkbox>
        </u-checkbox-group>

        <div class="saveBtn" @click="save">Save</div>
      </u-form>

      <m-city :provinceData="list" headTitle="area selection" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="4"></m-city>

      <uniMap v-if="mapFlage" @close="closeMap" @callback="callBackAddress" />
    </div>
  </view>
</template>
<script>
import { addAddress, editAddress, getAddressDetail } from "@/api/address.js";
import gkcity from "@/components/m-city/m-city.vue";
import uniMap from "./uniMap";
import permision from "@/js_sdk/wa-permission/permission.js";
export default {
  components: {
    "m-city": gkcity,
    uniMap,
  },
  onShow() {
    // Determine whether the current system permission location is enabled
  },
  methods: {
    // close the map
    closeMap() {
      this.mapFlage = false;
    },
    // Open the map and access permissions
    clickUniMap() {
      // #ifdef APP-PLUS
      if (plus.os.name == "iOS") {
        // ios system
        permision.judgeIosPermission("location")
          ? (this.mapFlage = true)
          : this.refuseMapOuther();
      } else {
        // Android
        this.requestAndroidPermission(
          "android.permission.ACCESS_FINE_LOCATION"
        );
      }
      // #endif

      // #ifndef APP-PLUS
      this.mapFlage = true;
      // #endif
    },

    // If permission is denied, prompt area setting
    refuseMapOuther() {
      uni.showModal({
        title: "Warm Reminder",
        content: "You have rejected positioning, please enable",
        confirmText: "Go to Settings",
        success(res) {
          if (res.confirm) {
            //Open authorization settings
            // #ifndef MP-WEIXIN
            uni.getSystemInfo({
              success(res) {
                if (res.platform == "ios") {
                  //IOS
                  plus.runtime.openURL("app-settings://");
                } else if (res.platform == "android") {
                  //Android
                  let main = plus.android.runtimeMainActivity();
                  let Intent = plus.android.importClass(
                    "android.content.Intent"
                  );
                  let mIntent = new Intent("android.settings.ACTION_SETTINGS");
                  main.startActivity(mIntent);
                }
              },
            });
            // #endif
          }
        },
      });
    },

    // Get whether Android has address permissions
    async requestAndroidPermission(permisionID) {
      var result = await permision.requestAndroidPermission(permisionID);

      if (result == 1) {
        this.mapFlage = true;
      } else {
        this.refuseMapOuther();
      }
    },

    // Callback of data after selecting the address
    callBackAddress(val) {
      uni.showLoading({
        title: "Loading",
      });

      if (val.regeocode && val) {
        let address = val.regeocode;
        this.form.detail = address.formatted_address; //Address details
        this.form.___path = val.data.result.name;
        this.form.consigneeAddressIdPath = val.data.result.id; // address id segmentation
        this.form.consigneeAddressPath = val.data.result.name; //Address name, separated by','
        this.form.lat = val.latitude; //Latitude
        this.form.lon = val.longitude; //Longitude
        uni.hideLoading();
      }

      this.mapFlage = !this.mapFlage; //Close the map
    },

    // Save the current address
    save() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          let pages = getCurrentPages(); //Get page stack
          let beforePage = pages[pages.length-2]; //Previous page

          // If there is no id, it is a new address
          if (!this.form.id) {
            // delete data that does not exist
            delete this.form.___path;
            addAddress(this.form).then((res) => {
              if (res.data.success) {
                if (this.routerVal.type == "order") {
                  uni.redirectTo({
                    url: `/pages/mine/address/address?way=${this.routerVal.way}`,
                  });
                } else {
                  uni.redirectTo({
                    url: `/pages/mine/address/addressManage`,
                  });
                }
              }
            });
          } else {
            // Change address
            delete this.form.___path;
            delete this.form.updateBy;
            delete this.form.updateTime;
            editAddress(this.form).then((res) => {
              if (res.data.success) {
                uni.navigateTo({
                  url: `/${beforePage.route}`,
                });
              }
            });
          }
        }
      });
    },

    // Three-level address linkage callback
    getpickerParentValue(e) {
      // Set the address to be bound to empty and assign a value
      this.form.consigneeAddressIdPath = [];
      this.form.consigneeAddressPath = [];
      let name = "";

      e.forEach((item, index) => {
        if (item.id) {
          // Traverse the data
          this.form.consigneeAddressIdPath.push(item.id);
          this.form.consigneeAddressPath.push(item.localName);
          name += item.localName;
          this.form.___path = name;
        }
        if (index == e.length-1) {
          //If it is the last
          let _town = item.children.filter((_child) => {
            return _child.id == item.id;
          });

          this.form.lat = _town[0].center.split(",")[0];
          this.form.lon = _town[0].center.split(",")[1];
        }
      });
    },

    // Display three-level address linkage
    showPicker() {
      this.$refs.cityPicker.show();
    },
  },
  mounted() {},
  data() {
    return {
      lightColor: this.$lightColor, //Highlight color
      mapFlage: false, // Map selection on
      routerVal: "",
      form: {
        detail: "", //Address details
        name: "", //Name of consignee
        mobile: "", //Mobile phone number
        consigneeAddressIdPath: [], //Address id
        consigneeAddressPath: [], //Address name
        ___path: "", //Area
        isDefault: false, //Is the default address
      },
      // Form submission verification rules
      rules: {
        name: [
          {
            required: true,
            message: "The name of the consignee cannot be empty",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "Mobile phone number cannot be empty",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value);
            },
            message: "Mobile phone number is incorrect",
            trigger: ["change", "blur"],
          },
        ],
        ___path: [
          {
            required: true,
            message: "Please select your region",
            trigger: ["change"],
          },
        ],
        detail: [
          {
            required: true,
            message: "Please fill in the detailed address",
            trigger: ["blur", "change"],
          },
        ],
      },
      list: [
        {
          id: "",
          localName: "Please select",
          children: [],
        },
      ],
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "Loading",
    });
    this.routerVal = option;
    // If you are currently editing the address, you need to query the address details
    if (option.id) {
      getAddressDetail(option.id).then((res) => {
        const params = res.data.result;
        params.___path = params.consigneeAddressPath;
        this.$set(this, "form", params);

        uni.hideLoading();
      });
    }
    uni.hideLoading();
  },
  // Initializing rules must be in the onReady life cycle, because the onLoad life cycle component may not be created yet
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style scoped lang="scss">
.detailAddress {
  /deep/ .u-form-item--left {
    display: flex;
    align-items: flex-start;
  }
}
.saveBtn,
.selectAddress {
  height: 70rpx;

  line-height: 70rpx;
  text-align: center;
  font-size: 30rpx;
  background: $aider-light-color;
  color: #fff;
  width: 70%;
  margin: 40rpx auto 0 auto;
  border-radius: 20rpx;
}
.selectAddress {
  margin-top: 40rpx;
  background: #fff;

  color: $aider-light-color;
  border: 2rpx solid $aider-light-color;
}

.uForm {
  width: 94%;
  overflow: hidden;
  left: 3%;
  position: relative;
  top: 2%;
  background: #fff;
  border-radius: 20rpx;
  padding: 0 0 40rpx 0;
}
.add-address {
  width: 100%;
  padding-top: 3%;

  /deep/ .u-form-item {
    background-color: #fff;
    padding: 24rpx 30rpx;
  }
  .u-btn {
    margin: 30rpx 30rpx 0 30rpx;
    background-color: $main-color;
  }

  /deep/.u-checkbox {
    margin: 30rpx 30rpx 0 30rpx;

    .u-label-class.u-checkbox__label {
      color: $font-color-light;
      font-size: $font-sm;
    }
  }
}
/deep/ .u-checkbox__label {
  font-size: 28rpx;
}
</style>

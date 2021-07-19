<template>
  <view class="person-msg">
    <view class="head c-content" @click="changeFace">
      <image :src="form.face ||'/static/missing-face.png'" mode=""></image>
      <view>Click to modify the avatar</view>
    </view>
    <u-form :model="form" ref="uForm" class="form">
      <u-form-item label="nickname" label-width="150">
        <u-input v-model="form.nickName" placeholder="Please enter a nickname" />
      </u-form-item>
      <u-form-item label="Gender" label-width="150">
        <u-radio-group v-model="form.sex" :active-color="lightColor">
          <u-radio name="1">Male</u-radio>
          <u-radio name="0">Female</u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item label="birthday" label-width="150" right-icon="arrow-right">
        <u-input v-model="birthday" disabled placeholder="Please select the date of birth" @click="showBirthday = true" />
        <u-picker v-model="showBirthday" mode="time" :confirm-color="lightColor" @confirm="selectTime"></u-picker>
      </u-form-item>
      <u-form-item label="City" label-width="150" placeholder="Please select a city" right-icon="arrow-right">
        <u-input v-model="form.___path" disabled @click="clickRegion" />
      </u-form-item>
      <view class="submit" @click="submit">Save</view>
    </u-form>

    <m-city :provinceData="region" headTitle="region selection" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="4"></m-city>
  </view>
</template>
<script>
import {saveUserInfo} from "@/api/members.js";
import {upload} from "@/api/common.js";
import storage from "@/utils/storage.js";
import uFormItem from "@/uview-ui/components/u-form-item/u-form-item.vue";
import gkcity from "@/components/m-city/m-city.vue";
export default {
  components: {uFormItem, "m-city": gkcity },
  data() {
    return {
      lightColor: this.$lightColor, //Highlight color
      form: {
        nickName: storage.getUserInfo().nickName || "",
        birthday: storage.getUserInfo().birthday || "",
        face: storage.getUserInfo().face || "/static/missing-face.png", //default avatar
        regionId: [], //Address Id
        region: storage.getUserInfo().region || [], //Address
        sex: storage.getUserInfo().sex || 1, //Sex
        ___path: storage.getUserInfo().region,
      },
      birthday: storage.getUserInfo().birthday || "", //Birthday
      photo: [
        {text: "Take a picture now", color: this.$mainColor },
        {text: "Select from album", color: this.$mainColor },
      ],
      region: [
        //Request city default address
        {
          id: "",
          localName: "Please select",
          children: [],
        },
      ],
      showBirthday: false, //Show birthday date
    };
  },
  methods: {
    /**
     * Select address callback
     */
    getpickerParentValue(e) {
      this.form.region = [];
      this.form.regionId = [];
      let name = "";

      e.forEach((item, index) => {
        if (item.id) {
          this.form.region.push(item.localName);
          this.form.regionId.push(item.id);
          if (index == e.length-1) {
            name += item.localName;
          } else {
            name += item.localName + ",";
          }
          this.form.___path = name;
        }
      });
    },

    /**
     * Click to select address
     */
    clickRegion() {
      this.$refs.cityPicker.show();
    },

    /**
     * Submit and save
     */
    submit() {
      delete this.form.___path;
      let params = JSON.parse(JSON.stringify(this.form));
      saveUserInfo(params).then((res) => {
        if (res.statusCode == 200) {
          storage.setUserInfo(res.data.result);
          uni.navigateBack();
        }
      });
    },

    /**
     * Modify avatar
     */
    changeFace(index) {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: upload,
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              accessToken: storage.getAccessToken(),
            },
            success: (uploadFileRes) => {
              let data = JSON.parse(uploadFileRes.data);

              this.form.face = data.result;
            },
          });
        },
      });
    },

    /**
     * Choose address
     */
    selectRegion(region) {
      this.$set(
        this.form,
        "address",
        `${region.province.label} ${region.city.label} ${region.area.label}`
      );
    },

    /**
     * selection period
     */
    selectTime(time) {
      this.form.birthday = `${time.year}-${time.month}-${time.day}`;
      this.birthday = `${time.year}-${time.month}-${time.day}`;
    },
  },

  /**
   * Download Data
   */
  onLoad() {},
};
</script>

<style lang="scss" scoped>
.submit {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  margin-top: 90rpx;

  width: 100%;
  margin: 0 auto;
  color: $main-color;
  border-radius: 100px;
}
.head {
  height: 260rpx;
  color: $font-color-light;
  font-size: $font-sm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 2em;
  image {
    width: 144rpx;
    height: 144rpx;
    border-radius: 50%;
  }
}
/deep/ .u-form {
  background-color: #ffffff;
  padding: 0;
  margin-top: 30rpx;
  .u-form-item {
    padding: 0 20rpx;
    height: 110rpx;
    line-height: 110rpx;
  }
}
.form {
  background-color: #ffffff;
}
</style>

<template>
  <view class="box">
    <view class="box-tips">
      <h2>
        {{verificationTitle[validateFlage==false? 0: 1].title}}
      </h2>
      <view class="verification">{{verificationTitle[step].desc}}</view>
    </view>
    <u-form :model="codeForm" class="form" ref="validateCodeForm">
      <view v-if="!validateFlage">
        <u-form-item label-width="120" label="Mobile number" prop="mobile">
          <u-input v-model="codeForm.mobile" placeholder="Please enter your mobile phone number" />
        </u-form-item>

        <u-form-item class="sendCode" label-width="120" prop="code" label="Verification code">
          <u-input v-model="codeForm.code" placeholder="Please enter the verification code" />
          <u-verification-code unique-key="page-edit" :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
          <view @tap="getCode" class="text-tips">{{ tips }}</view>
        </u-form-item>

        <view class="submit" @click="validatePhone">Verify</view>
        <myVerification keep-running @send="verification" class="verification" ref="verification" business="LOGIN" />
      </view>
      <view v-if="validateFlage">
        <u-form-item label-width="120" label="Old password">
          <u-input type="password" v-model="password" placeholder="Please enter your old password" />
        </u-form-item>

        <u-form-item label-width="120" label="New password">

          <u-input type="password" v-model="newPassword" placeholder="Please enter your new password" />

        </u-form-item>

        <view class="submit" @click="updatePassword">Change password</view>
      </view>
    </u-form>
  </view>
</template>

<script>
import {sendMobile, resetByMobile, modifyPass} from "@/api/login";
import storage from "@/utils/storage.js";
import {md5} from "@/utils/md5.js"; // md5
import myVerification from "@/components/verification/verification.vue"; //Verification
import uuid from "@/utils/uuid.modified.js";
export default {
  components: {
    myVerification,
  },
  data() {
    return {
      uuid,
      validateFlage: false, //Whether the mobile phone number verification has been carried out
      verificationTitle: [
        {
          title: "Security Verification",
          desc: "Please enter the current mobile phone number for security verification",
        },
        {
          title: "Modify Password",
          desc: "Please enter a new password",
        },
      ],
      step: 0, //Current verification step
      flage: false, //Whether to verify code verification

      codeForm: {
        mobile: "", //Mobile phone number
        code: "", //Verification code
      },
      newPassword: "", //new password
      password: "", //Password
      tips: "", //tips
      seconds: 60, // 60s waiting time

      // Verification code login verification
      codeRules: {
        mobile: [
          {
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value);
            },
            message: "Mobile phone number is incorrect",
            trigger: ["blur"],
          },
        ],
        code: [
          {
            min: 4,
            max: 6,
            required: true,
            message: "Please enter the verification code",
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  onReady() {
    // Must be in the onReady life cycle, because the onLoad life cycle component may not be created yet
    this.$refs.validateCodeForm.setRules(this.codeRules);
  },
  watch: {
    flage(val) {
      if (val) {
        if (this.$refs.uCode.canGetCode) {
          uni.showLoading({
            title: "Getting the verification code",
          });
          sendMobile(this.codeForm.mobile).then((res) => {
            uni.hideLoading();
            // Here this prompt will be overwritten by the prompt in this.start() method
            if (res.data.code == 200) {
              this.$refs.uCode.start();
            } else {
              uni.showToast({
                title: res.data.message,
                duration: 2000,
                icon: "none",
              });
            }
          });
        } else {
          this.$u.toast("Please send after the countdown is over");
        }
      }
    },
  },

  methods: {
    // change Password
    updatePassword() {
      modifyPass({
        newPassword: md5(this.newPassword),
        password: md5(this.password),
      }).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "Modified successfully!",
            duration: 2000,
            icon: "none",
          });
          setTimeout(() => {
            uni.navigateBack({
              delta: 1,
            });
          }, 1000);
        }
      });
    },

    // Verification code verification
    verification(val) {
      this.flage = val == this.$store.state.verificationKey? true: false;
    },

    // Verify mobile phone number
    validatePhone() {
      this.$refs.validateCodeForm.validate((valid) => {
        if (valid) {
          resetByMobile(this.codeForm).then((res) => {
            if (res.data.success) {
              storage.setAccessToken(res.data.result.accessToken);
              storage.setRefreshToken(res.data.result.refreshToken);
              // login successful
              uni.showToast({
                title: "Verification succeeded!",
                icon: "none",
              });
            }
          });
        }
      });
    },

    codeChange(text) {
      this.tips = text;
    },
    end() {},

    /** Determine whether it is the current user's mobile phone number */
    isUserPhone() {
      let flage = false;
      let user = this.$options.filters.isLogin();
      if (user.mobile != this.codeForm.mobile) {
        uni.showToast({
          title: "Please enter the currently bound mobile phone number",
          icon: "none",
        });
        flage = false;
      } else {
        flage = true;
      }

      return flage;
    },
    /**get verification code */
    getCode() {
      if (this.isUserPhone()) {
        if (this.tips == "Reacquire") {
          this.flage = true;
        }
        if (!this.$u.test.mobile(this.codeForm.mobile)) {
          uni.showToast({
            title: "Please enter the correct phone number",
            icon: "none",
          });
          return false;
        }
        if (!this.flage) {
          this.$refs.verification.hide();
          return false;
        }
      }
    },
    start() {
      this.$u.toast("The verification code has been sent");
      this.flage = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("../../../passport/login.scss");
.u-form-item {
  margin: 40rpx 0;
}
.sendCode {
  /deep/ .u-form-item--right__content__slot {
    display: flex;
  }
}
page {
  background: #fff;
}
.box {
  padding: 80rpx 0;
  border-radius: 20rpx;
}
.box-tips {
  margin: 0 72rpx;
}
.verification {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}
</style>

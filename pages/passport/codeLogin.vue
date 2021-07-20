<template>
  <div class="form">
    <u-form :model="codeForm" ref="validateCodeForm">
      <u-form-item class="cell" label-width="120" label="phone number" prop="mobile">
        <u-input maxlength="11" v-model="codeForm.mobile" placeholder="Please enter your mobile phone number" />
      </u-form-item>

      <u-form-item class="cell code" label-width="120" prop="code" label="Verification code">
        <div style="display:flex; with:100%;">
          <u-input v-model="codeForm.code" placeholder="Please enter the verification code" />
          <u-verification-code keep-running unique-key="page-login" :seconds="seconds" @end="end" @start="start"
                               ref="uCode" @change="codeChange"></u-verification-code>
          <view @tap="getCode" class="text-tips">{{ tips }}</view>
        </div>
      </u-form-item>

      <view class="submit" @click="submit">Log in</view>
      <view class="text-tips cell" @click="clickLogin">One-click login</view>
      <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="LOGIN" />
    </u-form>
  </div>
</template>

<script>
import { sendMobile, smsLogin } from '@/api/login';
import { getUserInfo } from '@/api/members';
import storage from '@/utils/storage.js'; //Cache
import { whetherNavigate } from '@/utils/Foundation'; //Login jump
import myVerification from '@/components/verification/verification.vue'; //Verification code module
import uuid from '@/utils/uuid.modified.js'; // uuid
export default {
  components: {
    myVerification
  },
  props: ['status'], //Whether to check "User Privacy" and "Privacy Policy"
  data() {
    return {
      uuid,
      flage: false, //Whether to verify code verification
      codeFlag: true, //Verification switch, used to display the verification code
      codeForm: {
        mobile:'', //Mobile phone number
        code:'' //Verification code
      },
      tips:'', //Prompt, click to send verification code and assign value when resending
      clientType:'', // client type
      seconds: 60, //Default verification code waiting time
      // QR code login verification rules
      codeRules: {
        // mobile phone number verification
        mobile: [
          {
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value);
            },
            message:'Mobile phone number is incorrect',
            trigger: ['blur']
          }
        ],
        // Verification code verification
        code: [
          {
            min: 4,
            max: 6,
            required: true,
            message:'Please enter the verification code',
            trigger: ['blur']
          }
        ]
      }
    };
  },
  // Must be setRules in the onReady life cycle, because the onLoad life cycle component may not have been created yet
  mounted() {
    // whetherNavigate();
    this.$refs.validateCodeForm.setRules(this.codeRules);
    /**
     * Conditional compilation to determine the current client type
     */
    //#ifdef H5
    this.clientType ='H5';
    //#endif
    //#ifdef APP-PLUS
    this.clientType ='APP';
    //#endif
  },
  watch: {
    async flage(val) {
      if (val) {
        if (this.$refs.uCode.canGetCode) {
          // Request a verification code from the backend
          uni.showLoading({
            title:'Getting the verification code'
          });

          let res = await sendMobile(this.codeForm.mobile);

          uni.hideLoading();
          // Here this prompt will be overwritten by the prompt in this.start() method
          if (res.data.success) {
            this.$refs.uCode.start();
          } else {
            uni.showToast({
              title: res.data.message,
              duration: 2000,
              icon:'none'
            });
            this.flage = false;
          }
        } else {
          this.$u.toast('Please send after the countdown is over');
        }
      } else {
        this.$refs.verification.hide();
      }
    }
  },

  methods: {
    // Verification code verification
    verification(val) {
      this.flage = val == this.$store.state.verificationKey? true: false;
    },
    //   log in
    submit() {
      if (!this.status) {
        /**
         * Users must understand
         * User agreement and privacy policy
         */
        uni.showToast({
          title:'Please read and agree to the user agreement and privacy policy',
          duration: 2000,
          icon:'none'
        });
        return false;
      }
      let _this = this;
      this.$refs.validateCodeForm.validate((valid) => {
        if (valid) {
          /**
           * Clear current account information
           */
          storage.setHasLogin(false);
          storage.setAccessToken('');
          storage.setRefreshToken('');
          storage.setUuid(this.uuid.v1());
          storage.setUserInfo({});
          /**
           * Perform login
           */
          smsLogin(this.codeForm, _this.clientType).then((res) => {
            if (res.data.success) {
              storage.setAccessToken(res.data.result.accessToken);
              storage.setRefreshToken(res.data.result.refreshToken);

              /**
               * Get personal information after successful login
               */
              getUserInfo().then((user) => {
                if (user.data.success) {
                  /**
                   * Personal information is stored in the cache userInfo
                   */
                  storage.setUserInfo(user.data.result);
                  storage.setHasLogin(true);
                  // login successful
                  uni.showToast({
                    title:'Login successful!',
                    icon:'none'
                  });

                  /**
                   * Calculate the current router path
                   * 1. If the redirected link is a login page or the redirected link is an empty page. Will redirect to the homepage
                   * 2. Not satisfied to return to the jump page
                   */
                  whetherNavigate();
                } else {
                  uni.switchTab({
                    url:'/pages/tabbar/home/index'
                  });
                }
              });
            }
          });
        }
      });
    },
    // Jump to one-click login
    clickLogin() {
      this.$emit('open','click');
    },

    /**Click the verification code*/
    codeChange(text) {
      this.tips = text;
    },
    /** Execute after the end of the verification code */
    end() {
    },
    /**get verification code */
    getCode() {
      if (this.tips =='Reacquire') {
        this.codeFlag = true;

        uni.showLoading({
          title:'Loading'
        });
        setTimeout(() => {
          this.$refs.verification.hide();
          uni.hideLoading();
        }, 2000);
      }

      if (!this.$u.test.mobile(this.codeForm.mobile)) {
        uni.showToast({
          title:'Please enter the correct phone number',
          icon:'none'
        });

        return false;
      }
      if (!this.flage) {
        this.$refs.verification.error();
        return false;
      }
    },

    // Click for authentication code
    start() {
      this.$u.toast('Verification code has been sent');
      this.flage = false;

      this.codeFlag = false;
      this.$refs.verification.hide();
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("./login.scss");

// #ifdef MP-WEIXIN
@import url("./mp-codeLogin.scss");

// #endif
</style>

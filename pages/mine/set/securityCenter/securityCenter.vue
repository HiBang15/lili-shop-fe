// The first version of TODO does not have this feature yet. Follow-up optimization and updates
<template>
  <view class="finger">
    <u-cell-group>
      <u-cell-item class="border-top" :arrow="false" title="Fingerprint login">
        <u-switch slot="right-icon" @change="fingerSwitchChange" :active-color="lightColor" size="40"
                  v-model="checked"></u-switch>
      </u-cell-item>
    </u-cell-group>
    After opening
    <view class="describe">, you can use fingerprint authentication to complete quick login, and the settings are only
      valid for this machine. If you need to modify the fingerprint, please operate in the system settings.
    </view>
  </view>
</template>

<script>
import storage from '@/utils/storage.js';
import { setBiolofy } from '@/api/passport.js';

export default {
  data() {
    return {
      lightColor: this.$lightColor,
      checked: false
    };
  },
  methods: {
    fingerSwitchChange(value) {
      if (value === true) {
        const res = uni.getSystemInfoSync();
        plus.device.getInfo({
          success: function (e) {
            let params = {
              mobile_type: res.model,
              secret_key: e.uuid
            };
            setBiolofy(params).then((res) => {
              if (res.statusCode === 200) {
                storage.setFingerLogin(true);
              }
            });
          },
          fail: function (e) {
            console.error('getDeviceInfo failed: ' + JSON.stringify(e));
          }
        });
      } else {
        storage.setFingerLogin(false);
      }
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    if (!plus.fingerprint.isSupport()) {
      plus.nativeUI.toast('This device does not support fingerprint recognition');
      uni.navigateBack();
    }
    if (!plus.fingerprint.isKeyguardSecure()) {
      plus.nativeUI.toast('This device has not set a password lock screen');
      uni.navigateBack();
    }
    if (!plus.fingerprint.isEnrolledFingerprints()) {
      plus.nativeUI.toast('No fingerprint is registered on this device');
      uni.navigateBack();
    }
    this.checked = storage.getFingerLogin() || false;
    // #endif
  }
};
</script>

<style scoped lang="scss">
</style>

<template></template>
<script>
import { getAddressCode } from '@/api/address';
import config from '@/config/config';

export default {
  data() {
    return {
      config
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // Initialize the map and call
    initMap() {
      let that = this;
      uni.chooseLocation({
        success: function (res) {
          /**Get address details address */
          that.posToCity(res.latitude, res.longitude).then((val) => {
            /**Get address code */
            getAddressCode(
                val.regeocode.addressComponent.citycode,
                val.regeocode.addressComponent.township
            ).then((code) => {
              that.$emit('callback', {...val, ...res, ...code});
              that.$emit('close');
            });
          });
        },
        fail() {
          that.$emit('close');
        }
      });
    },

    // Display different types of data according to the current client's judgment
    init() {
      // #ifdef MP-WEIXIN
      this.wechatMap();
      // #endif
      // #ifndef MP-WEIXIN
      this.initMap();
      // #endif
    },

    // If it is a WeChat applet to use the WeChat applet authorization mode alone
    wechatMap() {
      let that = this;
      uni.authorize({
        scope: 'scope.userLocation',
        success() {
          // Allow authorization
          that.initMap();
        },
        fail() {
          //Reject authorization
          uni.showModal({
            content: 'It is detected that you have not turned on the access to the address function, do you want to set it on?',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            success: (res) => {
              if (res.confirm) {
                // Refresh the map after opening the settings
                uni.openSetting({
                  success: (res) => {
                    that.initMap();
                  }
                });
              } else {
                // close after cancel
                that.$emit('close');
                return false;
              }
            }
          });
          return false;
        }
      });
    },
    // Get the data of the city
    posToCity(latitude, longitude) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `https://restapi.amap.com/v3/geocode/regeo`,
          method: 'GET',
          data: {
            key: config.aMapKey, //key of web service
            location: `${ longitude },${ latitude }`
          },
          success: ({data}) => {
            const {status, info} = data;
            if (status === '1') {
              resolve(data);
            } else {
              reject(info);
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

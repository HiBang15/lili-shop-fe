<template>
  <div class="feedBack">
    <div class="feedBack-box">
      <h4>Guess you want to ask</h4>
      <div class="feedBack-item" @click="handleClick(index)" v-for="(item,index) in list" :key="index">
        {{ item.text }}
      </div>
    </div>

    <div class="feedBack-box">
      <h4>Question feedback<span style="margin-left:10rpx;" v-if="feedBack.type">@{{
          list.find(item => {
            return item.value == feedBack.type;
          }).text
        }}</span></h4>
      <u-input class="field-input" height="500" :border-bottom="false" v-model="feedBack.context" type="textarea"
               placeholder="Please enter feedback information">
      </u-input>
    </div>

    <!-- Upload voucher -->
    <div class="feedBack-box">
      <view class="opt-view">
        <view class="img-title">Upload vouchers (up to 5)</view>
        <view class="images-view">
          <u-upload :header=" {accessToken: storage.getAccessToken() }" :action="action" width="150"
                    @on-uploaded="onUploaded" :max-count="5" :show-progress="false"></u-upload>
        </view>
      </view>
    </div>

    <div class="feedBack-box">
      <h4>Mobile phone number</h4>
      <u-input :border-bottom="false" v-model="feedBack.mobile" placeholder="Please enter your mobile phone number">
      </u-input>
    </div>

    <div class="submit" @click="submit()">Submit</div>
  </div>

</template>

<script>
import storage from '@/utils/storage.js';
import config from '@/config/config';
import { feedBack } from '@/api/members.js';
import { upload } from '@/api/common.js';

export default {
  data() {
    return {
      storage,
      config,
      feedBack: {
        type: 'FUNCTION' //The default feedback question is'function related'
      },
      action: upload, //Image upload address
      list: [
        {text: 'Function related', value: 'FUNCTION'},
        {text: 'Optimization feedback', value: 'OPTIMIZE'},
        {text: 'Other', value: 'OTHER'}
      ]
    };
  },
  methods: {
    // Click on the feedback content
    handleClick(index) {
      this.$set(this.feedBack, 'type', this.list[index].value);
    },

    //upload picture
    onUploaded(lists) {
      let images = [];
      lists.forEach((item) => {
        images.push(item.response.result);
      });
      this.feedBack.images = images.join(',');
    },

    /**
     * Submit feedback
     */
    submit() {
      if (!this.feedBack.type) {
        uni.showToast({
          title: 'Please fill in the feedback type',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if (!this.feedBack.context) {
        uni.showToast({
          title: 'Please fill in the feedback type',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if (this.feedBack.mobile && !this.$u.test.mobile(this.feedBack.mobile)) {
        uni.showToast({
          title: 'Please fill in your correct phone number',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      /** Submit */
      feedBack(this.feedBack).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: 'Submitted successfully!',
            duration: 2000,
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            });
          }, 500);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.submit {
  text-align: center;
  background: $light-color;
  height: 70 rpx;
  line-height: 70 rpx;
  color: #fff;
  width: 92%;
  margin-bottom: 100 rpx;
  margin: 0 auto;
  border-radius: 100px;
}

.feedBack {
  padding-bottom: 100 rpx;
}

.feedBack-box {
  background: #fff;
  border-radius: 20 rpx;
  padding: 32 rpx;
  margin-bottom: 40 rpx;
}

/deep/ .u-input__textarea {
  padding: 12px;
}

.feedBack-box:nth-of-type(1) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.feedBack-item {
  margin: 20 rpx 0;
  font-size: 24 rpx;
  color: #666;
}

h4 {
  font-size: 30 rpx;
}

.field-input {
  margin: 20 rpx 0;
  padding: 20 rpx 0;
  background: #fafafa;
  border-radius: 0.6em;
}
</style>

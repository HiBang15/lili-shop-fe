<template>
  <!-- Mask layer -->
  <u-popup @close="close" v-model="show" mode="bottom" border-radius="30" height="260rpx">

    <view class="share-title">
      <span>Share to</span>
    </view>
    <view class="share-list">
      <!-- #ifdef MP-WEIXIN -->
      <view class="share-item">
        <button class="share-btn" open-type="share">
          <u-icon color="#04BE02" size="80" name="weixin-fill"></u-icon>
          WeChat friends
        </button>
      </view>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view class="share-item" @click="handleShare(item)" v-for="(item, index) in list" :key="index">
        <u-icon :color="item.color" size="80" :name="item.icon"></u-icon>
        <view>{{ item.title }}</view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="share-item" @click="copyLink()">
        <u-icon color="#b4aee8" size="80" name="share-fill"></u-icon>
        <view>{{ 'Copy link' }}</view>
      </view>
      <!-- #endif -->
    </view>
  </u-popup>
</template>
<script>
import { h5Copy } from '@/js_sdk/h5-copy/h5-copy.js';
import configs from '@/config/config';
import mpShare from 'uview-ui/libs/mixin/mpShare.js';

export default {
  mixins: [mpShare],
  data() {
    return {
      configs,
      show: true,
      list: [
        {
          color: '#04BE02',
          title: 'WeChat Friends',
          icon: 'weixin-fill',
          type: 0
        },
        {
          color: '#04BE02',
          title: 'Friends Circle',
          icon: 'weixin-circle-fill',
          type: 1
        }
      ]
    };
  },
  // Picture thumbnail, product name, type (goods,shop,pintuan) group product sharing and shop sharing

  props: ['thumbnail', 'goodsName', 'type', 'goodsId', 'link'],
  // #ifdef MP-WEIXIN
  onShareAppMessage(res) {
    return {
      imageUrl: this.thumbnail || require('@/static/logo.png')
    };
  },
  // #endif
  methods: {
    close() {
      this.$emit('close');
    },
    // h5 copy link
    // #ifdef H5
    copyLink() {
      let content;
      if (this.link) {
        content = this.configs.shareLink + this.link;
      } else {
        content =
            this.configs.shareLink +
            getCurrentPages()[getCurrentPages().length - 1].__page__.fullPath;
      }
      if (content === null || content === undefined) {
        content = '';
      } else content = content + '';
      const result = h5Copy(content);
      if (result === false) {
        uni.showToast({
          title: 'Not supported'
        });
      } else {
        uni.showToast({
          title: 'Copy successful',
          icon: 'none'
        });
      }
    },
    // #endif

    // #ifdef APP-PLUS
    handleShare(val) {
      if (val.type <= 1) {
        let shareTitle;

        if (this.type == 'goods') {
          shareTitle = `I found a ${ this.goodsName } product, come and take a look with me`;
        } else if (this.type == 'shops') {
          shareTitle = `I found a ${ this.goodsName } store, come and have a look with me`;
        } else if (this.type == 'pintuan') {
          shareTitle = `I have put together a ${ this.goodsName }, come and snap it up with me!`;
        } else if (this.type == 'kanjia') {
          shareTitle = `Please come and cut a knife for me ${ this.goodsName }`;
        }

        let scene; // "WXSenceTimeline circle of friends WXSceneSession WeChat friends"
        val.type == 1
            ? (scene = 'WXSenceTimeline')
            : (scene = 'WXSceneSession');
        uni.share({
          provider: 'weixin',
          scene: scene,
          href: configs.shareLink + this.link,
          imageUrl: this.thumbnail,
          type: 0,
          summary: this.goodsName,
          title: shareTitle,
          success: function (res) {
            uni.showToast({
              title: 'Share successful!',
              duration: 2000,
              icon: 'none'
            });
            this.$emit('close');
          },
          fail: function (err) {
            uni.showToast({
              title: 'Sharing failed!',
              duration: 2000,
              icon: 'none'
            });
            this.$emit('close');
          }
        });
      }
    }
    // #endif
  }
};
</script>
<style lang="scss" scoped>
@import "./mp-share.scss";

.share-title {
  position: relative;
  height: 90 rpx;
  font-size: 32 rpx;
  line-height: 90 rpx;
  text-align: center;

  > .share-close {
    position: absolute;
    right: 0;
    right: 20 rpx;
    top: 30 rpx;
  }
}

button:after {
  border: none;
}

.share-list {
  padding: 0 32 rpx;
  display: flex;
  text-align: center;
  align-items: center;

  > .share-item {
    width: 25%;
    font-size: 24 rpx;
    color: #666;

    > * {
      margin: 8 rpx 0;
    }
  }
}
</style>

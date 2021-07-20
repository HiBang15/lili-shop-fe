<template>
  <!-- Carousel Picture -->
  <view class="carousel">
    <swiper circular="true" duration="400" @change="swiperChange">
      <swiper-item class="swiper-item" v-for="(item, index) in res" :key="index">
        <view class="image-wrapper">
          <u-image :src="item" mode="aspectFit" class="loaded" width="100%" height="100%">
            <u-loading slot="loading"></u-loading>
          </u-image>
        </view>
      </swiper-item>
    </swiper>
    <view class="swiper-dots">{{ current }}/{{ res.length }}</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      current: 1
    };
  },
  props: ['res'],
  methods: {
    // Dot corresponding to the carousel picture
    swiperChange(e) {
      this.current = e.detail.current + 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.carousel {
  // #ifdef MP-WEIXIN
  margin-top: 44px;
  // #endif
  width: 750 rpx;
  height: 750 rpx;
  position: relative;

  swiper {
    height: 100%;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
  }

  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 750 rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }

  position: relative;

  .swiper-dots {
    position: absolute;
    right: 0 rpx;
    bottom: 40 rpx;
    font-size: 32 rpx;
    width: 107 rpx;
    height: 44 rpx;
    line-height: 44 rpx;
    text-align: center;
    border-radius: 30 rpx 0 rpx 0 rpx 30 rpx;
    background: #333333;
    opacity: 0.4;
    font-weight: 400;
    color: #fff;
  }
}

/deep/ .image-wrapper image {
  opacity: 1 !important;
}
</style>

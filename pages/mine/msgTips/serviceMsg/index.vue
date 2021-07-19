<template>
  <view class="container">
    <view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
      <u-row gutter="12" justify="start">
        <u-col span="2">
          <img
              class="list_img"
              src="https://web-assets.fancynode.com.cn/web_v1/images/pxcook/features/icon-cloud.png"
              alt
          />
        </u-col>
        <u-col span="7">
          <p class="tit_title">
            <img
                src="https://web-assets.fancynode.com.cn/web_v1/images/pxcook/features/icon-cloud.png"
                alt
            />
            online service
          </p>
          <p class="tit_tips">View the reply message to the customer service</p>
        </u-col>
        <u-col span="3">
          <text class="cell-more">
            <p class="msgTime">2020-12-12</p>
            <span class="redBox">55</span>
          </text>
        </u-col>
      </u-row>
    </view>
  </view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['logout'])

  }
};
</script>

<style scoped lang='scss'>
.msgTime {
  font-size: 13px;
}

page {
  background: $page-color-base;
}

.list_img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  border-radius: 0.4em;
}

.qicon {
  text-align: center;
  display: block;
  font-size: 20px;
}

.redBox {
  padding: 10 rpx 12 rpx;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  line-height: 1em;
  width: 1em;
  height: 1em;
  background: #ed6533;
  border-radius: 50%;

  color: #fff;
}

.tit_title,
.tit_tips {
  margin-left: 8 rpx;
}

.tit_title {
  color: $u-main-color;

  > img {
    vertical-align: middle;
    margin-right: 10 rpx;
    width: 40 rpx;
    height: 40 rpx;
  }
}

.tit_tips {
  color: $u-tips-color;
}

.list-cell {
  align-items: baseline;
  padding: 20 rpx 30 rpx;
  line-height: 60 rpx;
  position: relative;
  background: #fff;
  justify-content: center;

  &.log-out-btn {
    margin-top: 40 rpx;

    .cell-tit {
      color: $uni-color-primary;
      text-align: center;
      margin-right: 0;
    }
  }

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    left: 30 rpx;
  }

  &.m-t {
    margin-top: 16 rpx;
  }

  .cell-more {
    text-align: right;
    margin-top: 10 rpx;
    height: 60 rpx;
    display: flex;
    justify-content: center; //This is the center of the X axis
    align-items: center; //This is the center of the Y axis
    align-self: baseline;
    font-size: $font-lg;
    color: $font-color-light;
    margin-left: 10 rpx;
  }

  .cell-tit {
    flex: 1;
    font-size: $font-base + 2rpx;
    color: $font-color-dark;
    margin-right: 10 rpx;
  }

  .cell-tip {
    font-size: $font-base;
    color: $font-color-light;
  }
}
</style>

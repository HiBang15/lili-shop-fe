<template>
  <div>
    <view class="detail-box">
      <view class="goods-detail">
        <view class="detail_padding">
          <div class="goods-detail-box">
            <div class="goods-detail-item goods-active">Product introduction</div>
          </div>
          <u-empty class="empty" text="No product introduction yet" mode="data" v-if="!res.intro"></u-empty>
          <u-parse class="vhtml" :lazy-load="true" :use-cache="true" :show-with-animation="true"
                   :html="res.mobileIntro"></u-parse>
        </view>
      </view>
    </view>

    <view class="detail-box">
      <view class="goods-detail">
        <view class="detail_padding">
          <div class="goods-detail-box">
            <div class="goods-detail-item goods-active">Product parameters</div>
          </div>
          <!-- <u-divider>Commodity parameters</u-divider> -->
          <div class="param-list" v-if="goodsParams.length == 0">
            <u-empty text="No product parameters temporarily" mode="list"></u-empty>
          </div>
          <div class="params-group" v-for="(group,groupIndex) in goodsParams" :key="groupIndex">
            <view style="font-weight: bold;margin-left: 10px;">{{ group.groupName }}</view>
            <div class="param-list">
              <div class="param-item" v-for="(param,index) in group.goodsParamsItemDTOList" :key="index">
                <div class="param-left">{{ param.paramName }}</div>
                <div class="param-right">{{ param.paramValue }}</div>
              </div>
            </div>
          </div>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import { getGoodsMessage } from '@/api/goods';

export default {
  data() {
    return {
      goodsDetail: ''
    };
  },
  props: ['res', 'goodsId', 'goodsParams'],
  async mounted() {
    console.log(this.res);
    let res = await getGoodsMessage(this.goodsId);
    if (res.data.success) {
      this.goodsDetail = res.data.result;

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../product.scss";

.param-list {
  padding: 40 rpx 0 80 rpx 0;
}

.param-item {
  display: flex;
  justify-content: center;
  border-bottom: none;

  > .param-left,
  > .param-right {
    padding: 16 rpx 0;
    font-size: 24 rpx;
    color: #666;
    border: 1px solid rgb(220, 223, 230);
    border-bottom: none;
  }

  > .param-left {
    text-align: center;
    border-right: none;
    flex: 3;
  }

  > .param-right {
    padding: 0 10 rpx;
    align-items: center;
    display: flex;
    flex: 7;
  }
}

.param-item:nth-last-of-type(1) {
  > .param-left,
  > .param-right {
    border-bottom: 1px solid rgb(220, 223, 230);
  }
}

.empty {
  margin: 40 rpx 0;
}

.goods-detail /deep/ .vhtml {
  overflow: hidden;

  width: 100%;
}

/deep/ img {
  width: 100%;
}

.goods-detail-box {
  display: flex;
  justify-content: space-between;
  // padding: 0 80rpx;
  height: 120 rpx;
  line-height: 120 rpx;

  > .goods-active {
    font-weight: 700;

    &::before {
      position: absolute;
      left: 50%;
      bottom: 15px;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      content: "";
      display: block;
      width: 52 rpx;
      height: 6 rpx;

      background-image: linear-gradient(90deg, $jd-color, $jd-light-color);
    }
  }

  > .goods-detail-item {
    color: #262626;
    position: relative;
  }
}

.detail_padding {
}
</style>

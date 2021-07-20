<template>
  <view class="evaluate-box">
    <view class="eva-section" @click="toComment(goodsDetail.goodsId, goodsDetail.grade)">
      <view class="e-header">

        <view class="evaluate-title">evaluation</view>
        <text class="evaluate-num">{{ commDetail.total || '0' }}+</text>
        <text class="tip">Praise rate {{ grade || '100' }}%</text>
      </view>
      <div v-if="commDetail && commDetail.records && commDetail.records.length> 0">
        <view class="eva-box" v-for="(commItem,commIndex) in commDetail.records.slice(0,2)" :key="commIndex">
          <view class="section-info">
            <u-avatar mode="circle" size="60" class="portrait" :src="commItem.memberProfile"></u-avatar>
            <view class="star-con">
              <text class="name">{{ commItem.memberName | noPassByName }}</text>
            </view>
          </view>
          <view class="section-contant">
            <u-read-more ref="uReadMore" :color="lightColor">
              <rich-text @load="parseLoaded" :nodes="commItem.content " class="con"></rich-text>
            </u-read-more>
            <scroll-view scroll-x class="scroll-x" v-if="commItem.image">
              <view class="img">
                <u-image border-radius="12" class="commImg" width="160rpx" height="160rpx"
                         v-for="(item, index) in commItem.image.split(',')" :src="item" :key="index"
                         @click.stop="previewImg(commItem.image, index)"></u-image>
              </view>
            </scroll-view>
            <view class="bot">
              <text class="attr">{{ commItem.goodsName }}</text>
            </view>
          </view>
        </view>
      </div>

      <div v-else class="goodsNoMore">
        <u-empty text="There are currently no reviews for this product" mode="message"></u-empty>
      </div>
    </view>
    <!-- View all evaluation buttons -->
    <view v-if="commDetail && commDetail.records && commDetail.records.length> 0" class="eva-section-btn"
          @click="toComment(goodsDetail.goodsId, goodsDetail.grade)">
      <text>View all reviews</text>
    </view>
  </view>
</template>

<script>
import * as API_Members from '@/api/members.js';

export default {
  data() {
    return {
      lightColor: this.$lightColor,
      // Comment collection
      commDetail: [],
      grade: '',
      // Comment page submission data
      params: {
        pageNumber: 1,
        pageSize: 10,
        grade: ''
      }
    };
  },
  props: {
    goodsDetail: {
      default: {},
      type: Object
    }
  },

  watch: {
    goodsDetail: {
      handler(val) {
        this.grade = val.grade;
        this.getGoodsComments();
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.getGoodsComments();
  },
  methods: {
    parseLoaded() {
      this.$refs.uReadMore.init();
    },

    // Get product reviews
    getGoodsComments() {
      API_Members.getGoodsComments(this.goodsDetail.goodsId, this.params).then(
          (res) => {
            this.commDetail = res.data.result;
          }
      );
    },
    toComment(id, grade) {
      uni.navigateTo({
        url: `/pages/product/comment?id=${ id }&grade=${ grade }`
      });
    },
    /**
     * Click the picture to enlarge or save
     */
    previewImg(url, index) {
      uni.previewImage({
        urls: url,
        indicator: 'number',
        current: index
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../product.scss";

.commImg {
  margin-right: 12 rpx;
  margin-bottom: 10 rpx;
  display: inline-block;
}

.name {
  color: #262626;
  font-size: 22 rpx;
}

.eva-section-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40 rpx 40 rpx 50 rpx;
  margin: 2px 0 20 rpx 0;
  background: #fff;

  text {
    width: 200 rpx;
    height: 50 rpx;
    font-size: 22 rpx;
    line-height: 46 rpx;
    text-align: center;
    color: #262626;
    border: 2 rpx solid #ededed;
    box-sizing: border-box;
    border-radius: 30px;
  }
}

.goodsNoMore {
  padding: 20 rpx 0;
  text-align: center;
  color: $u-tips-color;
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;

  background: #fff;

  .e-header {
    display: flex;
    align-items: baseline;

    font-size: $font-sm + 2rpx;
    color: $font-color-light;

    > .evaluate-num {
      margin-left: 10 rpx;
      font-size: 24 rpx;
      color: #333;
    }

    .tit {
      font-size: 32 rpx;
      color: $font-color-dark;
      font-weight: 500;
      margin: 0 4 rpx;
    }

    .tip {
      flex: 1;
      text-align: right;
      color: #8c8c8c;
      font-size: 24 rpx;
    }

    .icon-you {
      margin-left: 10 rpx;
    }
  }
}

.scroll-x {
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;

  overflow-x: auto;
}

.eva-box {
  padding: 36 rpx 0 30 rpx 0;
  border-bottom: 2 rpx solid #f2f2f2;

  .section-info {
    display: flex;
    align-items: center;

    .portrait {
      flex-shrink: 0;
      width: 80 rpx;
      height: 80 rpx;
      border-radius: 100px;
      margin-right: 20 rpx;
    }

    > view > text {
      margin-left: 6 rpx;
    }
  }

  .section-contant {
    display: flex;
    flex-direction: column;

    .con {
      font-size: 26 rpx;
      line-height: 46 rpx;
      color: $font-color-dark;
      color: #333;
      padding: 20 rpx 0;
    }

    .img {
    }

    .bot {
      display: flex;
      justify-content: space-between;
      font-size: 22 rpx;
      color: #999;
      margin-top: 20 rpx;
    }
  }
}
</style>

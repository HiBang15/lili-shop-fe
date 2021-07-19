<template>
  <view>
    <view class="exaluate-member-view">
      <view class="member-view">
        <view class="member-img">
          <u-image width="82rpx" style="border: 1px solid #ededed" height="82rpx" shape="circle" :src="comment.memberProfile ||'/static/missing-face.png'"> </u-image>
        </view>
        <view class="member-info">
          <view class="memName">{{ comment.memberName }}</view>
          <view class="creName">{{ comment.createTime }}</view>
        </view>
      </view>
      <view class="goods-view">
        <view class="goods-title">Product evaluation: {{ gradeList[comment.grade] }}</view>
        <view class="goods-subtitle">
          {{ comment.content }}
        </view>
        <!-- If there are pictures, the evaluation pictures will be displayed in a loop -->
        <view class="goods-imgs-view" v-if="comment.images != null && comment.images.length != 0">
          <view class="img-view" v-for="(img, imgIndex) in comment.images.split(',')" :key="imgIndex">
            <u-image @click.native="preview(comment.images.split(','),imgIndex)" width="160rpx" height="160rpx" :src="img"></u-image>
          </view>
        </view>
        <view class="goods-name">
          {{ comment.goodsName }}
        </view>
        <view class="goods-subtitle"></view>
        <view class="commentStyle" v-if="comment.reply">
          Merchant reply:
          <span class="addCommentSpan">{{ comment.reply }}</span>
          <view class="img">
            <!-- Circulate out the pictures of merchants replying to reviews -->
            <u-image width="140rpx" height="140rpx" v-if="comment.replyImage" v-for="(replyImg, replyIndex) in splitImg(comment.replyImage)" :src="replyImg" :key= "replyIndex"
              @click="preview(splitImg( comment.replyImage), index)">
            </u-image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      comment: {}, //Comment information
      gradeList: {
        //Evaluation grade
        GOOD: "Very Good",
        MODERATE: "Intermediate Review",
        WORSE: "Bad review",
        haveImage: "There are pictures",
      },
    };
  },
  onLoad(options) {
    this.comment = JSON.parse(decodeURIComponent(options.comment));
  },
  methods: {
    /**
     * Cut image
     */
    splitImg(val) {
      if (val && val.split(",")) {
        return val.split(",");
      } else if (val) {
        return val;
      } else {
        return false;
      }
    },
    /**
     * Click the picture to enlarge or save
     */
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ["Save Picture"],
          success: function (data) {},
          fail: function (err) {},
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.commentStyle {
  margin-top: 16rpx;
  padding: 14rpx 26rpx;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 22rpx;
  font-weight: 700;
  text-align: left;
  line-height: 40rpx;
}
.img {
  display: flex;
  flex-wrap: wrap;
  /* height: 140rpx; */
  overflow: hidden;
  margin: 10rpx 0;

  image {
    width: 166rpx;
    height: 166rpx;
    margin: 0 15rpx 15rpx 0;

    &:nth-of-type(3n + 0) {
      margin: 0 0 15rpx 0;
    }
  }
}

.addCommentSpan {
  color: $u-tips-color !important;
  padding-left: 20rpx;
}
.memName {
  font-size: 28rpx;
}

.goods-name {
  border-bottom: 1px solid #ededed;
  padding-bottom: 30rpx;
}
.creName,
.goods-name {
  font-size: 24rpx;
  color: $u-tips-color;
}
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.exaluate-member-view {
  background-color: #fff;
  margin-top: 12rpx;
  padding: 20rpx;
  .member-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    .member-img {
      width: 100rpx;
      margin: 20rpx;
    }
    .member-info {
      margin-left: 15rpx;
    }
  }
  .goods-view {
    margin-left: 15rpx;
  }
}
.border-bottom {
  padding-bottom: 20rpx;
  border-bottom: 1px solid #ededed;
}
.goods-title {
  margin-bottom: 10rpx;
}
.goods-subtitle {
  margin-bottom: 20rpx;
  color: #909399;
}
.goods-imgs-view {
  margin: 20rpx 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  .img-view {
    margin-right: 15rpx;
  }
}
</style>

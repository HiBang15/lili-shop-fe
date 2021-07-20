<template>
  <view class="comment">
    <view class="top-tab">
      <view class="tab-btn" :v-if="commentDetail">
        <view @click="select(0)" :class="{ cur: selectIndex == 0 }">All</view>
        <view @click="select(1)" :class="{ cur: selectIndex == 1 }">Praise {{ commentDetail.good }}</view>
        <view @click="select(2)" :class="{ cur: selectIndex == 2 }">Medium comment {{ commentDetail.moderate }}</view>
        <view @click="select(3)" :class="{ cur: selectIndex == 3 }">Bad review{{ commentDetail.worse }}</view>
        <view @click="select(4)" :class="{ cur: selectIndex == 4 }">There are pictures{{
            commentDetail.haveImage
          }}
        </view>
      </view>
    </view>
    <!-- Evaluation -->
    <div class="goodsBoxOver">
      <div class="scoll-page">
        <view class="eva-section">
          <div class="empty" v-if="commDetail.length <1">
            <view>
              <u-empty mode="message" text="Like no comment"></u-empty>
            </view>
          </div>
          <view class="eva-box" v-for="(item, index) in commDetail" :key="index">
            <view class="section-info">
              <image class="portrait" :src="item.memberProfile ||'/static/missing-face.png'" mode="aspectFill"></image>
              <view class="star-content">
                <text class="name">{{ item.memberName | noPassByName }}</text>
                <text class="time">{{ item.createTime }}</text>
              </view>
              <view class="stars">
                <text :class="{ star: item.deliveryScore> 0 }"></text>
                <text :class="{ star: item.deliveryScore> 1 }"></text>
                <text :class="{ star: item.deliveryScore> 2 }"></text>
                <text :class="{ star: item.deliveryScore> 3 }"></text>
                <text :class="{ star: item.deliveryScore> 4 }"></text>
              </view>
            </view>
            <view class="section-contant">
              <div class="content">{{ item.content }}</div>
              <view class="img">
                <!-- Loop out the pictures of user reviews -->
                <u-image width="140rpx" height="140rpx" v-if="item.images" v-for="(img, i) in splitImg(item.images)"
                         :src="img" :key="i" @click="preview(splitImg(item.images), i)">
                </u-image>
              </view>
              <view class="bot">
                <text class="attr">{{ item.goodsName }}-{{ gradeList[item.grade] }}</text>
              </view>
            </view>
            <view class="commentStyle" v-if="item.reply">
              Merchant reply:
              <span class="addCommentSpan">{{ item.reply }}</span>
              <view class="img">
                <!-- Circulate out the pictures of merchants replying to reviews -->
                <u-image width="140rpx" height="140rpx" v-if="item.replyImage"
                         v-for="(replyImg, replyIndex) in splitImg(item.replyImage)" :src="replyImg" :key="replyIndex"
                         @click="preview(splitImg( item.replyImage), index)">
                </u-image>
              </view>
            </view>
          </view>
          <u-loadmore bg-color="transparent" style="margin:40rpx 0" :status="status" @loadmore="loadmore()"
                      icon-type="iconType" />
        </view>
      </div>
    </div>
  </view>
</template>

<script>
// import { getGoodsDetail } from '@/api/goods.js';
import * as membersApi from '@/api/members.js';

export default {
  data() {
    return {
      status: 'loadmore', //Refresh status at the bottom
      commentDetail: '', //review details
      selectIndex: '0', //Search conditions
      params: {// Comment page submission data
        pageNumber: 1,
        pageSize: 10,
        grade: ''
      },
      gradeList: {
        GOOD: 'Very Good',
        MODERATE: 'Intermediate Review',
        WORSE: 'Bad review',
        HAVEIMAGE: 'There are pictures'
      },
      // Comment details
      commDetail: [],
      dataTotal: 0, //Total total number of comments
      opid: '' //Upper-level parameter id
    };
  },
  async onLoad(options) {
    this.getGoodsCommentsFun(options.id);
    this.getGoodsCommentsNum(options.id);
    this.opid = options.id;
  },

  /**
   * Bottom loading
   */
  onReachBottom() {
    this.params.pageNumber++;
    this.getGoodsCommentsFun(this.opid);
  },

  methods: {
    /**
     * Cut image
     */
    splitImg(val) {
      if (val && val.split(',')) {
        return val.split(',');
      } else if (val) {
        return val;
      } else {
        return false;
      }
    },

    /**
     * Get product reviews
     */
    getGoodsCommentsFun(id) {
      this.status = 'loading';
      // getGoodsComments
      membersApi.getGoodsComments(id, this.params).then((res) => {
        if (
            res.data.result.records == [] ||
            res.data.result.records == '' ||
            res.data.result.records == null
        ) {
          this.status = 'noMore';
          return false;
        }
        this.commDetail = this.commDetail.concat(res.data.result.records);
        this.dataTotal = res.data.result.total;
        this.status = 'loadmore';
      });
    },

    /**
     * Get the number of product reviews
     */
    getGoodsCommentsNum(id) {
      membersApi.getGoodsCommentsCount(id).then((res) => {
        if (res.statusCode === 200) {
          this.commentDetail = res.data.result;
        }
      });
    },

    /**
     * Top filter
     */
    select(index) {
      this.selectIndex = index;
      this.params.grade = ['', 'GOOD', 'MODERATE', 'WORSE', ''][
          this.selectIndex
          ];
      this.selectIndex == 4 ? (this.params.haveImage = 1) : true;
      this.params.pageNumber = 1;
      this.params.pageSize = 10;
      this.commDetail = [];
      if (this.selectIndex == 0) {
        this.params = {
          pageNumber: 1,
          pageSize: 10,
          grade: ''
        };
      }
      // Reload comments
      this.getGoodsCommentsFun(this.opid);
    },

    /**
     * Click the picture to enlarge or save
     */
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ['Save Picture'],
          success: function (data) {
            uni.showToast({
              title: 'Saved successfully',
              duration: 2000,
              icon: 'none'
            });
          },
          fail: function (err) {
            uni.showToast({
              title: 'Save failed',
              duration: 2000,
              icon: 'none'
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.commentStyle {
  margin-top: 16 rpx;
  padding: 14 rpx 26 rpx;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 22 rpx;
  font-weight: 700;
  text-align: left;
  line-height: 40 rpx;
}

.addCommentSpan {
  color: $u-tips-color !important;
  padding-left: 20 rpx;
}

.img {
  display: flex;
  flex-wrap: wrap;
  /* height: 140rpx; */
  overflow: hidden;

  image {
    width: 166 rpx;
    height: 166 rpx;
    margin: 0 15 rpx 15 rpx 0;

    &:nth-of-type(3n + 0) {
      margin: 0 0 15 rpx 0;
    }
  }
}

.goodsBoxOver {
  overflow-y: scroll;
}

page {
  background: #f7f7f7;
}

.comment {
  color: #333;
  background: #f7f7f7;

  overflow: hidden;

  .top-tab {
    background: #fff;
    margin-bottom: 10 rpx;
    border-radius: 20 rpx;
    display: flex;
    flex-direction: column;
    padding: 0 30 rpx 0 30 rpx;
    font-size: 24 rpx;

    .tab-btn {
      margin-top: 20 rpx;
      display: flex;
      flex-wrap: wrap;

      view {
        min-width: 118 rpx;
        text-align: center;
        height: 50 rpx;
        line-height: 50 rpx;
        padding: 0 10 rpx;
        background: #f8f8fe;
        border-radius: 25 rpx;
        margin: 0 20 rpx 30 rpx 0;

        &.cur {
          background: $aider-light-color;
          color: #fff;
        }
      }
    }
  }

  .eva-section {
    padding: 20 rpx 0;

    .eva-box {
      padding: 40 rpx;
      margin-bottom: 10 rpx;
      background: #fff;
      border-radius: 20 rpx;
      /* star */
      .star-content {
        display: flex;
        flex-direction: column;

        view {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .time {
          font-size: 24 rpx;
          color: #999;
        }
      }

      .section-info {
        display: flex;

        .stars {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .star {
            width: 30 rpx;
            height: 30 rpx;
            background: url("/static/star.png");
            background-size: 100%;
          }
        }

        .portrait {
          flex-shrink: 0;
          width: 80 rpx;
          height: 80 rpx;
          border-radius: 100px;
          margin-right: 20 rpx;
        }
      }

      .section-contant {
        display: flex;
        flex-direction: column;

        .content {
          font-size: 24 rpx;
          line-height: 46 rpx;
          font-weight: 400;
          color: $font-color-dark;
          color: #333;
          padding: 26 rpx 0;
        }

        .img {
          display: flex;
          flex-wrap: wrap;
          /* height: 140rpx; */
          overflow: hidden;

          > * {
            margin-right: 16 rpx;
          }
        }

        .bot {
          display: flex;
          justify-content: space-between;
          font-size: $font-sm;
          color: $font-color-light;
          margin-top: 20 rpx;


        }
      }
    }
  }
}

.empty {
  padding-top: 300 rpx;
  color: #999999;
  text-align: center;
}
</style>

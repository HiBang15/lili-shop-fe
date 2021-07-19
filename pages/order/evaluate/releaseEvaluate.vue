<template>
  <view>
    <!-- Traverse the evaluation product -->
    <view v-for="(sku, index) in order.orderItems" :key="index">
      <view class="after-sales-goods-detail-view">
        <view>
          <view class="goods-item-view">
            <view class="goods-img">
              <u-image border-radius="6" width="131rpx" height="131rpx" :src="sku.image" />
            </view>
            <view class="goods-info">
              <view class="goods-title u-line-2">{{ sku.name }}</view>
              <view class="goods-price">
                <view>x{{ sku.num }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="goods-evaluate-view">
        <view class="goods-view">
          <view>Product evaluation</view>
          <view class="sub-title">If you are satisfied, please give a good comment</view>
        </view>
        <view class="rate-view">
          <view class="rate-btn" @click="onGrade('GOOD', index)">
            <view style="font-size: 42rpx" :style="{ color: form.grade ==='GOOD'?'red':'#CCCCCC' }" class="alifont icon-haoping1"></view >
            <text>Praise</text>
          </view>
          <view class="rate-btn" @click="onGrade('MODERATE', index)">
            <view style="font-size: 42rpx" :style="{ color: form.grade ==='MODERATE'?'red':'#CCCCCC' }" class="alifont icon-zhongping1"></view >
            <text>Medium review</text>
          </view>
          <view class="rate-btn" @click="onGrade('WORSE', index)">
            <view style="font-size: 42rpx" :style="{ color: form.grade ==='WORSE'?'red':'#CCCCCC' }" class="alifont icon-chaping"></view >
            <text>Bad review</text>
          </view>
        </view>
      </view>
      <view class="info-evaluate-view">
        <view class="input-view">
          <u-input v-model="form.content" height="200" placeholder-style="font-size:12px;color:#CCCCCC" :type="type" :border="border" :maxlength=" maxlength" :placeholder="placeholder" />
        </view>
        <view class="input-num">
          <text>{{ form.content.length }}/{{ maxlength }}</text>
        </view>
      </view>
      <view class="info-evaluate-view">
        <view class="images-view">
          <u-upload :header=" {accessToken: storage.getAccessToken() }" :action="action" width="150" @on-uploaded="onUploaded" :max-count="5" :show-progress= "false"></u-upload>
        </view>
      </view>
    </view>
    <view class="info-evaluate-view" style="margin-bottom: 150rpx">
      <view class="info-header">Store rating</view>
      <view>
        <view class="seller-rate-view">
          <view class="rate-title">The description matches</view>
          <view>
            <u-rate count="count" gutter="20" active-color="#FFC71C" v-model="form.descriptionScore" :size="40"></u-rate>
          </view>
        </view>
        <view class="seller-rate-view">
          <view class="rate-title">Service attitude</view>
          <view>
            <u-rate count="count" gutter="20" active-color="#FFC71C" v-model="form.serviceScore" :size="40"></u-rate>
          </view>
        </view>
        <view class="seller-rate-view">
          <view class="rate-title">Logistics service</view>
          <view>
            <u-rate count="count" gutter="20" active-color="#FFC71C" v-model="form.deliveryScore" :size="40"></u-rate>
          </view>
        </view>
      </view>
    </view>
    <view class="onSubmit" @click="onSubmit"> Submit application</view>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
import storage from "@/utils/storage.js";
import {commentsMemberOrder} from "@/api/members.js";
import {upload} from "@/api/common.js";

export default {
  data() {
    return {
      storage,
      type: "textarea", //The input box status is textarea
      border: false, //No border
      maxlength: 500, //The maximum number of words in the evaluation is 500 words
      placeholder:
        "Does the baby meet your expectations? Tell me about its advantages and its shortcomings. Your evaluation will help more people",
      order: {}, //Order information
      form: {
        content: "", //Evaluation details
        goodsId: "", //goods id
        grade: "GOOD", //The default is good grade
        orderItemSn: "", //The sn of the product
        skuId: "", //Product skuId
        descriptionScore: 5, //The default description score is 5 points
        serviceScore: 5, //The default service score is 5 points
        deliveryScore: 5, //The default logistics score is 5 points
      },
      action: upload, //Image upload address
    };
  },
  onLoad(options) {
    // Get the data passed from the previous level for analysis
    this.form.orderItemSn = options.sn;
    this.order = JSON.parse(decodeURIComponent(options.order));
    this.form.goodsId = this.order.orderItems[0].goodsId;
    this.form.orderItemSn = this.order.orderItems[0].sn;
    this.form.skuId = this.order.orderItems[0].skuId;
  },
  methods: {
    /**
     * Click to rate
     */
    onGrade(grade) {
      this.form.grade = grade;
    },

    /**
     * Submit review
     */
    onSubmit() {
      uni.showLoading({
        title: "Loading",
      });
      commentsMemberOrder(this.form).then((res) => {
        uni.hideLoading();
        if (res.data.success) {
          uni.showToast({
            title: "Post evaluation success",
            duration: 2000,
            icon: "none",
            success: () => {
              setTimeout(() => {
                uni.navigateBack();
              }, 2000);
            },
          });
        }
      });
    },

    /**
     * Call back after the picture is successful
     */
    onUploaded(lists) {
      let images = [];
      lists.forEach((item) => {
        images.push(item.response.result);
      });
      this.form.images = images;
    },
  },
};
</script>

<style lang="scss" scoped>
page,
.content {
  background: $page-color-base;
  height: 100%;
  margin-bottom: 100rpx;
}
.onSubmit {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  background: $aider-light-color;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 100px;
}
.after-sales-goods-detail-view {
  background-color: #f4f4f5;
  padding: 10rpx 0rpx;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-bottom: 20rpx;
    .header-text {
      background-color: #f4f4f5;
      padding: 10rpx 30rpx;
      border-radius: 50rpx;
      .seller-name {
        color: $main-color;
        font-weight: 600;
      }
    }
  }
  .goods-item-view {
    display: flex;
    flex-direction: row;
    padding: 10rpx 30rpx;
    background-color: #eef1f2;
    .goods-img {
    }
    .goods-info {
      padding-left: 30rpx;
      flex: 1;
      .goods-title {
        margin-bottom: 10rpx;
        color: $font-color-dark;
      }
      .goods-specs {
        font-size: 24rpx;
        margin-bottom: 10rpx;
        color: #cccccc;
      }
      .goods-price {
        font-size: 28rpx;
        margin-bottom: 10rpx;
        color: $light-color;
      }
    }
    .goods-num {
      width: 60rpx;
      color: $main-color;
    }
  }
  .after-num {
    margin: 0rpx 30rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
  }
}
.goods-evaluate-view {
  margin-top: 8rpx;
  padding: 20rpx;
  margin-bottom: 5rpx;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  .goods-view {
    width: 250rpx;
    font-size: 28rpx;
    color: #333333;
    .sub-title {
      font-size: 22rpx;
      color: #cccccc;
    }
  }
  .rate-view {
    color: #333333;
    display: flex;
    flex-direction: row;
    align-items: center;
    .rate-btn {
      margin: 0rpx 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      text {
        margin-left: 10rpx;
      }
    }
  }
}
.info-evaluate-view {
  margin-top: 8rpx;
  padding: 20rpx;
  background-color: #fff;
  align-items: center;
  font-size: 24rpx;
  .input-view {
    width: 100%;
  }
  .input-num {
    color: #cccccc;
    text-align: right;
  }
  .images-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .info-header {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 30rpx;
  }
  .seller-rate-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    .rate-title {
      line-height: 70rpx;
      width: 150rpx;
      font-size: 26rpx;
      color: #333333;
    }
  }
}

.submit-view {
  position: fixed;
  z-index: 999;
  bottom: 0px;
  left: 0px;
  margin-top: 100rpx;
  border: solid 2rpx #f2f2f2;
  background-color: #ffffff;
  height: 100rpx;
  width: 750rpx;
  align-items: center;
  padding: 0rpx 20rpx;
}
</style>

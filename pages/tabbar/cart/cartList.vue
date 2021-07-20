<template>
  <div class="wrapper">
    <u-navbar :isBack="false" title="shopping cart"></u-navbar>
    <!-- Blank page-->
    <view v-if="cartDetail.cartList =='' || cartDetail.cartList == [] || !cartDetail" class="empty">
      <image src="/static/emptyCart.png" mode="aspectFit"></image>
      <view class="empty-tips">
        Empty
        <navigator class="navigator" url="/pages/tabbar/home/index" open-type="switchTab">Wander around></navigator>
      </view>
    </view>

    <!-- Store product information -->
    <div class="content">
      <div class="box box2" :class="{ invalid: isInvalid(item) }" v-for="(item, index) in cartDetail.cartList"
           :key="index">
        <view class="tab">
          <view class="store-line">
            <u-checkbox-group class="store-line-check">
              <!-- #ifndef MP-WEIXIN -->
              <u-checkbox shape="circle" :active-color="lightColor" v-model="item.checked"
                          @change="checkboxChangeDP(item)"></u-checkbox>
              <!-- #endif -->
              <!-- There is a problem with the v-model in the WeChat applet, use: value -->
              <!-- #ifdef MP-WEIXIN -->
              <u-checkbox shape="circle" :active-color="lightColor" :value="item.checked"
                          @change="checkboxChangeDP(item)"></u-checkbox>
              <!-- #endif -->
            </u-checkbox-group>
            <span class="storeName store-line-desc" @click.stop="navigateToStore(item)">{{
                item.storeName
              }}</span>
          </view>
          <view class="right_Col" @click="navigateToConpon(item)">
            <div class="right_Line"></div>
            <span>Lead Voucher</span>
          </view>
        </view>
        <u-swipe-action :show="skuItem.selected" @open="openAction(skuItem)" :options="options" bg-color="#fff"
                        ref="swiperAction" class="cartItem" v-for="(skuItem, i) in item.skuList" :index="i"
                        :key="skuItem.goodsSku.id" @click="changeActionTab(skuItem)"
                        @longpress="changeActionTab(skuItem)">
          <!-- Full reduction activity -->
          <div v-if="skuItem.promotions" v-for="(fullDiscount,fullDiscountIndex) in skuItem.promotions"
               :key="fullDiscountIndex">
            <div v-if="fullDiscount.promotionType =='FULL_DISCOUNT'">
              <div class="promotion-notice" v-if="item.promotionNotice">
                <span class="tips">Full reduction</span>
                <span style="flex:10;">{{ item.promotionNotice }}</span>
              </div>
            </div>
          </div>
          <view class="goods-row" :class="{ invalid: isInvalid(skuItem) }">
            <view class="goods-config">
              <view>
                <u-checkbox-group v-if="skuItem.invalid == 0">
                  <!-- #ifndef MP-WEIXIN -->
                  <u-checkbox shape="circle" :active-color="lightColor" class="c-left" v-model="skuItem.checked"
                              @change="checkboxChange(skuItem)"></u-checkbox>
                  <!-- #endif -->
                  <!-- There is a problem with the v-model in the WeChat applet, use: value -->
                  <!-- #ifdef MP-WEIXIN -->
                  <u-checkbox shape="circle" :active-color="lightColor" class="c-left" :value="skuItem.checked"
                              @change="checkboxChange(skuItem)"></u-checkbox>
                  <!-- #endif -->
                </u-checkbox-group>
                <span class="invalid" v-else style="font-size: 24rpx">Invalid</span>
              </view>
              <u-image border-radius="20" :fade="true" @click.native="navigateToGoods(skuItem)" width="200rpx"
                       height="200rpx" :src="skuItem.goodsSku.thumbnail" @click="navigateToGoods(skuItem)" />
            </view>
            <view class="goods-content">
              <!-- Product name -->
              <p class="sp-name" @click="navigateToGoods(skuItem)">
                {{ skuItem.goodsSku.goodsName }}
              </p>
              <!-- Specifications -->
              <p class="sp-type">{{ skuItem.goodsSku.simpleSpecs }}</p>
              <p class="sp-number">
                <view class="sp-price">
              <div class="default-color" :class="{'theme-color':skuItem.promotions.length <=0 }">
                ￥<span>{{ formatPrice(skuItem.goodsSku.price)[0] }}</span>
                <span>.{{ formatPrice(skuItem.goodsSku.price)[1] }}</span>
              </div>
            </view>
            <view>
              <!-- #ifndef MP-WEIXIN -->
              <u-number-box class="uNumber" :min="1" input-width="70" input-height="40" size="20" v-model="skuItem.num"
                            @change="numChange (skuItem)"></u-number-box>
              <!-- #endif -->
              <!-- #ifdef MP-WEIXIN -->
              <u-number-box class="uNumber" :min="1" input-width="70" input-height="40" size="20" :value="skuItem.num"
                            @plus="numChange( skuItem, '1')" @change="numChange_WEIXIN" :skuItem="skuItem"
                            @minus="numChange(skuItem, '0')"></u-number-box>
              <!-- #endif -->
            </view>
            <!-- If there is a promotion and the promotion is for a limited time -->
            <!-- promotions -->
            <div class="promotions-list" v-if="skuItem.promotions" v-for="(seckill,seckillIndex) in skuItem.promotions"
                 :key="seckillIndex">
              <div class="promotions-item-seckill" v-if="seckill.promotionType =='SECKILL'">
                To the end of the spike:
                <u-count-down show-border :hide-zero-day="true" :color="$mainColor" border-color="#ededed"
                              font-size="24" :timestamp="getCountDownTime (seckill.endTime)">
                </u-count-down>
              </div>

            </div>

            <!-- If there is activity and it is selected, the estimated price will be displayed -->
            <div class="priceDetail-flowPrice" :class="{'theme-color':skuItem.priceDetailDTO}"
                 v-if="skuItem.priceDetailDTO && skuItem.invalid == 0 && skuItem.promotions.length!=0 && skuItem.checked && skuItem.checked">
              Estimated hand price ￥<span>{{ formatPrice(skuItem.priceDetailDTO.flowPrice)[0] }}</span>
              <span>.{{ formatPrice(skuItem.priceDetailDTO.flowPrice)[1] }} </span>
            </div>

          </view>
          </view>
        </u-swipe-action>
      </div>
    </div>
    <u-modal v-model="deleteShow" :confirm-style="{'color':lightColor}" @confirm="delectConfirm" show-cancel-button
             :content="deleteContent" :async-close="true"></u-modal>
    <!-- Checkout -->
    <div class="box box6">
      <view class="navL">
        <u-checkbox shape="circle" :active-color="lightColor" v-model="checkout" @change="checkOut()" label-size="24">
          Select all
        </u-checkbox>
        <span class="price">
          <div class="prices">
            <div class="fullPrice">
              <span class="number" v-if="cartDetail && cartDetail.priceDetailDTO">
                Total: <span>¥{{
                  formatPrice(cartDetail.priceDetailDTO.flowPrice)[0]
                }}</span>.<span>{{ formatPrice(cartDetail.priceDetailDTO.flowPrice)[1] }}</span>
              </span>
              <span class="number" v-else>Total: 0.00</span>
            </div>
            <div
                v-if="cartDetail.cartList && cartDetail.cartList.length!=0 && cartDetail.priceDetailDTO && cartDetail.priceDetailDTO.discountPrice!=0 "
                class="discountPrice">
              <span>Offer discount: ¥{{ (cartDetail.priceDetailDTO.goodsPrice - cartDetail.priceDetailDTO.flowPrice) | unitPrice }} </span>
              <span class="discountDetails" @click="discountDetails">Discount Details</span>
            </div>
          </div>
        </span>
      </view>
      <!-- Offer details -->
      <u-popup z-index="3" close mode="bottom" height="50%" closeable v-model="discountDetailsFlag" border-radius="20">
        <div class="discount-list">
          <view class="discount-title">Discount details</view>
          <div class="discount-way">
            <div class="discount-item" v-if="cartDetail.priceDetailDTO">
              <span>Total merchandise</span>
              <span>￥{{ cartDetail.priceDetailDTO.goodsPrice | unitPrice }}</span>

            </div>
            <div class="discount-item" v-if="cartDetail.priceDetailDTO">
              <span>Coupon</span>
              <span>-￥{{ cartDetail.priceDetailDTO.couponPrice | unitPrice }}</span>
            </div>
            <div class="discount-item" v-if="cartDetail.priceDetailDTO">
              <span>Other offers</span>
              <span>-￥{{ cartDetail.priceDetailDTO.discountPrice | unitPrice }}</span>
            </div>
          </div>
        </div>
      </u-popup>

      <view v-if="isEdit" @click="deleteGoods()">
        <div class="settlement">Delete</div>
      </view>

      <view v-else @click="submitOrder()">
        <div class="settlement">Go to checkout</div>
      </view>
    </div>
    <u-toast ref="uToast" />
  </div>
</template>

<script>
import * as API_Trade from '@/api/trade';

export default {
  data() {
    return {
      lightColor: this.$lightColor,
      discountDetailsFlag: false, //Discount details switch
      // Slide button on the right side of the commodity bar
      options: [
        {
          text: 'Delete',
          style: {
            backgroundColor: this.$lightColor //Highlight color
          }
        }
      ],
      isInvalid(val) {
        //Whether the product is invalid
        if (val.invalid == 1) {
          return true;
        } else {
          return false;
        }
      },
      deleteShow: false, //Swipe right to delete
      deleteContent: 'Delete this product?', //Delete the displayed information
      cartDetail: '', //shopping cart details
      goodsVal: '', //Details of a single product
      isEdit: false, // is it edit
      checkout: true, //Select all button
      WEIXIN_num: '' //Shopping cart is compatible with WeChat stepper
    };
  },
  mounted() {
    // #ifdef MP-WEIXIN
    // Mini Programs are shared by default
    uni.showShareMenu({withShareTicket: true});
    // #endif
  },
  /**
   * Initialization information
   */
  onShow() {
    this.deleteShow ? (this.deleteShow = false) : true;
    if (this.$refs.swiperAction) {
      this.$refs.swiperAction.forEach((item, index) => {
        item.show = false;
      });

      this.getCardData();
    } else {
      this.getCardData();
    }
  },
  methods: {
    /**
     * countdown
     */
    getCountDownTime(val) {
      let date = new Date(val.replace(/-/g, '/'));
      let timeSimple = new Date(date).getTime() / 1000;
      return timeSimple - new Date().getTime() / 1000;
    },

    /**
     * Discount details switch
     */
    discountDetails() {
      this.discountDetailsFlag = true;
    },

    /**
     * Format money 1999 --> [1999,00]
     */
    formatPrice(val) {
      if (typeof val == 'undefined') {
        return val;
      }
      return val.toFixed(2).split('.');
    },

    /**
     * Swipe left to open delete
     */
    openAction(skuItem) {
      /**How ​​many shops are there in the cycle parent */
      this.cartDetail.cartList.forEach((cartItem) => {
        if (cartItem.skuList) {
          cartItem.skuList.forEach((sku) => {
            this.$set(sku, 'selected', false);
          });
        }
      });
      this.$set(skuItem, 'selected', true);
    },

    /**
     * Swipe to delete
     */
    changeActionTab(val) {
      this.deleteShow = true;
      this.goodsVal = val;
    },

    /**
     * Click to delete
     */
    delectConfirm() {
      API_Trade.deleteSkuItem(this.goodsVal.goodsSku.id).then((res) => {
        if (res.statusCode == 200) {
          uni.showToast({
            title: 'This product was successfully deleted',
            duration: 2000
          });
          this.deleteShow = false;
          this.getCardData();
        }
      });
    },

    /**
     * Delete product
     */
    deleteGoods() {
      if (this.whetherChecked()) {
        var delGoodsData = [];
        this.cartDetail.cartList.forEach((item) => {
          item.skuList.forEach((goodsItem) => {
            if (goodsItem.checked) {
              delGoodsData.push(goodsItem.goodsSku.id);
            }
          });
        });
        if (delGoodsData && delGoodsData.length > 0) {
          // execute delete
          API_Trade.deleteSkuItem(delGoodsData).then((res) => {
            if (res.data.success) {
              uni.showToast({
                title: 'Delete successfully!',
                icon: 'none'
              });
              this.getCardData();
            }
          });
        } else {
          uni.showToast({
            title: 'Please choose to delete the product, if the product is invalid, please swipe left to delete the invalid product',
            icon: 'none'
          });
        }
      }
    },

    /**
     * Jump to shop
     */
    navigateToStore(val) {
      uni.navigateTo({
        url: '../product/shopPage?id=' + val.storeId
      });
    },

    /**
     * Jump to coupon
     */
    navigateToConpon(val) {
      uni.navigateTo({
        url: '/pages/cart/coupon/couponCenter?storeId=' + val.storeId
      });
    },

    /**
     * Jump to product
     */
    navigateToGoods(val) {
      uni.navigateTo({
        url:
            '/pages/product/goods?id=' +
            val.goodsSku.id +
            '&goodsId=' +
            val.goodsSku.goodsId
      });
    },

    /**
     * Click the stepper WeChat callback
     */
    numChange_WEIXIN(callback) {
      this.WEIXIN_num = callback.value;
      this.numChange(callback.data, '3');
    },

    /**
     * Click the stepper callback
     */
    numChange(val, nums) {
      // #ifdef MP-WEIXIN
      if (nums && nums == '1') {
        val.num++;
      } else if (nums && nums == '0') {
        val.num--;
      } else if (nums && nums == '3') {
        val.num = this.WEIXIN_num;
      }
      // #endif
      this.updateSkuNumFun(val.goodsSku.id, val.num);
    },

    /**
     * Go to settlement
     */
    submitOrder() {
      if (this.whetherChecked()) {
        this.navigateTo('/pages/order/fillorder?way=CART');
      }
    },

    /**
     * Verify that the product is selected
     */
    whetherChecked() {
      let canBuy = false;
      this.cartDetail.cartList.forEach((item) => {
        if (item.checked) {
          canBuy = true;
        } else {
          item.skuList.forEach((skuItem) => {
            if (skuItem.checked) {
              canBuy = true;
            }
          });
        }
      });
      if (!canBuy) {
        uni.showToast({
          title: 'You have not selected a product',
          duration: 2000,
          icon: 'none'
        });
        return false;
      } else {
        return true;
      }
    },

    /**
     * Jump
     */
    navigateTo(url) {
      uni.navigateTo({
        url
      });
    },

    /**
     * select all
     */
    checkOut() {
      API_Trade.checkAll(this.checkout).then((result) => {
        if (result.data.success) {
          this.getCardData();
          return true;
        }
      });
    },

    /**
     * Get the selected information of the store
     */
    checkStoreFun(skuId, num) {
      API_Trade.checkStore(skuId, num).then((result) => {
        if (result.data.success) {
          this.getCardData();
        }
      });
    },

    /**
     * Shop click
     */
    checkboxChangeDP(e) {
      // #ifdef MP-WEIXIN
      e.checked = !e.checked;
      // #endif
      this.checkStoreFun(e.storeId, e.checked);
    },

    /**
     * Get the selected information of the shopping cart
     */
    updateSkuCheckedFun(skuId, num) {
      API_Trade.updateSkuChecked(skuId, num).then((result) => {
        if (result.data.success) {
          this.getCardData();
        }
      });
    },

    /**
     * Update the number of items in the shopping cart
     */
    updateSkuNumFun(skuId, num) {
      API_Trade.updateSkuNum(skuId, num).then((result) => {
        if (result.statusCode == 200) {
          this.getCardData();
        } else {
          let _this = this;
          setTimeout(() => {
            _this.getCardData();
          }, 1000);
        }
      });
    },

    /**
     * Get shopping cart data
     */
    getCardData() {
      if (this.$options.filters.isLogin('auth')) {
        uni.showLoading({
          title: 'Loading'
        });
        API_Trade.getCarts()
            .then((result) => {
              if (result.data.success) {
                this.cartDetail = result.data.result;
                this.checkout = true;
                for (let i = 0; i < this.cartDetail.cartList.length; i++) {
                  let item = this.cartDetail.cartList[i];
                  // Circulate whether the current products are all selected
                  if (item.checked == 0) {
                    this.checkout = false;
                  }
                  // If there is a group event, delete it by the way
                  item.skuList &&
                  item.skuList.forEach((sku) => {
                    sku.promotions &&
                    sku.promotions.forEach((pro, proIndex) => {
                      if (pro.promotionType == 'PINTUAN') {
                        sku.promotions.splice(proIndex, 1);
                      }
                    });
                  });
                }
                uni.stopPullDownRefresh();
              }
            })
            .catch((err) => {
            });
        uni.hideLoading();
      } else {
        uni.hideLoading();
      }
    },

    /**
     * When a check box is selected, it is triggered by the checkbox
     */
    checkboxChange(e) {
      // #ifdef MP-WEIXIN
      e.checked = !e.checked;
      // #endif
      this.updateSkuCheckedFun(e.goodsSku.id, e.checked);
    }
  }
};
</script>

<style scoped lang="scss">
// #ifdef MP-WEIXIN
@import "./mp-carui.scss";
// #endif
.u-image {
  box-shadow: 0 4 rpx 12 rpx 0 rgba(0, 0, 0, 0.05);
}

.promotion-notice {
  margin-left: 68 rpx;
  font-size: 24 rpx;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;

  /deep/ .tips {
    margin: 0 8 rpx 0 0;
    background: $main-color;
    border-radius: 100px;
    display: block;
    flex: 1;
    padding: 2 rpx 12 rpx;
    color: #fff;
  }
}

.promotionNotice {
  font-size: 24 rpx;
}

.goods-row {
  padding: 30 rpx 0;

  display: flex;
  align-items: center;
}

.storeName {
  font-weight: bold;
}

.invalid {
  filter: grayscale(1);
}

.cartItem {
  border-radius: 0.4em;
  transition: 0.35s;
}

.index {
  padding-top: var(--status-bar-height);
}

/* 空白页 */
/deep/ .u-number-input {
  background: #fff !important;
  border: 1px solid #ededed;
  margin: 0 !important;
}

/deep/ .u-icon-minus,
/deep/ .u-icon-plus {
  background: #ffffff !important;
  border: 1px solid #ededed;
  color: #333 !important;
  width: 40 rpx;
}

.empty {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 99;
  padding-bottom: 100 rpx;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;

  image {
    width: 240 rpx;
    height: 160 rpx;
    margin-bottom: 30 rpx;
  }

  .empty-tips {
    display: flex;
    font-size: $font-sm + 2rpx;
    color: $font-color-disabled;

    .navigator {
      color: $uni-color-primary;
      margin-left: 16 rpx;
    }
  }
}

.settlement {
  width: 180 rpx;
  height: 70 rpx;
  line-height: 70 rpx;
  background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
  border-radius: 900 rpx;
  text-align: center;
  color: #fff;
  margin-right: 10 rpx;
}

.price {
  display: flex;
  align-items: center;

  /deep/ .number {
    line-height: 1;
    font-size: 30 rpx;

    > span {
      font-weight: bold;
    }
  }
}

.box2 {
  border-radius: 30 rpx;
  padding: 32 rpx 40 rpx 32 rpx;

  .u-checkbox {
    display: flex;
    align-items: center;
    text-align: center;
  }

  background: #fff;
  margin-bottom: 20 rpx;
}

.wrapper {
  height: 100%;
}

/deep/ .u-col {
  padding: 24 rpx 0 !important;
}

.goods-content {
  width: 100%;
  height: 100%;
  overflow: hidden;

  > p {
    padding-left: 20 rpx;
  }
}

.allCheck {
  // padding: 0 10rpx;
  font-size: 24 rpx;
}

.content {
  padding: 20 rpx 0 20 rpx 0;
  margin-bottom: 80 rpx;
}

.line {
  float: left;
  width: 1px;
  height: 100%;
  border-right: 1px solid $light-color;
}

.store-line-check,
.store-line-img,
.store-line-desc {
  // #ifdef MP-WEIXIN
  float: left;
  // #endif
}

.store-line {
  // #ifndef MP-WEIXIN
  display: flex;
  // #endif
  overflow: hidden;
}

.goods-config {
  display: flex;
  align-items: center;

  /deep/ .invalid {
    display: block;
    width: 80 rpx !important;
  }
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30 rpx 0;
}

.couponIcon {
  margin-left: 20 rpx;
}

.right_Col {
  color: $light-color;
  font-size: 26 rpx;

  > span {
    margin-left: 20 rpx;
  }
}

.right_Line {
  width: 3px;
  float: left;
  height: 40 rpx;
  border-left: 1px solid #eeeeee;

  /deep/ span {
    margin-left: 20 rpx;
  }
}

.box6 {
  justify-content: space-between;
  position: fixed;
  // #ifdef APP-PLUS || MP-WEIXIN
  bottom: 0;
  // #endif
  // #ifdef H5
  bottom: 100 rpx;
  // #endif
  left: 0;
  border-top: 1px solid #ededed;
  display: flex;
  height: 100 rpx;
  overflow: hidden;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  color: #333;
  z-index: 99;

  > .navL {
    padding: 0 32 rpx;
    display: flex;
    align-items: center;
  }
}

.sp-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 26 rpx;
  color: #333;
  font-weight: bold;
}

.sp-type {
  color: $u-light-color;
  padding: 10 rpx 0;
  font-size: 24 rpx;
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.default-color {
  color: #333;
}

.theme-color {
  color: $main-color;
}

.sp-number {
  font-weight: bold;

  display: flex;
  justify-content: space-between;

  > .sp-price {
    /deep/ span:nth-of-type(1) {
      font-size: 38 rpx;
    }

    /deep/ span:nth-of-type(2) {
      font-size: 24 rpx;
    }
  }
}

.priceDetail-flowPrice {
  font-weight: bold;
  padding-left: 20 rpx;

  > span:nth-of-type(1) {
    font-size: 38 rpx;
  }
}

.prices {
  display: flex;
  flex-direction: column;

  > .discountPrice {
    align-items: center;
    display: flex;
    font-size: 24 rpx;
    color: rgb(201, 199, 199);
  }
}

.discountDetails {
  margin-left: 10px;
  color: #666;
  padding: 4 rpx 10 rpx;
  border-radius: 100px;
  background: rgba(201, 199, 199, 0.3);
}

.discount-item {
  display: flex;
  margin: 40 rpx 0;
  justify-content: space-between;

  > span:nth-of-type(1) {
    color: #666;
  }

  > span:nth-of-type(2) {
    color: #333;
    font-weight: bold;
  }
}

.discount-title {
  font-size: 36 rpx;
  margin-top: 20 rpx;
  text-align: center;
}

.discount-way {
  width: 94%;
  margin: 0 3%;
}

.discount-list {
  width: 100%;
}

.promotions-list {
  margin-left: 20 rpx;

  > .promotions-item-seckill {
    background: rgba($color: $main-color, $alpha: 0.1);
    font-size: 24 rpx;
    color: $main-color;
    display: inline;
    padding: 0 rpx 10 rpx;
    border-radius: 100px;
  }
}
</style>

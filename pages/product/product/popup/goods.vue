<template>
  <div class="wrapper">
    <u-popup class="popup" v-model="buyMask" :height="setup.height" closeable :mode="setup.mode"
             :mask-close-able="isClose" :mask="isMask" : border-radius="setup.radius" @close="closeMask()">
      <!-- Commodity -->
      <view class="goods-box bottom">
        <view class="goods-header">
          <view class="goods-img">
            <u-image width="200rpx" border-radius="20" class="uimage" height="200rpx"
                     :src="selectedSpecImg? selectedSpecImg: goodsDetail.thumbnail"></u-image>
          </view>
          <view class="goods-skus">

            <!-- There are active commodity prices -->
            <view class="goods-price" v-if="goodsDetail.promotionPrice">
              <span v-if="goodsDetail.promotionPrice && !pointDetail">
                $
                <span class="goods-price-promotionShow goods-price-bigshow">{{
                    formatPrice(goodsDetail.promotionPrice)[0]
                  }}</span>
                .{{ formatPrice(goodsDetail.promotionPrice)[1] }}
              </span>
              <span v-if="pointDetail.points">

                <span class="goods-price-promotionShow goods-price-bigshow">{{ pointDetail.points }}</span>
                integral
              </span>
              <div class="promotion-box">
                $
                <span class="goods-price-bigshow">{{
                    formatPrice(goodsDetail.price)[0]
                  }}</span>
                .{{ formatPrice(goodsDetail.price)[1] }}

              </div>
            </view>
            <!-- The price of a normal product -->
            <view class="goods-price" v-else>
              <span>
                $
                <span class="goods-price-bigshow">{{
                    formatPrice(goodsDetail.price)[0]
                  }}</span>
                .{{ formatPrice(goodsDetail.price)[1] }}

              </span>
            </view>
            <view class="goods-check-skus">
              selected
              <span class="goods-check-skus-name">
                {{ selectName }}
                <span>, {{ num }} number</span>
              </span>
            </view>
          </view>
        </view>
        <!-- Commodity information -->
        <view class="goods-skus-box">
          <!-- Specifications -->
          <view class="goods-skus-view" :key="specIndex" v-for="(spec, specIndex) in formatList">
            <view class="skus-view-list">
              <view class="view-class-title">{{ spec.name }}</view>
              <view :class="{ active: spec_val.value == currentSelceted[specIndex] }" class="skus-view-item"
                    v-for="(spec_val, spec_index) in spec.values" :key="spec_index"
                    @click="handleClickSpec(spec, specIndex, spec_val)">{{ spec_val.value }}
              </view>
            </view>
          </view>
          <!-- Quantity -->
          <view class="goods-skus-number">
            <view class="view-class-title">Quantity</view>
            <u-number-box :bg-color="numberBox.bgColor" :color="numberBox.color" :input-width="numberBox.width"
                          :input-height="numberBox.height" :size="numberBox. size" :min="1" v-model="num">
            </u-number-box>
          </view>
        </view>
        <!-- button -->
        <view class="btns">

          <view class="box-btn card" v-if="buyType !='PINTUAN' && goodsDetail.goodsType!='VIRTUAL_GOODS'"
                @click="addToCartOrBuy('cart')">Add to cart
          </view>
          <view class="box-btn buy" @click="addToCartOrBuy('buy')">Buy now</view>
        </view>
      </view>
    </u-popup>
  </div>
</template>
<script>
import * as API_trade from '@/api/trade.js';
import setup from './popup';

export default {
  data() {
    return {
      setup,
      num: 1,
      // The size unit of the stepper is rpx
      numberBox: {
        width: '50',
        height: '50',
        size: '22',
        color:'#333',
        bgColor:'#fff'
      },
      selectName:'', //The nickname of the selected product
      selectSkuList:'', //Select the shop sku,
      selectedSpecImg:'', //Selected image path
      buyType:'', //Used to store promotion, group joining and other activity types
      parentOrder:'', //Data of the parent group team-if it is a member, there is data
      formatList: [],
      currentSelceted: [],
      skuList:'',
      isMask: false, //Whether to display the mask layer
      isClose: false //Is it possible to click the mask to close
    };
  },
  props: [
    'goodsDetail', //product details
    'buyMask',
    'selectedSku',
    'goodsSpec',
    'addr',
    'pointDetail' // Points details
  ],
  watch: {
    buyType: {
      handler(val) {
        this.buyType = val;
      },
      immediate: true
    },
    selectSkuList: {
      handler(val, oldval) {
        this.$emit('changed', val);
      },
      deep: true
    }
  },

  methods: {


    // Format money 1999 --> [1999,00]
    formatPrice(val) {
      if (typeof val =='undefined') {
        return val;
      }
      return val.toFixed(2).split('.');
    },

    closeMask() {
      this.$emit('closeBuy', false);
    },

    /**Click for specifications */
    handleClickSpec(val, index, specValue) {
      this.$set(this.currentSelceted, index, specValue.value);
      let selectedSkuId = this.goodsSpec.find((i) => {
        let matched = true;
        let specValues = i.specValues.filter((j) => j.specName !=='images');
        for (let n = 0; n <specValues.length; n++) {
          if (specValues[n].specValue !== this.currentSelceted[n]) {
            matched = false;
            return;
          }
        }
        if (matched) {
          return i;
        }
      });
      this.selectSkuList = {
        spec: {
          specName: val.name,
          specValue: specValue.value
        },
        data: this.goodsDetail
      };
      this.selectName = specValue.value;

      this.$emit('handleClickSku', {skuId: selectedSkuId.skuId, goodsId: this.goodsDetail.goodsId});
    },

    /**
     * Add to cart or buy
     */
    addToCartOrBuy(val) {
      if (!this.selectSkuList) {
        uni.showToast({
          title:'Please select a specification product',
          icon:'none'
        });
        return;
      }
      let data = {
        skuId: this.goodsDetail.id,
        num: this.num
      };

      if (val =='cart') {
        API_trade.addToCart(data).then((res) => {
          if (res.data.code == 200) {
            uni.showToast({
              title:'The product has been added to the shopping cart',
              icon:'none'
            });

            this.$emit('queryCart');
            this.closeMask();
          }
        });
      } else {
        // Determine whether to join the group product
        if (this.buyType) {
          data.cartType ='PINTUAN';
        } else if (this.goodsDetail.goodsType =='VIRTUAL_GOODS') {
          data.cartType ='VIRTUAL';
        } else {
          data.cartType ='BUY_NOW';
        }

        API_trade.addToCart(data).then((res) => {
          if (res.data.code == 200) {
            uni.navigateTo({
              url: `/pages/order/fillorder?way=${ data.cartType }&addr=${
                  this.addr.id ||''
              }&parentOrder=${ encodeURIComponent(
                  JSON.stringify(this.parentOrder)
              ) }`
            });
          }
        });
      }
    },
    formatSku(list) {
      // Format data

      let arr = [{}];
      list.forEach((item, index) => {
        item.specValues.forEach((spec, specIndex) => {
          let name = spec.specName;
          let values = {
            value: spec.specValue,
            quantity: item.quantity
          };
          if (name ==='images') {
            return;
          }

          arr.forEach((arrItem, arrIndex) => {
            if (
                arrItem.name == name &&
                arrItem.values &&
                !arrItem.values.find((i) => i.value === values.value)
            ) {
              arrItem.values.push(values);
            }

            let keys = arr.map((key) => {
              return key.name;
            });
            if (!keys.includes(name)) {
              arr.push({
                name: name,
                values: [values]
              });
            }
          });
        });
      });

      arr.shift();
      this.formatList = arr;

      list.forEach((item) => {
        if (item.skuId === this.goodsDetail.id) {
          item.specValues
              .filter((i) => i.specName !=='images')
              .forEach((value, _index) => {
                this.currentSelceted[_index] = value.specValue;

                this.selectName = value.specValue;

                this.selectSkuList = {
                  spec: value,
                  data: this.goodsDetail
                };
              });
        }
      });

      this.skuList = list;
    }
  },

  mounted() {
    this.formatSku(this.goodsSpec);

    console.log(this.goodsDetail);
  }
};
</script>
<style lang="scss" scoped>
@import "./popup.scss";

.buy {
  background-image: linear-gradient(135deg, #ffba0d, #ffc30d 69%, #ffcf0d);
  box-shadow: 0 2px 6px 0 rgba(255, 65, 66, 0.2);
}

.card {
  background-image: linear-gradient(135deg, #f2140c, #f2270c 70%, #f24d0c);
  box-shadow: 0 2px 6px 0 rgba(255, 65, 66, 0.2);
}

/deep/ .u-icon-plus,
.u-icon-minus,
.u-icon-disabled {
  height: 30 rpx !important;
  background: #fff !important;
}

.goods-skus-number {
  justify-content: space-between;
  display: flex;
}

/deep/ .uni-scroll-view {
  overflow: hidden !important;
}

.active {
  background: $jd-light-color !important;
  border: 2 rpx solid $jd-color;
  font-weight: bold;
  color: $jd-color !important;
  box-sizing: border-box;
}

.goods-skus-box {
  overflow-y: auto;
  height: 610 rpx;
  // #ifdef MP-WEIXIN
  height: 570 rpx;
  // #endif
  margin-bottom: 10 rpx;
}

.goods-skus-view {
  overflow: hidden;

  .skus-view-list {
    > .skus-view-item {
      flex: 1;
      padding: 0 36 rpx;

      overflow: hidden;
      height: 60 rpx;
      line-height: 60 rpx;
      float: left;
      text-align: center;
      margin-left: 24 rpx;
      margin-bottom: 20 rpx;
      font-size: 22 rpx;
      color: #262626;
      background: #f2f2f2;
      border-radius: 30 rpx;
    }
  }
}

.goods-header {
  height: 200 rpx;
  display: flex;
  align-items: center;
  margin-bottom: 36 rpx;
}

.goods-box {
  padding: 50 rpx 36 rpx 0 36 rpx;
}

.goods-skus {
  padding: 0 20 rpx;
}

.goods-price {
  color: $jd-color;
  line-height: 80 rpx;
  display: flex;
}

.promotion-box {
  line-height: 1;
  display: flex;
  align-items: center;
  text-decoration: line-through;
  color: #999;
  margin-left: 10 rpx;

  /deep/ span {
    font-size: 30 rpx;
  }
}

.promotion {
  font-size: 30 rpx;
}

.goods-price-promotionShow {
  font-size: 48 rpx;
}

.goods-check-skus {
  font-size: 24 rpx;
  color: #999;

  > .goods-check-skus-name {
    margin-left: 4 rpx;
  }

  > span {
    color: #333;
  }
}
</style>

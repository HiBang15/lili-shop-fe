<template>
  <view>

    <div v-for="(promotion, promotion_index) in res" :key="promotion_index">
      <div class="showBox"
           v-if="promotion.__key =='SECKILL' || promotion.__key =='GROUPBUY' || promotion.__key =='PINTUAN'">
        <view class="group-wrapper">
          <div class="u-group-row">
            <view :span="8" class="showBox_L">
              <view class="u-group-flex">

                <!-- Limited time buying -->
                <view class="u-group-flex-left" v-if="promotion.__key =='SECKILL' ">

                  <span class="u-group-flex-left-span" v-if="detail.promotionPrice!=undefined">
                    ￥ <span
                      class="flex-price"> {{ formatPrice(detail.promotionPrice)[0] }}.{{ formatPrice(detail.promotionPrice)[1] }}</span>

                  </span>
                  <view class="u-group-flex" v-if="detail.price!=undefined">
                    <span
                        class="old-price">￥{{ formatPrice(detail.price)[0] }}.{{ formatPrice(detail.price)[1] }}</span>
                    <view class="promotion">Limited time purchase</view>
                  </view>
                </view>

                <!-- Group purchase -->
                <view class="u-group-flex-left" v-if="promotion.__key =='GROUPBUY' ">
                  <span class="u-group-flex-left-span">
                    <span class="flex-price"
                          v-if="promotion.groupbuy_goods_vo.price !=undefined">￥{{ formatPrice(promotion.groupbuy_goods_vo.price)[0] }}.{{ formatPrice(promotion.groupbuy_goods_vo.price)[1] }}</span>
                    <!-- <span v-if="promotion.point">+{{promotion.point}}Points</span> -->
                  </span>
                  <view class="u-group-flex">
                    <span class="old-price"
                          v-if="promotion.groupbuy_goods_vo.original_price!=undefined">￥{{ formatPrice(promotion.groupbuy_goods_vo.original_price)[0] }}.{{ formatPrice(promotion.groupbuy_goods_vo.original_price)[1] }}</span>
                    <view class="promotion">Group buying activity</view>
                  </view>
                </view>

                <view class="u-group-flex-left" v-if="promotion.__key =='PINTUAN' ">

                  <span class="u-group-flex-left-span" v-if="detail.promotionPrice != undefined">
                    ￥<span
                      class="flex-price"> {{ formatPrice(detail.promotionPrice)[0] }}.</span>{{ formatPrice(detail.promotionPrice)[1] }}
                  </span>
                  <view class="u-group-flex" v-if="detail.price != undefined">
                    <span
                        class="old-price">￥{{ formatPrice(detail.price)[0] }}.{{ formatPrice(detail.price)[1] }}</span>
                    <view class="promotion">Joining groups</view>
                  </view>
                </view>
                <!-- Join the group on the right side -->
                <view class="u-group-flex-right" v-if="promotion.__key =='PINTUAN' ">
                  <span class="group-bag">{{ promotion.requiredNum }} people join a group </span>
                  <span class="group-bag">Limit {{ promotion.limitNum }} pieces</span>
                </view>
              </view>
            </view>
            <view class="showBox_R" v-if="promotion && promotion.endTime">
              <u-tag :text="getIsTimer(promotion)" size="mini" type="error" />
              <u-count-down :hide-zero-day="true" font-size="25" color="#fff" bg-color="#f71471" separator-size="25"
                            separator-color="# f71471" :show-hours="true" :show-minutes="true"
                            :timestamp="getCountDownTime(promotion.endTime)"></u-count-down>
            </view>
          </div>
        </view>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    // Activities, promotional data
    res: {
      type: null,
      default: {}
    },
    // product details
    detail: {
      type: null,
      default: {}
    }
  },
  watch: {
    res: {
      handler() {
        if (this.res && this.res.length != 0) {
          Object.keys(this.res).forEach((item) => {
            let key = item.split('-')[0];
            this.res[item].__key = key;
            // Aiming at reality
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // Format money 1999 --> [1999,00]
    formatPrice(val) {
      if (typeof val == 'undefined') {
        return val;
      }
      return val.toFixed(2).split('.');
    },
    getCountDownTime(val) {
      let date = new Date(val.replace(/-/g, '/'));
      let timeSimple = new Date(date).getTime() / 1000;
      return timeSimple - new Date().getTime() / 1000;
    },
    getIsTimer(val) {
      var timestamp = new Date().getTime();


      if (timestamp < val.start_time) {
        this.startTimer = true;
        return 'Distance from the start of the activity';
      } else {
        return 'Distance to the end of the activity';
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "./group.scss";
</style>

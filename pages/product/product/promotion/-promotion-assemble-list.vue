<template>
  <view class="group-list">
    <view class="group-name">Shopping list</view>
    <view v-if="assembleOrder.length !=0">
      <view class="group-item" v-for="(order,index) in assembleOrder" :key="index">
        <view class="group-item-user">
          <u-image shape="circle" width="40px" height="40px" :src="order.face"></u-image>
          <span class="group-item-name">{{ order.nickName | noPassByName }}</span>
        </view>
        <view>
          <span class="group-item-name">It’s still a group of {{ order.toBeGroupedNum }} people</span>
        </view>
        <view>
          <u-button size="mini" :custom-style="customStyle" @click="buy(order)">Go to the group</u-button>
        </view>
      </view>

    </view>
    <view v-else class="nomore">

      <u-empty text="No group joining information yet" mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
import * as API_Promotions from '@/api/promotions';

export default {
  data() {
    return {
      customStyle: {
        background: this.$lightColor,
        color: '#fff'
      },
      /** Pending group orders */
      assembleOrder: '',

      /** View more pending group orders */
      assembleOrderAll: ''
    };
  },
  props: ['res'],

  watch: {
    res: {
      handler() {
        if (this.res && this.res.length != 0) {
          Object.keys(this.res).forEach((item) => {
            let key = item.split('-');
            if (key && key[0] == 'PINTUAN') {
              this.getAssembleInfo(item);
            }
          });
        }
      },
      immediate: true
    }

    // assembleOrder(val) {
    // this.$emit("assembleOrder", val);
    // },
  },
  computed: {},
  mounted() {
  },
  methods: {
    // Get all pending orders for this product
    getAssembleInfo(val) {
      let id = this.res[val].id;
      API_Promotions.getPromotionGroupMember(id).then((res) => {
        if (res.data.success) {
          console.warn(res.data.result);
          this.assembleOrder = res.data.result;
        }
      });
    },

    buy(order) {
      this.$emit('to-assemble-buy-now', order);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../product.scss";

.nomore {
  padding: 10 rpx 0;
}

.group-item {
  margin: 30 rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-item-user {
  display: flex;
  align-items: center;
}

.group-item-name {
  margin-left: 23 rpx;
  font-size: 24 rpx;
  color: #999999;
  font-weight: 400;
}
</style>

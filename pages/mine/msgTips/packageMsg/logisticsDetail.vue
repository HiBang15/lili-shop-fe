<template>
  <view class="logistics-detail">
    <view class="card">
      <view class="card-title">
        <span>{{ logiList.shipper }}</span> Express <span>{{ logiList.logisticCode }}</span>
      </view>
      <view class="time-line">
        <u-time-line v-if="logiList.traces && logiList.traces.length != 0">
          <u-time-line-item nodeTop="2" v-for="(item, index) in logiList.traces" :key="index">
            <!-- The content on the left is customized here and replaced with an icon -->
            <template v-slot:node>
              <view v-if="index == logiList.traces.length-1" class="u-node" :style="{ background: $lightColor }"
                    style="padding: 0 4px">
                <!-- Here is the icon component of uView -->
                <u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
              </view>
            </template>
            <template v-slot:content>
              <view>
                <!-- <view class="u-order-title">Pending items</view> -->
                <view class="u-order-desc">{{ item.AcceptStation }}</view>
                <view class="u-order-time">{{ item.AcceptTime }}</view>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
        <u-empty class="empty" v-else text="There are currently no logistics orders" mode="list"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
import uniSteps from '@/components/uni-steps/uni-steps.vue';
import { getExpress } from '@/api/trade.js';

export default {
  components: {uniSteps},
  data() {
    return {
      express: '',
      resData: {
        title: 'Logistics Details'
      },

      logiList: '',
      activeStep: 0
    };
  },
  methods: {
    init(sn) {
      getExpress(sn).then((res) => {
        this.logiList = res.data.result;
      });
    }
  },
  onLoad(option) {
    let sn = option.order_sn;
    this.init(sn);
  }
};
</script>

<style lang="scss">
.card-title {
  background: #f2f2f2;
}

.logistics-detail {
  margin-top: 20 rpx;
  padding: 0 16 rpx;
}

.card {
  background: #fff;
  border-radius: 20 rpx;
  width: 100%;

  > .card-title {
    font-size: 24 rpx;
    border-top-left-radius: 20 rpx;
    border-top-right-radius: 20 rpx;
    padding: 16 rpx;
  }

  > .time-line {
    padding: 16 rpx 32 rpx;
  }
}

.u-order-title {
  font-weight: bold;
}

.u-order-desc {
  font-size: 26 rpx;
  color: #666;
  margin: 10 rpx 0;
}

.u-order-time {
  font-size: 24 rpx;
  color: #999;
}

.empty {
  padding: 40 rpx 0;
}
</style>

<template>
  <view>
    <view v-if="!hid" class="flex-row-center" :style="{ top: scHight }"
          style="width: 750rpx; position: fixed; z-index: 100; left: 0">
      <view class="flex-column-center" style="background-color: #fcfcfc; padding: 30rpx; border-radius: 10rpx">
        <movable-area class="flex" style="width: 100%" animation="false" :style="{ height: originalHeight }">
          <movable-view scale-value="1" animation="false" damping="5000" :x="moveX" :style="{
              height: sliderHeight,
              width: sliderWidth,
              'z-index': 101,
            }" direction="horizontal">
            <image :src="imgbk" class="image" mode="aspectFit" :style="{
                height: sliderHeight,
                width: sliderWidth,
                'margin-top': imgbKH,
              }"></image>
          </movable-view>
          <image :src="img" mode="aspectFit" :style="{ height: originalHeight, width: originalWidth }"
                 style="border-radius: 10rpx"></image>
        </movable-area>

        <movable-area class="flex-row-start" style="
            width: 100%;
            background-color: #efefef;
            height: 80rpx;
            border-radius: 40rpx;
            margin-top: 30rpx;
          ">
          <movable-view scale-value="1" animation="false" damping="50" :x="movePv" class="flex-row-center" style="
              border-radius: 50%;
              height: 100rpx;
              width: 100rpx;
              background-color: #ffffff;
              border: 2rpx solid #e3e3e3;
              margin-top: -13rpx;
            " direction="horizontal" @change="moveChange" @touchend="end">
            <view :class="endLoad ? 'cuIcon-right' : 'cuIcon-loading turn-load'" class="loadIcon" style="">
            </view>
          </movable-view>

          <text style="padding-left: 140rpx" :style="{ color: col }">{{
              hasImg
            }}
          </text>
        </movable-area>
        <view class="flex-row-around padding-top" style="width: 100%">
          <view @click="hide" class="cuIcon-close" style="font-size: 50rpx; color: #e25915">
          </view>

          <text class="cu-tag bg-cyan round" @click="getCode">刷新拼图</text>
          <text class="my-neirong-sm cuIcon-safe" style="color: #c1c1c1">Lili-FRAMEWORK</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import api from '@/config/api.js';
import storage from '@/utils/storage.js';
import uuid from '@/utils/uuid.modified.js';

const phone = uni.getSystemInfoSync();
const l = phone.screenWidth / 750;
export default {
  name: 'verification',
  created() {
    // 可自行调整
    this.scHight = phone.screenHeight / 2 - 200 + 'px';
    this.getCode();

  },
  props: {
    height: {
      type: String,
      default: '80rpx'
    },
    width: {
      type: String,
      default: '350rpx'
    },
    left: {
      type: String,
      default: '180rpx'
    },
    top: {
      type: String,
      default: '30rpx'
    },
    business: {
      type: String,
      default: 'LOGIN'
    }
  },
  data() {
    return {
      flage: false,
      key: '', //key
      vsrtx: 'Click to verify', //button prompt
      vsr: false, //
      hid: true,
      col: '#838383',
      movePv: 0,
      hasImg: 'Drag the slider to complete the puzzle',
      spcode: '',
      tl: 0,
      moveCode: 0,
      //X axis movement distance
      moveX: 0,
      //Template height
      originalHeight: '',
      //Template width
      originalWidth: '',
      //Puzzle height
      sliderHeight: '',
      //Flat coating width
      sliderWidth: '',
      scHight: 0,
      //Original image
      img: '',
     //Jigsaw
      imgbk: '',
      endLoad: true,
      imgbKH: ''
    };
  },
  methods: {
    show() {
      this.hid = false;
    },
    hide() {
      if (!this.vsr) {
        // vsr judges whether the verification is successful, and successfully hides the verification box
        this.hid = !this.hid;
      }
    },
    error() {
      this.vsr = false;
      this.hid = false;
      this.moveX = 0;
      this.moveCode = 0;
    },
    // Get verification image
    getCode() {
      this.col ='#b3afae';
      this.hasImg ='Picture loading...';
      if (!storage.getUuid()) {
        storage.setUuid(uuid.v1());
      }
      uni.request({
        url: api.common +'/slider/' + this.business,
        header: {
          uuid: storage.getUuid()
        },
        success: (res) => {
          this.col ='#838383';
          this.hasImg ='Drag the slider to complete the puzzle';
          var data = res.data.result;

          // picture of base64
          this.img = data.backImage;
          this.imgbk = data.slidingImage;
          // Dynamically adapt the height and width of the verification image according to the parameters
          this.imgbKH = data.randomY * 1.8 +'rpx';
          this.originalHeight = data.originalHeight * 1.8 +'rpx';
          this.originalWidth = data.originalWidth * 1.8 +'rpx';
          this.sliderHeight = data.sliderHeight * 1.8 +'rpx';
          this.sliderWidth = data.sliderWidth * 1.8 +'rpx';
          // Adaptation ratio, used to adapt to sliding distance
          this.tl = 1 / (1.8 * l);
          // Useless information
          this.spcode = data.capcode;
          // Verification token
          this.key = data.key;
          this.$store.state.verificationKey = data.key;
        }
      });
    },
    end(e) {
      this.endLoad = false;
      // Verify that the puzzle position is correct
      uni.request({
        method:'POST',
        url:
            api.common +
            '/slider/' +
            this.business +
            '?xPos=' +
            parseInt(this.moveCode * this.tl),
        header: {
          uuid: storage.getUuid()
        },
        success: (res) => {
          this.endLoad = true;
          res.data.result == false
              ? (res.data.result = false)
              : (res.data.result = true);

          if (res.data && res.data.result) {
            //After the verification is successful, the key is sent out, and the backend will store the verification information in the cache
            this.$emit('send', this.key);
            this.hide();
            this.vsr = true;
            this.vsrtx ='Verified';
          } else {
            this.getCode(); // Return the slider to the starting position
            if (this.movePv == 1) {
              this.movePv = 0;
            } else {
              this.movePv = 1;
            }
          }
        },
        fail: (res) => {
          this.$msg('Failed to connect to the server');
        }
      });
    },
    // Bind the position of the puzzle
    moveChange(e) {
      this.moveX = e.detail.x;
      this.moveCode = e.detail.x;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./animation.css";
@import "./icon.css";
// @import './main.css';
.dh-wt {
  animation: at 1.1s ease;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  background-color: $main-color;
  border-radius: 50%;
}

@keyframes at {
  from {
    width: 27 rpx;
    height: 27 rpx;
  }

  to {
    width: 45 rpx;
    height: 45 rpx;
  }
}

.ttcl {
  color: $main-color;
}

.border-index {
  border: 1 rpx solid $main-color;
}

.loadIcon {
  color: $main-color;
  font-size: 40 rpx;
}

.status_bar {
  height: var(--status-bar-height);
  background-color: #f1f1f1;
  width: 100%;
}

.status_bar-nobg {
  height: var(--status-bar-height);
  width: 100%;
}

/* 转圈动画 */
.turn-load {
  animation: turnmy 1s linear infinite;
}

@keyframes turnmy {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(270deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

.status_bar-fixed {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #f1f1f1;
  z-index: 20;
}

.head-dh-my {
  display: flex;
  position: fixed;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 10 rpx;
  z-index: 15;
  background-color: #e3e3e3;
  width: 750 rpx;
}

.border-bom {
  border-bottom: 0.5 rpx solid #dddddd;
}

.border-red {
  border-bottom: 1 rpx solid #d33e18;
}

.border-bom-big {
  border-bottom: 8 rpx solid #dddddd;
}

.border-bom-white {
  border-bottom: 2 rpx solid #ffffff;
}

.border-bom-green {
  border-bottom: 4 rpx solid #f8f9bd;
}

.border-bom-index {
  border-bottom: 4 rpx solid #27d9b3;
}

.padding-left {
  padding-left: 20 rpx;
}

.padding-left-top {
  padding-left: 20 rpx;
  padding-top: 20 rpx;
}

.padding-right {
  padding-right: 20 rpx;
}

.input-my {
  padding-left: 20 rpx;
  border-radius: 40 rpx;
  height: 50 rpx;
  margin: 10 rpx;
}

.tb-tag-absolute {
  position: absolute;
  z-index: 5;
  border-radius: 25 rpx;
  font-size: 16 rpx;
  margin-left: 25 rpx;
  margin-top: -35rpx;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-column-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.flex-column-start {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-column-around {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.flex-row-around {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.flex-row-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.my-title {
  font-size: 35 rpx;
  font-weight: bold;
}

.my-neirong {
  font-size: 26 rpx;
  color: #6d6d6d;
}

.my-neirong-sm {
  font-size: 23 rpx;
  color: #616161;
}

.my-tag-text {
  font-size: 22 rpx;
  padding-top: 20 rpx;
  color: #bababa;
}

.padding-top {
  padding-top: 35 rpx;
}

.padding-top-sm {
  padding-top: 20 rpx;
}

.bottom-dh {
  background-color: #f1f1f1;
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 750 rpx;
  height: 110 rpx;
}

.tb-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom-text {
  width: 750 rpx;
  position: fixed;
  text-align: center;
  font-size: 26 rpx;
  color: #9d9d9d;
  bottom: 70 rpx;
}

.moneycolor {
  color: #ea5002;
}

.margin-top {
  margin-top: 20 rpx;
}

.margin-top-sm {
  margin-top: 12 rpx;
}

.margin {
  margin: 20 rpx;
}

.margin-left {
  margin-left: 20 rpx;
}

.margin-right {
  margin-right: 20 rpx;
}

.main-color {
  color: #07d188;
}
</style>

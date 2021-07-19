<template>
  <view class="sign-in">
    <view class="signin-btn-con">
      <div class="circle-box">
        <div class="cricle" @click="signIn()">
          <span v-if="!ifSign" :class="{ active: signFlag || ifSign }">Sign in</span>
          <span v-else :class="{ active: signFlag || ifSign }" :style="ifSign?'transform: rotateY(0deg);':''">Signed</span>
        </div>
      </div>
      <text class="tips">If you insist on signing in every day, you can get multiple rewards.</text>
    </view>
    <div class="date-card">
      <view class="date-con">
        <view class="date-tit">
          <u-row style="width: 100%; justify-content: center;">
            <div style="text-align: center; "class="text">{{ currentMonth }} {{ currentYear }}</div>
          </u-row>
        </view>
        <view class="week">
          <text v-for="item in weekArr" :key="item.id">{{ item }}</text>
        </view>
        <view class="date" v-for="obj in dataObj" :key="obj.id">
          <view class="item" v-for="item in obj" :key="item.id" :class="item ==''?'hide':''" :animation="item == currentDay? animationData:''">
            <view class="just" :class="signArr.indexOf(item) != -1?'active':''">
              <view class="top">{{ item }} </view>
              <view class="bottom">
                <u-icon name="error" v-if="item <= currentDay" color="#999"></u-icon>
              </view>
            </view>
            <view class="back" :class="signArr.indexOf(item) != -1?'active':''" :style="
                signArr.indexOf(item) != -1 && ifSign
                  ?'transform: rotateY(0deg);'
                  : signArr.indexOf(item) != -1 && item != currentDay
                  ?'transform: rotateY(0deg);'
                  :''
              ">
              <view class="top">{{ item }}</view>
              <view class="bottom">
                <u-icon name="checkmark" color="#ff9f28"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>
    </div>
    <view class="mask" :class="{ show: maskFlag, trans: transFlag }" ref="mask">
      <view class="mask-header">
        <text class="close"></text>
        <text>Sign in successfully</text>
        <text class="close" @click="close">×</text>
      </view>
      <view class="mask-con">
        <view class="keep-sign">
          Consecutively checked in this month
          <text>{{ continuity }}</text>
          day
        </view>
        <u-icon size="120" style="margin: 50rpx 0" color="#ff9f28" name="checkmark"></u-icon>
        <view class="mark">
          <view>Get points</view>
          <text>{{ continuityPoint }}</text>
        </view>
        <text class="text">Continuous sign-in can get extra rewards! </text>
      </view>
    </view>
  </view>
</template>

<template>
  <view class="myTracks">
    <u-empty text="No history record yet" style="margin-top:200rpx;" mode="history" v-if="whetherEmpty"></u-empty>
    <div v-else>
      <view v-for="(item, index) in trackList" :key="index">
        <view class="myTracks-title" @click="navgaiteToStore(item)">{{item.storeName}}</view>
        <view class="myTracks-items">
          <view class="myTracks-item">
            <u-checkbox-group>
              <u-checkbox v-model="item.___isDel" v-if="editFlag" active-color="#ff6b35" style="margin-right: 10rpx" @change="changeChecked(item)"></u -checkbox>
            </u-checkbox-group>
            <view class="myTracks-item-img" @click.stop="navgaiteToDetail(item)">
              <image :src="item.thumbnail"></image>
            </view>
            <view class="myTracks-item-content" @click.stop="navgaiteToDetail(item)">
              <view class="myTracks-item-title">
                {{ item.goodsName }}
                <view class="myTracks-item-title-desc"> </view>
              </view>
              <view class="myTracks-item-price">
                ￥{{ item.price | unitPrice }}
              </view>
            </view>
          </view>
        </view>
        <view class="myTracks-divider"></view>

      </view>
      <uni-load-more :status="loadStatus"></uni-load-more>
    </div>
    <view v-if="editFlag">
      <view class="myTracks-action-placeholder"></view>
      <view class="myTracks-action">
        <view class="myTracks-action-check">
          <u-checkbox-group>
            <u-checkbox v-model="allChecked" v-if="editFlag" active-color="#ff6b35" style="margin-right: 10rpx" @change="checkedAllitem"></u-checkbox>
            select all
          </u-checkbox-group>
        </view>

        <view>
          <u-button type="warning" plain="true" @click="delAllTracks" class="myTracks-action-btn">
            delete
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.date-card {
  padding: 0 40rpx;
}
.tips {
  margin-top: 34rpx;
}
.circle-box {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-top: 60rpx;
  background: #ff9f28;
  display: flex;
  justify-content: center; //这个是X轴居中
  align-items: center; //这个是 Y轴居中
}

.cricle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #ff9f28;
  text-align: center;
  line-height: 160rpx;
  color: #fff;
  font-size: 40rpx;
}

page {
  background: #fff;
}

.sign-in {
  color: #333;
  .signin-btn-con {
    width: 100%;
    height: 670rpx;
    background-image: linear-gradient(180deg, #ff6b35, #ff9f28, #ffcc03);
    display: flex;
    flex-direction: column;
    align-items: center;
    text {
      color: #fff;
      font-size: 28rpx;
      font-weight: 400;
    }
  }

  .date-con {
    background: #fff;
    min-height: 730rpx;
    border-radius: 0.8em;
    border: 1px solid #ededed;
    padding: 0 28rpx;
    transform: translateY(-320rpx);
    box-shadow: (1px 3px 5px rgba(0, 0, 0, 0.2));
  }

  .date-tit {
    display: flex;
    justify-content: space-between;
    margin: 30rpx 0;
  }

  .week {
    display: flex;
    justify-content: space-between;
    color: #a6a6a6;
    font-size: 26rpx;

    text {
      width: 66rpx;
      text-align: center;
    }
  }

  .date {
    margin: 10rpx 0 36rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .item {
      width: 66rpx;
      height: 80rpx;
      border-radius: 5px;
      overflow: hidden;

      position: relative;

      &.hide {
        opacity: 0;
      }

      .just,
      .back {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: absolute;

        .top {
          position: relative;
          flex: 1;
          text-align: center;
          line-height: 40rpx;

          &:before {
            content: "";
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 15rpx;
          }
        }
      }

      .just {
        &.active {
          display: none;
        }
      }
      .back {
        display: none;
        &.active {
          display: flex;
        }

        .top {
          color: #ff9f28;
        }
      }

      .bottom {
        color: #999;
        font-size: 20rpx;
        height: 20rpx;
        line-height: 20rpx;
        text-align: center;
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: -100%;
    right: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.5s;

    &.show {
      opacity: 1;
      left: 0;
      right: 0;
    }

    &.trans {
      left: 0;
      right: 0;
    }

    .mask-header {
      width: 540rpx;
      height: 130rpx;
      line-height: 130rpx;
      background: #ff9f28;
      color: #fff;
      font-size: 40rpx;
      font-weight: 500;
      display: flex;
      justify-content: space-between;

      .close {
        width: 60rpx;
        font-size: 66rpx;
        font-weight: 400;
        line-height: 60rpx;
      }
    }

    .mask-con {
      width: 540rpx;
      height: 460rpx;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999;
      font-size: 24rpx;
      border-radius: 0 0 9px 9px;

      .keep-sign {
        font-size: 30rpx;
        margin-top: 30rpx;

        text {
          font-size: 46rpx;
          font-weight: 500;
          color: #999;
          padding: 0 6rpx 0 8rpx;
        }
      }

      .mark {
        // flex: 1;
        display: flex;
        align-items: flex-end;
        position: relative;
        margin-bottom: 16rpx;

        text {
          margin-left: 4rpx;
          color: #999;
        }
      }

      .text {
        color: #6f6f6f;
        height: 90rpx;
      }
    }
  }
}
</style>

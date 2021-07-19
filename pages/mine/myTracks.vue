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

<script>
import {myTrackList, deleteHistoryListId} from "@/api/members.js";

export default {
  data() {
    return {
      editFlag: false, //Whether to edit
      allChecked: false, //Whether to select all
      loadStatus: "more", //The bottom pull-down loading status
      whetherEmpty: false, //whether the data is empty
      params: {
        pageNumber: 1,
        pageSize: 10,
      },

      trackList: [], //list of tracks
    };
  },

  /**
   * Slide to the bottom to load the next page of data
   */
  onReachBottom() {
    if (this.loadStatus != "noMore") {
      this.params.pageNumber++;
      this.getList();
    }
  },
  onLoad() {
    this.getList();
  },
  methods: {
    /**
     * Navigate to the store
     */
    navgaiteToStore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },

    /**
     * Set the text in the right navigation bar
     */
    setStyle(text) {
      //Navigation button text setting
      let pages = getCurrentPages();
      let page = pages[pages.length-1];
      // #ifdef APP-PLUS
      let currentWebview = page.$getAppWebview();
      let titleNView = currentWebview.getStyle().titleNView;
      titleNView.buttons[0].text = text;
      if (text == "complete") {
        this.trackList.forEach((key) => {
          key.history.forEach((item) => {
            this.$set(item, "___isDel", false);
          });
        });
      }
      currentWebview.setStyle({
        titleNView: titleNView,
      });
      // #endif
      // #ifdef H5
      // h5 temporary plan
      document.getElementsByClassName("uni-btn-icon")[1].innerText = text;
      // #endif
    },

    /**
     * Jump to details
     */
    navgaiteToDetail(item) {
      uni.navigateTo({
        url: "/pages/product/goods?id=" + item.id + "&goodsId=" + item.goodsId,
      });
    },

    /**
     * Get my track list
     */
    getList() {
      uni.showLoading({
        title: "Loading",
      });
      myTrackList(this.params).then((res) => {
        uni.stopPullDownRefresh();
        uni.hideLoading();
        if (res.statusCode == 200) {
          res.data.result &&
            res.data.result.forEach((item) => {
              item.___isDel = false;
            });

          let data = res.data.result;
          if (data.total == 0) {
            this.whetherEmpty = true;
          } else if (data.total <10) {
            this.loadStatus = "noMore";
            this.trackList.push(...data);
          } else {
            this.trackList.push(...data);
            if (data.length <10) this.loadStatus = "noMore";
          }
        }
      });
    },

    /**
     * After clicking, judge whether to select all
     */
    changeChecked(val) {
      const isCheckedAll = this.trackList.every((key) => {
        return key.___isDel == val.___isDel;
      });
      this.allChecked = isCheckedAll;
    },

    /**
     * Click the select all button
     */
    checkedAllitem() {
      //Select all button
      this.trackList.forEach((key) => {
        this.$set(key, "___isDel", this.allChecked);
      });
    },

    /**
     * Delete footprint
     */
    delAllTracks() {
      let way = [];
      this.trackList.forEach((key) => {
        if (key.___isDel) {
          way.push(key.goodsId);
        }
      });
      if (way.length == 0) return false;
      deleteHistoryListId(way).then((res) => {
        if (res.data.code == 200) {
          this.trackList = [];
          this.allChecked = false;
          this.getList();
        } else {
          uni.showToast({
            title: res.data.message,
            duration: 2000,
            icon: "none",
          });
        }
      });
    },
  },

  /**
   * Switch on the right tab bar
   */
  onNavigationBarButtonTap(e) {
    if (!this.editFlag) {
      this.setStyle("Complete");
    } else {
      this.setStyle("Edit");
    }
    this.editFlag = !this.editFlag;
  },
};
</script>

<style lang="scss" scoped>
.myTracks {
  width: 100%;
  padding-top: 2rpx;
}

.myTracks-title {
  width: 100%;
  height: 110rpx;
  padding-left: 20rpx;
  font-size: 28rpx;
  color: #666;
  font-weight: bold;
  background-color: #fff;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.myTracks-items {
  padding-top: 2rpx;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
}

.myTracks-item {
  width: 100%;
  height: 226rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  margin-bottom: 2rpx;
  // border-radius: 6/@px;
  background-color: #fff;
  position: relative;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.myTracks-item-img {
  margin-right: 20rpx;
  border-radius: 8rpx;
  image {
    width: 130rpx;
    height: 130rpx;
    border-radius: 8rpx;
  }
}

.myTracks-item-title {
  font-size: 28rpx;
  color: #333;
}

.myTracks-item-title-desc {
  font-size: 28rpx;
  color: #999;
}

.myTracks-item-price {
  font-size: 28rpx;
  color: $light-color;
  padding: 10rpx 0 0 0;
}

.myTracks-action-btn {
  width: 130rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.myTracks-divider {
  width: 100%;
  height: 20rpx;
}

.myTracks-action-placeholder {
  height: 110rpx;
}

.myTracks-action-check {
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
</style>

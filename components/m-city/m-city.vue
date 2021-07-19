<template>
  <view>
    <view
        class="mask"
        :class="{ maskShow: showPicker }"
        @click="hide"
        @click.stop.prevent
        @touchmove.stop.prevent
        catchtouchmove="true"
    ></view>
    <view class="cpicker-content" :class="{ cpickerShow: showPicker }">
      <view
          class="city-head"
          @click.stop.prevent
          @touchmove.stop.prevent
          catchtouchmove="true"
      >
        <view class="city-head-title">{{ headTitle }}</view>
        <icon
            type="clear"
            v-if="clearRightIcon"
            class="clearRightIcon"
            size="20"
            color="#cccccc"
            @click="hide"
        ></icon>
      </view>
      <scroll-view
          id="nav-bar"
          class="nav-bar"
          scroll-x="true"
          scroll-with-animation="true"
          :scroll-left="scrollLeft"
      >
        <view
            v-for="(item, index) in tabbars"
            class="nav-item"
            :key="index"
            :id="'tab' + index"
            @click="changeTab(index)"
            :class="{ current: index === tabCurrentIndex }"
        >
          <text class="nav-bar-title">{{ item.localName }}</text>
        </view
        >
      </scroll-view>
      <view class="city_content">
        <scroll-view
            class="panel-scroll-box"
            :scroll-y="enableScroll"
            :cscrollTop="scrollTop"
            :current="tabCurrentIndex"
            :scroll-top="scrollTop"
        >
          <block
              v-for="(item, index) in tabbars[tabCurrentIndex].children"
              :key="index"
          >
            <view
                class="flex-row-c-c"
                @click="changCity(tabCurrentIndex, item)"
            >
              <text
                  class="city-text"
                  :class="{ color: tabbars[tabCurrentIndex].id == item.id }"
              >{{ item.name }}
              </text
              >
              <icon
                  type="success_no_circle"
                  v-if="tabbars[tabCurrentIndex].id == item.id"
                  :id="'show' + tabCurrentIndex"
                  class="ischeck"
                  size="14"
                  :color="$lightColor"
              ></icon>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
let windowWidth = 0;
import { getRegionsById } from '@/api/common.js';

export default {
  name: 'UniCityNvue',
  props: {
    headTitle: {
      //title
      type: String,
      default: 'Region Selection'
    },
    pickerSize: {
      // how many tabs to use
      type: [String, String],
      default: '1'
    },
    provinceData: {
      // The default province and city area id, if the id is not used, it is [];
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      clearRightIcon: true, //Whether to display the right side closed icon
      scrollLeft: 500, //Left sliding distance of the top tab
      scrollTop: 0, //The default scroll top is 0
      enableScroll: true, //Whether to enable scrolling
      tabCurrentIndex: 0, //Current tab index
      tabbars: this.provinceData, //The default province and city id
      pickersize: this.pickerSize, //How many tabs are recommended as level 4
      showPicker: false //Show picker
    };
  },
  methods: {

    /**
     * Display selector
     */
    show() {
      this.showPicker = true;
      if (this.tabbars[0].children.length == 0) {
        getRegionsById(0).then((res) => {
          this.tabbars[0].children = res.data.result;
        });
      }

      windowWidth = uni.getSystemInfoSync().windowWidth;
    },

    /**
     * Close the selector
     */
    hide() {
      this.showPicker = false;
    },

    /**
     * Tab switch
     */
    changeTab(e) {
      let index = e;
      this.setScroll(index);
      //Delay 300ms, wait for the end of the swiper animation and then modify the tabbar
      this.tabCurrentIndex = index;
      setTimeout(() => {
        this.getScroll('show' + index);
      }, 10);
    },

    /**
     * Get the size of the element
     */
    getElSize(id) {
      return new Promise((res, rej) => {
        let el = uni
            .createSelectorQuery()
            .in(this)
            .select('#' + id);
        el.fields(
            {
              size: true,
              scrollOffset: true,
              rect: true
            },
            (data) => {
              res(data);
            }
        ).exec();
      });
    },

    /**
     * Call back after clicking the city
     */
    async changCity(index, item) {
      if (this.tabbars[index].id != item.id) {
        this.tabbars[index].localName = item.name;
        this.tabbars[index].id = item.id;
        if (index < this.tabbars.length - 1) {
          this.tabbars.splice(index + 1, this.tabbars.length - index - 1);
        }
        if (this.tabbars.length < this.pickersize) {
          let data = await getRegionsById(item.id);
          // Call back when the current option level is the last level, and return the selected data
          if (data.data.result.length == 0) {
            this.$emit('funcValue', this.tabbars);
            this.hide();
          } else {
            // Fill the new data into the next level
            var current = {
              localName: 'Please select',
              id: '',
              children: data.data.result
            };
            this.tabbars.push(current);
            this.tabCurrentIndex++;
// The current distance is back to the top
            this.scrollTop = 0;
          }
        } else {
          this.$emit('funcValue', this.tabbars);
          this.hide();
        }
      }
    },

    /**
     * Get the scroll distance in the current tab
     */
    async setScroll(index) {
      let width = 0;
      let nowWidth = 0;
      for (let i = 0; i <= index; i++) {
        let result = await this.getElSize('tab' + i);
        width += result.width;
        if (i === index) {
          nowWidth = result.width;
        }
      }
      if (width + nowWidth > windowWidth) {
        this.scrollLeft = width + nowWidth;
      } else {
        this.scrollLeft = 0;
      }
    },

    /**
     * Calculate the current scroll distance
     */
    getScroll(id) {
      uni
          .createSelectorQuery()
          .in(this)
          .select('.panel-scroll-box')
          .boundingClientRect((data) => {
            uni
                .createSelectorQuery()
                .in(this)
                .select('#' + id)
                .boundingClientRect((res) => {
                  if (res != undefined && res != null && res != '') {
                    this.scrollTop = res.top - data.top;
                  }
                })
                .exec();
          })
          .exec();
    }
  }
};
</script>

<style lang="scss" scoped>

.mask {
  visibility: hidden;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: all 0.3s ease;
}

.maskShow {
  visibility: visible;
  opacity: 1;
}

.cpicker-content {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}

.cpickerShow {
  transform: translateY(0);
}

.city-head {
  width: 750 rpx;
  height: 88 rpx;
  flex-direction: column;
  border-bottom-width: 1px;
  border-bottom-color: #f4f4f4;
  border-bottom-style: solid;
}

.city-head-title {
  font-size: 15px;
  line-height: 88 rpx;
  align-items: center;
  /* #ifndef APP-NVUE */
  text-align: center;
  /* #endif */
}

.clearRightIcon {
  position: absolute;
  right: 15px;
  top: 12px;
  font-size: 10px;
  color: #bebebe;
}

.nav-bar {
  position: relative;
  z-index: 10;
  height: 90 rpx;
  white-space: nowrap;
  box-shadow: 0 2 rpx 8 rpx rgba(0, 0, 0, 0.06);
  background-color: #fff;
}

.nav-item {
  /* #ifndef APP-NVUE */
  display: inline-flex !important;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex-direction: row !important;
  /* #endif */
  width: 170 rpx;
  padding: 7px 0px;
  line-height: 26px;
  align-items: center;
  justify-content: center;
  color: #303133;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-bar-title {
  font-size: 12px;
}

.current {
  color: $aider-light-color;
  border-color: $aider-light-color;
  border-bottom-width: 4 rpx;
  border-bottom-style: solid;
}

.current:after {
  width: 50%;
}

.panel-scroll-box {
  height: 516 rpx;
  margin-top: 8px;
}

.flex-row-c-c {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex-direction: row;
  /* #endif */
  padding-left: 25px;
}

.city-text {
  /* #ifdef APP-NVUE */
  flex-direction: row;
  /* #endif */
  height: 35px;
  line-height: 35px;
  font-size: 13px;
}

.hide {
  opacity: 0;
}

.ischeck {
  /* #ifndef APP-NVUE */
  display: inline-flex !important;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex-direction: column;
  /* #endif */
  margin-right: 5px;
  vertical-align: middle;
}

.color {
  color: $light-color;
}

icon {
  margin-left: 40 rpx;
}
</style>

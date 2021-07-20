<template>
  <view class="u-keyboard" @touchmove.stop.prevent>
    <view class="u-keyboard-grids">
      <block>
        <view class="u-keyboard-grids-item" v-for="(group, i) in abc ? EngKeyBoardList : areaList" :key="i">
          <view :hover-stay-time="100" @tap="carInputClick(i, j)" hover-class="u-carinput-hover"
                class="u-keyboard-grids-btn"
                v-for="(item, j) in group" :key="j">
            {{ item }}
          </view>
        </view>
        <view @touchstart="backspaceClick" @touchend="clearTimer" :hover-stay-time="100" class="u-keyboard-back"
              hover-class="u-hover-class">
          <u-icon :size="38" name="backspace" :bold="true"></u-icon>
        </view>
        <view :hover-stay-time="100" class="u-keyboard-change" hover-class="u-carinput-hover" @tap="changeCarInputMode">
          <text class="zh" :class="[!abc ? 'active' : 'inactive']">中</text>
          /
          <text class="en" :class="[abc ? 'active' : 'inactive']">英</text>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  name: 'u-keyboard',
  props: {
    // 是否打乱键盘按键的顺序
    random: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 车牌输入时，abc=true为输入车牌号码，bac=false为输入省份中文简称
      abc: false
    };
  },
  computed: {
    areaList() {
      let data = [
        'Beijing',
        'Shanghai',
        'Cantonese',
        'Jin',
        'Ji',
        'Yu',
        'cloud',
        'Liao',
        'Black',
        'Xiang',
        'Wan',
        'Lu',
        'Su',
        'Zhe',
        'Gan',
        'E',
        'Gui',
        'Gan',
        'Jin',
        'Shaan',
        'Mongolian',
        'Gee',
        'Min',
        'Expensive',
        'Yu',
        'Chuan',
        'Green',
        'Joan',
        'Ning',
        'Hang',
        'Hidden',
        'Port',
        'Australia',
        'New',
        'Make',
        'Learn'
      ];
      let tmp = [];
      // 打乱顺序
      if (this.random) data = this.$u.randomArray(data);
      // 切割成二维数组
      tmp[0] = data.slice(0, 10);
      tmp[1] = data.slice(10, 20);
      tmp[2] = data.slice(20, 30);
      tmp[3] = data.slice(30, 36);
      return tmp;
    },
    EngKeyBoardList() {
      let data = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        'Q',
        'W',
        'E',
        'R',
        'T',
        'Y',
        'U',
        'I',
        'O',
        'P',
        'A',
        'S',
        'D',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'Z',
        'X',
        'C',
        'V',
        'B',
        'N',
        'M'
      ];
      let tmp = [];
      if (this.random) data = this.$u.randomArray(data);
      tmp[0] = data.slice(0, 10);
      tmp[1] = data.slice(10, 20);
      tmp[2] = data.slice(20, 30);
      tmp[3] = data.slice(30, 36);
      return tmp;
    }
  },
  methods: {
    // 点击键盘按钮
    carInputClick(i, j) {
      let value = '';
      // 不同模式，获取不同数组的值
      if (this.abc) value = this.EngKeyBoardList[i][j];
      else value = this.areaList[i][j];
      this.$emit('change', value);
    },
    // 修改汽车牌键盘的输入模式，中文|英文
    changeCarInputMode() {
      this.abc = !this.abc;
    },
    // 点击退格键
    backspaceClick() {
      this.$emit('backspace');
      clearInterval(this.timer); //再次清空定时器，防止重复注册定时器
      this.timer = null;
      this.timer = setInterval(() => {
        this.$emit('backspace');
      }, 250);
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../libs/css/style.components.scss";

.u-keyboard-grids {
  background: rgb(215, 215, 217);
  padding: 24 rpx 0;
  position: relative;
}

.u-keyboard-grids-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-keyboard-grids-btn {
  text-decoration: none;
  width: 62 rpx;
  flex: 0 0 64 rpx;
  height: 80 rpx;
  display: inline-block;
  font-size: 36 rpx;
  text-align: center;
  line-height: 80 rpx;
  background-color: #fff;
  margin: 8 rpx 5 rpx;
  border-radius: 8 rpx;
  box-shadow: 0 2 rpx 0 rpx #888992;
  font-weight: 500;
}

.u-carinput-hover {
  background-color: rgb(185, 188, 195) !important;
}

.u-keyboard-back {
  position: absolute;
  width: 96 rpx;
  right: 22 rpx;
  bottom: 32 rpx;
  height: 80 rpx;
  background-color: rgb(185, 188, 195);
  display: flex;
  align-items: center;
  border-radius: 8 rpx;
  justify-content: center;
  box-shadow: 0 2 rpx 0 rpx #888992;
}

.u-keyboard-change {
  font-size: 24 rpx;
  box-shadow: 0 2 rpx 0 rpx #888992;
  position: absolute;
  width: 96 rpx;
  left: 22 rpx;
  line-height: 1;
  bottom: 32 rpx;
  height: 80 rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  border-radius: 8 rpx;
  justify-content: center;
}

.u-keyboard-change .inactive.zh {
  transform: scale(0.85) translateY(-10rpx);
}

.u-keyboard-change .inactive.en {
  transform: scale(0.85) translateY(10 rpx);
}

.u-keyboard-change .active {
  color: rgb(237, 112, 64);
  font-size: 30 rpx;
}

.u-keyboard-change .zh {
  transform: translateY(-10rpx);
}

.u-keyboard-change .en {
  transform: translateY(10 rpx);
}
</style>

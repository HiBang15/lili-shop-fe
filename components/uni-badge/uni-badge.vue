<template>
  <text v-if="text"
        :class="inverted ? 'uni-badge--' + type + ' uni-badge--' + size + ' uni-badge--' + type + '-inverted' : 'uni-badge--' + type + ' uni-badge--' + size"
        :style="badgeStyle" class="uni-badge" @click="onClick()">{{ text }}
  </text>
</template>

<script>
/**
 * Badge digital badge
 * @description Digital corner labels are generally used in conjunction with other controls (lists, 9 grids, etc.) for quantity prompts. The default is a solid gray background
 * @tutorial https://ext.dcloud.net.cn/plugin?id=21
 * @property {String} text subscript content
 * @property {String} type = [default|primary|success|warning|error] color type
 * @value default gray
 * @value primary blue
 * @value success green
 * @value warning yellow
 * @value error red
 * @property {String} size = [normal|small] Badge size
 * @value normal normal size
 * @value small small size
 * @property {String} inverted = [true|false] Whether there is no need for background color
 * @event {Function} click on Badge to trigger the event
 * @example <uni-badge text="1"></uni-badge>
 */
export default {
  name: 'UniBadge',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    inverted: {
      type: Boolean,
      default: false
    },
    text: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      badgeStyle: ''
    };
  },
  watch: {
    text() {
      this.setStyle();
    }
  },
  mounted() {
    this.setStyle();
  },
  methods: {
    setStyle() {
      this.badgeStyle = `width: ${ String(this.text).length * 8 + 12 }px`;
    },
    onClick() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
$bage-size: 12px;
$bage-small: scale(0.8);
$bage-height: 20px;

.uni-badge {
  /* #ifndef APP-PLUS */
  display: flex;
  /* #endif */
  justify-content: center;
  flex-direction: row;
  height: $bage-height;
  line-height: $bage-height;
  color: $uni-text-color;
  border-radius: 100px;
  background-color: $uni-bg-color-hover;
  background-color: transparent;
  text-align: center;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  font-size: $bage-size;
  padding: 0px 6px;
}

.uni-badge--inverted {
  padding: 0 5px 0 0;
  color: $uni-bg-color-hover;
}

.uni-badge--default {
  color: $uni-text-color;
  background-color: $uni-bg-color-hover;
}

.uni-badge--default-inverted {
  color: $uni-text-color-grey;
  background-color: transparent;
}

.uni-badge--primary {
  color: $uni-text-color-inverse;
  background-color: $uni-color-primary;
}

.uni-badge--primary-inverted {
  color: $uni-color-primary;
  background-color: transparent;
}

.uni-badge--success {
  color: $uni-text-color-inverse;
  background-color: $uni-color-success;
}

.uni-badge--success-inverted {
  color: $uni-color-success;
  background-color: transparent;
}

.uni-badge--warning {
  color: $uni-text-color-inverse;
  background-color: $uni-color-warning;
}

.uni-badge--warning-inverted {
  color: $uni-color-warning;
  background-color: transparent;
}

.uni-badge--error {
  color: $uni-text-color-inverse;
  background-color: $uni-color-error;
}

.uni-badge--error-inverted {
  color: $uni-color-error;
  background-color: transparent;
}

.uni-badge--small {
  transform: $bage-small;
  transform-origin: center center;
}
</style>

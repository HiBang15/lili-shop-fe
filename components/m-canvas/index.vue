<template>

  <div class="index">
    <u-modal v-model="show" :show-title="false" :show-confirm-button="false" mask-close-able>
      <view class="slot-content">
        <image @click="downLoad()" class="img" :src="imgUrl" />
        <div class="canvas-hide">
          <!-- #ifdef MP-WEIXIN -->
          <canvas id="canvas" type="2d" style="width: 600px; height: 960px" />
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <canvas canvas-id="canvas" id="canvas" style="width: 600px; height: 960px" />
          <!-- #endif -->
        </div>
      </view>
    </u-modal>

  </div>
</template>
<script>
// Introduce drawing plugin
import DrawPoster from '@/js_sdk/u-draw-poster';

export default {
  data: () => ({
    imgUrl: '', //The path of the drawn picture
    show: false, //Whether to show the modal box
    dp: {}, //The drawn dp object, used to store some methods such as drawing.
    logo: require('@/pages/passport/static/logo-title.png') //local logo address
  }),

  props: {
    /**
     * Parent parameter data
     */
    res: {
      type: null,
      default: ''
    }
  },
  onUnload() {
  },

  methods: {
    /**
     * Solve the problem of blurry pictures in WeChat applet
     */
    // #ifdef MP-WEIXIN
    st2: (size) => size * 2,
    // #endif

    // #ifndef MP-WEIXIN
    st2: (size) => size,
    // #endif

    /**
     * save Picture
     */
    downLoad() {
      uni.saveImageToPhotosAlbum({
        filePath: this.imgUrl,
        success: function () {
          uni.showToast({
            title: 'Save successfully!',
            icon: 'none'
          });
        },
        fail: function () {
          uni.showToast({
            title: 'Save failed, please try again later!',
            icon: 'none'
          });
        }
      });
    },

    /**
     * Create canvas
     */
    async init() {
      this.show = true;
      this.dp = await DrawPoster.build({
        selector: 'canvas',
        componentThis: this,
        loading: true,
        debugging: true
      });
      let dp = this.dp;
      // #ifdef MP-WEIXIN
      // Used for canvas confusion problem in WeChat applet
      dp.canvas.width = this.st2(600);
      dp.canvas.height = this.st2(960);
      // #endif
      this.draw(dp);
    },

    async draw(dp) {
      const {width, height, background, title} = this.res.container;
      const {code, img, price} = this.res.bottom;

      // /** Draw the background */
      await dp.draw((ctx) => {
        ctx.fillStyle = background;
        ctx.fillRoundRect(
            this.st2(0),
            this.st2(0),
            this.st2(width),
            this.st2(height),
            this.st2(12)
        );
        ctx.clip();
      });
      /** Draw a picture */
      dp.draw(async (ctx) => {
        await Promise.all([
          // Draw Logo
          ctx.drawImage(
              this.logo,
              this.st2(175),
              this.st2(0),
              this.st2(256),
              this.st2(144)
          ),
          // middle image
          ctx.drawImage(
              img,
              this.st2(100),
              this.st2(150),
              this.st2(400),
              this.st2(400)
          ),
          // QR code
          ctx.drawImage(
              code,
              this.st2(39),
              this.st2(750),
              this.st2(150),
              this.st2(150)
          )
        ]);
      });

      /** Draw the middle text*/
      await dp.draw((ctx) => {
        ctx.fillStyle = '#333';
        ctx.font = `bold ${ this.st2(24) }px PingFang SC`;
        ctx.textAlign = 'center';
        ctx.fillWarpText({
          text: title,
          maxWidth: this.st2(500),
          x: this.st2(300),
          y: this.st2(600),
          layer: 1
        });

        ctx.fillStyle = '#ff3c2a';
        ctx.font = `${ this.st2(38) }px PingFang SC`;
        ctx.textAlign = 'center';
        ctx.fillText(price, this.st2(300), this.st2(680));
      });

      // /** Draw bottom text */
      await dp.draw((ctx) => {
        ctx.fillStyle = '#666';
        ctx.font = `${ this.st2(24) }px PingFang SC`;
        ctx.fillText('Long press the picture to identify the QR code', this.st2(200), this.st2(866));
        ctx.fillStyle = '#666';
        ctx.font = `${ this.st2(24) }px PingFang SC`;
        ctx.fillText('View product details', this.st2(200), this.st2(900));
      });

      this.imgUrl = await dp.createImagePath();

      // console.log(posterImgUrl)
    }
  },

  async mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
page,
.index {
  height: 100%;
}

.canvas-hide {
  /* 1 */
  position: fixed;
  right: 100vw;
  bottom: 100vh;
  /* 2 */
  z-index: -9999;
  /* 3 */
  opacity: 0;
}

.index {
  position: relative;
  text-align: center;
  background: rgba($color: grey, $alpha: 0.2);
}

image {
  display: block;
}

.img {
  width: 600 rpx;
  height: 960 rpx;
}
</style>

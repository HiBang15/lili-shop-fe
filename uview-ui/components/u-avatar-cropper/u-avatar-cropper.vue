<template>
  <view class="content">
    <view class="cropper-wrapper" :style="{ height: cropperOpt.height + 'px' }">
      <canvas
          class="cropper"
          :disable-scroll="true"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
          :style="{ width: cropperOpt.width, height: cropperOpt.height, backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
          canvas-id="cropper"
          id="cropper"
      ></canvas>
      <canvas
          class="cropper"
          :disable-scroll="true"
          :style="{
					position: 'fixed',
					top: `-${cropperOpt.width * cropperOpt.pixelRatio}px`,
					left: `-${cropperOpt.height * cropperOpt.pixelRatio}px`,
					width: `${cropperOpt.width * cropperOpt.pixelRatio}px`,
					height: `${cropperOpt.height * cropperOpt.pixelRatio}`
				}"
          canvas-id="targetId"
          id="targetId"
      ></canvas>
    </view>
    <view class="cropper-buttons safe-area-padding" :style="{ height: bottomNavHeight +'px' }">
      <!-- #ifdef H5 -->
      <view class="upload" @tap="uploadTap">Select an image</view>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <view class="upload" @tap="uploadTap">Reselect</view>
      <!-- #endif -->
      <view class="getCropperImage" @tap="getCropperImage(false)">OK</view>
    </view>
  </view>
</template>

<script>
import WeCropper from './weCropper.js';

export default {
  props: {
// The style of the cropping rectangle, the attributes that can be included are lineWidth-border width (unit rpx), color: border color,
// mask-mask color, generally set to an rgba transparency, such as "rgba(0, 0, 0, 0.35)"
    boundStyle: {
      type: Object,
      default() {
        return {
          lineWidth: 4,
          borderColor: 'rgb(245, 245, 245)',
          mask: 'rgba(0, 0, 0, 0.35)'
        };
      }
    }
// // The width of the cropping frame, in rpx
// rectWidth: {
// type: [String, Number],
// default: 400
// },
// // The height of the cropping frame, in rpx
// rectHeight: {
// type: [String, Number],
// default: 400
// },
// // Output image width, unit rpx
// destWidth: {
// type: [String, Number],
// default: 400
// },
// // Output image height, unit rpx
// destHeight: {
// type: [String, Number],
// default: 400
// },
// // The output picture type, if the cropped picture is found to be large, it may be set to "png", just change it to "jpg"
// fileType: {
// type: String,
// default:'jpg',
// },
// // The quality of the generated image
// // Invalid on H5, this parameter is currently not considered
// quality: {
// type: [Number, String],
// default: 1
//}
  },
  data() {
    return {
// The height of the bottom navigation
      bottomNavHeight: 50,
      originWidth: 200,
      width: 0,
      height: 0,
      cropperOpt: {
        id: 'cropper',
        targetId: 'targetCropper',
        pixelRatio: 1,
        width: 0,
        height: 0,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (this.width - this.originWidth) / 2,
          y: (this.height - this.originWidth) / 2,
          width: this.originWidth,
          height: this.originWidth
        },
        boundStyle: {
          lineWidth: uni.upx2px(this.boundStyle.lineWidth),
          mask: this.boundStyle.mask,
          color: this.boundStyle.borderColor
        }
      },
// The size of the crop box and the output image, the height is equal to the width by default
// Output image width, unit px
      destWidth: 200,
// The width of the cropping frame, in px
      rectWidth: 200,
// The type of the output image, if the cropped image is found to be too large in the'png' type, just change it to "jpg"
      fileType: 'jpg',
      src: '' // The selected image path is used to judge whether the image is selected when you click OK
    };
  },
  onLoad(option) {
    let rectInfo = uni.getSystemInfoSync();
    this.width = rectInfo.windowWidth;
    this.height = rectInfo.windowHeight - this.bottomNavHeight;
    this.cropperOpt.width = this.width;
    this.cropperOpt.height = this.height;
    this.cropperOpt.pixelRatio = rectInfo.pixelRatio;

    if (option.destWidth) this.destWidth = option.destWidth;
    if (option.rectWidth) {
      let rectWidth = Number(option.rectWidth);
      this.cropperOpt.cut = {
        x: (this.width - rectWidth) / 2,
        y: (this.height - rectWidth) / 2,
        width: rectWidth,
        height: rectWidth
      };
    }
    this.rectWidth = option.rectWidth;
    if (option.fileType) this.fileType = option.fileType;
// Initialize
    this.cropper = new WeCropper(this.cropperOpt)
        .on('ready', ctx => {
// wecropper is ready for work!
        })
        .on('beforeImageLoad', ctx => {
// before picture loaded, i can do something
        })
        .on('imageLoad', ctx => {
// picture loaded
        })
        .on('beforeDraw', (ctx, instance) => {
// before canvas draw,i can do something
        });
// Set the style of the navigation bar to prevent users from setting it to a black background in page.json
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000'
    });
    uni.chooseImage({
      count: 1, // default 9
      sizeType: ['compressed'], // You can specify whether it is the original image or the compressed image, the default is both
      sourceType: ['album', 'camera'], // You can specify whether the source is an album or a camera, the default is both
      success: res => {
        this.src = res.tempFilePaths[0];
// After obtaining the cropped image resource, add the src attribute and its value to the data
        this.cropper.pushOrign(this.src);
      }
    });
  },
  methods: {
    touchStart(e) {
      this.cropper.touchStart(e);
    },
    touchMove(e) {
      this.cropper.touchMove(e);
    },
    touchEnd(e) {
      this.cropper.touchEnd(e);
    },
    getCropperImage(isPre = false) {
      if (!this.src) return this.$u.toast('Please select the picture first and then crop it');

      let cropper_opt = {
        destHeight: Number(this.destWidth), // uni.canvasToTempFilePath requires these parameters to be numeric
        destWidth: Number(this.destWidth),
        fileType: this.fileType
      };
      this.cropper.getCropperImage(cropper_opt, (path, err) => {
        if (err) {
          uni.showModal({
            title: 'Warm reminder',
            content: err.message
          });
        } else {
          if (isPre) {
            uni.previewImage({
              current: '', // http link of the currently displayed picture
              urls: [path] // http link list of pictures that need to be previewed
            });
          } else {
            uni.$emit('uAvatarCropper', path);
            this.$u.route({
              type: 'back'
            });
          }
        }
      });
    },
    uploadTap() {
      const self = this;
      uni.chooseImage({
        count: 1, // default 9
        sizeType: ['original', 'compressed'], // You can specify whether it is the original image or the compressed image, the default is both
        sourceType: ['album', 'camera'], // You can specify whether the source is an album or a camera, the default is both
        success: (res) => {
          self.src = res.tempFilePaths[0];
// After obtaining the cropped image resource, add the src attribute and its value to the data

          self.cropper.pushOrign(this.src);
        }
      });
    }
  }
};
</script>

<style scoped>
@import '../../libs/css/style.components.scss';

.content {
  background: rgba(255, 255, 255, 1);
}

.cropper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
}

.cropper-buttons {
  background-color: #000000;
  color: #eee;
}

.cropper-wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #000;
}

.cropper-buttons {
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 28 rpx;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
  width: 50%;
  text-align: center;
}

.cropper-buttons .upload {
  text-align: left;
  padding-left: 50 rpx;
}

.cropper-buttons .getCropperImage {
  text-align: right;
  padding-right: 50 rpx;
}
</style>

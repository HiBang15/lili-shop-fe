import uni from './utils/global';
import { handleBuildOpts, extendMount } from './utils/utils';
import { getCanvas2dContext } from './utils/wx-utils';
// Expand mount storage
let drawPosterExtend = {};
let drawCtxPosterExtend = {};

class DrawPoster {
   /** Builder, build returns the current instance, and mount multiple methods */
   constructor(canvas, ctx, canvasId, loading, debugging, loadingText, createText, tips) {
      var _a;
      this.canvas = canvas;
      this.ctx = ctx;

      this.canvasId = canvasId;
      this.loading = loading;
      this.debugging = debugging;
      this.loadingText = loadingText;
      this.createText = createText;
      this.executeOnions = [];
      this.stopStatus = false;
      /** Prompter, incoming messages and data */
      this.debuggingLog = (message, data, color = '#3489fd') => {
         if (this.debugging) {
            if (data) {
               console.log(`%c${ this.canvasId } -> ${ message }`, `color: ${ color }`, data);
            } else {
               console.log(`%c${ this.canvasId } -> ${ message }`, `color: ${ color }`);
            }
         }
      };
      /** Drawer, receive executor function, add to drawing container */
      this.draw = (execute) => {
         const length = this.executeOnions.length;
         this.executeOnions.push(async () => {
            var _a, _b;
            try {
               this.ctx.save();
               await execute(this.ctx);
               this.ctx.restore();
               return true;
            } catch (error) {
               const isOutError = ((_b = (_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.call(_a, `'nodeId' of undefined`)) >= 0;
               !isOutError && console.error(`${ this.canvasId } -> drawing stack (${ length }), drawing error: `, error);
               return false;
            }
         });
      };
      /** Wait for the creation of the painting, and empty the painter container after success */
      this.awaitCreate = async () => {
         this.debuggingLog('Drawing the poster...');
         this.loading && uni.showLoading({title: this.loadingText});
         const tips = [];
         for (let i = 0; i < this.executeOnions.length; i++) {
            const execute = this.executeOnions[i];
            tips.push(await execute());
         }
         this.executeOnions = [];
         this.debuggingLog('Drawing status', tips);
         // The current drawing is type2 drawing
         if (this.drawType === 'type2d') {
            this.loading && uni.hideLoading();

            return tips;
         }
         // Currently drawn as context drawing
         return await new Promise((resolve) => {
            this.ctx.draw(true, () => {
               resolve(tips);
               this.loading && uni.hideLoading();
            });
         });
      };
      /** Create canvas local address @returns {string} local address */
      this.createImagePath = async (baseOptions = {}) => {
         const {canvas, canvasId, executeOnions, awaitCreate} = this;
         executeOnions.length && await awaitCreate();
         // If it is currently stopped
         if (this.stopStatus) {
            this.stopStatus = false;
            return '---stop createImagePath---';
         }
         this.loading && uni.showLoading({title: this.createText});
         const options = Object.assign({}, baseOptions);
         if (this.drawType === 'context')
            options.canvasId = canvasId;
         if (this.drawType === 'type2d')
            options.canvas = canvas;

         console.log(options);
         return new Promise((resolve, reject) => {
            options.success = (res) => {
               resolve(res.tempFilePath);
               this.loading && uni.hideLoading();
               this.debuggingLog('Drawing successfully 🎉', res, '#19be6b');
            };
            options.fail = (err) => {
               reject(err);
               this.loading && uni.hideLoading();
               this.debuggingLog('Drawing failed 🌟', err, '#fa3534');
            };
            uni.canvasToTempFilePath(options);
         });
      };
      /** Stop the current drawing, call it to stop the drawing of the current drawing stack */
      this.stop = () => {
         this.executeOnions = [];
         this.stopStatus = true;
      };
      if (!canvas || !ctx || !canvasId) {
         throw new Error('DrawPoster Error: Use DrawPoster.build(string | ops) to build drawPoster instance objects');
      }
      // Determine the current drawing type
      ctx.drawType = this.drawType = (ctx.draw) ? 'context' : 'type2d';
      // Mount global instance, drawing extension
      extendMount(this.ctx, drawCtxPosterExtend, (extend, target) => {
         var _a;
         (_a = target === null || target === void 0 ? void 0 : target.init) === null || _a === void 0 ? void 0 : _a.call(target, this.canvas, this.ctx);
         return (...args) => extend(this.canvas, this.ctx, ...args);
      });
      extendMount(this, drawPosterExtend, (extend, target) => {
         var _a;
         (_a = target === null || target === void 0 ? void 0 : target.init) === null || _a === void 0 ? void 0 : _a.call(target, this);
         return (...args) => extend(this, ...args);
      });
      // When leaving the page, automatically call to stop drawing
      const _this = this;
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      // Query ID, does not exist, uninstall callback on the replacement page, to avoid infinite loop
      if (!((_a = page === null || page === void 0 ? void 0 : page.onUnload) === null || _a === void 0 ? void 0 : _a.identification)) {
         page.oldOnUnload = page.onUnload;
         page.onUnload = function () {
            _this === null || _this === void 0 ? void 0 : _this.stop();
            page.oldOnUnload();
         };
         page.onUnload.identification = true;
      }
      tips && this.debuggingLog('Build completed', {canvas, ctx, selector: canvasId}, '#19be6b');
   }
}

/** Pass in the mount configuration object, add extension methods */
DrawPoster.use = (opts) => {
   if (opts.name)
      drawPosterExtend[opts.name] = opts;
};
/** Pass in the mount configuration object, add painting extension method */
DrawPoster.useCtx = (opts) => {
   if (opts.name)
      drawCtxPosterExtend[opts.name] = opts;
};
/** Construct a method of drawing a poster rectangle, pass in the canvas selector or configuration object, and return the drawing object */
DrawPoster.build = async (options, tips = true) => {
   var _a, _b, _c, _d, _e;
   const config = handleBuildOpts(options);
   // Initialize and monitor the drawing object of the current page
   const pages = getCurrentPages();
   const page = pages[pages.length - 1];
   const gcanvas = DrawPoster.prototype['gcanvas'];
   if (page[config.selector + '__dp']) {
      return page[config.selector + '__dp'];
   }
   if (config.gcanvas) {
      if (!gcanvas)
         console.error('--- gcanvas extension is not currently introduced, it will automatically switch to normal canvas ---');
      else
         gcanvas.enable((_b = (_a = config.componentThis) === null || _a === void 0 ? void 0 : _a.$refs) === null || _b === void 0 ? void 0 : _b[config.selector], {
            bridge: gcanvas.WeexBridge
         });
   }
   // Get the canvas instance
   const canvas = config.gcanvas && gcanvas ?
      gcanvas.enable((_d = (_c = config.componentThis) === null || _c === void 0 ? void 0 : _c.$refs) === null || _d === void 0 ? void 0 : _d[config.selector], {
         bridge: gcanvas.WeexBridge
      }) :
      await getCanvas2dContext(config.selector, config.componentThis);
   const ctx = (((_e = canvas.getContext) === null || _e === void 0 ? void 0 : _e.call(canvas, '2d')) || uni.createCanvasContext(config.selector, config.componentThis));
   const dp = new DrawPoster(canvas, ctx, config.selector, config.loading, config.debugging, config.loadingText, config.createText, tips);
   // Save the current drawing object
   page[config.selector + '__dp'] = dp;
   return page[config.selector + '__dp'];
};
/** Build multiple methods for drawing poster rectangles, pass in an array of selectors or configuration objects, and return multiple drawing objects */
DrawPoster.buildAll = async (optionsAll) => {
   const dpsArr = await Promise.all(optionsAll.map(async (options) => {
      return await DrawPoster.build(options, false);
   }));
   const dpsObj = {};
   dpsArr.forEach(dp => dpsObj[dp.canvasId] = dp);
   console.log('%cdraw-poster completed:', '#E3712A', dpsObj);
   return dpsObj;
};
export default DrawPoster;

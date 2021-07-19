import { downloadImgUrl } from '../../utils/wx-utils';

/** Waiting to draw the picture prototype method */
export default {
   name: 'drawImage',
   init: (canvas, ctx) => {
      ctx.drawImageProto = ctx.drawImage;
   },
   handle: async (canvas, ctx, url, sx, sy, sh, sw, dx, dy, dh, dw) => {
      // download path
      const path = await downloadImgUrl(url);
      // Mark the current drawing that there is a picture drawing
      let result = false;
      // The basic drawing method, if it is the fit method, all parameters are passed in, otherwise only four parameters are passed in
      const baseDrawImage = (imageResource) => {
         const isFit = typeof dx === 'number' && typeof dw === 'number';
         if (isFit) {
            ctx.drawImageProto(imageResource, sx, sy, sh, sw, dx, dy, dh, dw);
         } else {
            ctx.drawImageProto(imageResource, sx, sy, sh, sw);
         }
      };
      // If it is the context drawing method, draw directly
      if (ctx.drawType === 'context') {
         baseDrawImage(path);
         result = true;
      }
      // If it is a type2d drawing method, wait for the picture to be drawn
      if (ctx.drawType === 'type2d') {
         result = await new Promise(resolve => {
            const image = canvas.createImage();
            image.src = path;
            image.onload = () => {
               baseDrawImage(image);
               resolve(true);
            };
            image.onerror = () => resolve(false);
         });
      }
      return result;
   }
};

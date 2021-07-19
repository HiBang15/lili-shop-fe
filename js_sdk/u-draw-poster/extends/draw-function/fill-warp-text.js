/** Draw a newline font prototype method */
export default {
   name: 'fillWarpText',
   handle: (canvas, ctx, config) => {
      const newConfig = config = Object.assign({
         maxWidth: 100,
         layer: 2,
         lineHeight: Number(ctx.font.replace(/[^0-9.]/g, '')),
         x: 0,
         y: Number(ctx.font.replace(/[^0-9.]/g, '')) / 1.2,
         splitText: '',
         notFillText: false
      }, config);
      const {text, splitText, maxWidth, layer, lineHeight, notFillText, x, y} = newConfig;
      // When the string is empty, throw an error
      if (!text) {
         throw Error('warpFillText Error: text is empty string');
      }
      // Split all single strings
      const chr = text.split(splitText);
      // The container of each line of fonts stored
      let row = [];
      // Determine the string
      let timp = '';
      if (splitText) {
         row = chr;
      } else {
         // Traverse all the strings, fill the row container
         for (let i = 0; i < chr.length; i++) {
            // When the ranks are exceeded, the traversal is stopped, saving calculation time
            if (row.length > layer) {
               break;
            }
            if (ctx.measureText(timp).width < maxWidth) {
               // If it exceeds the length, add it to the row array
               timp += chr[i];
            } else {
               // If it exceeds the length of a line, wrap the line and clear the container
               i--;
               row.push(timp);
               timp = '';
            }
         }
         // If there are fonts left, add a line at the end
         if (timp) {
            row.push(timp);
         }
         // If the length of the array is greater than the specified number of rows
         if (row.length > layer) {
            row = row.slice(0, layer);
            // end index
            const end = layer - 1;
            for (let i = 0; i < row[end].length; i++) {
               const currentWidth = ctx.measureText(`${ row[end] }...`).width;
               if (currentWidth > maxWidth) {
                  // Add... When the current width is greater than the maximum width, remove one character string
                  const strEnd = row[end].length - 1;
                  row[end] = row[end].slice(0, strEnd);
               } else {
                  row[end] += '...';
                  break;
               }
            }
         }
      }
      // Store and return drawing information
      const drawInfos = row.map((item, index) => {
         const info = {
            text: item,
            y: y + index * lineHeight,
            x: x
         };
         // Perform drawing information by default
         if (!notFillText) {
            ctx.fillText(info.text, info.x, info.y);
         }
         return info;
      });
      return drawInfos;
   }
};

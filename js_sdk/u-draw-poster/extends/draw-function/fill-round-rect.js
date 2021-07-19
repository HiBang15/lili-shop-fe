/** Method of drawing a filled rectangle with rounded corners */
export default {
    name: 'fillRoundRect',
    handle: (canvas, ctx, x, y, w, h, r) => {
        ctx.roundRect(x, y, w, h, r, true);
    }
};

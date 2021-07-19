/** Method of drawing a filled rectangle with rounded corners */
export default {
    name: 'strokeRoundRect',
    handle: (canvas, ctx, x, y, w, h, r) => {
        ctx.roundRect(x, y, w, h, r, false, true);
    }
};

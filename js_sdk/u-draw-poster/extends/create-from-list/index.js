/** Drawing form extension method */
export default {
    name: 'createLayer',
    init: (dp) => {
        dp.from = {
            height: 0,
            padding: 8,
            margin: 0
        };
        dp.setFromOptions = (opts) => {
            if (typeof opts.height !== 'undefined') {
                dp.from.height = opts.height;
            }
            if (typeof opts.margin !== 'undefined') {
                dp.from.margin = opts.margin;
            }
            if (typeof opts.padding !== 'undefined') {
                dp.from.padding = opts.padding;
            }
        };
    },
    handle: (dp, afferOpts, rowList) => {
        // Current configuration (head offset, column margin, form margin)
        const height = dp.from.height;
        const margin = dp.from.margin;
        const padding = dp.from.padding;
        // current layer width
        const containerWidth = dp.canvas.width-(margin * 2);
        // Basic layer configuration
        const opts = Object.assign({ background: "#fff", columnY: height || margin, self: true, line: true, lineHeight: 0, border: true }, afferOpts);
        // Basic column configuration
        const baseRowOpts = {
            text: "",
            font: "24px sans-serif",
            color: "#333",
            center: false,
            width: 0,
        };
        // The highest accumulative column is defined as the level height
        let maxRowHeight = 0;
        // Accumulate fixed grid column offset
        let columnOffsetX = margin;
        // Create a line drawing task
        const drawLayerInfos = rowList.map((afferRowOpts = {}, index) => {
            const rowOpts = Object.assign(Object.assign({}, baseRowOpts), afferRowOpts);
            let columnX = 0; // X axis of each column
            let columnW = 0; // width of each column
            let fontOffsetX = 0; // font offset X axis
            let fontMaxWidth = 100; // Maximum font width
            opts.lineHeight = opts.lineHeight || Number(rowOpts.font.replace(/[^0-9.]/g, ""));
            if (opts.self) {
                // Adaptive grid grid calculation
                columnX = containerWidth-(containerWidth / (index + 1)) + margin;
                columnW = containerWidth / rowList.length;
                if (columnX> 0 && columnX <containerWidth-columnW) {
                    columnX = (columnW * index) + margin;
                }
                fontOffsetX = rowOpts.center? columnX + (columnW / 2): columnX + padding;
                fontMaxWidth = columnW-(padding * 3);
            }
            if (!opts.self) {
                // Fixed grid grid calculation
                columnW = rowOpts.width;
                columnX = columnOffsetX;
                fontMaxWidth = columnW-(padding * 3);
                fontOffsetX = rowOpts.center? columnOffsetX + (rowOpts.width / 2): columnOffsetX + padding;
                columnOffsetX += rowOpts.width;
            }
            dp.ctx.font = rowOpts.font;
            const drawFontInfos = dp.ctx.fillWarpText({
                text: rowOpts.text,
                maxWidth: fontMaxWidth,
                lineHeight: opts.lineHeight,
                x: fontOffsetX,
                y: opts.columnY,
                layer: 10,
                notFillText: true
            });
            // The height of the current row
            const rowHeight = (opts.lineHeight * drawFontInfos.length) + (padding * 3);
            // If the column height is greater than the cumulative height, replace the cumulative height
            if (rowHeight> maxRowHeight) {
                maxRowHeight = rowHeight;
            }
            return {
                font: rowOpts.font,
                center: rowOpts.center,
                color: rowOpts.color,
                border: opts.border,
                background: opts.background,
                lineHeight: opts.lineHeight,
                line: opts.line,
                drawFontInfos,
                columnY: opts.columnY,
                columnX,
                columnW,
                columnH: maxRowHeight,
                margin,
                padding
            };
        });
        // Add the line drawing task to the drawing container
        dp.draw((ctx) => drawLayerInfos.forEach((rowOpts, index) => {
            ctx.font = rowOpts.font;
            ctx.fillStyle = rowOpts.background;
            ctx.strokeStyle = "#333";
            ctx.textBaseline = "middle";
            ctx.textAlign ='left';
            if (rowOpts.center) {
                ctx.textAlign = "center";
            }
            ctx.fillRect(rowOpts.columnX, rowOpts.columnY, rowOpts.columnW, rowOpts.columnH);
            if (rowOpts.border) {
                dp.ctx.strokeRect(margin, rowOpts.columnY, dp.canvas.width-margin, maxRowHeight);
            }
            if (rowOpts.line && rowOpts.columnX !== margin) {
                ctx.moveTo(rowOpts.columnX, rowOpts.columnY);
                ctx.lineTo(rowOpts.columnX, rowOpts.columnY + rowOpts.columnH);
                ctx.stroke();
                ctx.beginPath();
            }
            ctx.fillStyle = rowOpts.color;
            rowOpts.drawFontInfos.forEach(fontInfo => {
                // Calculate the y-axis length of each line of font drawing
                // y (the current column top axis) + (rowOpts.columnH (the highest length of the current column) / 2)-(((total number of columns-1) * row height) / 2)
                const textTotal = rowOpts.drawFontInfos.length-1;
                const textMiddleY = (textTotal * rowOpts.lineHeight) / 2;
                let fontOffsetY = fontInfo.y + (rowOpts.columnH / 2);
                fontOffsetY -= textMiddleY;
                ctx.fillText(fontInfo.text, fontInfo.x, fontOffsetY);
            });
        }));
        if (opts.columnY === 0 || opts.columnY === margin) {
            maxRowHeight += margin;
        }
        // superimposed height
        dp.from.height += maxRowHeight;
        return maxRowHeight;
    },
};

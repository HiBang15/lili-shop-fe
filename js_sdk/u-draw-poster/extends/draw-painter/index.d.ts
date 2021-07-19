import {DrawPosterUseOpts} from '../../utils/interface';
import {ImageFitOption} from '../draw-function/draw-image-fit';

/** Basic information of rectangle */
interface PainterItemSize {
    /** The width of the container, a fixed value */
    width: number;
    /** The height of the container, fixed value */
    height: number;
}

/** Element location information */
interface PainterItemSite {
    /** The distance between the anchor point of the element and the left; default: 0 */
    left?: number;
    /** The distance between the anchor point of the element and the upper edge; default: 0 */
    top?: number;
}

/** Draw picture information */
interface PainterImageInfo extends PainterItemSize, PainterItemSite {
    /** Draw picture elements */
    type: 'image';
    /** The map's address */
    src: string;
    /** Picture adaptive, refer to css attribute object-fit */
    objectFit?: ImageFitOption['objectFit'];
    /** The position of the image displayed in the element container, please refer to the css attribute object-position */
    position?: ImageFitOption['intrinsicPosition'];
    /** Fillet size; default: 0 */
    radius?: number;
}

/** Draw rectangle information */
interface PainterRectInfo extends PainterItemSize, PainterItemSite {
    /** Draw rectangular elements */
    type: 'rect';
    /** Rectangle background color; default: "#000" */
    background?: string;
    /** Fillet size; default: 0 */
    radius?: number;
}

/** Draw a single line of text information */
interface PainterTextInfo extends PainterItemSite {
    /** Draw text elements */
    type: 'text';
    /** Text color; default: "#000" */
    color?: string;
    /** Font; Default: "serial" */
    fontFamily?: string;
    /** Font size (unit rpx); Default: 30 rpx */
    fontSize?: number;
    /** Font weight; Default: "normal" Options: "bold" */
    fontWeight?: string;
    /** Font Default: "normal" Optional: "italic" */
    fontStyle?: string;
    /** The width of the element (unit rpx), which affects the position of the next element when it is arranged horizontally. When it is null, it will be calculated according to the actual width of the text */
    width?: number;
    /** Text content */
    content: string;
}

/** Draw multiple lines of text information */
interface PainterLineFeedTextInfo extends PainterItemSite {
    /** Draw a newline text element */
    type: 'line-feed-text';
    /** Text color; default: "#000" */
    color?: string;
    /** Font; Default: "serial" */
    fontFamily?: string;
    /** Font size (unit rpx); default: 30 rpx */
    fontSize?: number;
    /** Font weight; Default: "normal" Options: "bold" */
    fontWeight?: string;
    /** Font Default: "normal" Optional: "italic" */
    fontStyle?: string;
    /** The width of the text block, cannot be empty */
    width: number;
    /** Line height; default to the current text line height */
    lineHeight?: number;
    /** The maximum number of lines of text, ellipsis will be displayed when it exceeds; 3 lines by default */
    lineClamp?: number;
    /** Text content */
    content: string;
}

/** Draw QR code information */
interface PainterQrCodeInfo extends PainterItemSite {
    /** Draw a newline text element */
    type: 'qr-code';
    /** QR code size */
    size: number;
    /** QR code content */
    content: string;
    /** Margin, the actual size of the QR code will be scaled and adjusted according to the set margin value (default: 5) */
    margin?: number;
    /** Background color (default:'#ffffff')*/
    backgroundColor?: string;
    /** Foreground color (default:'#000000') */
    foregroundColor?: string;
}

export interface PainterContainerOption extends PainterItemSize {
    /** Array of drawn items */
    contents: Array<PainterImageInfo | PainterRectInfo | PainterTextInfo | PainterLineFeedTextInfo | PainterQrCodeInfo>;
}

declare const _default: DrawPosterUseOpts;
export default _default;

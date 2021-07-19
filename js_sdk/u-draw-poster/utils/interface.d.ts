/// <reference types="@dcloudio/types" />
import DrawPoster from '../draw-poster';
import {ImageFitOption} from '../extends/draw-function/draw-image-fit';
import {CreateLayerOpts, DrawRowOpt} from '../extends/create-from-list';
import {PainterContainerOption} from '../extends/draw-painter';

/** Draw the container */
export declare type Execute = Array<() => Promise<boolean>>;

export interface drawPosterExtends {
    from: {
        height: number;
        padding: number;
        margin: number;
    };
    createLayer: (afferOpts: CreateLayerOpts, rowList: DrawRowOpt[]) => number;
    setFromOptions: (opts: Partial<{
        height: number;
        padding: number;
        margin: number;
    }>) => void;
    gcanvas: {
        WeexBridge: any;
        Image: any;
        enable: (el: any, options: {
            bridge?: any;
            debug?: boolean;
            disableAutoSwap?: any;
            disableComboCommands?: any;
        }) => Canvas;
    };
    painter: (option: PainterContainerOption) => void;
}

/** Builder configuration */
export interface DrawPosterBuildOpts {
    /** Query selector; note that # */
    selector: string;
    /** Select component range */
    componentThis?: any;
    /** The drawing type is 2d drawing, which is enabled by default, and is dynamically loaded in the WeChat applet */
    type2d?: boolean;
    /** Whether to load prompt when drawing */
    loading?: boolean;
    /** When there is a drawing picture, the time (seconds) to wait for the drawing to be completed only takes effect in the App
     *
     * View the document description specifically: https://github.com/TuiMao233/uni-draw-poster
     */
    drawImageTime?: number;
    /** Whether to enable debugging mode */
    debugging?: boolean;
    /** Load prompt text */
    loadingText?: string;
    /** Create picture prompt text */
    createText?: string;
    /** Whether to start gcanvas(nvue) */
    gcanvas?: boolean;
}

/** Draw line break configuration */
export interface FillWarpTextOpts {
    text: string;
    maxWidth?: number;
    lineHeight?: number;
    layer?: number;
    x?: number;
    y?: number;
    splitText?: string;
    notFillText?: boolean;
}

/** Draw QR code configuration */
export interface DrawQrCodeOpts {
    text: string;
    x?: number;
    y?: number;
    size?: number;
    margin?: number;
    backgroundColor?: string;
    foregroundColor?: string;
}

/** Draw line break, single line information */
export interface FillWarpTextItemInfo {
    text: string;
    y: number;
    x: number;
}

/** Draw the brush */
export interface DrawPosterCanvasCtx extends UniApp.CanvasContext {
    [key: string]: any;

    createImageData: () => ImageData;
    textAlign: CanvasTextDrawingStyles['textAlign'];
    textBaseline: CanvasTextDrawingStyles['textBaseline'];
    transform: CanvasTransform['transform'];
    /** Draw a picture prototype */
    drawImageProto: UniApp.CanvasContext['drawImage'];
    /** Current drawing type */
    drawType: 'context' | 'type2d';

    /** Wait for the picture to be drawn
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawImage(url: string, dx?: number | undefined, dy?: number | undefined, dWidth?: number | undefined, dHeigt?: number | undefined, sx?: number | undefined, sy?: number | undefined, sWidth?: number | undefined, sHeight?: number | undefined): Promise<boolean>;

    /** Draw a picture with rounded corners
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawRoundImage(url: string, x: number, y: number, w: number, h: number, r?: number): Promise<boolean>;

    /** Draw Object-Fit mode picture
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawImageFit(url: string, opts?: ImageFitOption): Promise<boolean>;

    /** Draw a newline font
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    fillWarpText(options: FillWarpTextOpts): Array<FillWarpTextItemInfo>;

    /** Draw a rounded rectangle (prototype)
     *
     */
    roundRect(x: number, y: number, w: number, h: number, r: number, fill?: boolean, stroke?: boolean): void;

    /** Draw a rounded rectangle (fill)
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    fillRoundRect(x: number, y: number, w: number, h: number, r: number): void;

    /** Draw a rounded rectangle (border)
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    strokeRoundRect(x: number, y: number, w: number, h: number, r: number): void;

    /** Draw a QR code
     *
     * Documentation: https://tuimao233.gitee.io/mao-blog/my-extends/u-draw-poste
     */
    drawQrCode(options: DrawQrCodeOpts): void;
}

/** Canvas2d instance */
export interface Canvas {
    width: number;
    height: number;

    getContext(contextType: '2d' | 'webgl'): DrawPosterCanvasCtx | WebGLRenderingContext;

    createImage(): {
        src: string;
        width: number;
        height: number;
        onload: () => void;
        onerror: () => void;
    };

    requestAnimationFrame(callback: Function): number;

    cancelAnimationFrame(requestID: number): void;

    createImageData(): ImageData;

    createPath2D(path: Path2D): Path2D;

    toDataURL(type: string, encoderOptions: number): string;
}

/** Create image path configuration item */
export interface CreateImagePathOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    destWidth?: number;
    destHeight?: number;
}

/** Drawing instance extension configuration */
export interface DrawPosterUseOpts {
    name: string;
    init?: (dp: InstanceType<typeof DrawPoster>) => void;
    handle: (dp: InstanceType<typeof DrawPoster>, ...args: any[]) => any;
    createImage?: (dp: InstanceType<typeof DrawPoster>) => void;

    [key: string]: any;
}

/** Drawing brush instance extension configuration */
export interface DrawPosterUseCtxOpts {
    name: string;
    init?: (canvas: Canvas, ctx: DrawPosterCanvasCtx) => void;
    handle: (canvas: Canvas, ctx: DrawPosterCanvasCtx, ...args: any[]) => any;

    [key: string]: any;
}

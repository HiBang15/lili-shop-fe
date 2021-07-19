import {Canvas, DrawPosterCanvasCtx, CreateImagePathOptions, DrawPosterBuildOpts, DrawPosterUseOpts, drawPosterExtends, DrawPosterUseCtxOpts} from "./utils/interface";
declare type DrawPosterInstanceType = InstanceType<typeof DrawPoster> & drawPosterExtends;
declare class DrawPoster {
    canvas: Canvas;
    ctx: DrawPosterCanvasCtx;
    canvasId: string;
    loading: boolean;
    debugging: boolean;
    loadingText: string;
    createText: string;
    [key: string]: any;
    private executeOnions;
    private stopStatus;
    private drawType;
    /** Builder, build returns the current instance, and mount multiple methods */
    constructor(canvas: Canvas, ctx: DrawPosterCanvasCtx, canvasId: string, loading: boolean, debugging: boolean, loadingText: string, createText: string, tips: boolean);
    /** Prompter, incoming messages and data */
    private debuggingLog;
    /** Pass in the mount configuration object, add extension methods */
    static use: (opts: DrawPosterUseOpts) => void;
    /** Pass in the mount configuration object, add painting extension method */
    static useCtx: (opts: DrawPosterUseCtxOpts) => void;
    /** Construct a method of drawing a poster rectangle, pass in the canvas selector or configuration object, and return the drawing object */
    static build: (options: string | DrawPosterBuildOpts, tips?: boolean) => Promise<DrawPosterInstanceType>;
    /** Build multiple methods for drawing poster rectangles, pass in an array of selectors or configuration objects, and return multiple drawing objects */
    static buildAll: (optionsAll: (string | DrawPosterBuildOpts)[]) => Promise<{
        [key: string]: DrawPosterInstanceType;
    }>;
    /** Drawer, receive executor function, add to drawing container */
    draw: (execute: (ctx: DrawPosterCanvasCtx) => Promise<any> | void) => void;
    /** Wait for the creation of the painting, and empty the painter container after success */
    awaitCreate: () => Promise<boolean[]>;
    /** Create canvas local address @returns {string} local address */
    createImagePath: (baseOptions?: CreateImagePathOptions) => Promise<string>;
    /** Stop the current drawing, call it to stop the drawing of the current drawing stack */
    stop: () => void;
}
export default DrawPoster;

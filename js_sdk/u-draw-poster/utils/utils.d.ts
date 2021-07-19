import {DrawPosterBuildOpts} from "./interface";
/** Is it a base64 local address */
export declare const isBaseUrl: (str: string) => boolean;
/** Is it the local address of the applet */
export declare const isTmpUrl: (str: string) => boolean;
/** Is it a network address */
export declare const isNetworkUrl: (str: string) => boolean;
/** The object target is mounted to the object current */
export declare const extendMount: (current: Record<any, any>, target: Record<any, any>, handle?: (extend: Function, target?: Record<any, any> | undefined) => any) => void;
/** Process build configuration */
export declare const handleBuildOpts: (options: string | DrawPosterBuildOpts) => {
     selector: string;
     componentThis: any;
     type2d: boolean;
     loading: boolean;
     debugging: boolean;
     loadingText: string;
     createText: string;
     gcanvas: boolean;
};

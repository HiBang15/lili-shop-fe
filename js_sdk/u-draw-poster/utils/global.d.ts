/// <reference types="@dcloudio/types" />
/** Current environment type */
export declare type UniPlatforms ='app-plus' |'app-plus-nvue' |'h5' |'mp-weixin' |'mp-alipay' |'mp-baidu' |'mp-toutiao' |'mp- qq' |'mp-360' |'mp' |'quickapp-webview' |'quickapp-webview-union' |'quickapp-webview-huawei' | undefined;
export declare const PLATFORM: UniPlatforms;
/** Global object */
declare const _uni: UniApp.Uni;
export default _uni;

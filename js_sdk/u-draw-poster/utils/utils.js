import {PLATFORM} from "./global";
/** Is it a base64 local address */
export const isBaseUrl = (str) => {
    return /^\s*data:(?:[az]+\/[a-z0-9-+.]+(?:;[az-]+=[a-z0-9-]+)?) ?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i .test(str);
};
/** Is it the local address of the applet */
export const isTmpUrl = (str) => {
    return /http:\/\/temp\/wx/.test(str);
};
/** Is it a network address */
export const isNetworkUrl = (str) => {
    return /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&: /~+#-]*[\w@?^=%&/~+#-])?$/.test(str);
};
/** The object target is mounted to the object current */
export const extendMount = (current, target, handle = (extend, target) => undefined) => {
    for (const key in target) {
        current[key] = handle(target[key].handle, target[key]) || target[key].handle;
    }
};
/** Process build configuration */
export const handleBuildOpts = (options) => {
    let defaultOpts = {
        selector:'',
        componentThis: undefined,
        type2d: true,
        loading: false,
        debugging: false,
        loadingText:'Drawing the poster...',
        createText:'Generating picture...',
        gcanvas: false
    };
    if (typeof options === "string") {
        defaultOpts.selector = options;
    }
    else {
        defaultOpts = Object.assign(Object.assign({}, defaultOpts), options);
    }
    const oldSelector = defaultOpts.selector;
    if (PLATFORM ==='mp-weixin' && defaultOpts.type2d) {
        defaultOpts.selector ='#' + defaultOpts.selector;
    }
    if (!PLATFORM) {
        console.error('Attention! draw-poster is not enabled for uni conditional compilation! When the environment is WeChat applet, it will not dynamically switch to type2d mode');
        console.error(`Please add'uni-draw-poster' in transpileDependencies in vue.config.js`);
        console.error(`Or you can add # in the selector string prefix to switch to type2d drawing`);
        defaultOpts.selector = oldSelector;
    }
    return defaultOpts;
};

/**
 * base: Basic business API
 * buyer: buyer API
 */
// Development environment
const dev = {
   common: 'https://common-api.pickmall.cn',
   buyer: 'https://buyer-api.pickmall.cn'

};
// Production Environment
const prod = {
   common: 'https://common-api.pickmall.cn',
   buyer: 'https://buyer-api.pickmall.cn'
};

//Default production environment
let api = dev;
//If it is a development environment
if (process.env.NODE_ENV == 'development') {
   api = dev;
} else {
   api = prod;
}
//WeChat applet, the app packaging method is recommended to be a production environment, so this block is directly conditionally compiled and assigned
// #ifdef MP-WEIXIN || APP-PLUS
api = prod;
// #endif

api.buyer += '/buyer';
api.common += '/common';
export default {
   ...api
};

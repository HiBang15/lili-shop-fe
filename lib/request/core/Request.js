/**
 * @Class Request
 * @description luch-request http request plugin
 * @version 3.0.2
 * @Author lu-ch
 * @Date 2020-06-04
 * @Email webwork.s@qq.com
 * Document: https://quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: 2.7.9
 */


import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';
import defaults from './defaults';
import { isPlainObject } from '../utils';

export default class Request {
   /**
    * @param {Object} arg-global configuration
    * @param {String} arg.baseURL-global root path
    * @param {Object} arg.header-global header
    * @param {String} arg.method = [GET|POST|PUT|DELETE|CONNECT|HEAD|OPTIONS|TRACE]-Global default request method
    * @param {String} arg.dataType = [json]-the global default dataType
    * @param {String} arg.responseType = [text|arraybuffer]-the global default responseType. App and Alipay applet are not supported
    * @param {Object} arg.custom-global default custom parameters
    * @param {Number} arg.timeout-the global default timeout time, in ms. The default is 30000. Only WeChat applet (2.10.0) and Alipay applet support
    * @param {Boolean} arg.sslVerify-global default whether to verify the ssl certificate. The default is true. Only App Android supports (HBuilderX 2.3.3+)
    * @param {Boolean} arg.withCredentials-global default cross-domain request whether to carry credentials (cookies). The default is false. Only H5 support (HBuilderX 2.6.15+)
    * @param {Function(statusCode):Boolean} arg.validateStatus-the global default custom validator. Default statusCode >= 200 && statusCode <300
    */
   constructor(arg = {}) {
      if (!isPlainObject(arg)) {
         arg = {};
         //console.warn('Set global parameters must receive an Object')
      }
      this.config = {...defaults, ...arg};
      this.interceptors = {
         request: new InterceptorManager(),
         response: new InterceptorManager()
      };
   }

   /**
    * @Function
    * @param {Request~setConfigCallback} f-Set global default configuration
    */
   setConfig(f) {
      this.config = f(this.config);
   }

   _middleware(config) {
      config = mergeConfig(this.config, config);
      let chain = [dispatchRequest, undefined];
      let promise = Promise.resolve(config);

      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
         chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
         chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
         promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
   }

   /**
    * @Function
    * @param {Object} config-request configuration item
    * @prop {String} options.url-request path
    * @prop {Object} options.data-request parameters
    * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer]-response data type
    * @prop {Object} [options.dataType = config.dataType]-If it is set to json, it will try to do a JSON.parse on the returned data
    * @prop {Object} [options.header = config.header]-request header
    * @prop {Object} [options.method = config.method]-request method
    * @returns {Promise<unknown>}
    */
   request(config = {}) {
      return this._middleware(config);
   }

   get(url, options = {}) {
      return this.request({
         url,
         method: 'GET',
         ...options
      });
   }

   post(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'POST',
         ...options
      });
   }

   // #ifndef MP-ALIPAY
   put(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'PUT',
         ...options
      });
   }

   // #endif

   // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
   delete(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'DELETE',
         ...options
      });
   }

   // #endif

   // #ifdef APP-PLUS || H5 || MP-WEIXIN
   connect(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'CONNECT',
         ...options
      });
   }

   // #endif

   // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
   head(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'HEAD',
         ...options
      });
   }

   // #endif

   // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
   options(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'OPTIONS',
         ...options
      });
   }

   // #endif

   // #ifdef APP-PLUS || H5 || MP-WEIXIN
   trace(url, data, options = {}) {
      return this.request({
         url,
         data,
         method: 'TRACE',
         ...options
      });
   }

   // #endif

   upload(url, config = {}) {
      config.url = url;
      config.method = 'UPLOAD';
      return this._middleware(config);
   }

   download(url, config = {}) {
      config.url = url;
      config.method = 'DOWNLOAD';
      return this._middleware(config);
   }
}


/**
 * setConfig callback
 * @return {Object}-Return the config after the operation
 * @callback Request~setConfigCallback
 * @param {Object} config-global default config
 */

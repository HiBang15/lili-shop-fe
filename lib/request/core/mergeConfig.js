import { deepMerge, isObject } from '../utils';

/**
 * Merge local configuration priority configuration, if there is this configuration item locally, use the local, if there is this configuration item globally, use the global
 * @param {Array} keys-configuration items
 * @param {Object} globalsConfig-current global configuration
 * @param {Object} config2-partial configuration
 * @return {{}}
 */
const mergeKeys = (keys, globalsConfig, config2) => {
   let config = {};
   keys.forEach(prop => {
      if (typeof config2[prop] !== 'undefined') {
         config[prop] = config2[prop];
      } else if (typeof globalsConfig[prop] !== 'undefined') {
         config[prop] = globalsConfig[prop];
      }
   });
   return config;
};
/**
 *
 * @param globalsConfig-the global configuration of the current instance
 * @param config2-current local configuration
 * @return-merged configuration
 */
export default (globalsConfig, config2 = {}) => {
   const method = config2.method || globalsConfig.method || 'GET';
   let config = {
      baseURL: globalsConfig.baseURL || '',
      method: method,
      url: config2.url || ''
   };
   const mergeDeepPropertiesKeys = ['header', 'params', 'custom'];
   const defaultToConfig2Keys = ['getTask', 'validateStatus'];
   mergeDeepPropertiesKeys.forEach(prop => {
      if (isObject(config2[prop])) {
         config[prop] = deepMerge(globalsConfig[prop], config2[prop]);
      } else if (typeof config2[prop] !== 'undefined') {
         config[prop] = config2[prop];
      } else if (isObject(globalsConfig[prop])) {
         config[prop] = deepMerge(globalsConfig[prop]);
      } else if (typeof globalsConfig[prop] !== 'undefined') {
         config[prop] = globalsConfig[prop];
      }
   });
   config = {...config, ...mergeKeys(defaultToConfig2Keys, globalsConfig, config2)};

   // eslint-disable-next-line no-empty
   if (method === 'DOWNLOAD') {

   } else if (method === 'UPLOAD') {
      if (isObject(config.header)) {
         delete config.header['content-type'];
         delete config.header['Content-Type'];
      }
      const uploadKeys = [
         // #ifdef APP-PLUS || H5
         'files',
         // #endif
         // #ifdef MP-ALIPAY
         'fileType',
         // #endif
         // #ifdef H5
         'file',
         // #endif
         'filePath',
         'name',
         'formData'
      ];
      uploadKeys.forEach(prop => {
         if (typeof config2[prop] !== 'undefined') {
            config[prop] = config2[prop];
         }
      });
   } else {
      const defaultsKeys = [
         'data',
         // #ifdef MP-ALIPAY || MP-WEIXIN
         'timeout',
         // #endif
         'dataType',
         // #ifndef MP-ALIPAY || APP-PLUS
         'responseType',
         // #endif
         // #ifdef APP-PLUS
         'sslVerify',
         // #endif
         // #ifdef H5
         'withCredentials'
         // #endif
      ];
      config = {...config, ...mergeKeys(defaultsKeys, globalsConfig, config2)};
   }

   return config;
}

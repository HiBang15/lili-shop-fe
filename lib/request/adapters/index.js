import buildURL from '../helpers/buildURL';
import buildFullPath from '../core/buildFullPath';
import settle from '../core/settle';

/**
 * Return the configuration where the optional value exists
 * @param {Array} keys-an array of optional values
 * @param {Object} config2-configuration
 * @return {{}}-existing configuration items
 */
const mergeKeys = (keys, config2) => {
   let config = {};
   keys.forEach(prop => {
      if (typeof config2[prop] !== 'undefined') {
         config[prop] = config2[prop];
      }
   });
   return config;
};
export default (config) => {
   return new Promise((resolve, reject) => {
      const _config = {
         url: buildURL(buildFullPath(config.baseURL, config.url), config.params),
         header: config.header,
         complete: (response) => {
            response.config = config;
            try {
               // Tolerant for the case where the string may not be json
               if (typeof response.data === 'string') {
                  response.data = JSON.parse(response.data);
               }
               // eslint-disable-next-line no-empty
            } catch (e) {
            }
            settle(resolve, reject, response);
         }
      };
      let requestTask;
      if (config.method === 'UPLOAD') {
         let otherConfig = {
            // #ifdef MP-ALIPAY
            fileType: config.fileType,
            // #endif
            filePath: config.filePath,
            name: config.name
         };
         const optionalKeys = [
            // #ifdef APP-PLUS || H5
            'files',
            // #endif
            // #ifdef H5
            'file',
            // #endif
            'formData'
         ];
         requestTask = uni.uploadFile({..._config, ...otherConfig, ...mergeKeys(optionalKeys, config)});
      } else if (config.method === 'DOWNLOAD') {
         requestTask = uni.downloadFile(_config);
      } else {
         const optionalKeys = [
            'data',
            'method',
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
         requestTask = uni.request({..._config, ...mergeKeys(optionalKeys, config)});
      }
      if (config.getTask) {
         config.getTask(requestTask, config);
      }
   });
}

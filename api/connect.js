/**
 * Trust login related API
 */

import {
   http,
   Method
} from '@/utils/request.js';

const request = http.request;


/**
 * Web third-party login
 * @param {Object} code
 */
export function webConnect(code) {
   return http.request({
      url: `connect/login/web/${ code }`,
      method: Method.GET,
      needToken: true,
      header: {
         'clientType': 'H5'
      }
   });
}

export function openIdLogin(params, clientType) {
   return http.request({
      url: `connect/app/login`,
      method: Method.GET,
      needToken: true,
      data: params,
      header: {
         'clientType': clientType
      }
   });
}

/**
 * The third-party login is successful callback interface
 */
export function loginCallback(state) {
   return http.request({
      url: `connect/result?state=${ state }`,
      method: Method.GET,
      needToken: false
   });
}


/**
 * Automatic login in Mini Program
 * @param params
 */
export function mpAutoLogin(params) {
   return http.request({
      url: 'mini-program/auto-login',
      method: Method.GET,
      params
   });
}

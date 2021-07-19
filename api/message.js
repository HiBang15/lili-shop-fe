/**
 * In-site message related API
 */

import { http, Method } from '@/utils/request.js';

const request = http.request;

import api from '@/config/api.js';

/**
 * Get WeChat news subscription
 * @param params
 * @returns {AxiosPromise}
 */
export function getWeChatMpMessage() {
   return http.request({
      url: 'mini-program/subscribeMessage',
      method: Method.GET
   });
}

/**
 * Get the message list
 * @param params
 * @returns {AxiosPromise}
 */
export function getMessages(params) {
   params = params || {};
   params.pageSize = params.pageSize || 5;
   return http.request({
      url: 'members/member-nocice-logs',
      method: Method.GET,
      needToken: true,
      params
   });
}


/**
 * Mark the message as read
 * @param ids
 */
export function messageMarkAsRead(ids) {
   return http.request({
      url: `members/member-nocice-logs/${ ids }/read`,
      method: Method.PUT,
      needToken: true
   });
}


/**
 * Get a list of logistics news
 * @param params
 * @returns {AxiosPromise}
 */
export function getLogisticsMessages(params) {
   params = params || {};
   params.pageSize = params.pageSize || 5;
   return http.request({
      url: 'trade/logistics/message',
      method: Method.GET,
      needToken: true,
      params
   });
}


/**
 * @param appType
 * @returns {AxiosPromise}
 *
 */
export function getAppVersion(appType) {
   return http.request({
      url: `/appVersion/${ appType }`,
      method: Method.GET,
      type: 'manager'
   });
}

/**
 * @param appType
 * @returns {AxiosPromise}
 *
 */
export function getAppVersionList(type, data) {
   return http.request({
      url: `/appVersion/appVersion/${ type }`,
      method: Method.GET,
      type: 'manager',
      data
   });
}

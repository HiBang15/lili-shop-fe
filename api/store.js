/**
 * Store related API
 */

import { http, Method } from '@/utils/request.js';

/**
 * Get a list of shops
 * @param params
 */
export function getstoreList(params) {
   return http.request({
      url: '/store',
      method: Method.GET,
      params
   });
}

/**
 * Get basic store information
 * @param storeId
 */
export function getstoreBaseInfo(storeId) {
   return http.request({
      url: `/store/get/detail/${ storeId }`,
      method: Method.GET,
      loading: false
   });
}

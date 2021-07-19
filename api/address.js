/**
 * Receiving address related API
 */

import { http, Method } from '@/utils/request.js';

import api from '@/config/api.js';

/**
 * Get a list of shipping addresses
 * @returns {AxiosPromise}
 */
export function getAddressList(pageNumber, pageSize) {
   return http.request({
      url: '/memberAddress',
      method: Method.GET,
      needToken: true,
      params: {pageNumber, pageSize}
   });
}

/**
 * Obtain a logistics company
 */
export function getLogistics() {
   return http.request({
      url: '/logistics',
      method: Method.GET,
      needToken: true,
      params: {pageNumber: 1, pageSize: 200, disabled: 'OPEN'}
   });
}

/**
 * Get the area code through cityCode
 */
export function getAddressCode(cityCode, townName) {
   return http.request({
      url: api.common + '/region/region',
      method: Method.GET,
      needToken: true,
      params: {cityCode, townName}
   });
}

/**
 * Add delivery address
 * @param params address parameters
 * @returns {AxiosPromise}
 */
export function addAddress(data) {
   return http.request({
      url: '/memberAddress',
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: data
   });
}

/**
 * Edit address
 * @param id address ID
 * @param params address parameters
 * @returns {AxiosPromise}
 */
export function editAddress(params) {
   return http.request({
      url: `/memberAddress`,
      method: Method.PUT,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: params
   });
}

/**
 * Delete the delivery address
 * @param id
 */
export function deleteAddress(id) {
   return http.request({
      url: `/memberAddress/delById/${ id }`,
      method: Method.DELETE,
      needToken: true
   });
}


/**
 * Obtain member receiving address based on ID
 * @param id
 */
export function getAddressDetail(id) {
   return http.request({
      url: `/memberAddress/get/${ id }`,
      method: Method.GET,
      loading: false,
      needToken: true
   });
}

/**
 *
 */
export function getAddressDefault() {
   return http.request({
      url: `/memberAddress/get/default`,
      method: Method.GET,
      loading: false,
      needToken: true
   });
}

/**
 * Apply for after-sales related API
 */

import { http, Method } from '@/utils/request.js';

/**
 * Get the after-sales list
 * @param params
 * @returns {AxiosPromise}
 */
export function getAfterSale(params) {
   return http.request({
      url: 'after-sales/refunds',
      method: Method.GET,
      needToken: true,
      loading: false,
      params
   });
}


/******************* The following is the new method ***********************/
/**
 * Application to cancel the order
 * @param params
 */
export function applyCancelOrder(params) {
   return http.request({
      url: 'after-sales/apply/cancel/order',
      method: Method.POST,
      needToken: true,
      params
   });
}

/**
 * Get the merchant's after-sales address
 */
export function getstoreAfterSaleAddress(sn) {
   return http.request({
      url: `/afterSale/getStoreAfterSaleAddress/${ sn }`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Obtain data related to after-sales service
 * @param params parameters
 */
export function getAfterSaleList(params) {
   return http.request({
      url: `/afterSale/page`,
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * View after-sales service details
 * @param sn After-sales service order number
 */
export function getServiceDetail(sn) {
   return http.request({
      url: `/afterSale/get/${ sn }`,
      method: Method.GET,
      needToken: true
   });
}


/**
 * Add complaint
 */
export function addComplain(params) {
   return http.request({
      url: `/complain`,
      method: Method.POST,
      needToken: true,
      header: {
         'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: params
   });
}

/**
 * Cancel complaint
 */
export function clearComplain(id, params) {
   return http.request({
      url: `/complain/status/${ id }`,
      method: Method.PUT,
      needToken: true,
      params
   });
}

/**
 * Cancel complaint
 */
export function getAfterSaleLog(sn) {
   return http.request({
      url: `/afterSale/get/getAfterSaleLog/${ sn }`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * List of complaints
 */
export function getComplain(params) {
   return http.request({
      url: `/complain`,
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Get the reason for application
 */
export function getAfterSaleReason(serviceType) {
   return http.request({
      url: `/afterSale/get/afterSaleReason/${ serviceType }`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get the reason for cancellation
 */
export function getClearReason() {
   return http.request({
      url: `/afterSale/get/afterSaleReason/CANCEL`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get the reason for the complaint
 */
export function getComplainReason() {
   return http.request({
      url: `/afterSale/get/afterSaleReason/COMPLAIN`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get complaint details
 */
export function getComplainDetail(id) {
   return http.request({
      url: `/complain/${ id }`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get information on the application after-sales page
 */
export function getAfterSaleInfo(sn) {
   return http.request({
      url: `/afterSale/applyAfterSaleInfo/${ sn }`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Apply for return service
 * @param params
 */
export function applyReturn(orderItemSn, params) {
   return http.request({
      url: `/afterSale/save/${ orderItemSn }`,
      method: Method.POST,
      header: {
         'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: params
   });
}

/**
 * Fill in logistics information
 * @param afterSaleSn after-sales service order number
 * @param params parameter information
 */
export function fillShipInfo(afterSaleSn, params) {
   return http.request({
      url: `/afterSale/delivery/${ afterSaleSn }`,
      method: Method.POST,
      header: {
         'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: params
   });
}

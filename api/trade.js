/**
 * Trading related API
 */

import { http, Method } from '@/utils/request.js';

/**
 * Get the shopping cart list
 * @param show_type The type to be displayed all: all checked: checked
 */
export function getCarts() {
   return http.request({
      url: `/trade/carts/all`,
      method: Method.GET,
      needToken: true,
      loading: false
   });
}

/**
 * Get the total number of shopping carts
 * @param show_type The type to be displayed all: all checked: checked
 */
export function getCartNum() {
   return http.request({
      url: `/trade/carts/count`,
      method: Method.GET,
      needToken: true,
      loading: false
   });
}

/**
 * Get the number of coupons available in the shopping cart
 * @param way Shopping cart purchase: CART/Buy now: BUY_NOW/Group purchase: PINTUAN / Points purchase: POINT
 */
export function getCartCouponNum(way) {
   return http.request({
      url: `/trade/carts/coupon/num?way=${ way }`,
      method: Method.GET,
      needToken: true,
      loading: false
   });
}

/**
 * Add goods to the shopping cart
 * @param skuId product ID
 * @param num product purchase quantity
 * @param cartType shopping cart type, added to the shopping cart by default
 */
export function addToCart(data) {
   return http.request({
      url: '/trade/carts',
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data
   });
}


/**
 * Update the number of items in the shopping cart
 * @param skuId
 * @param num
 */
export function updateSkuNum(skuId, num = 1) {
   return http.request({
      url: `/trade/carts/sku/num/${ skuId }`,
      method: Method.POST,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      needToken: true,
      data: {num}
   });
}

/**
 * Update the selected status of the shopping cart
 * @param skuId
 * @param checked
 */
export function updateSkuChecked(skuId, checked) {
   return http.request({
      url: `/trade/carts/sku/checked/${ skuId }`,
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {checked}
   });
}

/**
 * Delete multiple items
 * @param skuIds
 */
export function deleteSkuItem(skuIds) {
   return http.request({
      url: `/trade/carts/sku/remove?skuIds=${ skuIds }`,
      method: Method.DELETE,
      needToken: true
   });
}


/**
 * Set all items to be selected or unselected
 * @param checked
 */
export function checkAll(checked) {
   return http.request({
      url: '/trade/carts/sku/checked',
      method: Method.POST,
      needToken: true,
      params: {checked}
   });
}

/**
 * Set the selected status of all goods in the store
 * @param storeId
 * @param checked
 */
export function checkStore(storeId, checked) {
   return http.request({
      url: `/trade/carts/store/${ storeId }`,
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {checked}
   });
}

/**
 * Get settlement parameters
 */
export function getCheckoutParams(way) {
   return http.request({
      url: '/trade/carts/checked?way=' + way,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Set the delivery address ID
 * @param addressId
 */
export function setAddressId(addressId, way) {
   return http.request({
      url: `/trade/carts/shippingAddress?shippingAddressId=${ addressId }&way=${ way }`,
      method: Method.GET,
      needToken: true

   });
}


/**
 * Create transaction
 */
export function createTrade(params) {
   return http.request({
      url: '/trade/carts/create/trade',
      method: Method.POST,
      needToken: true,
      message: false,
      data: params
   });
}


/**
 * Query cash register data based on transaction number or order number
 * @param params
 */
export function getCashierData(params) {
   return http.request({
      url: 'cashier/tradeDetail',
      method: Method.GET,
      needToken: true,
      params
   });
}


/**
 * Initiate payment
 * @param paymentMethod
 * @param paymentClient
 * @param params
 * @returns {*|*}
 */
export function initiatePay(paymentMethod, paymentClient, params) {
   return http.request({
      url: `cashier/pay/${ paymentMethod }/${ paymentClient }`,
      method: Method.GET,
      needToken: true,
      params
   });
}


/**
 * Inquire about logistics
 * @param orderSn

 */
export function getExpress(orderSn) {
   return http.request({
      url: `/orders/getTraces/${ orderSn }`,
      method: Method.POST,
      needToken: true

   });
}


/**
 * Get the current member's list of coupons that can be used for the current product
 */
export function getMemberCanUse(data) {
   return http.request({
      url: `/promotion/coupon/canUse`,
      method: Method.GET,
      params: data
   });
}


/**
 * Get the current member's coupon list
 */
export function getMemberCouponList(data) {
   return http.request({
      url: `/promotion/coupon/getCoupons`,
      method: Method.GET,
      params: data
   });
}

/**
 * use a coupon

 */
export function useCoupon(params) {
   return http.request({
      url: `/trade/carts/select/coupon`,
      method: Method.GET,
      needToken: true,
      params: params
   });
}


/**
 * Change participation activities
 * @param params
 */
export function changeActivity(params) {
   return http.request({
      url: 'trade/promotion',
      method: Method.POST,
      needToken: true,
      data: params,

      header: {'content-type': 'application/x-www-form-urlencoded'}
   });
}

/**
 * Query the order list according to the transaction order number
 * @param trade_sn
 */
export function reBuy(sn) {
   return http.request({
      url: `trade/carts/rebuy/${ sn }`,
      method: Method.POST,
      needToken: true
   });
}

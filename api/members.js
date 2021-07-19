import storage from '@/utils/storage';
import { http, Method } from '@/utils/request.js';

/**
 * Feedback
 */
export function feedBack(params) {
   return http.request({
      url: '/feedback',
      method: Method.POST,
      needToken: true,
      params
   });
}

// withdraw
export function withdrawalApply(params) {
   return http.request({
      url: '/members/wallet/withdrawal',
      method: Method.POST,
      needToken: true,
      params
   });
}

/**
 * Payment result query
 * @param orderType transaction type, available values: TRADE, ORDER, RECHARGE
 * @param sn order number
 */
export function payCallback(params) {
   return http.request({
      url: `/cashier/result`,
      method: Method.GET,
      params
   });
}

// online recharge
export function recharge(params) {
   return http.request({
      url: '/trade/recharge',
      method: Method.POST,
      params
   });
}

/**
 * Get pre-deposit recharge records by page
 * @param params
 */
export function getUserRecharge(params) {
   return http.request({
      url: '/member/recharge',
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Get pre-deposit recharge records by page
 * @param params
 */
export function getWalletLog(params) {
   return http.request({
      url: '/wallet/log',
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Get a list of coupons
 * @param params
 */
export function getCoupons(params) {
   return http.request({
      url: '/promotion/coupon/getCoupons',
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Receive coupons
 * @param couponId
 */
export function receiveCoupons(couponId) {
   return http.request({
      url: `/promotion/coupon/receive/${ couponId }`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get points details
 * @param params
 * @returns {AxiosPromise}
 */
export function getPointsData(params) {
   return http.request({
      url: 'member/memberPointsHistory/getByPage',
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Get my comment list
 * @param params
 * @returns {AxiosPromise}
 */
export function getComments(params) {
   return http.request({
      url: '/memberEvaluation',
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Get the number of views of the current member
 * @param params
 * @returns {AxiosPromise}
 */
export function getFootprintNum(params) {
   return http.request({
      url: '/footprint/getFootprintNum',
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Order comment
 * @param params
 */
export function commentsMemberOrder(params) {
   return http.request({
      url: '/memberEvaluation',
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: params
   });
}

/**
 * Additional comments
 * @param params
 */
export function AppendCommentsOrder(params) {
   return http.request({
      url: 'members/comments/additional',
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: params
   });
}

// This function is not implemented in the first version of TODO
/**
 * Commodity consultation
 * @param goods_id
 * @param ask_content
 */
export function consultating(goods_id, ask_content, anonymous) {
   return http.request({
      url: 'members/asks',
      method: Method.POST,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      needToken: true,
      data: {
         goods_id,
         ask_content,
         anonymous
      }
   });
}

/**
 * Get product collection
 * @param params
 * @returns {AxiosPromise}
 */
export function getGoodsCollection(params, type) {
   return http.request({
      url: `/member/collection/${ type }`,
      method: Method.GET,
      needToken: true,
      loading: false,
      message: false,
      params
   });
}

/**
 * Favorite Product
 * @returns {AxiosPromise}
 */
export function collectionGoods(id, type) {
   return http.request({
      url: `/member/collection/add/${ type }/${ id }`,
      method: Method.POST,
      needToken: true
   });
}

/**
 * Delete product collection
 * @param ids collection ID [collection or single product ID]
 * @returns {AxiosPromise}
 */
export function deleteGoodsCollection(ids) {
   if (Array.isArray(ids)) {
      ids = ids.join(',');
   }
   return http.request({
      url: `/member/collection/delete/GOODS/${ ids }`,
      method: Method.DELETE,
      needToken: true
   });
}

/**
 * Get whether the product is favorited
 * @param good_id
 */
export function getGoodsIsCollect(good_id, type) {
   return http.request({
      url: `/member/collection/isCollection/${ type }/${ good_id }`,
      method: Method.GET,
      needToken: true,
      loading: false
   });
}

/**
 * Favorite shop
 * @param store_id store ID
 * @returns {AxiosPromise}
 */
export function collectionStore(store_id) {
   return http.request({
      url: 'members/collection/store',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method: Method.POST,
      data: {store_id}
   });
}

/**
 * Delete store collection
 * @param store_id
 */
export function deleteStoreCollection(store_id) {
   return http.request({
      url: `members/collection/store/${ store_id }`,
      method: Method.DELETE,
      needToken: true
   });
}

/**
 * Get the information of the currently logged-in user
 * @returns {AxiosPromise}
 */
export function getUserInfo() {
   return http.request({
      url: '/members',
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get the current user's pre-deposit
 * @returns {AxiosPromise}
 */
export function getUserWallet() {
   return http.request({
      url: '/members/wallet',
      method: Method.GET,
      needToken: true
   });
}

/**
 * Save user information
 * @param params
 * @returns {AxiosPromise}
 */
export function saveUserInfo(params) {
   return http.request({
      url: '/members/editOwn',
      method: Method.PUT,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      needToken: true,
      data: params
   });
}

/**
 * Add invoice
 * @param params
 */
export function addReceipt(params) {
   return http.request({
      url: '/trade/receipt',
      method: Method.POST,
      needToken: true,
      params
   });
}

/**
 * Get a list of product reviews
 * @param goodsId
 * @param params
 */
export function getGoodsComments(goodsId, params) {
   return http.request({
      url: `/memberEvaluation/${ goodsId }/goodsEvaluation`,
      method: Method.GET,
      loading: false,
      params
   });
}

/**
 * Get statistics on the number of product reviews
 * @param goodsId
 */
export function getGoodsCommentsCount(goodsId) {
   return http.request({
      url: `/memberEvaluation/${ goodsId }/evaluationNumber`,
      method: Method.GET,
      loading: false
   });
}

/**
 * Get information about the number of unread messages
 */
export function getNoReadMessageNum() {
   return http.request({
      url: `members/member-nocice-logs/number`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * My footprint list
 * @param pageNumber pageSize
 *
 */
export function myTrackList(params) {
   return http.request({
      url: `/footprint`,
      method: Method.GET,
      needToken: true,
      params
   });
}

/**
 * Delete member footprints based on id
 * @param id
 */
export function deleteHistoryListId(ids) {
   return http.request({
      url: `/footprint/delByIds/${ ids }`,
      method: Method.DELETE,
      needToken: true
   });
}

/**
 * Get a list of current member coupons
 * @param
 */
export function getMemberCoupons(data) {
   return http.request({
      url: `/promotion/coupon/getCoupons`,
      method: Method.GET,
      needToken: true,
      params: data
   });
}

/**
 * Get the number of coupons that the current member can use
 *
 */
export function getCouponsNum() {
   return http.request({
      url: `/promotion/coupon/getCouponsNum`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Get member points VO
 * @param
 */
export function getMemberPointSum() {
   return http.request({
      url: `member/memberPointsHistory/getMemberPointsHistoryVO`,
      method: Method.GET
   });
}

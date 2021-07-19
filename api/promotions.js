/**
 * Promotion related API
 */
import { http, Method } from '@/utils/request.js';

/**
 * Get the current live broadcast list
 *
 * @param {*}
 * @returns
 */
export function getLiveList(params) {
   return http.request({
      url: `broadcast/studio`,
      method: Method.GET,
      params
   });
}

/**
 * Get members who are not in the current group activity
 */
export function getPromotionGroupMember(pintuanId) {
   return http.request({
      url: `promotion/pintuan/${ pintuanId }/members`,
      method: Method.GET
   });
}

/** Get the group list */
export function getAssembleList(params) {
   return http.request({
      url: 'promotion/pintuan',
      method: Method.GET,
      loading: false,
      params
   });
}

/**
 * Get points mall category
 */
export function getPointsCategory() {
   return http.request({
      url: '/promotion/pointsGoods/category',
      method: Method.GET
   });
}

/**
 * Get points mall merchandise
 * @param params
 */
export function getPointsGoods(params) {
   return http.request({
      url: '/promotion/pointsGoods',
      method: Method.GET,
      params
   });
}

/**
 * Get the timeline of limited-time snap-up sales information on the same day
 */
export function getSeckillTimeLine() {
   return http.request({
      url: 'promotion/seckill',
      method: Method.GET
   });
}

/**
 * Get limited-time rush-sell merchandise Get the limited-time rush-sell product information
 * @param params
 */
export function getSeckillTimeGoods(timeline) {
   return http.request({
      url: `promotion/seckill/${ timeline }`,
      method: Method.GET
   });
}

/**
 * Get all coupons
 * @param params
 */
export function getAllCoupons(params) {
   return http.request({
      url: '/promotion/coupon',
      method: Method.GET,
      params
   });
}

/**
 * Pagination to get bargained goods
 * @param params
 */
export function getBargainList(params) {
   return http.request({
      url: '/promotion/kanjiaGoods',
      method: Method.GET,
      params
   });
}

/**
 * Pagination to get bargained goods
 * @param params
 */
export function getBargainDetail(id) {
   return http.request({
      url: `/promotion/kanjiaGoods/${ id }`,
      method: Method.GET
   });
}

/**
 * Get bargaining activities
 * @param params
 */
export function getBargainActivity(params) {
   return http.request({
      url: `/promotion/kanjiaGoods/getKanjiaActivity`,
      method: Method.POST,
      params
   });
}

/**
 * Initiate bargaining activities
 * @param params
 */
export function openBargain(params) {
   return http.request({
      url: `/promotion/kanjiaGoods`,
      method: Method.POST,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: params
   });
}

/**
 * Pagination for bargaining activities-help cut records
 */
export function getBargainLog(params) {
   return http.request({
      url: `/promotion/kanjiaGoods/getKanjiaActivity/logs`,
      method: Method.GET,
      data: params
   });
}

/**
 * Pagination for bargaining activities-help cut records
 */
export function helpBargain(kanJiaActivityId) {
   return http.request({
      url: `promotion/kanjiaGoods/help/${ kanJiaActivityId }`,
      method: Method.POST
   });
}

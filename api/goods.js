/**
 * Commodity related API
 */

import { http, Method } from '@/utils/request.js';

/**
 * Obtain the relevant product brand name, category name and attributes from ES
 */
export function getGoodsMessage(goodsId) {
   return http.request({
      url: `/goods/get/${ goodsId }`,
      method: Method.GET
   });
}

/**
 * Obtain the relevant product brand name, category name and attributes from ES
 */
export function getGoodsRelated(params) {
   return http.request({
      url: `/goods/es/related`,
      method: Method.GET,
      params
   });
}

/**
 * Get product details
 * @param skuId product ID
 * @returns {AxiosPromise}
 */
export function getGoods(skuId, goodsId) {
   return http.request({
      url: `/goods/sku/${ goodsId }/${ skuId }`,
      method: Method.GET
   });
}

/**
 * Get merchandise distribution
 * @param distributionId Commodity distribution ID
 */
export function getGoodsDistribution(distributionId) {
   return http.request({
      url: `/distribution/bindingDistribution/${ distributionId }`,
      method: Method.GET
   });
}


/**
 * Get product list
 * @param params
 * @returns {AxiosPromise}
 */
export function getGoodsList(params) {
   return http.request({
      url: '/goods/es',
      method: Method.GET,
      params
   });
}

/**
 * Get a list of new products
 * @param params
 * @returns {AxiosPromise}
 */
export function getGoodsListUplog(params) {
   return http.request({
      url: 'goods/search/uplog',
      method: Method.GET,
      params
   });
}


/**
 * Get label products
 * @param storeId seller id
 * @param mark tag hot: hot new: new product recommend: recommended
 * @param num Get the number
 */
export function getTagGoods(storeId, mark = 'hot', num = 5) {
   return http.request({
      url: `goods/tags/${ mark }/goods`,
      method: Method.GET,
      loading: false,
      params: {
         storeId,
         mark,
         num
      }
   });
}

/**
 * Get label products
 */
export function getPlateformTagGoods(tag_id) {
   return http.request({
      url: `goods/tags/byid/${ tag_id }`,
      method: Method.GET,
      loading: false
   });
}

/**
 * Get the product category on the homepage, the list on the left
 * @param parent_id
 */
export function getCategoryList(id) {
   return http.request({
      url: `/category/get/${ id }`,
      method: Method.GET,
      loading: false
   });
}

/**
 * Get product category
 * @param parent_id
 */
export function getCategory(parent_id = 0) {
   return http.request({
      url: `goods/categories/${ parent_id }/children`,
      method: Method.GET,
      loading: false
   });
}


/**
 * Obtain the current member’s distributor information. You can query information such as the amount of cash to be withdrawn and the frozen amount according to the distributor information
 */
export function distribution() {
   return http.request({
      url: `/distribution`,
      method: Method.GET
   });
}

/**
 * Apply for distributor
 */
export function applyDistribution(params) {
   return http.request({
      url: `/distribution`,
      method: Method.POST,
      params
   });
}

/**
 * Distributor cash withdrawal
 */
export function cash(params) {
   return http.request({
      url: `/distribution/cash`,
      method: Method.POST,
      params
   });
}

/**
 * Withdrawal history of distributors
 */
export function cashLog() {
   return http.request({
      url: `/distribution/cash`,
      method: Method.GET
   });
}

/**
 * Get the distributor's paging order list
 */
export function distributionOrderList() {
   return http.request({
      url: `/distribution/distributionOrder`,
      method: Method.GET
   });
}

/**
 * Get the distributor's product list
 */
export function distributionGoods(params) {
   return http.request({
      url: `/distributionGoods`,
      method: Method.GET,
      params
   });
}

/**
 * Select the distribution product ID of the distribution product
 */
export function checkedDistributionGoods(params) {
   return http.request({
      url: `/distributionGoods/checked/${ params.id }`,
      method: Method.GET,
      params
   });
}

/**
 * Get Mini Program Code
 */
export function getMpCode(params) {
   return http.request({
      url: `/mini-program/mp/unlimited`,
      method: Method.GET,
      params
   });
}

/**
 * Get page parameters according to shortlink
 */
export function getMpScene(id) {
   return http.request({
      url: `/mini-program/mp/unlimited/scene?id=${ id }`,
      method: Method.GET

   });
}

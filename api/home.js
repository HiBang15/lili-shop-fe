import { http, Method } from '@/utils/request.js';


/**
 * Get the ad image
 */
export function getAdvertisement() {
   return http.request({
      url: '/advertisement',
      method: Method.GET
   });
}


/**
 * Get the homepage product category
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
 * Get popular keywords
 * @param num
 */
export function getHotKeywords(start = 0, end = 10) {
   return http.request({
      url: '/goods/hot-words',
      method: Method.GET,
      loading: false,
      params: {start, end}
   });
}

/**
 * Get floor data
 * @param client_type
 * @param page_type
 */
export function getFloorData() {
   return http.request({
      url: `/pageData/getIndex?clientType=H5`,
      method: 'get'
   });
}

/**
 * Get home page classification data
 */
export function getCategoryIndexData(parentId = 0) {
   return http.request({
      url: `/category/get/${ parentId }`,
      method: 'get'
   });
}

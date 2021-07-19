/**
 * Article related API
 */

import { http, Method } from '@/utils/request.js';
import api from '@/config/api.js';

/**
 * Get a list of articles in a category
 * @param category_type
 */
export function getArticleCategory(category_type) {
   return http.request({
      url: `${ api.base }/pages/article-categories`,
      method: Method.GET,
      params: {category_type}
   });
}

/**
 * Get article details
 * @param type
 */
export function getArticleDetail(type) {
   return http.request({
      url: `/article/type/${ type }`,
      method: Method.GET
   });
}


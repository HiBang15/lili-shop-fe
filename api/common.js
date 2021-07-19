/**
 * Public API
 */
import { http, Method } from '@/utils/request.js';
import api from '@/config/api.js';


/**
 * Get regional data
 * @param id
 */
export function getRegionsById(id = 0) {
   return http.request({
      url: `${ api.common }/region/item/${ id }`,
      method: Method.GET,
      message: false
   });
}

/**
 * File upload address
 * @type {string}
 */
export const upload = api.common + '/upload/file';


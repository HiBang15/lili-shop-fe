import { http } from '@/utils/request.js';

import api from '@/config/api.js';

/**
 * Reset password via SMS
 * @param mobile
 */
export function resetByMobile(params) {
   return http.request({
      url: `/members/resetByMobile`,
      method: 'POST',
      params
   });
}

/**
 * Send the verification code
 * @param mobile
 */
export function sendMobile(mobile) {
   return http.request({
      url: `${ api.common }/sms/LOGIN/${ mobile }`,
      method: 'GET'
   });
}

/**
 * SMS login
 * @param mobile
 * @param smsCode
 */
export function smsLogin(params, clientType) {
   return http.request({
      url: `/members/smsLogin`,
      method: 'POST',
      data: params,
      header: {
         'content-type': 'application/x-www-form-urlencoded',
         clientType: clientType
      }
   });
}

/**
 * change Password
 * @param newPassword
 * @param password
 */

export function modifyPass(params) {
   return http.request({
      url: `/members/modifyPass`,
      method: 'PUT',
      params
   });
}

/**
 * Refresh token
 */
export function refreshTokenFn(refresh_token) {
   return http.request({
      url: `/members/refresh/${ refresh_token }`,
      method: 'GET'
   });
}

/**
 * Security related API
 */

import { http, Method } from '@/utils/request.js';
import storage from '@/utils/storage.js';
import { md5 } from '@/utils/md5.js';

/**
 * Send the verification code of the bound mobile phone
 * @param mobile
 * @param captcha
 */
export function sendBindMobileSms(mobile, captcha) {
   return http.request({
      url: `members/security/bind/send/${ mobile }`,
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {
         uuid: storage.getUuid(),
         captcha
      }
   });
}

/**
 * Bind mobile phone number
 * @param mobile
 * @param sms_code
 */
export function bindMobile(mobile, sms_code) {
   return http.request({
      url: `members/security/bind/${ mobile }`,
      method: Method.PUT,
      needToken: true,
      data: {sms_code}
   });
}

/**
 * Send mobile phone verification code
 * Common when changing mobile phone number and changing password
 * @param captcha
 */
export function sendMobileSms(captcha) {
   return http.request({
      url: 'members/security/send',
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {
         uuid: storage.getUuid(),
         captcha
      }
   });
}

/**
 * Verify and change mobile phone number SMS
 * @param sms_code
 */
export function validChangeMobileSms(sms_code) {
   return http.request({
      url: 'members/security/exchange-bind',
      method: Method.GET,
      needToken: true,
      params: {sms_code}
   });
}

/**
 * Change mobile phone number
 * @param mobile
 * @param sms_code
 */
export function changeMobile(mobile, sms_code) {
   return http.request({
      url: `members/security/exchange-bind/${ mobile }`,
      method: Method.PUT,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      needToken: true,
      data: {sms_code}
   });
}


/**
 * change the password
 * @param captcha
 * @param password
 */
export function changePassword(captcha, password) {
   return http.request({
      url: 'members/security/password',
      method: Method.PUT,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      needToken: true,
      data: {
         uuid: storage.getUuid(),
         captcha,
         password: md5(password)
      }
   });
}

/**
 * Get the current real-name authentication progress
 * @param email
 * @param email_code
 */
export function contractStep() {
   return http.request({
      url: `members/contract/step`,
      method: Method.GET,
      needToken: true
   });
}

/**
 * Verified
 * @param email
 * @param email_code
 */
export function authentication(params) {
   return http.request({
      url: `members/contract/authentication`,
      method: Method.POST,
      needToken: true,
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: params
   });
}

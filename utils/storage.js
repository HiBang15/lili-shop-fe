let isDev = process.env.NODE_ENV === "development";

const UUID = isDev ? "uuid_key_dev" : "uuid_key";
const HAS_LOGIN = isDev ? "has_login_key_dev" : "has_login_key";
const ACCESS_TOKEN = isDev ? "access_token_key_dev" : "access_token_key";
const REFRESH_TOKEN = isDev ? "refresh_token_key_dev" : "refresh_token_key";
const USER_INFO = isDev ? "user_info_obj_dev" : "user_info_obj";
const FACE_LOGIN = isDev ? "face_login_dev" : "face_login";
const FINGER_LOGIN = isDev ? "finger_login_dev" : "finger_login";
const CART_BACKBTN = isDev ? "cart_backbtn_dev" : "cart_backbtn";
export default {

  // Get face id login
  getFaceLogin() {
    return uni.getStorageSync(FACE_LOGIN);
  },
  // write face id
  setFaceLogin(val) {
    uni.setStorageSync(FACE_LOGIN, val);
  },
  // Get fingerprint login
  getFingerLogin() {
    return uni.getStorageSync(FINGER_LOGIN);
  },
  // Write fingerprint login
  setFingerLogin(val) {
    uni.setStorageSync(FINGER_LOGIN, val);
  },
  // Write user information
  setUserInfo(val) {
    uni.setStorageSync(USER_INFO, val);
  },
  // Get user information
  getUserInfo() {
    return uni.getStorageSync(USER_INFO);
  },
  // write uuid
  setUuid(val) {
    uni.setStorageSync(UUID, val);
  },
  // Get uuid
  getUuid() {
    return uni.getStorageSync(UUID);
  },
  // write login
  setHasLogin(val) {
    uni.setStorageSync(HAS_LOGIN, val);
  },
  // Get whether to log in
  getHasLogin() {
    return uni.getStorageSync(HAS_LOGIN);
  },
  // delete uuid
  removeUuid() {
    uni.removeStorageSync(UUID);
  },
  // write accessToken
  setAccessToken(val) {
    uni.setStorageSync(ACCESS_TOKEN, val);
  },
  // Get accessToken
  getAccessToken() {
    return uni.getStorageSync(ACCESS_TOKEN);
  },
  // Back to shopping cart
  setCartBackbtn(val) {
    uni.setStorageSync(CART_BACKBTN, val);
  },

  // delete token
  removeAccessToken() {
    uni.removeStorageSync(ACCESS_TOKEN);
  },
  // Write refresh token
  setRefreshToken(val) {
    uni.setStorageSync(REFRESH_TOKEN, val);
  },
  // Get refresh token
  getRefreshToken() {
    return uni.getStorageSync(REFRESH_TOKEN);
  },
  // delete token
  removeRefreshToken() {
    uni.removeStorageSync(REFRESH_TOKEN);
  },
};

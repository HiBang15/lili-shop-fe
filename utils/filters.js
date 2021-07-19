import Foundation from "./Foundation.js";
import storage from "@/utils/storage.js";
/**
 * 金钱单位置换  2999 --> 2,999.00
 * @param val
 * @param unit
 * @param location
 * @returns {*}
 */
export function unitPrice(val, unit, location) {
  if (!val) val = 0;
  let price = Foundation.formatPrice(val);
  if (location === "before") {
    return price.substr(0, price.length - 3);
  }
  if (location === "after") {
    return price.substr(-2);
  }
  return (unit || "") + price;
}

/**
 * 脱敏姓名
 */

export function noPassByName(str) {
  if (null != str && str != undefined) {
    if (str.length <= 3) {
      return "*" + str.substring(1, str.length);
    } else if (str.length > 3 && str.length <= 6) {
      return "**" + str.substring(2, str.length);
    } else if (str.length > 6) {
      return str.substring(0, 2) + "****" + str.substring(6, str.length);
    }
  } else {
    return "";
  }
}

/**
 * Process unix timestamp and convert to readable time format
 * @param unix
 * @param format
 * @returns {*|string}
 */
export function unixToDate(unix, format) {
  let _format = format || "yyyy-MM-dd hh:mm:ss";
  const d = new Date(unix * 1000);
  const o = {
    "M+": d.getMonth() + 1,
    "d+": d.getDate(),
    "h+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds(),
  };
  if (/(y+)/.test(_format))
    _format = _format.replace(
      RegExp.$1,
      (d.getFullYear() + "").substr(4-RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp("(" + k + ")").test(_format))
      _format = _format.replace(
        RegExp.$1,
        RegExp.$1.length === 1? O[k]: ("00" + o[k]).substr(("" + o[k]).length)
      );
  return _format;
}

/**
 * 13888888888 -> 138****8888
 * @param mobile
 * @returns {*}
 */
export function secrecyMobile(mobile) {
  mobile = String(mobile);
  if (!/\d{11}/.test(mobile)) {
    return mobile;
  }
  return mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
}

/**
 * Clear comma
 *
 */
export function clearStrComma(str) {
  str = str.replace(/,/g, ""); //Cancel all commas in the string
  return str;
}

/**
 * Determine whether the user is logged in
 * @param val If it is auth, judge whether to log in
 * If auth is passed in, it will judge whether to log in
 */
export function isLogin(val) {
  let userInfo = storage.getUserInfo();
  if (val == "auth") {
    return userInfo.id? true: false;
  } else {
    return storage.getUserInfo();
  }
}

/**
 * Get the currently loaded page object
 * @param val
 */
export function getPages(val) {
  const pages = getCurrentPages(); //Get the loaded page
  const currentPage = pages[pages.length-1]; //Get the object of the current page
  const url = currentPage.route; //current page url

  return val? currentPage: url;
}

/**
 * Service status list
 */
export function serviceStatusList(val) {
  let statusList = {
    APPLY: "Apply for after-sales service",
    PASS: "Pass the after-sales service",
    REFUSE: "Refuse after-sales",
    BUYER_RETURN: "The buyer returns the goods, pending the seller to receive the goods",
    SELLER_RE_DELIVERY: "Merchant Exchange/Reissue",
    SELLER_CONFIRM: "Seller confirms receipt",
    SELLER_TERMINATION: "Seller terminates after-sales",
    BUYER_CONFIRM: "Buyer confirms receipt",
    BUYER_CANCEL: "Buyer cancels after-sales",
    WAIT_REFUND: "Waiting for platform refund",
    COMPLETE: "Complete after-sales",
  };
  return statusList[val];
}

/**
 * Order status list
 */
export function orderStatusList(val) {
  let orderStatusList = {
    UNDELIVERED: "Pending Shipment",
    UNPAID: "Unpaid",
    PAID: "paid",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    COMPLETE: "Completed",
    TAKE: "To be verified",
  };
  return orderStatusList[val];
}

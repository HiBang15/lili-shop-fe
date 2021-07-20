import Request from "@/lib/request/index.js";
import { refreshTokenFn } from "@/api/login.js";
import storage from "@/utils/storage.js";
import { md5 } from "@/utils/md5.js";
import Foundation from "@/utils/Foundation.js";
import api from "@/config/api.js";

import uuid from "@/utils/uuid.modified.js";

/**
 * Painless refresh token idea (if you do not use painless refresh token, ignore the note here)
 * After reading a lot, there is a problem that has not been solved-‘multiple interface requests and token failure, how to get the token only once’,
 * So I thought of closure anti-shake...
 * This plan is not the best plan, but just to provide you with a way of thinking. If you have a perfect solution, you can share it
 */
const expireToken = []; // store expired token

// A wave of anti-shake closure
function getTokenDebounce() {
  let lock = false;
  let success = false;
  return async function () {
    if (!lock) {
      lock = true;
      await refreshTokenFn(storage.getRefreshToken())
        .then((res) => {
          if (res.data.success) {
            let {accessToken, refreshToken} = res.data.result;
            storage.setAccessToken(accessToken);
            storage.setRefreshToken(refreshToken);
            success = true;
            lock = false;
          } else {
            cleanStorage();
            success = false;
            lock = false;
          }
        })
        .catch((error) => {
          cleanStorage();
          success = false;
          lock = false;
        });
    }
    return new Promise((resolve) => {
      // XXX I can only think of polling to see if the acquisition of new tokens is over. There are good solutions. Keep watching the lock until the request fails or succeeds
      const timer = setInterval(() => {
        if (!lock) {
          clearInterval(timer);

          if (success) {
            resolve("success");
          } else {
            cleanStorage();
            resolve("fail");
          }
        }
      }, 100); // The polling time can be changed by yourself
    });
  };
}

function cleanStorage() {
  uni.showToast({
    title: "Your login status has expired, please log in again",
    icon: "none",
    duration: 1500,
  });
  if (uni.showLoading()) {
    uni.hideLoading();
  }

  storage.setHasLogin(false);
  storage.setAccessToken("");
  storage.setRefreshToken("");
  console.log("Empty token");
  storage.setUuid("");
  storage.setUserInfo({});

  uni.navigateTo({
    url: "/pages/passport/login",
  });
}

let http = new Request();
const refreshToken = getTokenDebounce();

http.setConfig((config) => {
  // No uuid created
  if (!storage.getUuid()) {
    storage.setUuid(uuid.v1());
  }

  /* Set global configuration */
  config.baseURL = api.buyer;
  config.header = {
    ...config.header,
  };
  config.validateStatus = (statusCode) => {
    // Regardless of the status, we will deal with it correctly
    return true;
  };
  return config;
});

http.interceptors.request.use(
  (config) => {
    /* Interceptor before request. You can use async await to do asynchronous operations */
    let accessToken = storage.getAccessToken();
    if (accessToken) {
      const nonce = Foundation.randomString(6);
      const timestamp = parseInt(new Date().getTime() / 1000);
      const sign = md5(nonce + timestamp + accessToken);
      const _params = {
        nonce,
        timestamp,
        sign,
      };
      let params = config.params || {};
      params = {...params, ..._params };

      config.params = params;
      config.header.accessToken = accessToken;

      /**
       * jwt because Android and ios have no window attribute
       * The window.atob() function is used for base64 encoding using btoa(), and the used method for decoding is atob(),
       * So use handwritten base-64 encoded string data.
       */
      const atob = (str) => Buffer.from(str, "base64").toString("binary");
      // Determine if the expiration time is less than my current time, refresh the token on the request
      if (accessToken.split(".").length <= 1) {
        refresh();
      } else {
        if (
          JSON.parse(
            atob(
              accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
            )
          ).exp <Math.round(new Date() / 1000)
        ) {
          refresh();
        }
      }
    }
    config.header = {
      ...config.header,
      uuid: storage.getUuid() || uuid.v1(),
    };
    return config;
  },
  (config) => {
    return Promise.reject(config);
  }
);

async function refresh() {
  // The locally stored token is expired, get it again
  const getTokenResult = await refreshToken();
  if (getTokenResult === "success") {
    // Get the new token successfully, refresh the current page

    let routes = getCurrentPages(); // Get the currently opened page routing array
    let curRoute = routes[routes.length-1].route; //Get the current page route
    let curParam = routes[routes.length-1].options; //Get routing parameters
    // splicing parameters
    let param = "";
    for (let key in curParam) {
      param += "&" + key + "=" + curParam[key];
    }
    // Determine the current path
    if (curRoute.indexOf("pages/tabbar") == 1) {
      uni.switchTab({
        url: "/" + curRoute + param.replace("&", "?"),
      });
    }

    uni.redirectTo({
      url: "/" + curRoute + param.replace("&", "?"),
    });
  }
}

// Must use asynchronous function, pay attention
http.interceptors.response.use(
  async (response) => {
    /* Interceptor after request. You can use async await to do asynchronous operations */
    // token exists and token expires
    let token = storage.getAccessToken();
    if (
      (token && response.statusCode === 403) ||
      response.data.status === 403
    ) {
      // jwt token expired
      expireToken.push(token); // Store expired token
      const currentToken = storage.getAccessToken();
      if (expireToken.includes(currentToken)) {
        refresh();
      }
      // If the current return is not logged
    } else if (
      (!token && response.statusCode === 403) ||
      response.data.code === 403
    ) {
      cleanStorage();
      // If the current status code is normal but success is abnormal
    } else if (
      (response.statusCode == 200 && !response.data.success) ||
      response.statusCode == 400
    ) {
      if (response.data.message) {
        uni.showToast({
          title: response.data.message,
          icon: "none",
          duration: 1500,
        });
      }
    }
    return response;
  },
  (error) => {
    return error;
  }
);

export { http };

export const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

/**
 * Parse url parameters
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
function urlParse(url) {
   let obj = {};
   let reg = /[?&][^?&]+=[^?&]+/g;
   let arr = url.match(reg);
   if (arr) {
      arr.forEach((item) => {
         let tempArr = item.substring(1).split('=');
         let key = decodeURIComponent(tempArr[0]);
         let val = decodeURIComponent(tempArr.splice(1).join('='));
         obj[key] = val;
      });
   }
   return obj;
}

const getNetworkType = () => {
   uni.getNetworkType({
      success: (res) => {
         if (res.networkType === 'none') {
            uni.showToast({
               title: 'There seems to be a problem with the network, please check and try again!',
               duration: 2000,
               icon: 'none'
            });
            let pages = getCurrentPages();
            if (pages.length) {
               let route = pages[pages.length - 1].route;
               if (route !== 'pages/empty/empty') {
                  uni.navigateTo({
                     url: `/pages/empty/empty?type=wifi`
                  });
               }
            } else {
               uni.navigateTo({
                  url: `/pages/empty/empty?type=wifi`
               });
            }
         }
      }
   });
};

const throttle = (fn, that, gapTime) => {
   // export function throttle(fn, gapTime) {
   if (gapTime == null || gapTime == undefined) {
      gapTime = 1800;
   }
   let _lastTime = that.lastTime;
   let _nowTime = +new Date();
   if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(that, arguments); //pass this and parameters to the original function
      that.lastTime = _nowTime;
   }
};

/**
 * Calculate the countdown of the transmitted seconds [day, hour, minute, second]
 * @param seconds
 * @returns {{day: *, hours: *, minutes: *, seconds: *}}
 */
const countTimeDown = (seconds) => {
   const leftTime = (time) => {
      if (time < 10) time = '0' + time;
      return time + '';
   };
   return {
      day: leftTime(parseInt(seconds / 60 / 60 / 24, 10)),
      hours: leftTime(parseInt((seconds / 60 / 60) % 24, 10)),
      minutes: leftTime(parseInt((seconds / 60) % 60, 10)),
      seconds: leftTime(parseInt(seconds % 60, 10))
   };
};

/**
 * Calculate the countdown from the current time to 0:00 the next day [seconds]
 * @returns {number}
 */
const theNextDayTime = () => {
   const nowDate = new Date();
   const time =
      new Date(
         nowDate.getFullYear(),
         nowDate.getMonth(),
         nowDate.getDate() + 1,
         0,
         0,
         0
      ).getTime() - nowDate.getTime();
   return parseInt(time / 1000);
};

export {
   getNetworkType,
   throttle,
   countTimeDown,
   theNextDayTime
};

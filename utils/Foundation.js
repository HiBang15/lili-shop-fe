/**
 * Some common basic methods
 * whetherNavigate jump judgment after login
 * unixToDate converts the unix timestamp to the specified format
 * dateToUnix converts time to unix timestamp
 * deepClone makes a deep copy of an object
 * formatPrice currency format
 * secrecyMobile phone number privacy protection
 * randomString randomly generates a string of specified length
 */

/**
 * Verify bank card number
 */
export function checkBankno(bankno) {
   var lastNum = bankno.substr(bankno.length - 1, 1); //Remove the last digit (compare with luhm)
   var first15Num = bankno.substr(0, bankno.length - 1); //The first 15 or 18 digits
   var newArr = [];

   for (var i = first15Num.length - 1; i > -1; i--) {
      //The first 15 or 18 bits are stored in the array in reverse order
      newArr.push(first15Num.substr(i, 1));
   }

   var arrJiShu = []; //Product of odd digits*2 <9
   var arrJiShu2 = []; //The product of odd digits*2 >9
   var arrOuShu = []; //even-numbered bit array
   for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 == 1) {
         //Odd digits
         if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
         else arrJiShu2.push(parseInt(newArr[j]) * 2);
      } //Even digits
      else arrOuShu.push(newArr[j]);
   }

   var jishu_child1 = []; //Odd digits*2 >9 The single digits of the array after the division
   var jishu_child2 = []; //The tens digit of the array after the odd digit *2 >9
   for (var h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
   }

   var sumJiShu = 0; //Sum of arrays with odd number *2 <9
   var sumOuShu = 0; //Sum of even bit array
   var sumJiShuChild1 = 0; //The sum of the single digits of the array after the odd digit *2> 9 is divided
   var sumJiShuChild2 = 0; //The sum of the tens digits of the array after the odd digit *2> 9 is divided
   var sumTotal = 0;
   for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
   }
   for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
   }
   for (var p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
   }
   //Calculate the sum
   sumTotal =
      parseInt(sumJiShu) +
      parseInt(sumOuShu) +
      parseInt(sumJiShuChild1) +
      parseInt(sumJiShuChild2);
   //Calculate the Luhm value
   var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
   var luhm = 10 - k;
   if (lastNum == luhm) {
      return true;
   } else {
      return false;
   }
}

/**
 * Jump judgment after login
 * Calculate the current router path
 * 1. If the redirected link is a login page or the redirected link is an empty page. Will redirect to the homepage
 * 2. Not satisfied to return to the jump page
 * @param type'default' ||'wx' //The return address will be judged and the default is default
 */

export function whetherNavigate(type = 'default') {
   let navigation = getCurrentPages()[getCurrentPages().length - (getCurrentPages().length)];
   if (getCurrentPages().length > 1) {
      console.log(navigation, getCurrentPages());
      if (navigation.route == 'pages/passport/login') {
         navigationToBack(type);
      } else {
         if (!navigation.route || navigation.route == 'undefined') {
            navigationToBack(type);
         } else {
            uni.navigateBack({
               delta: getCurrentPages().length
            });
         }
      }
   } else {
      uni.switchTab({
         url: '/pages/tabbar/home/index'
      });
   }
}

/**
 * Convert the unix timestamp to the specified format
 * @param unix timestamp [seconds]
 * @param format conversion format
 * @returns {*|string}
 */
export function unixToDate(unix, format) {
   if (!unix) return unix;
   let _format = format || 'yyyy-MM-dd hh:mm:ss';
   const d = new Date(unix);
   const o = {
      'M+': d.getMonth() + 1,
      'd+': d.getDate(),
      'h+': d.getHours(),
      'm+': d.getMinutes(),
      's+': d.getSeconds(),
      'q+': Math.floor((d.getMonth() + 3) / 3),
      S: d.getMilliseconds()
   };
   if (/(y+)/.test(_format))
      _format = _format.replace(
         RegExp.$1,
         (d.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
   for (const k in o)
      if (new RegExp('(' + k + ')').test(_format))
         _format = _format.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? O[k] : ('00' + o[k]).substr(('' + o[k]).length)
         );
   return _format;
}

/**
 * Convert time to unix timestamp
 * @param date
 * @returns {number} [seconds]
 */
export function dateToUnix(date) {
   let newStr = date.replace(/:/g, '-');
   newStr = newStr.replace(/ /g, '-');
   const arr = newStr.split('-');
   const datum = new Date(
      Date.UTC(
         arr[0],
         arr[1] - 1,
         arr[2],
         arr[3] - 8 || -8,
         arr[4] || 0,
         arr[5] || 0
      )
   );
   return parseInt(datum.getTime() / 1000);
}

/**
 * Currency formatting
 * @param price
 * @returns {string}
 */
export function formatPrice(price) {
   if (typeof price !== 'number') return price;
   return String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Mobile phone number privacy protection
 * Hide the middle four digits
 * @param mobile
 * @returns {*}
 */
export function secrecyMobile(mobile) {
   mobile = String(mobile);
   if (!/\d{11}/.test(mobile)) {
      return mobile;
   }
   return mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
}

/**
 * Randomly generate a string of specified length
 * @param length
 * @returns {string}
 */
export function randomString(length = 32) {
   const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const maxPos = chars.length;
   let _string = '';
   for (let i = 0; i < length; i++) {
      _string += chars.charAt(Math.floor(Math.random() * maxPos));
   }
   return _string;
}

/**
 * Calculate the countdown of the transmitted seconds [day, hour, minute, second]
 * @param seconds
 * @returns {{day: *, hours: *, minutes: *, seconds: *}}
 */

export function countTimeDown(seconds) {
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
}

function navigationToBack(type) {
   if (type == 'wx') {
      // console.log(getCurrentPages().length-3)
      uni.navigateBack({
         delta: getCurrentPages().length
      });
   } else {
      uni.switchTab({
         url: '/pages/tabbar/home/index'
      });
   }
}

/**
 * Calculate the countdown from the current time to 0:00 the next day [seconds]
 * @returns {number}
 */
export function theNextDayTime() {
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
}

module.exports = {
   unixToDate,
   dateToUnix,
   formatPrice,
   secrecyMobile,
   randomString,
   countTimeDown,
   theNextDayTime,
   whetherNavigate,
   checkBankno
};

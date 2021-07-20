/**
  * Various regular expressions
  * mobile phone number
  * email
  * password [6-20 digits]
  * integer positive integer [does not contain 0]
  * money
  * TINumber tax identification number
  * IDCard
  * userName account name [combination of Chinese characters, letters, numbers, "-" and "_"]
  * URL URL
  * TEL fixed telephone
  */

// phone number
export const mobile = /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/

// E-mail
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

// Password【6-20 digits】
export const password = /^[@A-Za-z0-9!#$%^&*.~,]{6,20}$/

// Positive integer [does not contain 0]
export const integer = /^[1-9]\d*$/

// Positive integer [including 0]
export const Integer = /^[0-9]\d*$/

// money
export const money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

// Tax identification number
export const TINumber = /^((\d{6}[0-9A-Z]{9})|([0-9A-Za-z]{2}\d{6}[0-9A-Za-z]{10,12}))$/

// ID card
export const IDCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// Account name [combination of Chinese characters, letters, numbers, "-" and "_"]
export const userName = /[A-Za-z0-9_\-\u4e00-\u9fa5]$/

// URL
export const URL =
	/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/

// Fixed
export const TEL = /0\d{2,3}-\d{7,8}/

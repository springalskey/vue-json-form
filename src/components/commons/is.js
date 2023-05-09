import REGEXP from './regexp';

let is = {};

is.object = obj => {
  return (
    Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
  );
};

is.url = url => {
  return REGEXP.URL.test(url);
};

is.string = str => {
  return typeof str === 'string';
};

is.array = arr => {
  return Array.isArray(arr);
};

is.function = fn => {
  return typeof fn === 'function';
};

// 是否线上和UT环境
is.prod = () => {
  let origin = window.location.origin;
  if ($ENV.env === 'prod' || origin.includes('.zhizhi.info')) {
    return true;
  }
  return false;
};

// 是否是json字符串
is.json = str => {
  if (is.string(str)) {
    try {
      JSON.parse(str);
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
};

// 小程序：判断登录角色是否为买家
is.buyer = () => {
  let value = sessionStorage.getItem('USER_BASEINFO');
  let userInfo = JSON.parse(value || '{}');
  let buyerRole = 1;
  let isBuyer = is.empty(userInfo) || userInfo.userRole === buyerRole;
  return isBuyer;
};

/**
 * 判断是否为空值
 * test case:
 * console.log(is.empty(-1)); // false
 * console.log(is.empty(0));  // false
 * console.log(is.empty(false)); // false
 * console.log(is.empty([undefined,0]));  // false
 * console.log(is.empty([0,0]));  // false
 * console.log(is.empty([undefined,false]));  // false
 * console.log('')
 * console.log(is.empty(null));  // true
 * console.log(is.empty(''));  // true
 * console.log(is.empty(undefined));  // true
 * console.log(is.empty({}));  // true
 * console.log(is.empty([]));  // true
 * console.log(is.empty(Infinity));  // true
 * console.log(is.empty(NaN));  // true
 * console.log(is.empty([[]]));  // true
 * console.log(is.empty([undefined]));  // true
 * console.log(is.empty([null,Infinity]));  // true
 * console.log(is.empty(['','']));  // true
 */
is.empty = function(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.every(v => is.empty(v));
  } else if (is.object(value)) {
    var length = Object.keys(value).length;
    if (length === 0) {
      return true;
    }
    return false;
  } else if (typeof value === 'number' && !isFinite(value)) {
    return true;
  }
  return typeof value === 'undefined' || value === '' || value === null;
};

export default is;

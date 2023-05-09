/**
 * 截取url参数转成object
 * @param {String} url
 * @return {Object}
 */
export function getQuery(url) {
  let result = {};
  if (url && url.indexOf('?') !== -1) {
    let strs = url.substring(url.indexOf('?') + 1).split('&');
    for (let i = 0; i < strs.length; i++) {
      let arr = strs[i].split('=');
      result[arr[0]] = decodeURIComponent(arr[1]);
    }
  }
  return result;
}

/**
 * 将object转成URL参数
 * @param {Object} queryObj
 * @return {String} '?id=1&host=2'
 */
export function toQuery(queryObj = {}) {
  let arr = [];
  for (let key in queryObj) {
    if (queryObj.hasOwnProperty(key)) {
      let value = encodeURIComponent(queryObj[key] || '');
      arr.push(key + '=' + value);
    }
  }
  if (arr.length) return '?' + arr.join('&');
  return '';
}

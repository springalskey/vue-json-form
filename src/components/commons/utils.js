import is from './is';
/**
 * 防抖函数
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 */
export function debounce(func, wait = 300, immediate) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait || 0);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function throttle(func, delay = 300) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
}

/**
 * 获取element距离页面顶部的距离
 * @param {Dom} element
 */
export function getElementTop(element) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}

/**
 * obj转formData
 * @param {Object} obj
 */
export function toFormData(obj) {
  let formData = new FormData();
  for (let p in obj) {
    formData.append(p, obj[p]);
  }
  return formData;
}

// 生产uuid
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

// 深度克隆
export function deepClone(obj) {
  if (typeof obj !== 'object') return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      newObj[key] = deepClone(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// 获取纯净的formData，剔除空数据
export function getPureFormData(formData) {
  for (let v in formData) {
    if (is.empty(formData[v])) {
      delete formData[v];
    } else if (v.includes('.')) {
      delete formData[v];
    } else if (is.object(formData[v])) {
      this.getPureFormData(formData[v]);
    }
  }
  return formData;
}

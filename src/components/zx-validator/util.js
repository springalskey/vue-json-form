/**
 * 判断值是否为空
 */
export function isEmpty(value) {
  return typeof value === 'undefined' || value === '' || value === null;
}

export function trim(val) {
  if (typeof val === 'string') {
    return val.trim();
  }
  return val;
}

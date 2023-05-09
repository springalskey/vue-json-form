export function setValueByObjectPath(obj, path, value) {
  let a = path.split('.');
  let o = obj;
  while (a.length - 1) {
    let n = a.shift();
    if (!(n in o)) o[n] = {};
    o = o[n];
  }
  o[a[0]] = value;
}

export function getValueByObjectPath(obj, path) {
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  let a = path.split('.');
  let o = obj;
  while (a.length) {
    let n = a.shift();
    if (!(n in o)) return;
    o = o[n];
  }
  return o;
}

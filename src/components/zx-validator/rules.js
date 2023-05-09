import is from '../commons/is';
import { trim, isEmpty } from './util';
let rules = {};

addRule('mobile', /^1\d{10}$/, '{{name}}格式不正确');
addRule('num', /^\d+$/, '{{name}}格式必须为>=0的整数');
addRule('integer', /^[1-9]\d*$/, '{{name}}为>0的整数');
addRule('char', /^[a-zA-Z]+$/, '{{name}}由英文字母组成');
addRule('nchar', /^[a-zA-Z0-9]+$/, '{{name}}由英文字母和数字组成');

// 版本号：1.2.3，每一位最多三位数
addRule('version', /^([1-9]{1,3}|0)\.\d{1,3}\.\d{1,3}$/, '{{name}}格式不正确');
// 16进制颜色值
addRule('color', /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, '{{name}}格式不正确');
// 正数金额(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)
// 正负数金额
addRule(
  'money',
  /(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^-?0$)|(^-?\d\.\d{1,2}$)/,
  '{{name}}格式不正确'
);
addRule(
  'email',
  /^[\w.\-]+@(?:[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.)+[A-Za-z]{2,6}$/,
  '{{name}}格式不正确'
);
addRule(
  'url',
  /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
  '{{name}}格式不正确'
);

addRule(
  'pathname',
  /^[a-z]+((\-)*[a-z0-9]+)*$/,
  '{{name}}必须以字母开头且由小写字母、数字、中划线组成'
);

addRule(
  'required',
  val => {
    // daterange值循环判空
    return !is.empty(trim(val));
  },
  '{{name}}不能为空'
);
addRule(
  'max',
  (val, rule) => {
    if (isEmpty(val)) return true;
    return Number(val) <= Number(rule);
  },
  '{{name}}必须小于等于{{max}}'
);
addRule(
  'min',
  (val, rule) => {
    if (isEmpty(val)) return true;
    return Number(val) >= Number(rule);
  },
  '{{name}}必须大于等于{{min}}'
);
addRule(
  'minlen',
  (val, rule) => {
    if (isEmpty(val)) return true;
    return trim(val).length >= Number(trim(rule));
  },
  '{{name}}的长度必须大于等于{{minlen}}'
);
addRule(
  'maxlen',
  (val, rule) => {
    if (isEmpty(val)) return true;
    return trim(val).length <= Number(trim(rule));
  },
  '{{name}}的长度必须小于等于{{maxlen}}'
);

addRule(
  'regexp',
  (val, rule) => {
    if (isEmpty(val)) return true;
    return new RegExp(rule, 'g').test(trim(val));
  },
  '{{name}}不符合规则'
);

addRule(
  'password',
  (val, rule) => {
    if (!rule) return true;
    return !(
      (
        val.length < 8 ||
        val.length > 16 ||
        /^\d+$/.test(val) ||
        /^[A-Za-z]+$/.test(val) ||
        /^[^A-Za-z0-9]+$/.test(val)
      ) // 如果是特殊字符
    );
  },
  '密码长度8-16位，数字、字母、字符至少包含两种'
);

function addRule(name, operator, message) {
  if (rules[name]) {
    console.error('Rule already exists');
    return;
  }
  if (operator instanceof RegExp) {
    let fn = val => {
      if (isEmpty(val)) return true;
      return operator.test(val);
    };
    rules[name] = [fn, message];
  } else {
    rules[name] = [operator, message];
  }
}

function setMessage(name, message) {
  if (rules[name]) {
    rules[name][1] = message;
  }
}

function getRule(name) {
  if (rules[name]) {
    return rules[name];
  }
}

function getMessage(name) {
  return rules[name] ? rules[name][1] : '';
}

export { rules, addRule, getMessage, setMessage, getRule };

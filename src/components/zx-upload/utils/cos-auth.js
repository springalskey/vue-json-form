var CryptoJS = require('crypto-js');

(function() {
  'use strict';

  // 和 cam 保持一致的 url encode
  function camSafeUrlEncode(str) {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }

  // v4 签名
  var CosAuthV4 = function(opt) {
    var pathname = opt.Pathname || '/';
    var expires = opt.Expires;

    var ShortBucketName = '';
    var AppId = '';
    var match = opt.Bucket.match(/^(.+)-(\d+)$/);
    if (match) {
      ShortBucketName = match[1];
      AppId = match[2];
    }

    var random = parseInt(Math.random() * Math.pow(2, 32));
    var now = parseInt(Date.now() / 1000);
    var e = now + (expires === undefined ? 900 : expires * 1 || 0); // 默认签名过期时间为当前时间 + 900s
    var path =
      '/' +
      AppId +
      '/' +
      ShortBucketName +
      encodeURIComponent(pathname).replace(/%2F/g, '/'); // 多次签名这里填空
    var plainText =
      'a=' +
      AppId +
      '&b=' +
      ShortBucketName +
      '&k=' +
      opt.SecretId +
      '&e=' +
      e +
      '&t=' +
      now +
      '&r=' +
      random +
      '&f=' +
      path;
    var sha1Res = CryptoJS.HmacSHA1(plainText, opt.SecretKey);
    var strWordArray = CryptoJS.enc.Utf8.parse(plainText);
    var resWordArray = sha1Res.concat(strWordArray);
    var sign = resWordArray.toString(CryptoJS.enc.Base64);

    return sign;
  };

  // v5 签名
  var CosAuth = function(opt) {
    if (!opt.SecretId) return console.error('missing param SecretId');
    if (!opt.SecretKey) return console.error('missing param SecretKey');

    if (opt.Version === '4.0') {
      return CosAuthV4(opt);
    }

    opt = opt || {};

    var SecretId = opt.SecretId;
    var SecretKey = opt.SecretKey;
    var method = (opt.Method || 'get').toLowerCase();
    var query = opt.Query || {};
    var headers = opt.Headers || {};
    var pathname = opt.Pathname || '/';
    var expires = opt.Expires;

    var getObjectKeys = function(obj) {
      var list = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          list.push(key);
        }
      }
      return list.sort(function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a === b ? 0 : a > b ? 1 : -1;
      });
    };

    var obj2str = function(obj) {
      var i, key, val;
      var list = [];
      var keyList = getObjectKeys(obj);
      for (i = 0; i < keyList.length; i++) {
        key = keyList[i];
        val = obj[key] === undefined || obj[key] === null ? '' : '' + obj[key];
        key = key.toLowerCase();
        key = camSafeUrlEncode(key);
        val = camSafeUrlEncode(val) || '';
        list.push(key + '=' + val);
      }
      return list.join('&');
    };

    // 签名有效起止时间
    var now = parseInt(new Date().getTime() / 1000) - 1;
    var exp = now + (expires === undefined ? 900 : expires * 1 || 0); // 默认签名过期时间为当前时间 + 900s

    // 要用到的 Authorization 参数列表
    var qSignAlgorithm = 'sha1';
    var qAk = SecretId;
    var qSignTime = now + ';' + exp;
    var qKeyTime = now + ';' + exp;
    var qHeaderList = getObjectKeys(headers)
      .join(';')
      .toLowerCase();
    var qUrlParamList = getObjectKeys(query)
      .join(';')
      .toLowerCase();

    // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
    // 步骤一：计算 SignKey
    var signKey = CryptoJS.HmacSHA1(qKeyTime, SecretKey).toString();

    // 步骤二：构成 FormatString
    var formatString = [
      method,
      pathname,
      obj2str(query),
      obj2str(headers),
      ''
    ].join('\n');

    // 步骤三：计算 StringToSign
    var stringToSign = [
      'sha1',
      qSignTime,
      CryptoJS.SHA1(formatString).toString(),
      ''
    ].join('\n');

    // 步骤四：计算 Signature
    var qSignature = CryptoJS.HmacSHA1(stringToSign, signKey).toString();

    // 步骤五：构造 Authorization
    var authorization = [
      'q-sign-algorithm=' + qSignAlgorithm,
      'q-ak=' + qAk,
      'q-sign-time=' + qSignTime,
      'q-key-time=' + qKeyTime,
      'q-header-list=' + qHeaderList,
      'q-url-param-list=' + qUrlParamList,
      'q-signature=' + qSignature
    ].join('&');

    return authorization;
  };

  if (typeof module === 'object') {
    module.exports = CosAuth;
  } else {
    window.CosAuth = CosAuth;
  }
})();

import Vue from 'vue';
import './common.scss';
import is from './is';
import * as url from './url';
import * as utils from './utils';
import * as file from './file';

const tools = Object.assign(utils, url, file);

// 封装插件
Vue.use({
  install(Vue) {
    Vue.prototype.$$is = is;
    Vue.prototype.$$utils = tools;
    Vue.prototype.$$log = (...args) => {
      console.log(...JSON.parse(JSON.stringify(args)));
    };
  }
});

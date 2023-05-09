<template>
  <div :data-uuid="uuid" :vid="vid" class="form-validator">
    <slot></slot>
  </div>
</template>
<script>
import { refs } from './directive';
import { getMessage, getRule } from './rules';
import { guid } from '../commons/utils';
import is from '../commons/is';
import { debounce } from '../commons/utils';

// 验证失败时以下选择器元素将展示红色边框
const ValidFailureSelectors = [
  '.form-valid-failure-redborder',
  '.el-textarea > textarea',
  '.el-date-editor--daterange',
  '.zx-datetimerange',
  'input'
];

export default {
  name: 'zxValidator',
  props: {
    // formdata
    form: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    vid: {
      type: String
    }
  },
  data() {
    return {
      required: false,
      // 自定义校验函数名称
      validfnName: 'valid',
      formName: 'zxForm'
    };
  },
  computed: {
    uuid() {
      return guid();
    }
  },
  created() {
    this.onChangeItemValue = debounce(this.onChangeItemValueFn, 0);
  },
  mounted() {
    refs[this.uuid] = this;
    // vid决定了valueChange的作用范围，valueChange始终作用于vid标签下的表单中，从下往上逐级拆分。
    if (this.vid) {
      this.$watch('form', () => this.onChangeItemValue(), { deep: true });
    }
  },
  methods: {
    onChangeItemValueFn() {
      this.$eventBus.$emit(this.uuid + this.vid, this.form);
    },
    // 找出和fieldList字段名相同的config
    getValidConfigList(fieldList, configList) {
      let validList = [];
      for (let field of fieldList) {
        let res = configList.find(item => item.field === field && item._vif);
        validList.push(res);
      }
      return validList;
    },
    /**
     *  过滤掉隐藏的配置
     */
    getVisibleList(fieldList) {
      let arr = [];
      for (let item of this.list) {
        // 过滤数据
        if (item._vif && item.field) {
          arr.push(item);
        }
      }
      if (!is.empty(fieldList)) {
        return this.getValidConfigList(fieldList, arr);
      } else {
        return arr;
      }
    },

    /**
     * 验证通过返回true，否则false
     * cacheMsg: 是否缓存验证结果，当在change或者blur时cacheMsg = true，并缓存缓存校验结果。
     * 当点击保存按钮的时候cacheMsg = false，会根据是否有缓存的结果来决定是否进行验证
     */
    async valid(fieldList, cacheMsg = false) {
      let list = this.getVisibleList(fieldList);
      let msg = '';
      for (let i = 0; i < list.length; i++) {
        let config = list[i];
        let ruleNames = this.sortRules(config);
        for (let item of ruleNames.entries()) {
          let ruleName = item[1];
          let rule = getRule(ruleName) || ruleName === this.validfnName;
          if (rule && config.rules[ruleName] !== false) {
            let { matched, message } = await this.matchRule(
              config,
              rule,
              ruleName,
              cacheMsg
            );
            if (!matched) {
              msg = message;
              this.showErrorTips(config.$el, msg);
              break;
            } else {
              this.showErrorTips(config.$el, '');
            }
          }
        }
      }
      let valided = msg === '';
      if (cacheMsg) {
        return {
          matched: valided,
          message: msg
        };
      }
      // !valided && Message.error(msg);
      return valided;
    },

    /**
     * 排序attrs校验规则，排序后顺序如下：[required, num, money, ...其他, valid]
     */
    sortRules(config) {
      let rules = config.rules || {};
      let ruleNames = Object.keys(rules);
      let sortResults = [];
      this.addRuleName(sortResults, ruleNames, 'required');
      this.addRuleName(sortResults, ruleNames, 'num');
      this.addRuleName(sortResults, ruleNames, 'money');
      ruleNames.forEach(item => {
        if (item !== 'valid') {
          sortResults.push(item);
        }
      });
      this.addRuleName(sortResults, ruleNames, 'valid');
      return sortResults;
    },

    addRuleName(sortResults, ruleNames, ruleName) {
      ruleNames.forEach((item, index) => {
        if (item === ruleName) {
          ruleNames.splice(index, 1);
          sortResults.push(ruleName);
        }
      });
    },

    // 显示错误信息
    showErrorTips(el, msg) {
      if (!el) return;
      let errorEl = el.querySelector('.error-tips');
      if (!errorEl) return;
      errorEl.innerText = msg;
      let color = msg ? 'red' : '';
      this.setInputBorderColor(el, color);
    },

    setInputBorderColor(el, color = '') {
      // 验证不通过时，以下class将展示红色边框
      for (let item of ValidFailureSelectors) {
        let inputEle = el.querySelector(item);
        if (inputEle) {
          inputEle.style['border-color'] = color;
          break;
        }
      }
    },

    /**
     * 1.校验rule规则
     * 2.支持字符串规则、字符串函数名、绑定函数、配置化rules
     * 在配置化中：cacheMsg=true为change或blur触发，一定会执行校验方法（预设规则或自定义校验）
     * 当提交保存时，cacheMsg=false，如果该字段已经有缓存的校验结果则返回缓存结果
     * 非配置化中：不会缓存校验交过
     */
    async matchRule(config, rule, ruleName, cacheMsg = false) {
      let { field, rules, label } = config;
      let value = this.form[field];
      // 点击提交时走缓存的验证结果
      // 如果有缓存就返回缓存
      if (!cacheMsg && config && config.validResult) {
        return config.validResult;
      }
      let validResult = {
        matched: true,
        message: ''
      };
      if (ruleName.toLowerCase() !== this.validfnName) {
        validResult.matched = rule[0](value, rules[ruleName]) || false;
        let ruleValue = rules[ruleName];
        validResult.message = this.getMessage(ruleName, ruleValue, label) || '';
        // 返回校验结果
        return validResult;
      }
      // valid函数
      let validFn = config.rules && config.rules.valid;
      if (validFn) {
        // change时不走缓存的validResult
        let res = {};
        try {
          res = await validFn.call(this, {
            formData: this.form,
            rules,
            value,
            ctx: this.getContext(),
            config
          });
        } catch (error) {
          return error;
        }
        validResult.matched = res.matched;
        validResult.message = res.message;
        return validResult;
      }
    },

    getMessage(ruleName, ruleValue, title) {
      let msg = getMessage(ruleName, title);
      return msg
        .replace('{{name}}', title)
        .replace(`{{${ruleName}}}`, ruleValue);
    },

    getContext() {
      let _formVM = this.$vnode.context;
      if (_formVM.$options.name === this.formName) {
        return _formVM.$vnode.context || _formVM;
      }
      return _formVM;
    }
  },
  beforeDestroy() {
    delete refs[this.uuid];
  }
};
</script>

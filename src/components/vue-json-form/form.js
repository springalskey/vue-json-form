import { setValueByObjectPath, getValueByObjectPath } from './objec-path';
import prefixSuffix from './prefix-suffix';
import { validAll } from '../zx-validator/directive';
import { debounce } from '../commons/utils';
export default {
  name: 'VueJsonForm',
  components: {
    prefixSuffix
  },
  props: {
    vid: {
      type: String
    },
    value: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    className: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 全局配置表单中各个组件触发验证的事件名（change|blur）
    trigger: {
      type: String
    },
    // 全局配置表单中各个组件销毁时是否清空数据
    destroyClearData: {
      type: Boolean
    },
    // 表单嵌套循环时，当前表单的索引
    rowIndex: {
      type: Number
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {},
      initFormData: {},
      data: {},
      // 所有节点数组
      leafItems: []
    };
  },
  provide() {
    return {
      getFormVm: () => {
        return this;
      }
    };
  },
  created() {
    this.onChangeItemValue = debounce(this.onChangeItemValueFn, 0);
    this.init();
  },
  mounted() {
    // this.initUploadCompWidth();
  },
  methods: {
    // 初始化日期
    init() {
      this.formData = this.value;
      this.showFormItem();
      this.initFormData = JSON.parse(JSON.stringify(this.formData));
      // 初始化设置formData的值，读取配置中的defaultValue
      this.setFormData();
    },

    // 设置表单数据
    setFormData() {
      for (let item of this.list) {
        this.setValueItem(item);
      }
    },

    /**
     * 如果formData不存在field字段，则设置默认值等于defaultValue
     * @param {Object} config
     */
    setValueItem(config) {
      if (!config.field) {
        return;
      }
      // value必须为空数组的组件
      let arrDefaults = ['checkbox-group', 'add-minus'];
      if (config.field && config.field.includes('.')) {
        let v = getValueByObjectPath(this.value, config.field);
        this.$set(this.formData, config.field, v);
      } else if (!this.formData.hasOwnProperty(config.field)) {
        let value;
        if (config.hasOwnProperty('defaultValue')) {
          value = config.defaultValue;
        }
        if (arrDefaults.includes(config.type) && this.$$is.empty(value)) {
          value = [];
        }
        this.$set(this.formData, config.field, value);
      } else if (config.field) {
        let value = this.formData[config.field];
        if (arrDefaults.includes(config.type) && this.$$is.empty(value)) {
          this.formData[config.field] = [];
        }
      }
    },

    showFormItem(list) {
      list = list || this.list;
      for (let item of list) {
        if (item.vif) {
          this.$set(item, '_vif', item.vif(this.formData));
        } else {
          this.$set(item, '_vif', true);
        }
        if (item.list) {
          this.showFormItem(item.list);
        }
        if (Array.isArray(item.suffix)) {
          this.showFormItem(item.suffix);
        }
      }
    },

    // 设置上传组件宽度为100%
    initUploadCompWidth() {
      let wrapper = this.$refs.wrapper;
      let uploads = wrapper.querySelectorAll('.zx-image-upload');
      let files = wrapper.querySelectorAll('.zx-file-upload');
      uploads = [...uploads].concat([...files]);
      let clientWidth = wrapper.clientWidth;
      let labelWidth = this.$attrs['label-width'] || '0px';
      labelWidth = Number(labelWidth.replace('px', ''));
      uploads.forEach(el => {
        if (el.offsetParent) {
          el.offsetParent.style.width = clientWidth - labelWidth + 'px';
        }
      });
    },
    /**
     * 如果fieldList=[]，校验整个表单。否则校验数组中的元素
     * @param {Array} fieldList 字段名数组
     */
    async valid(fieldList = [], cacheMsg = false) {
      let validator = this.$refs.validator;
      if (!validator || !validator.$el) {
        return;
      }
      if (fieldList.length) {
        // 校验部分标签
        let validResult = await validator.valid(fieldList, cacheMsg);
        if (cacheMsg) {
          return {
            matched: validResult.matched,
            message: validResult.message
          };
        }
        return validResult === true;
      }
      // 校验全部,返回布尔值
      let valided = await validAll(validator.$el);
      return valided;
    },

    // 通过字段名获取配置
    findItem(field) {
      for (let item of this.list) {
        if (field === item.field && item._vif !== false) {
          return item;
        }
      }
    },
    // value变化时，根据path设置value
    setPathValue() {
      for (let p in this.formData) {
        if (p.includes('.')) {
          setValueByObjectPath(this.formData, p, this.formData[p]);
        }
      }
    },
    /**
     * 获取初始化formData
     */
    getInitFormData() {
      return this.initFormData;
    },
    /**
     * 清空表单值
     */
    resetFields(formData = {}) {
      for (let item of this.leafItems) {
        if (item.validResult) {
          item.validResult = undefined;
        }
      }
      this.formData = formData;
      this.valid();
    },
    onChangeItemValueFn() {
      this.setPathValue();
      this.showFormItem();
      this.setFormData();
    }
  },
  watch: {
    value: {
      handler() {
        this.formData = this.value;
        this.onChangeItemValue();
      }
    },
    list: {
      handler() {
        this.onChangeItemValue();
      }
    }
  }
};

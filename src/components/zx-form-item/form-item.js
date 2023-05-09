import is from '../commons/is';
import { setValueByObjectPath } from '../vue-json-form/objec-path';

export default {
  name: 'zxFormItem',
  props: {
    item: {
      type: Object
    },
    value: {},
    formData: {
      type: Object
    },
    rowIndex: {
      type: Number
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  inject: ['getFormVm'],
  data() {
    return {
      RANGE_TYPES: ['datetimerange', 'daterange', 'timerange'],
      data: undefined,
      clearable: true
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.data = this.value;
          this.changeHandler();
          if (this.item.hasOwnProperty('validResult')) {
            this.item.validResult = undefined;
          }
        }
      },
      deep: true
    },
    data(newVal, oldVal) {
      if (newVal !== oldVal && this.data !== this.value) {
        this.$emit('input', newVal);
      }
    }
  },
  created() {
    // 初始化赋值
    this.data = this.value;
    this.clearable = this.getClearAble();
    this.$nextTick(() => {
      this.getConfig();
    });
  },
  mounted() {
    // 添加挂在$el
    this.item.$el = this.$refs.formItem;
    let uvId = this.getRootUVid();
    if (uvId) {
      this.$eventBus.$on(uvId, data => {
        let params = this.getParam();
        params.globalFormData = data;
        this.item.valueChange && this.item.valueChange(params);
      });
    }
  },
  methods: {
    // 找到最上层的form vid。
    // vid决定了valueChange的作用范围，valueChange被触发于vid标签下的表单中，且从下往上逐级拆分vid。
    getRootUVid() {
      let root;
      let parent = this.$parent;
      while (parent) {
        if (parent.$props && parent.$props.vid) {
          root = parent;
          parent = null;
          break;
        }
        parent = parent.$parent;
      }
      if (root && root.$props && root.$props.vid) {
        let vid = root.$props.vid;
        let uuid = root.$el.getAttribute('data-uuid');
        let uvId = uuid + vid;
        return uvId;
      }
    },
    getClearAble() {
      if (this.item.attrs) {
        if (this.item.attrs.clearable === false) {
          return false;
        }
      }
      return true;
    },

    /**
     * 处理函数回调
     * option, data, text可为数组，函数
     */
    async getConfig() {
      let param = this.getParam();
      if (is.function(this.item.optionsAsync)) {
        let _options = await this.item.optionsAsync(param);
        this.$set(this.item, 'options', _options);
      }
      if (is.function(this.item.dataAsync)) {
        let _data = await this.item.dataAsync(param);
        this.$set(this.item, 'data', _data);
      }
      if (is.function(this.item.textAsync)) {
        let _text = await this.item.textAsync(param);
        this.$set(this.item, 'text', _text);
      }
      // 初始化调用changeHandler事件
      this.changeHandler();
    },
    getDateAttrs({ rules = {}, attrs = {} }, format) {
      let attr = Object.assign({}, rules, attrs);
      attr.placeholder = (attr.placeholder || '请选择') + this.item.label;
      attr['range-separator'] = attr['range-separator'] || '至';
      attr['value-format'] = attr['value-format'] || format;
      if (attr.valid) {
        attr.valid = '';
      }
      return attr;
    },
    getAttrs({ rules = {}, attrs = {} }, placeholder = '请选择') {
      let attr = Object.assign({}, rules, attrs);
      if (attr.valid) {
        attr.valid = '';
      }
      // 扁平数据结构不需要验证
      if (rules && rules.required && this.item.deepData !== false) {
        attr.validator = this.item.label;
      }
      attr.placeholder = attr.placeholder || placeholder + this.item.label;
      return attr;
    },
    // 如果非通过鼠标事件触发onChange，则会出现表单初始化会校验不通过的提示
    // 目前校验过input、select通过formData改值不会触发
    onChange(e) {
      let v = this.isEmpty(e) ? '' : e;
      this.setPathValue(v);
      this.changeHandler(v);
    },

    // value变化时，根据path设置value
    setPathValue(v) {
      if (this.item.field.includes('.')) {
        setValueByObjectPath(this.formData, this.item.field, v);
      }
    },
    /**
     * 如果e等于undefined或者null，不需要触发校验。当点击保存按钮的时候，不会走这里的changeHandler方法。
     */
    changeHandler(e) {
      let formVm = this.getFormVm();
      this.$emit('input', this.data);
      this.$emit('change', this.data);
      if (is.function(this.item.change)) {
        // 给item添加value属性并赋值
        this.$set(this.item, 'value', this.data);
        // 防止change和watch导致执行两次item.change
        if (this.t) return;
        this.t = setTimeout(async () => {
          let needValid = await this.item.change(this.getParam(e));
          this.t = null;
          if (this.isEmpty(e)) {
            return;
          }
          this.handleResult(needValid);
        });
      } else if (
        (this.validTrigger('change') &&
          !this.item.blur &&
          this.item.change !== false) ||
        this.item.change === true
      ) {
        if (this.isEmpty(e)) {
          return;
        }
        this.$nextTick(async () => {
          let validResult = await formVm.valid([this.item.field], true);
          this.item.validResult = validResult;
        });
      }
    },
    // 如果value等于null|undefined|[undefined, undefined]|[null, null]返回true
    isEmpty(e) {
      if (typeof e === 'undefined' || e === null) {
        return true;
      }
      if (Array.isArray(e) && this.RANGE_TYPES.includes(this.item.type)) {
        return e.every(item => this.isEmpty(item));
      }
      return false;
    },
    /**
     * 获取form配置中是否存在trigger=“change”或trigger="blur"
     * @param {String} eventName 触发表单验证的事件名 （change| blur）
     */
    validTrigger(eventName) {
      let formVm = this.getFormVm();
      if (formVm.$attrs) {
        if (formVm.trigger === eventName) {
          return true;
        }
      }
    },

    // 失去焦点事件
    async onBlur(e) {
      // 等于true代表需要失去焦点时验证当前元素
      let formVm = this.getFormVm();
      this.$emit('input', this.data);
      if (is.function(this.item.blur)) {
        this.$set(this.item, 'value', this.data);
        // 如果blur函数返回true，代表需要校验
        if (is.function(this.item.blur)) {
          let needValid = this.item.blur(this.getParam(e));
          this.handleResult(needValid);
        }
      } else if (this.validTrigger('blur') || this.item.blur === true) {
        this.$nextTick(async () => {
          let validResult = await formVm.valid([this.item.field], true);
          this.item.validResult = validResult;
        });
      }
    },
    onFocus(e) {
      if (is.function(this.item.focus)) {
        this.item.focus(this.getParam(e));
      }
    },
    // 按钮类型点击事件
    onClick(e) {
      if (this.item.click) {
        this.item.click(this.getParam(e));
      }
    },
    getParam(e) {
      let ctx = this.getContext();
      let formVm = this.getFormVm();
      return {
        formData: formVm.formData,
        ctx: ctx,
        config: this.item,
        value: this.data,
        vm: this,
        $form: formVm,
        findItem: formVm.findItem,
        e: e,
        rowIndex: this.rowIndex
      };
    },
    // 必须等于true才能触发校验
    async handleResult(needValid) {
      let formVm = this.getFormVm();
      let validResult;
      if (needValid instanceof Promise) {
        let res = await needValid;
        if (res === true) {
          validResult = await formVm.valid([this.item.field], true);
        }
      } else if (needValid === true) {
        validResult = await formVm.valid([this.item.field], true);
      }
      // 判断是否需要change时验证
      if (this.validTrigger('change')) {
        validResult = await formVm.valid([this.item.field], true);
      }
      this.item.validResult = validResult;
    },
    getContext() {
      let formVm = this.getFormVm();
      return formVm.$vnode.context || formVm;
    },
    getDisabled() {
      if (this.item.attrs) {
        if (this.$$is.function(this.item.attrs.disabled)) {
          let flag = this.item.attrs.disabled(this.getParam());
          return flag;
        }
        return this.item.attrs.disabled;
      }
      return false;
    }
  },
  computed: {
    displayLabel() {
      if (!this.editable) {
        // 执行display方法
        if (is.function(this.item.display)) {
          return this.item.display(this.getParam());
        }
        // 支持mapList
        if (is.object(this.item.mapList)) {
          let label = this.item.mapList[this.value];
          return label;
        }
        // 支持mapList
        if (Array.isArray(this.item.mapList)) {
          let { label } =
            this.item.mapList.find(item => item.value === this.value) || {};
          return label;
        }
      }
    }
  },
  beforeDestroy() {
    let formVm = this.getFormVm();
    // 如果设置destroyClearData属性，在组件销毁时清空该属性的值。
    // 发生在触发v-if=true的时候，应用场景如级联操作中。
    if (
      (this.item.attrs && this.item.attrs.destroyClearData) ||
      formVm.destroyClearData ||
      formVm.$attrs.destroyClearData
    ) {
      this.$emit('input', undefined);
      this.item.value = undefined;
    }
    if (this.item.validResult) {
      this.item.validResult = undefined;
    }
  }
};

<template>
  <!--daterange-->
  <el-date-picker
    v-if="item.type === 'daterange'"
    :validator="item.label"
    :field="item.field"
    @change="onChange"
    :type="item.type"
    value-format="yyyy-MM-dd"
    v-bind="getAttrs(item)"
    v-model="data"
  />
  <!--datetimerange-->
  <el-date-picker
    class="zx-datetimerange"
    v-else-if="item.type === 'datetimerange'"
    :validator="item.label"
    :field="item.field"
    :type="item.type"
    @change="onChange"
    value-format="yyyy-MM-dd HH:mm:ss"
    v-bind="getAttrs(item)"
    v-model="data"
  />
  <!--datetimerange-->
  <el-time-picker
    class="zx-datetimerange"
    v-else-if="item.type === 'timerange'"
    :validator="item.label"
    :field="item.field"
    :type="item.type"
    @change="onChange"
    value-format="HH:mm:ss"
    v-bind="getAttrs(item)"
    v-model="data"
  />
</template>
<script>
export default {
  name: 'zxFormDaterange',
  props: {
    value: {},
    item: {
      type: Object
    },
    formData: {
      type: Object
    }
  },
  inject: ['getFormVm'],
  data() {
    return {
      data: undefined,
      start: undefined,
      end: undefined
    };
  },
  created() {
    this.start = this.item.attrs.startField;
    this.end = this.item.attrs.endField;
    // 如果没有值设置为空字符串，否则会报错
    let range = [
      this.formData[this.start] || '',
      this.formData[this.end] || ''
    ];
    this.changeHandler(range);
  },
  methods: {
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
    changeHandler(range) {
      range = range || [];
      this.$set(this.formData, this.start, range[0]);
      this.$set(this.formData, this.end, range[1]);
      // 设置formData.dateRange = range，验证时需要使用
      this.$emit('input', range);
      this.data = range;
    },
    onChange(range) {
      this.changeHandler(range);
      this.emitChange();
    },
    emitChange() {
      this.$emit('change', this.data);
    }
  },
  watch: {
    formData: {
      handler(newVal, oldVal) {
        // 处理初始化赋值，异步延迟赋值
        let range = [
          this.formData[this.start] || '',
          this.formData[this.end] || ''
        ];
        this.data = this.data || ['', ''];
        if (range[0] !== this.data[0] || range[1] !== this.data[1]) {
          this.data = range;
          this.$emit('input', this.data);
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    // 如果设置destroyClearData属性，在组件销毁时清空该属性的值。
    // 发生在触发v-if=true的时候，应用场景如级联操作中。
    let formVm = this.getFormVm();
    if (
      (this.item.attrs && this.item.attrs.destroyClearData) ||
      formVm.$attrs.destroyClearData
    ) {
      this.$emit('input', undefined);
      this.$set(this.formData, this.start, undefined);
      this.$set(this.formData, this.end, undefined);
    }
  }
};
</script>

<style lang="scss">
.zx-form-item .el-date-picker {
  width: 100%;
  min-width: 200px;
}

.zx-form-item .zx-datetimerange {
  min-width: 200px;
}
</style>

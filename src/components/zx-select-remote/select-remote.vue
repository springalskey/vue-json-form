<template>
  <div
    class="zx-select-remote"
    :class="{ 'focus-abled': focusInput }"
    @click.stop="onClickWrapper"
  >
    <div class="form-valid-failure-redborder">
      <el-input
        v-if="!multiple"
        ref="input"
        v-bind="$attrs"
        v-model="keyword"
        :clearable="$attrs.clearable"
        @focus="onFocus"
        @clear="onClearKeyword"
        @input="remoteSearch"
      />
      <div v-if="multiple">
        <div class="tags-wrap">
          <div
            class="tag-selected"
            @click.stop=""
            @dblclick.stop="onRemoveTag(item)"
            :class="{ 'full-width': fullWidth }"
            :key="index"
            v-for="(item, index) in selectedOptions"
          >
            <span>{{ item[labelField] }}</span>
            <i
              class="el-icon-close f14 pointer"
              @click.stop="onRemoveTag(item)"
            />
          </div>
          <el-input
            ref="input"
            :clearable="false"
            :class="{ 'input-auto': !fullWidth }"
            v-model="keyword"
            @focus="onFocus"
            :placeholder="$attrs.placeholder"
            @input="remoteSearch"
          />
        </div>
      </div>
      <div
        class="dropdown-options-wrap"
        @click.stop=""
        v-show="
          (multiple && showDropdown) || (!multiple && keyword && showDropdown)
        "
      >
        <div class="dropdown-options">
          <div
            :key="index"
            class="option"
            v-for="(item, index) in dropdownOptions"
            :class="{ 'option-selected': item.selected }"
            @click.stop="onChange(item)"
          >
            {{ item[labelField] }}
          </div>
          <div class="nodata" v-show="!dropdownOptions.length">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from '../commons/utils';
import is from '../commons/is';

export default {
  name: 'zxSelectRemote',
  props: {
    valueField: {
      type: String,
      default: 'id'
    },
    labelField: {
      type: String,
      default: 'name'
    },
    value: {
      type: [String, Number, Array]
    },
    label: {
      type: String
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchField: {
      type: String,
      default: 'q'
    },
    getData: {
      type: Function
    },
    getLabel: {
      type: Function
    },
    // 初始化时从外部传选中的options列表
    getSelectedOptions: {
      type: Function
    },
    // 在单选时，如果只有id没有label，当该props等于true时，会默认触发查询
    initSearch: {
      type: Boolean,
      default: false
    }
  },
  inject: ['getFormVm'],
  data() {
    return {
      loading: false,
      showDropdown: false,
      keyword: undefined,
      focusInput: false,
      data: [],
      // 下拉框选项
      dropdownOptions: [],
      // 选中项
      selectedOptions: []
    };
  },
  watch: {
    value: {
      handler() {
        this.data = this.value;
        if (is.empty(this.value)) {
          this.dropdownOptions = [];
          this.selectedOptions = [];
          this.keyword = undefined;
        }
      },
      immediate: true
    }
  },
  created() {
    let vm = this.getFormVm();
    if (this.getSelectedOptions) {
      this.selectedOptions = this.getSelectedOptions(vm.formData, vm);
      let values = this.selectedOptions.map(item => item[this.valueField]);
      this.$emit('input', values);
    } else if (this.getLabel) {
      this.keyword = this.getLabel(vm.formData, vm);
    } else if (this.label) {
      this.keyword = this.label;
    }
    if (!this.getSelectedOptions) {
      this.init();
    }
  },
  mounted() {
    document.addEventListener('click', this.clickBodyHandler);
  },
  methods: {
    async init() {
      if (this.multiple) {
        this.initMultipleData(this.data);
      } else {
        let defualtOption = {};
        defualtOption[this.valueField] = this.value;
        // 如果有value并且初始化需要根据id查询
        if (this.initSearch) {
          if (!is.empty(this.value)) {
            let value = this.value;
            let query = {};
            query[this.valueField] = value;
            let results = await this.getData(query, {
              $form: this.getFormVm(),
              isInit: true
            });
            this.keyword =
              (results && results[0] && results[0][this.labelField]) || '';
            defualtOption[this.labelField] = this.keyword;
            this.$emit('input', value);
          }
        } else {
          defualtOption[this.labelField] = this.label;
        }
        defualtOption['selected'] = true;
        this.selectedOptions = [defualtOption];
      }
    },
    remoteSearch: debounce(async function(keyword) {
      this.showDropdown = true;
      this.focusInput = true;
      this.queryByKey(keyword);
    }, 300),
    async initMultipleData(idArr = []) {
      let ids = idArr.join(',');
      if (!ids) return;
      let query = {};
      query[this.searchField] = ids;
      this.initQueryById(query);
    },

    async initQueryById(query) {
      let data = await this.getData(query, this.getFormVm());
      if (is.empty(data)) {
        this.dropdownOptions = [];
        return;
      }
      data.forEach(item => (item.selected = true));
      this.selectedOptions = data;
    },

    async queryByKey(keyword) {
      if (!keyword) {
        return;
      }
      let query = {};
      query[this.searchField] = keyword;
      let data = await this.getData(query, this.getFormVm());
      if (is.empty(data)) {
        this.dropdownOptions = [];
        return;
      }
      data.forEach((item, index) => {
        item.selected = false;
        let result = this.selectedOptions.find(
          el => el[this.valueField] === item[this.valueField]
        );
        if (result && result[this.valueField]) {
          item.selected = true;
          // 用选中的替换data中的
          data.splice(index, 1, result);
        }
      });
      this.dropdownOptions = data;
    },
    onChange(item) {
      if (this.multiple) {
        if (item.selected) {
          this.onRemoveTag(item);
          return;
        }
        item.selected = true;
        this.selectedOptions.push(item);
        let values = this.selectedOptions.map(el => el[this.valueField]);
        this.$emit('input', values);
        this.$emit('change', values);
        this.keyword = '';
        this.showDropdown = true;
      } else {
        this.dropdownOptions.forEach(el => {
          el.selected = false;
        });
        item.selected = true;
        this.selectedOptions = [item];
        this.$emit('input', item[this.valueField]);
        this.keyword = item[this.labelField];
        this.showDropdown = false;
        this.$emit('change', item[this.valueField]);
      }
    },
    onRemoveTag(item) {
      item.selected = false;
      this.selectedOptions = this.selectedOptions.filter(
        el => el[this.valueField] !== item[this.valueField]
      );
      let values = this.selectedOptions.map(el => el[this.valueField]);
      this.$emit('input', values);
      this.keyword = '';
      this.$emit('change', values);
    },
    onFocus() {
      this.showDropdown = true;
      this.focusInput = true;
      if (!this.multiple && is.empty(this.dropdownOptions)) {
        this.queryByKey(this.keyword);
      }
    },
    onClickWrapper() {
      this.$refs.input.focus();
    },
    onClearKeyword(e, b, c) {
      this.selectedOptions = [];
      this.$emit('input', undefined);
      this.$emit('change', undefined);
      this.showDropdown = false;
    },
    clickBodyHandler(e) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BODY') {
        if (!this.keyword && !this.multiple) {
          // this.keyword = this.selectedOptions[0][this.labelField];
          // 无关键字时点击组件之外的地方，将value置为空。
          this.selectedOptions = [];
          this.$emit('input', undefined);
        } else if (this.keyword && this.multiple) {
          this.keyword = '';
        }
        this.showDropdown = false;
        this.focusInput = false;
      } else {
        this.focusInput = false;
        this.showDropdown = false;
      }
    },
    getContext() {
      let formVm = this.getFormVm();
      return formVm.$vnode.context || formVm;
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickBodyHandler);
  }
};
</script>
<style lang="scss" src="./style.scss"></style>

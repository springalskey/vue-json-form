export default {
  name: 'zxAddMinus',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    item: {
      type: Object
    },
    // 限制最大个数
    maxlength: {
      type: Number
    },
    // 是否换行
    inline: {
      type: Boolean,
      default: true
    },
    // 是否有分割线
    divider: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    showAddIcon: {
      type: Boolean,
      default: true
    },
    showDelIcon: {
      type: Boolean,
      default: true
    },
    trigger: {
      type: String
    },
    // 第一行是否保留（被删除）
    keepOne: {
      type: Boolean,
      default: true
    },
    defaultRowData: {
      type: Object
    }
  },
  inject: ['getFormVm'],
  data() {
    return {
      maxIdx: 0,
      addList: [],
      attrs: {}
    };
  },
  created() {
    let formVm = this.getFormVm();
    this.attrs = formVm.$attrs;
    this.init();
    this.item.getInstance && this.item.getInstance(this.getInstance(this));
  },
  methods: {
    /**
     * 初始化如果value有长度，那么addList展示和value保持一致；
     * 否则addList新加一行，value添加新数据
     */
    init() {
      if (this.value.length) {
        let list = [];
        this.value.forEach((item, index) => {
          item.$idx = index;
          let rowConfig = this.$$utils.deepClone(this.item.list);
          list.push({
            $idx: index,
            list: rowConfig
          });
        });
        this.addList = list;
        this.maxIdx = this.value.length - 1;
      } else if (this.keepOne) {
        this.addNewRow();
      }
    },
    /**
     * 添加新的一行配置和value
     */
    addNewRow() {
      let rowConfig = this.getNewRowConfig();
      let value = this.getNewRowValue();
      this.addList.push(rowConfig);
      this.value.push(value);
    },

    getInstance() {
      return this;
    },
    /**
     * 添加行，index、target、value为新的行和数据
     */
    async _onAdd(data) {
      if (this.maxlength && this.addList.length >= this.maxlength) {
        this.$message({
          message: `超过最大限制${this.maxlength}`,
          type: 'warning'
        });
        return;
      }
      // 添加value
      let rowConfig = this.getNewRowConfig();
      let formData = this.getNewRowValue(data);
      // 添加新的rowConfig，和新formData
      let isAdd = await this.rowChange(
        'add',
        this.addList.length,
        rowConfig,
        formData
      );
      // 点击添加，只要不返回false就证明可以添加
      if (isAdd !== false) {
        this.value.push(formData);
        this.addList.push(rowConfig);
      }
    },

    /**
     * 删除行，index、target、value为当前被删除行
     */
    async _onDel(data) {
      let index = 0;
      if (this.$$is.object(data)) {
        index = this.value.findIndex(item => item.$idx === data.$idx);
      } else {
        index = data;
      }
      let delRow = this.addList[index];
      let delRowValue = this.value[index];
      // 删除前
      let isDel = await this.rowChange('delete', index, delRow, delRowValue);
      if (isDel !== false) {
        this.addList.splice(index, 1);
        this.value.splice(index, 1);
      }
    },

    addRow(data = {}) {
      this._onAdd(data);
    },

    delRow(data = {}) {
      this._onDel(data);
    },

    /**
     * 只有点击添加和删除才会调用rowChange
     */
    rowChange(type, index, target, value) {
      let rowChange = this.item.rowChange || this.$attrs.rowChange;
      if (rowChange) {
        let res = rowChange({
          type: type,
          ...this.getParams(index, target, value)
        });
        return res;
      }
    },

    getParams(index, target, targetValue) {
      return {
        $forms: this.$refs.addMinus,
        index,
        values: this.value,
        targetValue,
        target,
        addList: this.addList,
        ctx: this.$vnode.context,
        formData: this.$vnode.context.formData
      };
    },

    // 获得新知行配置
    getNewRowConfig() {
      let maxIdx = this.getMaxIdx();
      let rowConfig = this.$$utils.deepClone(this.item.list);
      for (let item of rowConfig) {
        delete item.validResult;
        delete item.$el;
      }
      return {
        $idx: maxIdx,
        list: rowConfig
      };
    },

    getNewRowValue(data) {
      if (!this.$$is.empty(data)) {
        return JSON.parse(JSON.stringify(data));
      }
      // let initFormData = this.getFormVm().getInitFormData();
      // let value = initFormData[this.item.field];
      // let v = value && value.length ? value[0] : {};
      // let formData = this.$$utils.deepClone(v);
      let formData = this.defaultRowData
        ? JSON.parse(JSON.stringify(this.defaultRowData))
        : {};
      // getNewRowConfig已计算过$idx
      formData.$idx = this.maxIdx;
      return formData;
    },

    getMaxIdx() {
      this.maxIdx += 1;
      return this.maxIdx;
    },
    /**
     * 如果value为空，清空addList并且新空行数据
     * 如果value不为空，删除addList中在value存在但addList不存在的项
     */
    delDiff() {
      if (this.$$is.empty(this.value) && this.keepOne) {
        this.addList = [];
        this.$nextTick(() => {
          this.addNewRow();
        });
        return;
      }
      let delArr = [];
      this.addList.forEach(item => {
        let res = this.value.find(el => el.$idx === item.$idx);
        if (!res) {
          delArr.push(item.$idx);
        }
      });
      this.addList = this.addList.filter(item => !delArr.includes(item.$idx));
    }
  },
  watch: {
    value: {
      handler() {
        // value.push
        if (this.value.length > this.addList.length) {
          let len1 = this.value.length;
          let len2 = this.addList.length;
          for (let i = 0; i < len1 - len2; i++) {
            let rowConfig = this.getNewRowConfig();
            this.addList.push(rowConfig);
          }
        } else if (this.value.length < this.addList.length) {
          // value splice
          this.delDiff();
        }
        // if (this.item && this.item.tableCellValueChange) {
        //   this.item.tableCellValueChange(this.value);
        // }
      }
    }
  }
};

<template>
  <div>
    <div v-if="content">
      <span v-if="typeof content === 'string'" v-html="content"></span>
      <span v-else-if="Array.isArray(content)">
        <template v-for="el in content">
          <template v-if="el._vif !== false">
            <!--button-->
            <el-button
              @click="onClick(el, $event)"
              v-if="el.type === 'button'"
              v-bind="el.attrs || {}"
              :key="el.key"
            >
              {{ formData[el.field] || el.label }}
            </el-button>
            <!--icon-->
            <el-tooltip
              v-if="el.type === 'icon' && el.tooltip"
              :key="el.key"
              transfer
              :content="el.tooltip"
            >
              <el-icon @click="onClick(el, $event)" v-bind="el.attrs || {}" />
            </el-tooltip>
            <el-icon
              v-else-if="el.type === 'icon'"
              :key="el.key"
              @click="onClick(el, $event)"
              v-bind="el.attrs || {}"
            />

            <!--image-->
            <img
              @click="onClick(el, $event)"
              v-else-if="el.type === 'image'"
              :key="el.key"
              v-bind="el.attrs || {}"
            />
            <!--链接-->
            <a
              v-else-if="el.type === 'a'"
              :key="el.key"
              v-bind="el.attrs || {}"
            >
              {{ formData[el.field] || el.label }}
            </a>
            <!--链接-->
            <label
              v-else-if="el.type === 'text'"
              :key="el.key"
              v-bind="el.attrs || {}"
              v-html="formData[el.field] || el.label"
            >
            </label>
          </template>
        </template>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'prefixSuffix',
  inject: ['getFormVm'],
  props: {
    formData: {
      type: Object
    },
    item: {
      type: Object
    },
    // add-minus2
    rowIndex: {
      type: Number
    },
    content: {
      type: [String, Array]
    }
  },
  methods: {
    onClick(item, e) {
      if (item.click) {
        let formVm = this.getFormVm();
        item.click({
          config: this.item,
          $form: formVm,
          e,
          ctx: this.getContext(),
          findItem: formVm.findItem,
          formData: formVm.formData,
          rowIndex: this.rowIndex
        });
      }
    },
    getContext() {
      return this.getFormVm().$vnode.context;
    }
  }
};
</script>

<style>
.prefix-suffix-item {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>

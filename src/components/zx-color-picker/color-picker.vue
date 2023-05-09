<template>
  <div class="zx-color-picker">
    <el-color-picker v-bind="$attrs" @change="onChange" v-model="data" />
    <el-input
      @input="onChange"
      @blur="onBlur"
      clearable
      class="color-input"
      v-bind="$attrs"
      v-model="data2"
    />
  </div>
</template>

<script>
export default {
  name: 'zxColorPicker',
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      data: undefined,
      data2: undefined
    };
  },
  methods: {
    onChange(value) {
      this.$emit('change', value);
    },
    onBlur(value) {
      this.$emit('blur', value);
    }
  },
  watch: {
    value: {
      handler() {
        this.data = this.value;
        this.data2 = this.value;
      },
      immediate: true
    },
    data() {
      this.data2 = this.data;
      this.$emit('input', this.data);
    },
    data2() {
      this.data = this.data2;
      this.$emit('input', this.data);
    }
  }
};
</script>

<style lang="scss">
.zx-color-picker {
  width: 200px;
  display: flex;
  align-items: center;
  .color-input {
    flex-grow: 1;
    margin-left: 4px;
  }
  .el-color-picker-rel {
    width: 60px;
    min-width: 60px;
  }
}
</style>

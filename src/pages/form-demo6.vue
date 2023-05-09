<template>
  <div class="about">
    <h1 class="text-center">Deep Path Object</h1>
    <div style="width: 470px; margin: auto">
      <vue-json-form
        ref="form"
        :inline="false"
        label-width="90px"
        trigger="change"
        vid="vid-test"
        v-model="formData"
        :list="formList"
      />
      <el-button vid="vid-test" v-onsubmit="onSave" type="primary">
        保存
      </el-button>
      <div style="text-align: left; line-height: 30px">
        <h5>初始值：</h5>
        <div>{{ JSON.stringify(initData, null, 2) }}</div>
        <h5>赋值后：</h5>
        <div>{{ JSON.stringify(formData, null, 2) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
let getData = () => {
  return {
    test: '测试',
    obj: {
      user: {
        name: '杨泉'
      }
    }
  };
};
export default {
  data() {
    return {
      formData: getData(),
      initData: getData(),
      formList: [
        {
          type: 'input',
          label: 'Deep1',
          field: 'test',
          rules: { required: true },
          attrs: { maxlength: 20 }
        },
        {
          type: 'input',
          label: 'Deep2',
          field: 'user.mobile',
          rules: { required: true },
          attrs: { maxlength: 20 }
        },
        {
          type: 'input',
          label: 'Deep3',
          field: 'obj.user.name',
          rules: { required: true },
          attrs: { maxlength: 20 }
        }
      ]
    };
  },
  mounted() {},
  methods: {
    async onSave(valided) {
      console.log(valided);
      console.log(JSON.stringify(this.formData, null, 2));
    }
  }
};
</script>

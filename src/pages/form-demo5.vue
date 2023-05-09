<template>
  <div class="about">
    <h1 class="text-center">formList</h1>
    <div style="width: 870px; margin: auto">
      <vue-json-form
        ref="form"
        :inline="false"
        label-width="100px"
        trigger="change"
        vid="vid-test"
        v-model="formData"
        :list="formList"
      />
      <el-button vid="vid-test" v-onsubmit="onSave" type="primary">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        // activityNmae: '618'
      },
      formList: [
        {
          type: 'input',
          label: '活动名称',
          field: 'activityNmae',
          rules: { required: true },
          attrs: { maxlength: 20 }
        },
        {
          type: 'formList',
          label: '可参与次数',
          field: 'counts',
          list: [
            {
              type: 'input',
              label: '团长次数',
              field: 't1',
              prefix: '以团长身份可参与',
              showLabel: false,
              suffix: '次，',
              rules: { required: true },
              attrs: { maxlength: 20, max: 10, placeholder: '请输入团长次数' }
            },
            {
              type: 'input',
              field: 't2',
              label: '团员次数',
              prefix: '以团员身份可参与',
              showLabel: false,
              suffix: '次',
              rules: { required: true },
              attrs: { maxlength: 20, max: 5, placeholder: '请输入团员次数' }
            }
          ]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    async onSave(valided) {
      console.log(valided, JSON.parse(JSON.stringify(this.formData)));
    }
  }
};
</script>
<style lang="scss">
#vid-test {
  .form-list-inline-item {
    .el-input-wrapper {
      width: 100px;
      min-width: 100px;
    }
  }
}
</style>

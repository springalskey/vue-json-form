<template>
  <div class="about">
    <h1 class="text-center">自定义验证</h1>
    <div style="width: 470px; margin: auto">
      <vue-json-form
        ref="form"
        :inline="false"
        label-width="80px"
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
        activityId: 1234,
        activityName: undefined
      },
      formList: [
        {
          type: 'input',
          label: '活动ID',
          field: 'activityId',
          rules: { required: true },
          attrs: { maxlength: 20 }
        },
        {
          type: 'input',
          label: '活动名称',
          field: 'activityName',
          rules: {
            valid({ value }) {
              return {
                matched: !!value,
                message: '活动名称不能为空???'
              };
            }
          },
          attrs: { maxlength: 20 }
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

<template>
  <div class="about">
    <h1 class="text-center">异步校验+动态赋值options</h1>
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
const formList = [
  {
    type: 'select',
    label: '城市',
    field: 'city',
    optionsAsync: async () => {
      return [
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
        { label: '广州', value: 'guangzhou' }
      ];
    },
    rules: { required: true },
    change({ findItem, formData }) {
      let v = formData.city;
      formData.income = undefined;
      let config = findItem('income');
      if (v === 'shanghai') {
        config.options = [
          { label: '1元', value: 1 },
          { label: '10元', value: 10 },
          { label: '20元', value: 20 }
        ];
      } else if (v === 'beijing') {
        config.options = [
          { label: '100元', value: 100 },
          { label: '200元', value: 200 },
          { label: '300元', value: 300 }
        ];
      } else {
        config.options = [{ label: '5元', value: 5 }];
      }
    }
  },
  {
    type: 'radio',
    label: '平均收入',
    field: 'income',
    options: [{ label: '5元', value: 5 }],
    rules: { required: true }
  },
  {
    type: 'input',
    label: '活动ID',
    field: 'activityId',
    rules: {
      num: true,
      valid: ({ value }) => {
        console.log(111222);
        if (value && value.length >= 5) {
          return { matched: true };
        }
        return {
          matched: false,
          message: '活动ID长度不能小于5'
        };
      }
    }
  },
  {
    type: 'input',
    label: '异步校验',
    field: 'activityId2',
    rules: {
      required: true,
      valid({ value }) {
        console.log(333444);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!value || Number(value) === 2) {
              resolve({
                matched: true
              });
            } else {
              reject({
                matched: false,
                message: '活动名称必须等于2'
              });
            }
          }, 1000);
        });
      }
    }
  }
];

export default {
  data() {
    return {
      formData: {
        type: 1,
        city: 'guangzhou'
      },
      formList
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

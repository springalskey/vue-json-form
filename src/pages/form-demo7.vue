<template>
  <div class="about">
    <h1 class="text-center">增减</h1>
    <div style="width: 720px; margin: auto">
      <vue-json-form
        ref="form"
        label-width="90px"
        vid="vid-11"
        trigger="change"
        v-model="formData"
        @change="onChange"
        :list="formList"
      />
      <div class="flex-center">
        <el-button vid="vid-11" v-onsubmit="onSave" type="primary">
          保存
        </el-button>
        <el-button @click="onDel(0)" type="primary">删除第一个</el-button>
        <el-button @click="onDel(1)" type="primary">删除第2个</el-button>
        <el-button @click="onClear" type="primary">清空value</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      formList: [
        {
          type: 'input',
          label: '活动类型',
          field: 'type',
          change: ({ config, findItem }) => {
            // let vm = findItem('tests').getInstance();
            // if (config.value === '1') {
            //   vm.addList[0].list[0].options = [
            //     { label: '测试', value: 22 },
            //     { label: 'aaaa-测试', value: 333 }
            //   ];
            // } else if (config.value === '2') {
            //   vm.addList[0].list[0].options = [
            //     { label: 'aha', value: 223 },
            //     { label: 'aaaa-bc', value: 3333 }
            //   ];
            // }
          },
          rules: {
            required: true
          }
        },
        {
          type: 'add-minus',
          label: '增减测试',
          showLabel: false,
          field: 'tests',
          attrs: {
            maxlength: 5,
            inline: true,
            // 是否包含分割线
            divider: true,
            showAddIcon: true,
            trigger: 'change',
            showDelIcon: true
          },
          rules: { required: true },
          list: [
            {
              type: 'select',
              label: '测试类型',
              field: 'testType',
              options: [
                { label: 'xxx', value: '1' },
                { label: 'ooo', value: '2' },
                { label: 'aaa', value: '3' }
              ],
              rules: {
                required: true
              },
              attrs: {
                disabled: false
              },
              valueChange(data) {
                if (data.rowIndex === 0) {
                  data.config.attrs.disabled = true;
                }
              }
            }
          ]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    onDel(index) {
      this.formData.tests.splice(index, 1);
    },
    onClear() {
      this.formData.tests = [];
    },
    onChange(value) {
      console.log(JSON.parse(JSON.stringify(value)));
    },
    async onSave(valided) {
      console.log(valided);
      console.log(JSON.stringify(this.formData, null, 2));
    }
  }
};
</script>
<style scoped>
.about {
  background-color: #ffffff;
}
</style>

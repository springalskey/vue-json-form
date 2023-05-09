# vue-json-form
base on Vue2

## How to use
```
npm install git+ssh://git@github.com:springalskey/vue-json-form.git#v0.0.1 --save
```

## Project setup

```
npm install
```

### Project start

```
npm start
```

## Demo

```html
<vue-json-form v-model="formData" :list="list" vid="vid-test"></vue-json-form>
<el-button vid="vid-test" v-onsubmit="onSave" type="primary">保存</el-button>
```
```js
export default {
  data() {
    return {
      formData: {
        color: '#F0F0F0'
      },
      list: [
        {
          type: 'color',
          label: '颜色',
          field: 'color',
          rules: { required: true }
        },
        {
          type: 'input-number',
          label: '购买数量',
          field: 'buyCount',
          rules: { required: true }
        },
        {
          type: 'radio',
          label: '活动类型',
          field: 'type',
          rules: { required: true },
          options: [
            { label: '单品活动', value: 1 },
            { label: '满减活动', value: 2 }
          ]
        },
        {
          type: 'switch',
          label: '是否显示',
          field: 'isShow',
          rules: { required: true },
          // vif control showOrHide
          vif: (formData) => formData.type === 1
        },
      ]
    };
  },
  methods: {
    async onSave(valided) {
      if (!valided) return;
      // 校验通过TOTO:
    }
  }
};
```

## 其他
如果您对这个项目敢兴趣，请给个小星星哦。另外，如果需要更高级的功能，(可以查看)[https://zhizhi.info]
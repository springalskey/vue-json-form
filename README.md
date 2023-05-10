# vue-json-form
vue-json-form base on Vue2

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

```js
// main.js
import 'vue-json-form';
```

```html
<vue-json-form v-model="formData" :list="list" vid="vid-test"></vue-json-form>
<el-button vid="vid-test" v-onsubmit="onSubmit" type="primary">submit</el-button>
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
          type: 'input',
          label: 'nick name',
          field: 'nickname',
          rules: {
            required: true,
            valid: ({ value, formData }) => {
              if (value.includes('null')) {
                return {
                  matched: false,
                  message: 'Null is not allowed'
                };
              }
              return { matched: true };
            }
          }
        },
        {
          type: 'input-number',
          label: 'buy count',
          field: 'buyCount',
          rules: {required: true, num: true }
        },
        {
          type: 'radio',
          label: 'type',
          field: 'type',
          rules: { required: true },
          options: [
            { label: '单品活动', value: 1 },
            { label: '满减活动', value: 2 }
          ]
        },
        {
          type: 'select',
          label: 'province',
          field: 'province',
          rules: { required: true },
          optionsAsync: async () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([
                  { label: 'beijing', value: 1 },
                  { label: 'shanghai', value: 2 }
                ])
              }, 300);
            })
          }
        },
        {
          type: 'switch',
          label: 'open',
          field: 'isOpen',
          rules: { required: true },
          // vif control showOrHide
          vif: (formData) => formData.type === 1
        },
        {
          type: 'daterange',
          label: '日期范围',
          field: 'dateRange',
          rules: { required: true },
          attrs: {
            startField: 'beginDate',
            endField: 'endDate'
          }
        },
      ]
    };
  },
  methods: {
    async onSubmit(valided, { formData }) {
      if (!valided) return;
      // TOTO:
      console.log(formData);
    }
  }
};
```

## Other

More features and services [https://zhizhi.info]


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, Quan Yang
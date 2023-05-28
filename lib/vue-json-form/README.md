# vue-json-form
vue-json-form base on Vue2 and ElementUI

## How to use
```
npm install @vue-json/vue-json-form
```

## Usage

```js
// main.js
import '@vue-json/vue-json-form';
import '@vue-json/vue-json-form/index.css';
```
```html
<!--html-->
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
          label: 'nickname',
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
          label: 'count',
          field: 'count',
          rules: {required: true, num: true }
        },
        {
          type: 'radio',
          label: 'type',
          field: 'type',
          rules: { required: true },
          options: [
            { label: 'type1', value: 1 },
            { label: 'type2', value: 2 }
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
                  { label: 'London', value: 1 },
                  { label: 'New York', value: 2 }
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
          label: 'daterange',
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

## Services

More features and services [https://zhizhi.info]


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, Quan Yang
# select 远程搜索（单选或多选）

单选： 初次加载默认使用 label 属性或 getLabel()方法，初始化不触发查询  
多选： 默认使用 id 数组查询，初始化触发查询

```html
Props:
__________________________________________________________________________________________
| Name | Type | Required | description |
|———————————————————————————————————————————————————————————————————————————————————————————
| v-model | [String,Number,Array] | false | id或id数组 | | searchField | String
| false | 搜索的字段名默认'q' | | valueField | String | true |option value字段名
| | labelField | String | true |option label字段名 | | multiple | Boolean |
false | 默认单选 | | label | String | false |
默认显示的label值（单选）,表单配置中无须使用| | getLabel | Function | false |
默认显示的label值（单选）,表单配置中使用 | | getData | Function | false |
搜索时调用方法，需返回Promise | | remote | Boolean | false
|是否开启远程搜索，默认true | | fullWidth | Boolean | false
|选中项宽度是否100%，默认false（多选） | | initSearch | Boolean | false
|在单选时，如果只有id没有label，当该props等于true时，初始化会触发查询 | |
getSelectedOptions| Array | false |在多选时，设置选中的值，用于编辑反显 |
———————————————————————————————————————————————————————————————————————————————————————————
```

## 普通 HTML 方式

```html
<!--多选，不需要label-->
<zx-select-remote
  url="/api/topics"
  valueField="id"
  labelField="title"
  :fullWidth="true"
  v-model="topic_ids"
  :multiple="true"
></zx-select-remote>

<!--单选，不需要fullWidth参数-->
<zx-select-remote
  url="/api/users"
  valueField="id"
  labelField="name"
  v-model="user_id"
  :multiple="false"
  label="订单生成，几天可以到货换胎"
></zx-select-remote>
```

## 配置使用方法：

```js
this.formData.koubeiId = 11;
this.formData.title = '口碑榜标题';

let config = [
  {
    type: 'select-search',
    label: '口碑榜标题',
    field: 'koubeiId',
    rules: { required: true },
    attrs: {
      // 自定义value/label
      valueField: 'id',
      labelField: 'title',
      searchField: 'q',
      clearable: true,
      // 获得表单值
      getLabel: form => form.title,
      // 异步加载data，返回数组
      getData: async (params = {}, ctx) => {
        let { data } = await ctx.axios.get('/api/reputation-lists', params);
        return data;
      }
    }
  }
];
```

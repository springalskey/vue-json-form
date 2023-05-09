## 增减组件

里面嵌套一层新的 form 表单，它完全支持表单的功能和特性

## demo

```js
[
  {
    formList: [
    {
      type: 'add-minus',
      label: '增减',
      showLabel: false,
      field: 'rows',
      attrs: {
        // 最大增加个数
        maxlength: 5,
        // 表单元素是否inline
        inline: true,
        // 是否包含分割线
        divider: true
      },
      rules: { required: true },
      list: [
        {
          type: 'input',
          label: '活动类型',
          field: 'type',
          rules: {
            required: true
          },
          change (data) {
          }
        }
      ]
    }
  }
]
// 数据格式

value: [
  {
    type1: 517,
    type2: 618,
    $idx: 0
  },
  {
    type1: 315,
    type2: 308,
    $idx: 1
  }
];

addList:
[
  {
    $idx: 0, // 与value$idx对应
    list: [
      {
        type: 'input',
        label: '活动类型1',
        field: 'type1,
        change: () => {}
      },
      {
        type: 'input',
        label: '活动类型2',
        field: 'type2'
      }
    ],
  },
  {
    $idx: 1, // 与value$idx对应
    list: [
      {
        type: 'input',
        label: '活动类型1',
        field: 'type1,
        change: () => {}
      },
      {
        type: 'input',
        label: '活动类型2',
        field: 'type2'
      }
    ]
  }
]

1. 如果value长，list短，需要补足list配置

2. 如果value短，list长，需要删除list多余配置

3. 如果value长度和list长度相同，不做改变

```

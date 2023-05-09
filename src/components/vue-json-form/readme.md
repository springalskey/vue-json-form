## 简单的表单配置组件

1. 支持嵌套 form 表单的数据：

```
this.formData = {
  activityId: 12908,
  activityName: '618',
  coupon: {
    type: 1,
    name: '满20减10'
  }
}
```

2. 可配置基本的表单验证逻辑，支持 validator 组件中的所有验证规则和自定义函数校验，详情参考 zx-validator 组件文档。

## 基本用法

```html
只需要button提供vid和v-onsubmit指令即可。 我们假设有这么一个表单：
<vue-json-form vid="vid-form" :list="[]" v-model="formData"></vue-json-form>

在页面其他任何地方有如下的保存按钮，和平常写法一样，使用vid进行关联即可
<el-button vid="vid-form" v-onsubmit="onSave" type="primary">保存</el-button>
```


## demo

```html
<vue-json-form v-model="formData" :list="list" vid="vid-test"></vue-json-form>
<el-button vid="vid-test" v-onsubmit="onSave" type="primary">保存</el-button>
```

```js
export default {
  data() {
    return {
      formData: {
        color: '#f0f0f0'
      },
      list: [
        {
          type: 'color',
          label: '车身颜色',
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
          type: 'switch',
          label: '是否显示',
          field: 'isShow',
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
        }
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

## 触发 value 的 watch 监听

1. ”初始化组件时“
   1). 当 formList 中声明 field 之后，但是在 formData 中没有声明，会触发 watch（formData 新增属性）
   2). 一个日期范围配置会触发一次 watch（假设配置了两个日期范围，就会触发 2 次）
2. 当某个值变更时

## 触发校验的时机

1. 数据更改或触发 onchange 事件时，如果数据等于 null 或 undefined，不校验数据。但在提交的时候会校验。
2. 当 onChange 或 onBlur 方法执行时，每次都会将结果存在 validResult 中，当点击提交时会去拿 validResult 验证结果，不再进行重复交验。

## 关于表单 value 赋值的优先级顺序

formData 大于 config.defaultValue 大于 config.value  
如果 formData 中没有值，就寻找 defaultValue，再寻找 value，如果都没有则默认 undefined

# 普通组件

1. 只要有 v-model 暴露出来，就可以配置到 items 中去，v-model 是表单验证和 formData 的基础
2. 组件监听表单元素的 value 值的变化（immediate=true），组件初始化时和修改值都会调用配置中的 change 事件

# 支持自定义组件类型（动态传递的组件）

自定义组件自动监听\$emit('input')事件，触发后会修改 formData 数据

```js
{
  type: 'component',
  label: '车身',
  field: 'body',
  // 传递自定义组件
  component: MyComponent,
  rules: { required: true },
  // 可设置自定义组件的props属性
  attrs: { clearable: true }
}
// MyComponent组件中必须执行$emit('input')事件，这样外围的formData才能拿到组件中的value，等同于执行formData.body = {MyComponent组件中的值}

## 自定义组件如何在验证”失败时显示红色外边框“以及“错误提示信息”，请移步validator组件中的readme.md

```

## type 等于'select'时，options 支持数组和函数：

```js
{
  type: 'select',
  optionsAsync: (ctx, item) => {
    // return promise
  }
}

{
  type: 'select',
  async optionsAsync (ctx, item) {
    // return promise
  }
}

{
  type: 'select',
  optionsAsync: async (ctx, item) => {
    // return promise
  }
}

// 普通方式
{
  type: 'select',
  options: []
}
```

## type 等于'text'文本类型时，支持字符串和函数两种方式，使用 v-html 方式渲染

```js
{
  type: 'text',
  textAsync: (ctx, item) => {
    // 支持return promise
  }
}
{
  type: 'text',
  text: ''
}
```

## destroyClearData

```js
{
  type: 'select',
  options: [],
  vif: form => form.type === 2,
  attrs: {
    // 组件销毁时清空数据，value将设置为undefined
    destroyClearData: true
  }
}
```

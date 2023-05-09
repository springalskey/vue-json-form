# 普通组件

1. 只要有 v-model 暴露出来，就可以配置到 item 中去，v-model 是表单验证和 formData 的基础
2. 组件监听表单元素的 value 值的变化（immediate=true），组件初始化时和修改值都会调用配置中的 change 事件

# 支持自定义组件类型（动态传递的组件）

自定义组件自动监听\$emit('input')事件，触发后修改 formData 数据

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

## valid 验证时机

数据更改或触发 onchange 事件时，如果数据等于 null 或 undefined，不校验数据。但在提交的时候会校验。
当 onChange 或 onBlur 方法执行时，每次都会将结果存在 validResult 中，当点击提交时会去拿 validResult 验证结果，不再进行重复交验

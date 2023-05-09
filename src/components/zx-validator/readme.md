## 内置校验规则

required,max,min,maxlen,minlen,url,email,money,mobile,regexp  
除了 required 的验证规则，其他的规则当值等于[null, undefined, '']会返回 true，校验通过。如果需要校验空值，则需要添加 required=true。

## 自定义组件如何在验证”失败时显示红色外边框“

含以下情况时红色 border 将会被作用（优先级按照以下顺序）：

1. class="form-valid-failure-redborder"
2. class="el-select-selection"
3. <input/>标签

## 默认错误信息展示位置

:validator="item.label"
:field="item.field"
v-bind="item.rules" // 等等多个验证规则
将错误信息插入到同时“包含以上这些属性的标签”的最后。

## 组件内置展示错误信息的插槽

form-items 底部包含<p class="error-tips"></p>，放置错误提示语。假设是自定义组件，该组件中拥有多个表单元素，应当在该组件内部使用 form 包裹起来

## demo


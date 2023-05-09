<template>
  <div
    class="zx-form-item"
    ref="formItem"
    :style="item.attrs && item.attrs.style"
  >
    <!--display只读-->
    <div v-if="editable === false" v-html="displayLabel"></div>
    <template v-else>
      <!--input-->
      <el-input
        v-if="item.type === 'input'"
        :validator="item.label"
        :clearable="clearable"
        @input="onChange"
        @blur="onBlur"
        :disabled="getDisabled()"
        v-bind="getAttrs(item, '请输入')"
        :field="item.field"
        v-model="data"
      />
      <el-input
        v-else-if="item.type === 'textarea'"
        :validator="item.label"
        :clearable="clearable"
        :type="item.type"
        @input="onChange"
        @blur="onBlur"
        :disabled="getDisabled()"
        v-bind="getAttrs(item, '请输入')"
        :field="item.field"
        v-model="data"
      />
      <!--input-number-->
      <el-input-number
        v-else-if="item.type === 'input-number'"
        :validator="item.label"
        :clearable="clearable"
        :type="item.type"
        @change="onChange"
        @blur="onBlur"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        :field="item.field"
        v-model="data"
      />
      <!--评分-->
      <el-rate
        v-else-if="item.type === 'rate'"
        :validator="item.label"
        :type="item.type"
        allow-half
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        :field="item.field"
        v-model="data"
      />
      <!--text普通文本-->
      <div
        @click="onClick"
        v-else-if="item.type === 'text'"
        :class="item.rowClass"
        class="form-item-text"
      >
        <!--取字段值-->
        <div v-if="data" v-html="data"></div>
        <!--可能字符串、函数-->
        <div v-else v-html="item.text"></div>
      </div>
      <!--button-->
      <el-button
        v-else-if="item.type === 'button'"
        @click="onClick"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
      >
        {{ item.label }}
      </el-button>
      <!--select-->
      <el-select
        v-else-if="item.type === 'select'"
        :validator="item.label"
        :clearable="clearable"
        :field="item.field"
        :disabled="getDisabled()"
        @change="onChange"
        @focus="onFocus"
        v-bind="getAttrs(item)"
        v-model="data"
      >
        <el-option
          v-for="optionItem in item.options || []"
          :key="optionItem.value"
          :label="optionItem.label"
          :disabled="optionItem.disabled || false"
          :value="optionItem.value"
        />
      </el-select>
      <!--cascader options多选-->
      <el-cascader
        v-else-if="item.type === 'cascader' && item.options"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :options="item.options || []"
        :clearable="clearable"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      />
      <!--cascader data单选-->
      <el-cascader
        v-else-if="item.type === 'cascader' && item.data"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :data="item.data || []"
        :clearable="clearable"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      />
      <!--radio-->
      <el-radio-group
        v-else-if="item.type === 'radio'"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      >
        <el-radio
          v-for="optionItem in item.options || []"
          :key="optionItem.value"
          :disabled="optionItem.disabled || false"
          :label="optionItem.value"
        >
          {{ optionItem.label }}
        </el-radio>
      </el-radio-group>
      <el-radio-group
        v-else-if="item.type === 'radio-button'"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      >
        <el-radio-button
          v-for="optionItem in item.options || []"
          :key="optionItem.value"
          :disabled="optionItem.disabled || false"
          :label="optionItem.value"
        >
          {{ optionItem.label }}
        </el-radio-button>
      </el-radio-group>
      <!--checkbox-group-->
      <el-checkbox-group
        v-else-if="item.type === 'checkbox-group'"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      >
        <el-checkbox
          v-for="optionItem in item.options || []"
          :label="optionItem.value"
          :disabled="optionItem.disabled || false"
          :key="optionItem.value"
        >
          {{ optionItem.label }}
        </el-checkbox>
      </el-checkbox-group>
      <!--checkbox-->
      <el-checkbox
        v-else-if="item.type === 'checkbox'"
        :label="item.text || ''"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      />
      <!--select-search-->
      <zx-select-remote
        v-else-if="item.type === 'select-search'"
        :validator="item.label"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item, '请输入')"
        :field="item.field"
        v-model="data"
      />
      <div
        v-else-if="item.type === 'switch'"
        class="switch-items-wrap"
        v-bind="{ style: getAttrs(item).style || {} }"
      >
        <el-switch
          :validator="item.label"
          @change="onChange"
          :disabled="getDisabled()"
          v-bind="getAttrs(item)"
          :field="item.field"
          v-model="data"
        />
      </div>
      <!--color-picker--->
      <zx-color-picker
        v-else-if="item.type === 'color'"
        :validator="item.label"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        :field="item.field"
        v-model="data"
      />
      <!--date-->
      <el-date-picker
        v-else-if="item.type === 'date'"
        :validator="item.label"
        :field="item.field"
        :disabled="getDisabled()"
        @change="onChange"
        v-bind="getDateAttrs(item, 'yyyy-MM-dd')"
        :type="item.type"
        v-model="data"
      />
      <!--datetime-->
      <el-date-picker
        v-else-if="item.type === 'datetime'"
        :validator="item.label"
        :field="item.field"
        :type="item.type"
        :disabled="getDisabled()"
        @change="onChange"
        v-bind="getDateAttrs(item, 'yyyy-MM-dd HH:mm:ss')"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="data"
      />
      <!--time-->
      <el-time-picker
        v-else-if="item.type === 'time'"
        :validator="item.label"
        :field="item.field"
        :type="item.type"
        :disabled="getDisabled()"
        @change="onChange"
        v-bind="getDateAttrs(item, 'HH:mm')"
        value-format="HH:mm"
        v-model="data"
      />
      <!--daterange-->
      <zx-form-daterange
        v-else-if="RANGE_TYPES.includes(item.type)"
        :formData="formData"
        :item="item"
        :disabled="getDisabled()"
        @change="onChange"
        v-model="data"
      />
      <!--image upload-->
      <zx-image-upload
        v-else-if="item.type === 'imageUpload'"
        :validator="item.label"
        :field="item.field"
        @change="onChange"
        :disabled="getDisabled()"
        v-bind="getAttrs(item)"
        v-model="data"
      />
      <!--file upload-->
      <zx-file-upload
        v-else-if="item.type === 'fileUpload'"
        :validator="item.label"
        :field="item.field"
        :disabled="getDisabled()"
        @change="onChange"
        v-bind="getAttrs(item)"
        v-model="data"
      />
    </template>
    <!--自定义组件不添加错误信息，所有自定义组件应该使用独立的form包裹-->
    <p v-if="!item.list" class="error-tips"></p>
  </div>
</template>
<script src="./form-item.js"></script>
<style lang="scss">
.form-item-block {
  .zx-form-item > div {
    width: 100%;
  }
}
$width: 200px;
.zx-form-item {
  position: relative;
  > div {
    width: $width;
  }
  .switch-items-wrap {
    width: 60px;
  }
  .form-item-text {
    word-break: break-all;
    line-height: 1.4;
    min-height: 32px;
    display: flex;
    align-items: center;
    color: #606266;
  }
  .el-rate {
    margin-top: 6px;
  }
  .el-e-cascader {
    display: block;
  }
  .error-tips {
    color: red;
    font-size: 12px;
    position: absolute;
    top: 110%;
    white-space: nowrap;
    line-height: 100%;
  }
}

.el-form-inline {
  .zx-image-upload button {
    margin-right: 10px;
  }
}
</style>

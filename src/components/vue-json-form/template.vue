<template>
  <div class="vue-json-form" ref="wrapper" :class="className">
    <zx-validator
      v-if="list.length"
      ref="validator"
      :vid="vid"
      :form="formData"
      :list="list"
    >
      <el-form
        v-bind="$attrs"
        :class="[$attrs.cols ? 'form-cols-' + $attrs.cols : '']"
      >
        <template v-for="item in list">
          <el-form-item
            :key="item.key || item.field || item.label"
            :label="item.label"
            :class="[
              item.showLabel === false ? 'form-label-hidden' : '',
              !item.rules || item.rules.required !== true
                ? 'el-form-item-not-required'
                : '',
              ...(item.className || []),
              item.list && item.list.length ? 'form-list' : '',
              !$attrs.inline ? 'form-item-block' : ''
            ]"
            :form-field="item.field"
            :required="(item.rules && item.rules.required) || false"
            v-if="item._vif"
          >
            <!-- 1.formList-->
            <vue-json-form
              class="form-list-row"
              v-if="item.type === 'formList'"
              v-bind="$attrs"
              v-model="value"
              :style="item.attrs && item.attrs.style"
              :rowIndex="rowIndex"
              :editable="editable"
              trigger="change"
              label-position="left"
              :inline="true"
              :list="item.list"
            />
            <!-- 2.add-minus-->
            <zx-add-minus
              v-if="item.type === 'add-minus'"
              :item="item"
              v-model="formData[item.field]"
              v-bind="item.attrs || {}"
              :editable="editable"
            />
            <!-- 4.非formList-->
            <div
              v-else
              :class="{ 'prefix-suffix-item': item.prefix || item.suffix }"
            >
              <prefix-suffix
                v-if="item.prefix"
                :rowIndex="rowIndex"
                class="prefix"
                :item="item"
                :formData="formData"
                :content="item.prefix"
              />
              <!-- 普通表单不带增减 -->
              <zx-form-item
                :editable="
                  typeof item.editable !== 'undefined'
                    ? item.editable
                    : editable
                "
                :item="item"
                :rowIndex="rowIndex"
                :formData="formData"
                @change="onChangeItemValue"
                v-model="formData[item.field]"
              />
              <prefix-suffix
                v-if="item.suffix"
                :rowIndex="rowIndex"
                class="suffix"
                :formData="formData"
                :item="item"
                :content="item.suffix"
              />
            </div>
          </el-form-item>
        </template>
        <slot></slot>
      </el-form>
    </zx-validator>
  </div>
</template>
<script src="./form.js"></script>
<style lang="scss">
.vue-json-form {
  .el-form-item {
    margin-bottom: 20px !important;
    text-align: left;
    vertical-align: middle;
    .el-form-item .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .form-list-inline-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > .form-list-inline-item {
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
.vue-json-form .el-form-item.form-list {
  margin-bottom: 0px !important;

  .el-radio-group {
    margin-top: 8px;
  }
}
.form-label-hidden {
  > .el-form-item__label {
    display: none !important;
    margin-left: 0;
  }
  .el-form-item__content {
    margin-left: 0px !important;
    line-height: 1.4 !important;
  }
}

// 在ui中的星星样式.el-form-item-required .el-form-item__label:before { content: "*"; color: #ed4014;}
// 此时在表单嵌套时会影响子级的星星展示
.el-form-item-not-required > .el-form-item__label:before {
  display: none !important;
}

.prefix {
  padding-right: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.suffix {
  padding-left: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

// 如果需要中间元素占领所有剩余空间，设置flex-grow: 1;
.prefix-suffix-item {
  display: flex;
  .vue-json-form-item {
    // flex-grow: 1;
  }
}
.form-item-text {
  text-align: left;
}
// 表单嵌套时 用来覆盖样式
.el-form-item > .el-form-item__label:before {
  content: '';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
}

.form-cols-2.el-form--inline {
  display: table;
  .el-form-item {
    width: 50%;
    margin-right: 0px;
  }
  .vue-json-form-item > div {
    width: 100%;
  }
}

.form-cols-3.el-form--inline {
  display: table;
  .el-form-item {
    width: 33.33%;
    margin-right: 0px;
  }
  .vue-json-form-item > div {
    width: 100%;
  }
}

.form-cols-4.el-form--inline {
  display: table;
  .el-form-item {
    width: 25%;
    margin-right: 0px;
  }
  .vue-json-form-item > div {
    width: 100%;
  }
}
.form-cols-5.el-form--inline {
  display: table;
  .el-form-item {
    width: 20%;
    margin-right: 0px;
  }
  .vue-json-form-item > div {
    width: 100%;
  }
}
</style>

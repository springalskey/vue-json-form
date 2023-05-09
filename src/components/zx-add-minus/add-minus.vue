<template>
  <div class="zx-add-minus">
    <div
      class="zx-add-row"
      :class="[
        divider ? 'row-divider' : 'no-row-divider',
        showAddIcon || showDelIcon ? 'has-icon' : ''
      ]"
      :key="item.$idx"
      v-for="(item, index) in addList"
    >
      <vue-json-form
        ref="addMinus"
        v-bind="attrs"
        :inline="inline"
        :editable="editable"
        :trigger="trigger"
        :rowIndex="index"
        v-model="value[index]"
        :class="[inline ? 'add-minus-form-inline' : 'add-minus-form-block']"
        :list="item.list"
      />
      <i
        class="el-icon-circle-plus-outline"
        v-if="index === 0 && showAddIcon"
        @click="_onAdd()"
      ></i>
      <i
        class="el-icon-remove-outline"
        v-else-if="showDelIcon"
        @click="_onDel(index)"
      ></i>
    </div>
  </div>
</template>
<script src="./script.js"></script>

<style lang="scss">
.zx-add-minus {
  .add-minus-form-inline > .form-validator > form {
    display: flex;
    flex-wrap: wrap;
    .th-form-item {
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 24px;
    }
  }

  .add-minus-form-block > .form-validator > form {
    // display: flex;
    // flex-wrap: wrap;
    .th-form-item {
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 24px;
    }
  }

  .el-icon-remove-outline,
  .el-icon-circle-plus-outline {
    color: #2d8cf0;
    font-size: 22px;
    margin-top: -20px;
    cursor: pointer;
  }

  .zx-add-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 20px;
    .add-row-item {
      padding-bottom: 20px;
    }
    &.row-divider {
      border-bottom: 1px dotted #d7d7d7;
    }
    &:first-child {
      padding-top: 0px;
    }
    &.no-row-divider {
      padding-top: 0px;
    }
  }
  .close-items-0 {
    opacity: 0;
  }

  .m-t_20 {
    margin-top: -20px;
  }
}
</style>

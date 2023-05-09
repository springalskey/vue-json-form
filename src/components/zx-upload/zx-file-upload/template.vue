<template>
  <div class="zx-file-upload">
    <div>
      <el-input
        v-if="showInput"
        class="full-width"
        v-model.trim="fileUrl"
        :readonly="getReadonly()"
        :disabled="$attrs.disabled"
        :clearable="true"
        @change="onChange"
        :placeholder="$attrs.placeholder || '请上传文件'"
      />
      <input class="hidden" type="file" ref="file" />
      <el-button
        class="m-l-5"
        :disabled="$attrs.disabled"
        icon="ios-cloud-upload-outline"
        @click="handleClick"
      >
        {{ buttonText }}
      </el-button>
    </div>
    <p v-if="tips" class="m-t-5 t3 f12">{{ tips }}</p>
    <div ref="videobox"></div>
  </div>
</template>
<script src="./file-upload.js"></script>
<style lang="scss">
.zx-file-upload {
  line-height: 1.4;
  > div {
    display: flex;
    flex-direction: row;
  }
  .tips {
    padding-top: 6px;
  }
}
</style>

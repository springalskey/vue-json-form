<template>
  <div class="zx-image-upload">
    <input
      :accept="accept"
      class="hidden"
      type="file"
      :multiple="multiple"
      ref="file"
    />
    <div v-if="viewType === 'input' || multiple" class="upload-type-input">
      <div>
        <el-popover
          placement="top-start"
          width="400"
          trigger="hover"
          class="icon-preview"
        >
          <div>
            <img
              :src="imageUrl"
              style="width:400px;"
              @error="onImageError($event)"
            />
          </div>
          <span slot="reference">
            <!-- fix破图 -->
            <img
              :src="imageUrl"
              v-if="imageUrl"
              style="width:30px;height:30px;object-fit: contain;"
              class="p-r-5"
              @error="onImageError($event)"
            />
            <img
              v-else
              style="width:30px;height:30px;object-fit: contain;"
              class="p-r-5"
            />
          </span>
        </el-popover>
        <el-input
          class="full-width m-r-5"
          v-model.trim="imageUrl"
          :readonly="getReadonly()"
          @blur="handleInputBlur"
          :disabled="$attrs.disabled"
          :clearable="multiple ? false : true"
          @change="onChange"
          :placeholder="$attrs.placeholder || '请上传图片'"
        />
        <el-button
          :disabled="$attrs.disabled"
          icon="ios-cloud-upload-outline"
          @click="handleClick"
        >
          {{ buttonText }}
        </el-button>
      </div>
      <div v-if="tips" class="tips f12 t3">
        <p>
          <span>{{ tips }}</span>
        </p>
      </div>
      <div
        v-if="multiple && successArr.length && showPreview"
        class="multiple-preview"
      >
        <div
          :key="index"
          v-for="(url, index) in successArr"
          @click="onClickPreview(url, index)"
          :class="{ selected: selectedIndex === index }"
        >
          <img :src="url" @error="onImageError($event)" />
          <div @click.stop="onDelete(url, index)" class="delete">删除</div>
        </div>
      </div>
    </div>
    <div
      v-else-if="viewType === 'thumbnail' && !multiple"
      class="border-1"
      :style="{ width: imageWidth, height: imageHeight }"
    >
      <el-popover
        v-if="imageUrl"
        placement="bottom"
        width="300"
        trigger="hover"
        style="margin: 0 auto;"
        class="icon-preview"
      >
        <span>
          <img
            :src="imageUrl"
            style="width:300px;height: 300px;object-fit: contain;"
          />
        </span>
        <span slot="reference">
          <span class="pointer full-width full-height text-center">
            <img
              @click="handleClick"
              :src="imageUrl"
              style="width:100%;height: 100%;object-fit: contain;"
            />
          </span>
        </span>
      </el-popover>

      <span
        class="icon flex-row flex-center pointer"
        @click="handleClick"
        v-if="!imageUrl"
      >
        <i class="el-icon-plus t3"></i>
      </span>
    </div>
  </div>
</template>
<script src="./image-upload.js"></script>
<style lang="scss">
.zx-image-upload {
  line-height: 1.4;
  .upload-type-input > div {
    display: flex;
    flex-direction: row;
  }
  .tips {
    padding-top: 6px;
    font-size: 12px;
    color: #909399;
  }
  .multiple-preview {
    width: 100%;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    margin-top: 5px;
    flex-wrap: wrap;
    > div {
      position: relative;
      border: 1px solid #ffffff;
      margin: 5px;
    }
    .selected {
      border: 1px solid #ed143d;
    }
    img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
    .delete {
      cursor: pointer;
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100px;
      text-align: center;
      background-color: #ed143d;
      height: 20px;
      line-height: 20px;
      color: #ffffff;
      font-size: 12px;
    }
  }
  a.preview {
    color: #2d8cf0;
  }
  .icon {
    background-color: #f7f8fa;
    cursor: pointer;
    box-sizing: border-box;
    flex: 0 0 100%;
  }
  .el-icon-plus {
    font-size: 40px;
  }
}
</style>

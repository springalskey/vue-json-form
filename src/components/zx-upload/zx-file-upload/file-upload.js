import is from '../../commons/is';
import CosUpload from '../utils/cosUpload';
import { Message } from 'element-ui';
export default {
  name: 'zxFileUpload',
  props: {
    value: {
      type: String
    },
    // 0：图片；1：视频；2：音频  3：其他文件
    type: {
      type: Number,
      default: 3
    },
    beforeUpload: {
      type: Function
    },
    successUpload: {
      type: Function
    },
    // 单位kb
    maxSize: {
      type: Number,
      default: 1024 * 10
    },
    format: {
      type: Array,
      default: () => ['.mp4']
    },
    readonly: {
      type: Boolean
    },
    tips: {
      type: String
    },
    buttonText: {
      type: String,
      default: '点击上传'
    },
    // 1:上传到腾讯云，2:不上传暴露文件流给upload方法
    uploadType: {
      type: Number,
      default: 1
    },
    upload: {
      type: Function
    },
    // 是否展示input框
    showInput: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileUrl: undefined
    };
  },
  watch: {
    value: {
      handler() {
        this.fileUrl = this.value;
      },
      immediate: true
    }
  },
  methods: {
    handleClick() {
      this.$refs.file.click();
      let _this = this;
      this.$refs.file.onchange = async function () {
        let file = this.files[0];
        let fileName = file.name;
        let extensions = fileName.substring(fileName.lastIndexOf('.'));
        let result = _this.valid(file, extensions);
        if (!result) {
          _this.$refs.file.value = '';
          return;
        }
        // 上传参数
        let options = {
          fileName,
          file,
          extensions,
          type: _this.type
        };
        try {
          if (_this.uploadType === 2) {
            _this.upload && _this.upload(options);
            _this.$emit('input', fileName);
            _this.$refs.file.value = '';
            return;
          }
          let fileInfo = await CosUpload.uploadFile({
            file: options.file,
            type: _this.type
          });
          let url = fileInfo.path;
          if (url) {
            _this.fileUrl = url;
            _this.$emit('input', url);
            _this.$emit('change', url);
            // let isVideo = _this.isVideo(extensions.toLowerCase());
            // // 当为视频时，截取第一帧作为默认封面
            // if (isVideo) {
            //   let coverUrl = fileInfo.animatedImage;
            //   let { width, height } = await this.$$utils.getImageSizeBySrc(coverUrl);
            // }
            _this.$emit('success', fileInfo);
            _this.successUpload && _this.successUpload(fileInfo);
          }
          _this.$refs.file.value = '';
        } catch (err) {
          _this.$refs.file.value = '';
        }
      };
    },

    valid(file, extensions) {
      if (extensions === '.ZIP') {
        Message.error('zip格式必后缀必须小写！');
        return false;
      }
      if (this.format.indexOf(extensions.toLowerCase()) < 0) {
        Message.error('不支持该文件类型！');
        return false;
      }
      let kb = file.size / 1024;
      const isGtMax = kb > this.maxSize;
      if (isGtMax) {
        if (this.maxSize / 1024 >= 1) {
          Message.error(`上传文件大小不能超过${this.maxSize / 1024}MB!`);
        } else {
          Message.error(`上传文件大小不能超过${this.maxSize}KB!`);
        }
        return false;
      }
      if (this.beforeUpload) {
        return this.beforeUpload.call(this.$vnode.context, file);
      }
      return true;
    },
    isVideo(extensions) {
      let _exts = ['.mp4', '.avi', '.wmv'];
      return _exts.includes(extensions);
    },
    getReadonly() {
      if (typeof this.readonly !== 'undefined') return this.readonly;
      if (is.prod()) return true;
      return false;
    },
    onChange() {
      if (this.fileUrl !== this.value) {
        this.$emit('change', this.fileUrl);
        this.$emit('input', this.fileUrl);
      }
    }
  }
};

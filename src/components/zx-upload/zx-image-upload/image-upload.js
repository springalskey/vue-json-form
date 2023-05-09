import is from '../../commons/is';
import { Message } from 'element-ui';
import CosUpload from '../utils/cosUpload';
import compressImage from '../../commons/compress-image';
export default {
  name: 'zxImageUpload',
  props: {
    value: {
      type: [String, Array]
    },
    beforeUpload: {
      type: Function
    },
    successUpload: {
      type: Function
    },
    scale: {
      type: [Number, Array]
    },
    // 单位kb
    maxSize: {
      type: Number,
      default: 5120
    },
    // 单位px
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    format: {
      type: Array,
      default: () => ['.png', '.jpg', '.jpeg']
    },
    tips: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean
    },
    multipleMax: {
      type: Number
    },
    // 0：图片；1：视频；2：音频  3：其他文件
    type: {
      type: Number,
      default: 0
    },
    buttonText: {
      type: String,
      default: '点击上传'
    },
    // 多选时展示预览图片列表
    showPreview: {
      type: Boolean,
      default: true
    },
    // 向URL后面添加原始文件名称
    urlQueryAddSrouceName: {
      type: Boolean,
      default: false
    },
    // 2种视图形式，默认带input输入框，第二种thumbnail缩略图形式
    viewType: {
      type: String,
      default: 'input'
    },
    imageWidth: {
      type: String,
      default: '50px'
    },
    imageHeight: {
      type: String,
      default: '50px'
    },
    footprint: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reqCount: 0,
      imageUrl: undefined,
      supportExtensions: /.png|.jpg|.jpeg/gi,
      // 多选时选中的预览图片
      selectedIndex: undefined,
      // 上传成功的URL
      successArr: [],
      accept: undefined
    };
  },
  watch: {
    value: {
      handler() {
        if (this.multiple) {
          this.imageUrl = !is.empty(this.value) ? this.value[0] : '';
          this.successArr = this.value || [];
          this.selectedIndex = 0;
          return;
        }
        this.imageUrl = this.value;
      },
      immediate: true
    }
  },
  created() {
    this.accept = this.format
      .map(ext => `image/${ext.replace('.', '')}`)
      .join(',');
  },
  mounted() {
    if (this.multiple) {
      this.imageUrl = !is.empty(this.value) ? this.value[0] : '';
      this.successArr = this.value || [];
      this.selectedIndex = 0;
    } else {
      this.imageUrl = this.value;
    }
  },
  methods: {
    handleClick() {
      this.reqCount = 0;
      if (this.multipleMax && this.successArr.length >= this.multipleMax) {
        Message.error('最多只能上传' + this.multipleMax + '张图片');
        return;
      }
      this.$refs.file.click();
      let _this = this;
      this.$refs.file.onchange = async function () {
        let passedCount = 0;
        let filesArr = [];
        if (_this.multipleMax) {
          let count = _this.successArr.length + this.files.length;
          if (count > _this.multipleMax) {
            Message.error('最多只能上传' + _this.multipleMax + '张图片');
            return;
          }
        }
        for (let file of this.files) {
          let fileName = file.name;
          let kb = file.size / 1024;
          if (kb > 500) {
            compressImage({
              file: file,
              // targetSize: 500,
              fileName: fileName,
              quality: 0.6,
              success(resultFile) {
                if (resultFile) {
                  file = resultFile;
                  console.log(file.size / 1024, 'kb');
                }
              }
            });
          }
          let extensions = fileName.substring(fileName.lastIndexOf('.'));
          fileName = fileName.replace(extensions, '');
          let imageSize;
          try {
            imageSize = await _this.getImageSize(file);
          } catch (err) {
            console.log(err);
            imageSize = {};
          }
          let { width, height } = imageSize;
          let result = _this.valid(file, width, height, extensions);
          if (!result) {
            _this.$refs.file.value = '';
            return;
          } else {
            filesArr.push({
              fileName,
              file,
              extensions,
              height,
              width,
              useType: 5
            });
            passedCount++;
          }
        }
        if (passedCount === this.files.length) {
          for (const [index, options] of filesArr.entries()) {
            let fileInfo = await _this.upload({
              file: options.file
            });
            let url = fileInfo.path;
            if (!url) {
              if (_this.multiple) {
                _this.$emit('change', _this.successArr);
                if (!_this.imageUrl) {
                  _this.imageUrl = _this.successArr[0];
                }
                return;
              }
            }
            // 追加原始名称
            if (_this.urlQueryAddSrouceName) {
              url = url + '?sourceName=' + options.fileName;
            }
            if (!_this.multiple) {
              _this.imageUrl = url;
              _this.$emit('change', url);
              _this.$emit('input', url);
            } else {
              _this.successArr.push(url);
              if (index === filesArr.length - 1) {
                _this.$emit('change', _this.successArr);
                _this.$emit('input', _this.successArr);
                if (!_this.imageUrl) {
                  _this.imageUrl = _this.successArr[0];
                }
              }
            }
            _this.$emit('success', fileInfo);
            _this.successUpload && _this.successUpload(fileInfo);
          }
        }
      };
    },
    // 输入后同步v-model绑定值
    handleInputBlur() {
      if (this.multiple) {
        this.$emit('input', this.value);
        this.$emit('change', this.value);
        return;
      }
      this.$emit('input', this.imageUrl);
      this.$emit('change', this.imageUrl);
    },
    async upload(options) {
      let fileInfo = '';
      try {
        fileInfo = await CosUpload.uploadFile({
          file: options.file,
          type: this.type,
          footprint: this.footprint
        });
        this.$refs.file.value = '';
      } catch (err) {
        console.log(err);
        this.$refs.file.value = '';
      }
      return fileInfo;
    },

    valid(file, width, height, extensions) {
      let result = true;
      if (this.beforeUpload) {
        result = this.beforeUpload.call(this.$vnode.context, file);
      } else {
        if (this.format.indexOf(extensions.toLowerCase()) < 0) {
          Message.error('不支持该图片类型！');
          return false;
        }
        let kb = file.size / 1024;
        const isGtMax = kb > this.maxSize;
        if (isGtMax) {
          if (this.maxSize / 1024 >= 1) {
            Message.error(`上传图片大小不能超过${this.maxSize / 1024}MB!`);
          } else {
            Message.error(`上传图片大小不能超过${this.maxSize}KB!`);
          }
          return false;
        }
        if (this.width && width !== this.width) {
          Message.error(`图片宽必须为${this.width}px!`);
          return false;
        }
        if (this.height && height !== this.height) {
          Message.error(`图片高必须为${this.height}px!`);
          return false;
        }
        const scale = width / height;
        if (!Array.isArray(this.scale)) {
          if (this.scale && scale !== this.scale) {
            Message.error('图片宽高比例不正确');
            return false;
          }
        } else {
          if (this.scale && !this.scale.includes(scale)) {
            Message.error('图片宽高比例不正确');
            return false;
          }
        }
      }
      return result;
    },

    getImageSize(file) {
      return new Promise((resolve, reject) => {
        let result = {};
        let reader = new FileReader();
        reader.onload = e => {
          var data = e.target.result;
          var image = new Image();
          image.onload = () => {
            result.width = image.width;
            result.height = image.height;
            resolve(result);
          };
          image.onerror = () => {
            this.$refs.file.value = '';
            reject(new Error('图片加载失败'));
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });
    },
    onClickPreview(url, index) {
      this.selectedIndex = index;
      this.imageUrl = url;
    },
    onDelete(url, index) {
      this.successArr.splice(index, 1);
      this.$emit('input', this.successArr);
      if (this.imageUrl === url) {
        this.imageUrl = undefined;
      }
    },
    getReadonly() {
      if (this.multiple || is.prod()) return true;
      return false;
    },
    onChange() {
      if (this.imageUrl !== this.value) {
        this.$emit('change', this.imageUrl);
        this.$emit('input', this.imageUrl);
      }
    },
    onImageError(e) {
      this.reqCount++;
      if (this.reqCount < 10) {
        let src = e.target.src;
        let a = '';
        if (src.includes('?')) {
          a = '&_t=';
        } else {
          a = '?_t=';
        }
        let t = setTimeout(() => {
          e.target.src = src + a + Math.random() * 1000;
          clearTimeout(t);
        }, 500);
      }
    }
  }
};

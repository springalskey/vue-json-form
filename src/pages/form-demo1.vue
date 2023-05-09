<template>
  <div class="about m-b-30 m-t-20">
    <div style="width: 800px; margin: auto">
      <vue-json-form
        ref="form"
        :inline="false"
        vid="vid-test"
        trigger="change"
        label-width="120px"
        v-model="formData"
        :list="formList"
      />
      <el-button @click="onReset" type="default">清空</el-button>
      <el-button vid="vid-test" v-onsubmit="onSave" type="primary">
        保存
      </el-button>
    </div>
  </div>
</template>
<script>
import cityOptions from './cityData';
export default {
  data() {
    return {
      formData: {
        startTime1: '08:05',
        // isShow: true,
        cities: ['shanghai', 'shenzhen'],
        flag: true
        // city1: [[17, 21, 23]],
        // city2: [],
        // transfer: [1, 2],
        // color: '#A30E0E',
        // name: '测试测试看看',
        // status: [1],
        // createTime: '2020-03-03 12:00:34',
        // activittyDate: '2020-03-03',
        // start_time: '2020-03-03',
        // end_time: '2020-03-31',
        // start_datetime: '2020-03-03 12:00:00',
        // end_datetime: '2020-03-31 23:00:00',
        // cover_image:'',
        // showSuffixDemo: undefined
      },
      formList: [
        {
          type: 'time',
          label: '开始时间',
          field: 'startTime1',
          rules: { required: true },
          attrs: { format: 'HH:mm' }
        },
        {
          type: 'input',
          label: '敏感词',
          field: 'name',
          attrs: { maxlength: 20 },
          rules: { required: true },
          change: true,
          // blur: true 代表失去焦点需要进行校验
          prefix: [
            {
              type: 'icon',
              tooltip: '这里是提示，这里是提示，这里是提示',
              click(data) {},
              attrs: {
                type: 'ios-help-circle-outline',
                size: '25',
                color: '#2d8cf0'
              }
            },
            {
              type: 'button',
              label: '测试',
              click(data) {}
            }
          ],
          suffix: [
            {
              type: 'button',
              label: 'suffix测试',
              click(data) {}
            }
          ]
        },
        {
          type: 'select',
          label: '状态',
          field: 'status',
          options: [
            {
              label: '运营审核',
              value: 1
            },
            {
              label: '禁止发布',
              value: 2
            }
          ],
          change({ e }) {
            console.log(11111, e);
          },
          rules: { required: true },
          attrs: { multiple: false, clearable: true }
        },
        {
          type: 'checkbox-group',
          label: '城市',
          field: 'cities',
          options: [
            { label: '上海', value: 'shanghai' },
            { label: '北京', value: 'beijing' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' }
          ],
          rules: { required: true },
          vif: formData => formData.status === 1
        },
        {
          type: 'checkbox',
          label: '有房有车',
          field: 'flag',
          rules: { required: true }
        },
        {
          type: 'color',
          label: '车身颜色',
          field: 'color',
          rules: { required: true, color: true }
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
          type: 'radio-button',
          label: '城市2',
          field: 'bts',
          rules: { required: true },
          // options和optionsAsync两种方式选其一
          // options: [],
          optionsAsync: async () => {
            return [
              { label: '上海', value: '1' },
              { label: '北京', value: '2' },
              { label: '广州', value: '3' }
            ];
          }
        },
        {
          type: 'radio',
          label: '活动类型',
          field: 'type',
          rules: { required: true },
          // options和optionsAsync两种方式选其一
          options: [
            { label: '单品活动', value: 1 },
            { label: '满减活动', value: 2 }
          ]
        },
        {
          // date|datetime
          type: 'datetime',
          label: '创建时间',
          field: 'createTime',
          rules: { required: true }
        },
        {
          type: 'date',
          label: '活动日期',
          field: 'activittyDate',
          prefix: '<div>自定义prefix</div>',
          suffix: '<div>自定义suffix</div>',
          rules: { required: true }
        },
        {
          // daterange|datetimerange
          type: 'daterange',
          label: '日期范围',
          field: 'dateRange',
          rules: { required: true },
          attrs: {
            startField: 'start_time',
            endField: 'end_time'
          }
        },
        {
          // daterange|datetimerange
          type: 'datetimerange',
          label: '时间范围',
          field: 'datetimerange',
          rules: { required: true },
          attrs: {
            startField: 'start_datetime',
            endField: 'end_datetime'
          }
        },
        {
          type: 'imageUpload',
          label: '封面图',
          field: 'cover_image',
          rules: { required: true },
          attrs: {
            // viewType: 'thumbnail',
            // footprint: true,
            tips: '支持图片格式png/jpg/jpeg/gif，图片尺寸120*120',
            format: ['.png', '.jpg', '.jpeg', '.gif']
            // width: 120,
            // height: 120
          }
        },
        {
          type: 'imageUpload',
          label: '多图上传',
          field: 'cover_images',
          rules: { required: true },
          attrs: {
            multiple: true,
            multipleMax: 3,
            placeholder: '最多上传3张',
            tips: '支持图片格式png/jpg/jpeg/gif',
            format: ['.png', '.jpg', '.jpeg', '.gif']
          }
        },
        {
          type: 'fileUpload',
          label: '文件上传',
          field: 'xlsxUrl',
          rules: { required: true },
          attrs: {
            tips: '支持文件格式xlsx',
            format: ['.xlsx'],
            type: 3
          }
        },
        // 不上传到腾讯云，暴露出upload方法，自己去写上传接口
        {
          type: 'fileUpload',
          label: '自定义上传文件',
          field: 'testUrl',
          rules: {
            required: true,
            maxSize: 800
          },
          attrs: {
            uploadType: 2,
            // 需要自己去写上传代码
            upload: data => {
              debugger;
            },
            showInput: false,
            tips: '支持图片格式png/jpg/jpeg/gif',
            format: ['.png', '.jpg', '.jpeg', '.gif']
          }
        },
        {
          type: 'textarea',
          label: 'textarea',
          field: 'desc',
          rules: {
            required: true
          },
          attrs: { maxlength: 200, rows: 4 }
        },
        {
          type: 'rate',
          label: '推荐指数',
          field: 'rate',
          attrs: {},
          rules: { required: true, min: 1 }
        },
        {
          type: 'cascader',
          label: '级联(多选)',
          field: 'city1',
          options: cityOptions,
          attrs: {
            'collapse-tags': true,
            // 多选也支持搜索
            filterable: true,
            props: {
              multiple: true,
              // true返回上下架关系（数组），false只返回最后一个
              emitPath: true,
              // 隔离父子的强依赖关系，任意节点都可选择
              checkStrictly: true
            }
          },
          rules: { required: true }
        },
        {
          type: 'cascader',
          label: '级联(单选)',
          field: 'city2',
          options: cityOptions,
          rules: { required: true }
        },
        {
          type: 'select-search',
          label: '远程搜索多选',
          field: 'search',
          rules: { required: true },
          attrs: {
            // 自定义value/label
            valueField: 'id',
            labelField: 'title',
            searchField: 'q',
            clearable: true,
            multiple: true,
            // 该函数用于在编辑时显示展示的值。它需要返回一个数组，数组里存选中项的所有数据
            getSelectedOptions: () => {
              return [];
            },
            // 异步加载data，返回数组
            getData: async (params = {}) => {
              return [
                { id: 1, title: '测试1' },
                { id: 2, title: '测试2' }
              ];
            }
          }
        },
        {
          type: 'select-search',
          label: '远程搜索单选',
          field: 'search2',
          // value: 1,
          rules: { required: true },
          attrs: {
            // 自定义value/label
            valueField: 'id',
            labelField: 'title',
            searchField: 'q',
            clearable: true,
            multiple: false,
            // 如果配置了getLabel，则不会触发getData请求，用于默认展示id和label。
            // getLabel: (formData) => {
            //   if (formData.search2 === 1) {
            //     return '测试1'
            //   }
            // },
            // 异步加载data，返回数组
            getData: async (params = {}) => {
              return [
                { id: 1, title: '测试1' },
                { id: 2, title: '测试2' }
              ];
            }
          }
        },
        {
          type: 'input',
          field: 'suffixId',
          label: 'suffix展示隐藏',
          attrs: {
            placeholder: '输入1展示showSuffixDemo，其他值展示suffix测试',
            style: {
              width: '300px'
            }
          },
          blur: async ({ formData }) => {
            setTimeout(() => {
              formData.showSuffixDemo = formData.suffixId === '1';
            });
          }
        }
      ]
    };
  },
  mounted() {
    setTimeout(() => {
      this.formData.name = 'aaaaaa';
    }, 1500);
  },
  methods: {
    async onSave(valided, { formData }) {
      console.log(valided, JSON.parse(JSON.stringify(formData)));
    },
    onReset() {
      this.formData = {};
      this.$refs.form.resetFields(this.formData);
    }
  }
};
</script>
<style>
div[form-field='city1'] .th-e-cascader {
  display: block;
}

div[form-field='activittyDate'] .zx-form-item {
  /* flex-grow: 1; */
}
</style>

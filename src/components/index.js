import Vue from 'vue';
import './commons/index';
import { definition } from './zx-validator/directive';
import Validator from './zx-validator/validator';
import VueJsonForm from './vue-json-form/template';
import ImageUpload from './zx-upload/zx-image-upload/template';
import FileUpload from './zx-upload/zx-file-upload/template';
import SelectRemote from './zx-select-remote/select-remote';
import FormItem from './zx-form-item/template';
import AddMinus from './zx-add-minus/add-minus';
import ColorPicker from './zx-color-picker/color-picker';
import Daterange from './zx-form-daterange/daterange';

Vue.component(Validator.name, Validator);
Vue.component(VueJsonForm.name, VueJsonForm);
Vue.component(ImageUpload.name, ImageUpload);
Vue.component(FileUpload.name, FileUpload);
Vue.component(SelectRemote.name, SelectRemote);
Vue.component(FormItem.name, FormItem);
Vue.component(AddMinus.name, AddMinus);
Vue.component(ColorPicker.name, ColorPicker);
Vue.component(Daterange.name, Daterange);

// 防抖提交，在提交时置灰按钮
Vue.directive('onsubmit', definition);

// 封装插件
Vue.use({
  install(Vue) {
    Vue.prototype.$eventBus = new Vue();
    // Vue.prototype.$$user = {};
  }
});

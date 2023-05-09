import Vue from 'vue';
import './components';
import App from '@/App';
import router from '@/router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small' });

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

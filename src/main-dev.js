import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//按需引入element组件库
import './plugins/element'
// import { BUtton, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//引入图标库
import './assets/fonts/iconfont.css'

//引入全局样式/
import './assets/css/global.css'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import 'Nprogress' from 'nprofress'

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


//引入axios
import axios from 'axios';
//设置请求跟路径
axios.defaults.baseURL = 'http://localhost:3000/api/';
//设置axios拦截器
axios.interceptors.request.use(config => {
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});

axios.interceptors.response.use(config => {
    NProgress.done()
    return config;
});
Vue.prototype.$http = axios;
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
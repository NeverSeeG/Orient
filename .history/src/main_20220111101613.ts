import * as ElIconModules from "@element-plus/icons-vue";
import * as echarts from 'echarts';
// import locale from "element-plus/lib/locale/lang/zh-cn";
import { createApp } from 'vue';
import App from './App.vue';
import elementPlus from './plugins/elementPlus';
import router from './router';
import { key, store } from './store';
import './styles/index.scss';
const app = createApp(App)

app.config.globalProperties.$echarts = echarts;
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}
app.use(router)
    .use(store, key)
    .use(elementPlus)
    .mount('#app')

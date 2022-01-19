import * as ElIconModules from "@element-plus/icons-vue"
import moment from "moment"
import { createApp } from 'vue'
import App from './App.vue'
import elementPlus from './plugins/elementPlus'
import router from './router'
import { key, store } from './store'
import './styles/index.scss'
const app = createApp(App)
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}
app.use(router)
    .use(store, key)
    .use(moment)
    .use(elementPlus, {size: 'small', zIndex: 2000})
    .mount('#app')

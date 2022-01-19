import { transElIconName } from '@/utils/utils.js'
import * as ElIconModules from "@element-plus/icons"
import { createApp } from 'vue'
import App from './App.vue'
import elementPlus from './plugins/elementPlus'
import router from './router'
import { key, store } from './store'
import './styles/index.scss'
const app = createApp(App)

for (let iconName in ElIconModules) {
    app.component(transElIconName(iconName), ElIconModules[iconName])
}
app.use(router)
    .use(store, key)
    .use(elementPlus, {size: 'small', zIndex: 2000})
    .mount('#app')

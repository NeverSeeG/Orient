import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {store, key} from './store'
import './styles/index.scss'
import elementPlus from './plugins/elementPlus'
import * as ElIconModules from "@element-plus/icons"

const app = createApp(App)
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}
app.use(router)
    .use(store, key)
    .use(elementPlus, {size: 'small', zIndex: 2000})
    .mount('#app')

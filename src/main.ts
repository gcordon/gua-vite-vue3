import { createApp } from 'vue'
import './style.css'
import ViewApp from './App.vue'
import { setupRouter } from './router/routes/routes'
import { langEnglish, setupI18n, updateI18nLang } from './locales/setupI18n'

const app = createApp(ViewApp)

const __mainInit = () => {
    setupRouter(app)
    setupI18n(app)
    setTimeout(() => {
        updateI18nLang(langEnglish)
    }, 1000)
}

__mainInit()
// 绑定到DOM元素上
app.mount('#app')
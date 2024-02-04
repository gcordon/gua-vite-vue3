import { App } from 'vue'
import { createI18n } from 'vue-i18n' // https://kazupon.github.io/vue-i18n/zh/guide/formatting.html#%E5%85%B7%E5%90%8D%E6%A0%BC%E5%BC%8F

export let i18n: ReturnType<typeof createI18n>;

export const langChinese = Symbol('中文翻译')
export const langEnglish = Symbol('英文翻译')

// symbol 转换为 string
export const symbolToString = (tag: Symbol): string => {
    return tag.toString()
}

// 设置 html dom 标签属性
const setHtmlDomAttrbuteLang = (currenI18lang: Symbol): void => {
    const langMap = new Map()
    langMap.set(langChinese, 'zh_CN')
    langMap.set(langEnglish, 'en_US')
    let l = langMap.get(currenI18lang)
    if (l !== undefined) {
        l && document.querySelector('html')?.setAttribute('lang', l)
    }
}

// 获取 多语言 json
const getImportLangJson = (json: any) => {
    // 用于进行动态模块导入
    // 当 eager 参数设置为 true 时，import.meta.glob 返回的模块对象会立即执行并加载相应的模块。
    // 这意味着在调用 import.meta.glob 的同时，模块就会被加载并执行。
    // 得到东西为
    /*
        './lang/en-US/g1.json': {
            "default": {
                "hello": "英文你好"
            },
            "hello": "英文你好"
        }
     */
    let j:{
            [key: string]: {
                [key: string]: string | number,
            },
        } = {}
    let keys = Object.keys(json) // ['./lang/en-US/g1.json',]
    keys.forEach(langJson => {
        let a = langJson.split('/')
        let b = a[a.length - 1]                // 拿到 g1.json
        let c = b.slice(0, b.indexOf('.json')) // 得到 g1
        j[c] = json[langJson].default            // 得到 g1.json 文件中的内容
    })
    // 最终返回
    // {
    //     g1: {
    //         "hello": "英文你好"
    //     }
    // }
    return j
}
 
// 初始化使用路由
export const setupI18n = (app: App) => {
    let __defaultLang = langChinese // TODO 这里还需要拿状态管理的 pina 数据
    // let __defaultLang = langEnglish // TODO 这里还需要拿状态管理的 pina 数据
    let messages = {
        // glob 中的第一个参数无法使用 魔法字符串 所以现在只能写死，本来的做法是这样 mp.set(langChinese, 'en-US')
        [symbolToString(langEnglish)]: getImportLangJson(import.meta.glob(`./lang/en-US/*.json`, { eager: true },),),
        [symbolToString(langChinese)]: getImportLangJson(import.meta.glob(`./lang/zh-CN/*.json`, { eager: true },),),
    }
    i18n = createI18n({
        locale: symbolToString(__defaultLang), //  当前默认使用语言
        // messages: {
        //     [symbolToString(langEnglish)]: {
        //        g1: {
        //           hello: 'g1___',
        //        }
        //     },
        //     // 添加其他语言的翻译
        // },
        //  TODO: 有一个问题就是 Vant 虽然支持了多语言，但是可能缺少我们希望的国家，这时候可以问！ gpt: "vant lang 要是没有我想要的多语言国家怎么办"
        messages: messages,
    })
    setHtmlDomAttrbuteLang(__defaultLang)
    app.use(i18n)
}


// 变更语言
export const updateI18nLang = (lang: symbol) => {
    let c = symbolToString(lang)
    if (i18n.global.locale === c) { // 切换的语言和当前语言是一样的
        return
    }
    i18n.global.locale = c
}

// echo "# gua-vite-vue3" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin git@github.com:gcordon/gua-vite-vue3.git
// git push -u origin main
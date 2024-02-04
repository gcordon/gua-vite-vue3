import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'


// 路由名
export enum RoutesPageEnum { // 枚举
    popularize = '/popularize',
}
const autoCreate = Symbol('自动生成路由name')
let popMeta:[string, number,] = ['推广页标题', 88,] // 元组类型
let routes = [
  {
    path: RoutesPageEnum.popularize,
    name: autoCreate,
    component: () => import('../../views/popularize/popularize.vue'),
    meta: {
        title: popMeta[0],     // 标题  这里需要使用多语言
        authority: popMeta[1], // 权限高度
    }
  },
]


// 自动生成路由的name
const namemMathUpdate = (pathName: string,): string => {
    if (!pathName || pathName.length < 1) {
        return pathName
    }

    // pathName = '/popularize' 
    let n1 = pathName.slice(1,)        // 切掉   '/'
    let n2 = n1[0].toLocaleUpperCase() // 转为大写
    let n3 = `${n2}${n1.slice(1,)}`    // 最后得到 Popularize
    return n3
} 
// TODO: 这里是hack的，应该用自带的声明类型才是对的
interface routerObjectInterface { // typescript --- 接口
    path: string,
    name: string | symbol,
    component: Function,
    meta: object,
}
// 上下两种声明都可以使用
// routerObjectInterface = Array<{path: string,
//      name: string | symbol,
//      component: Function,
//      meta: object,
// }>


const autoCreateRouteName = (routeArrary: Array<any>): Array<any> => {
    let r = routeArrary
    r.forEach(o => {
        if (o.name === autoCreate) {
            o.name = namemMathUpdate(o.path)
        }
    })
    return r
}

routes = autoCreateRouteName(routes)
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior: () => ({ left: 0, top: 0 }), // 切换路由自动滚动到顶部
})



// 初始化使用路由
export const setupRouter = (app: App) => {
    app.use(router)
}
 
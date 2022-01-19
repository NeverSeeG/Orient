import router from "@/router";
import axios, { AxiosRequestConfig, Method } from "axios";
import { ElMessage } from 'element-plus';


const message = (msg: string, type?: any) => {
    ElMessage({
        message: msg,
        type: type || 'warning',
        duration: 1500,
    });
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/login',
        name: 'login',
    });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number, other: string) => {
    // 状态码判断
    switch (status) {
        // -1: 未登录状态，跳转登录页
        case -1:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            message('登录过期，请重新登录');
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        // 404请求不存在
        case 404:
            message('请求的资源不存在');
            break;
        default:
            message(other);
    }
}

// 定义接口
interface PendingType {
    url?: string;
    method?: Method;
    params: any;
    data: any;
    cancel: any;
}

// 取消重复请求
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
    for (const key in pending) {
        const item: number = +key;
        const list: PendingType = pending[key];
        // 当前请求在数组中存在时执行函数体
        if (list.url === config.url && list.method === config.method && JSON.stringify(list.params) === JSON.stringify(config.params) && JSON.stringify(list.data) === JSON.stringify(config.data)) {
            // 执行取消操作
            list.cancel('操作太频繁，请稍后再试');
            // 从数组中移除记录
            pending.splice(item, 1);
        }
    }
};

/* 实例化请求配置 */
const instance = axios.create({
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin-Type": '*',
    },
    // 请求时长
    timeout: 1000 * 30,
    // baseURL: "http://localhost:3000",
    //   process.env.NODE_ENV === "development"
    //     ? "测试"
    //     : "正式",
    withCredentials: true,
})

axios.defaults.withCredentials = true
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    config => {
        // removePending(config);
        // config.cancelToken = new CancelToken((c) => {
        //     pending.push({url: config.url, method: config.method, params: config.params, data: config.data, cancel: c});
        // });
        return config;
    },
    // error => Promise.error(error)
)


// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res),
    // 请求失败
    error => {
        const {response} = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 后续增加断网情况下做的一些操作
            // store.commit('networkState', false);
        }
    }
)


// 只需要考虑单一职责，这块只封装axios
export default instance

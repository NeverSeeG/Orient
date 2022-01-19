import axios from 'axios'
import type {AxiosInstance} from "axios";
import type {RequestInterceptors, RequestConfig} from "./type";
import {ElLoading} from "element-plus";

const DEAFULT_LOADING = true;
//
// const request = axios.create({
//     baseURL: import.meta.env.VITE_API_BASEURL,
//    // baseURL: process.env.VUE_APP_BASE_API,  // url = base url + request url
//     timeout: 40 * 1000, // 默认用40s超时时间
//     headers: { // 配置OAuth 2.0的认证头
//         'Content-Type': 'application/json;charset=utf-8'
//     },
//     // withCredentials: true
// })
// // 请求前置拦截器
// request.interceptors.request.use((config) => {
//     if (config.method === 'post' && !config.data) {
//         config.data = config.params
//         config.params = null
//     }
//     return config
// }, (error) => {
//     return Promise.reject(error)
// })
//
// // request.interceptors.response.use(function (response) {
// //     // 统一设置接口相应错误, 比如 token 过期失效, 服务端异常
// //     return response
// // }, function (error) {
// //     // Do something with response error
// //     return Promise.reject(error)
// // })
//
// // 响应前置拦截器
// request.interceptors.response.use((res) => {
//     return Promise.resolve(res)
// }, (error) => {
//     let errMsg = ''
//     if (error && error.response) {
//         switch (error.response.status) {
//             case 400:
//                 errMsg = '错误的请求'
//                 break
//             case 500:
//                 errMsg = '服务器端出错'
//                 break
//             case 401:
//                 errMsg = '权限校验错误'
//                 break
//             default:
//                 errMsg = '网络错误'
//         }
//     }
//     return Promise.reject(errMsg)
// })
//
// export default request

class Request {
    instance: AxiosInstance; //axios实例
    interceptors?: RequestInterceptors;
    showLoading: boolean;
    // loading?: ILoadingInstance; //loading实例
    constructor(config: RequestConfig) {
        this.instance = axios.create(config);
        this.interceptors = config.interceptors;
        this.showLoading = config.showLoading ?? DEAFULT_LOADING;
        //单个实例的拦截
        this.instance.interceptors.request.use(
            this.interceptors?.requestInterceptor,
            this.interceptors?.requestInterceptorCatch
        );
        this.instance.interceptors.response.use(
            this.interceptors?.responseInterceptor,
            this.interceptors?.requestInterceptorCatch
        );
        //添加所有实例的拦截器
        this.instance.interceptors.request.use(
            (config) => {
                console.log("所有实例的拦拦截器:请求拦截成功");
                if (this.showLoading) {
                    // this.loading = ElLoading.service({
                    //     lock: true,
                    //     text: "正在请求数据...",
                    //     background: "regba(0,0,0,0.5)"
                    // });
                }
                return config;
            },
            (err) => {
                console.log("所有实例的拦拦截器:请求拦截失败");
                return err;
            }
        );
        this.instance.interceptors.response.use(
            (res) => {
                console.log("所有实例的拦拦截器:响应拦截成功");
                //将loading移除
                // this.loading?.close();
                const data = res.data as any;
                if (data.returnCode === "-1001") {
                    console.log("请求失败,错误信息");
                } else {
                    return data;
                }
            },
            (err) => {
                console.log("所有实例的拦拦截器:响应拦截失败");
                if (err.response.status === 404) {
                    console.log("404的错误");
                }
                return err;
            }
        );
    }
    //单个请求多拦截
    request<T>(config: RequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            //判断单个请求是否有拦截
            if (config.interceptors?.requestInterceptor) {
                config = config.interceptors.requestInterceptor(config);
            }
            if (config.showLoading === false) {
                this.showLoading = config.showLoading;
            }
            this.instance
                .request<any, any>(config)
                .then((res) => {
                    if (config.interceptors?.responseInterceptor) {
                        res = config.interceptors.responseInterceptor(res);
                    }
                    this.showLoading = DEAFULT_LOADING;
                    //将结果res返回出去
                    resolve(res);
                })
                .catch((err) => {
                    this.showLoading = DEAFULT_LOADING;
                    reject(err);
                    return err;
                });
        });
    }

    get<T>(config: RequestConfig): Promise<T> {
        return this.request<T>({...config, method: "get"});
    }

    post<T>(config: RequestConfig): Promise<T> {
        return this.request<T>({...config, method: "post"});
    }

    delete<T>(config: RequestConfig): Promise<T> {
        return this.request<T>({...config, method: "delete"});
    }

    patch<T>(config: RequestConfig): Promise<T> {
        return this.request<T>({...config, method: "patch"});
    }
}

export default Request;

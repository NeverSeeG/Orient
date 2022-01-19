import type {AxiosRequestConfig} from "axios";

//拦截器
export interface RequestInterceptors {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestInterceptorCatch?: (error: any) => any;
    responseInterceptor?: (res: any) => any;
    rrequestInterceptorCatch?: (error: any) => any;
}

export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors;
    showLoading?: boolean;
}

// request.ts
import axios from "@/axios/index"
import qs from 'qs'

export class Request {
    /**
     * get方法
     * @param {string} url 路径
     * @param {object} params 参数
     */
    static get = (url: string, params?: any) => {
        return new Promise((resolve, reject) => {
            axios.get(url, {params: params}).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    static post = (url: string, params?: any) => {
        return new Promise((resolve, reject) => {
            axios.post(url, params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    static put = (url: string, params?: any) => {
        return new Promise((resolve, reject) => {
            axios.put(url, qs.stringify(params)).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    static delete = (url: string, params?: any) => {
        return new Promise((resolve, reject) => {
            axios.delete(url, params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    static customer=(url: string, params?:any,formData?:any)=>{
      return axios({
        url: url,
        method: 'post',
        params: { ...params },
        data: formData,
      })
    }
}

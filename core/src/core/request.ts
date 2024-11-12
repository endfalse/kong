import axios , { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AjaxResultCode } from '../enums/system'
import { AjaxResult } from '../types'
import {kong} from '../core';

const baseURL = kong.api.baseUrl || 'https://jcloud.jq123.net';
const timeout = kong.api.timeout || 3000;

export const bigUploadApi=kong.api.bigUploadApi||`${baseURL}/file/uploadBig`
export const normalUploadApi=kong.api.normalUploadAPi||`${baseURL}/file`

const service: AxiosInstance = axios.create({baseURL: baseURL,timeout})


// 请求前的统一处理
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
     const token = kong.storeHook.token()
    // JWT鉴权处理
    if (token&&config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config!=null&&config.data&&(config.method||'get').toLowerCase() === "get") {
      config.params = config.data
      delete config.data
    } 
    return config
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
const requests={
    isRefreshing:false,
    listing:[] as ((token:string)=>void)[],
    retry:0,
    clear(loginOut:boolean=false,reason:any|undefined=undefined){
        this.listing=[],
        this.isRefreshing =false,
        this.retry=0
        if(loginOut)
        {
            kong.storeHook.sinOut()
        }
        if(reason)
        {
            return Promise.reject(reason)
        }
    }
}

const refreshToken=()=>{
    if(requests.retry>0){
        throw new Error('refresh token is invalid')
    }
    return request<string>({
            url: 'system/user/refreshToken',
            method: 'post',
            data:{refreshToken:kong.storeHook.refreshToken()}
    })
}

const tryPopMessage=(ajaxResult: AjaxResult)=>{
  if (typeof(ajaxResult.code)==='number'&& ajaxResult.message) {
    const {code,message} = ajaxResult
    switch (code) {
      case AjaxResultCode.Error:
        kong.messageBox('error',message || '服务异常')
        break;
      case AjaxResultCode.Fail:
      case AjaxResultCode.Warning:
        kong.messageBox('warning',message || '服务异常')
        break;
      case AjaxResultCode.None:
        message&&kong.messageBox('info',message)
        break;
      case AjaxResultCode.Success:
        message&&kong.messageBox('success',message)
        break;
      default:
        kong.messageBox('success',message || '这是一个未能识别的提示信息，请检查接口信息')
        break;
    }
  }
}

const unWrapResponse=(nativeResponse: AxiosResponse): any=>{
  if(nativeResponse.data.feedback){
    return nativeResponse.data
  }

  if (typeof nativeResponse.data === "undefined") {
    nativeResponse.data = {};
  }

  let response: any;
  const { data } = nativeResponse;

  if(data && typeof(data.code)!=='undefined') 
  {
    response =data.code === AjaxResultCode.Success
    ? (data.data!==undefined?data.data:true)
    : (data.data!==undefined?data.data:false);
  }
  else
  {
    response = data
  }
  return response     
}

const responseProcess=(response: AxiosResponse<AjaxResult>,unWrapResponseFn:((ajaxResult: AjaxResult)=>any)|undefined=undefined):Promise<any> => {
  if (response.status === 200) {
    const {code} = response.data
    const resolveFn=(
      resolve: (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void,
      response: AxiosResponse<any, any>)=>{
       if(unWrapResponseFn)
        {
          resolve(unWrapResponseFn(response.data))
        }
        else
        {
          resolve(unWrapResponse(response))
        }
    }
    if(code===AjaxResultCode.InvalidToken){
      if(!requests.isRefreshing)
      {
        requests.isRefreshing=true
        return new Promise(resolve=>{
          refreshToken().then(async token=>{
              if (token) {
                kong.storeHook.saveToken(token)
                response.headers['Authorization'] = `Bearer ${token}`
                const newret =  await service(response.config)
                requests.listing.forEach((cb) => cb(token))
                requests.clear()
                resolve(newret)
              }
              else {
                throw new Error('refresh token is invalid')
              }
          }).catch(reason=>{
            requests.clear(true,reason)
          })
        }) 
      }
      else if(requests.isRefreshing){
        return Promise.reject("刷新令牌已失效")
      }
      return new Promise<any>(resolve=>{
        requests.listing.push(token=>{
            response.headers.Authorization = `${token}`
            service(response.config).then(real=>{
              resolveFn(resolve,real)
            })
        })
      })
    }
    tryPopMessage(response.data)
    return new Promise<any>(resolve=>resolveFn(resolve,response))
  } 
  else {
    showError(response)
    return Promise.reject(response)
  }
}

service.interceptors.response.use(responseProcess,
  (error: AxiosError)=> {
    const badMessage: any = error.message || error
    const code = parseInt(badMessage.toString().replace('Request failed with status code ', ''))
    showError({ status: code, message: badMessage })
    return Promise.reject(error)
  }
)

// 错误处理
function showError(error: any) {
  // token过期，清除本地数据，并跳转至登录页面
  if (error.status === 403||error.status === 401) {
    kong.storeHook.sinOut()
  } else {
    const {message} = error
    kong.messageBox('error',message || '服务异常')
  }
}

const request=<T=any>(config: AxiosRequestConfig): Promise<T>=>{
   return service(config) as any;
}
//获取响应体数据
const getBody=(xhr: XMLHttpRequest): AjaxResult|XMLHttpRequestResponseType => {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text as XMLHttpRequestResponseType
  }
  try {
    return JSON.parse(text) as AjaxResult
  } catch {
    return text as  XMLHttpRequestResponseType
  }
}
//获取包装好的响应内容
const getAxiosResponse=(xhr:XMLHttpRequest,config:InternalAxiosRequestConfig) : AxiosResponse<AjaxResult,InternalAxiosRequestConfig>=>
  {
    return {
      data: getBody(xhr) as AjaxResult,
      status: xhr.status,
      statusText: xhr.statusText,
      headers:config.headers,
      config,
      request: xhr,
    }
}

export {responseProcess,unWrapResponse,getAxiosResponse}
export default request
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import kConfig from './kconfig'
import {UploadRequestFactory,RequestFactory,ProgressComputing} from './lib'
import { AjaxResult, AxiosConfig, Optional } from './types'
import * as utils from './utils'
export {kConfig,UploadRequestFactory,RequestFactory,utils,ProgressComputing}

export default (axiosConfig:Optional<AxiosConfig>)=>{
    const facory = new RequestFactory(axiosConfig)
    const getAxiosResponse= (xhr: XMLHttpRequest, config: InternalAxiosRequestConfig)=>{return facory.getAxiosResponse(xhr,config)}
    const responseProcess= (response: AxiosResponse<AjaxResult>, unWrapResponseFn?: ((ajaxResult: AjaxResult) => any) | undefined)=>{ return facory.responseProcess(response,unWrapResponseFn)}
    const request=<T=any,D=any>(config: AxiosRequestConfig<D>)=>{
       return facory.request<T,D>(config)
    }
    return {getAxiosResponse,responseProcess,request}
}

export * from './types'
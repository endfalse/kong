import axios , { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AjaxResultCode } from '../enums/system'
import { AjaxResult, AxiosConfig, Optional } from '../types/index'
import kconfig from '../kconfig'
class RequestFactory{
    private service: AxiosInstance
    private get defaultInterceptor() {
        return (config: InternalAxiosRequestConfig<any>)=>{
            const token = this.config.token()
            // JWT鉴权处理
            if (token&&config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (config!=null&&config.data&&(config.method||'get').toLowerCase() === "get") {
                config.params = config.data
                delete config.data
            } 
            return config
        }
    }
    private config:AxiosConfig

    constructor(config:Optional<AxiosConfig>){
        this.config = kconfig
        for(const key in config){
            config[key]&&(this.config[key]=config[key])
        }
        this.service = axios.create({baseURL: this.config.baseUrl,timeout:this.config.timeout})
        // 请求前的统一处理
        this.service.interceptors.request.use(this.defaultInterceptor,
            (error: AxiosError) => {return Promise.reject(error)}
        )
        this.service.interceptors.response.use(this.responseProcess,
            (error: AxiosError)=> {
              const badMessage: any = error.message || error
              const code = parseInt(badMessage.toString().replace('Request failed with status code ', ''))
              this.showError({ status: code, message: badMessage })
              return Promise.reject(error)
            }
        )
    }

    private get requests(){
        const that =this
        return {
            isRefreshing:false,
            listing:[] as ((token:string)=>void)[],
            retry:0,
            clear(loginOut:boolean=false,reason:any|undefined=undefined){
                this.listing=[],
                this.isRefreshing =false,
                this.retry=0
                if(loginOut)
                {
                    that.config.signOut()
                }
                if(reason)
                {
                    Promise.reject(reason)
                }
            }
        }
    }

    private refreshToken = ()=>{
        if(this.requests.retry>0){
            throw new Error('refresh token is invalid')
        }
        return this.request<string>({
                url: this.config.refreshTokenApi,
                method: 'post',
                data:{refreshToken:this.config.refreshToken()}
        })
    }

    private tryPopMessage = (ajaxResult: AjaxResult)=>{
        if (typeof(ajaxResult.code)==='number'&& ajaxResult.message) {
          const {code,message} = ajaxResult
          switch (code) {
            case AjaxResultCode.Error:
                this.config.messageBox('error',message || '服务异常')
              break;
            case AjaxResultCode.Fail:
            case AjaxResultCode.Warning:
                this.config.messageBox('warning',message || '服务异常')
              break;
            case AjaxResultCode.None:
              message&&this.config.messageBox('info',message)
              break;
            case AjaxResultCode.Success:
              message&&this.config.messageBox('success',message)
              break;
            default:
                this.config.messageBox('success',message || '这是一个未能识别的提示信息，请检查接口信息')
              break;
          }
        }
    }
      
    // 错误处理
    private showError=(error: any) =>{
    // token过期，清除本地数据，并跳转至登录页面
    if (error.status === 403||error.status === 401) {
        this.config.signOut()
    } else {
      const {message} = error
      this.config.messageBox('error',message || '服务异常')
    }
    }

    //获取响应体数据
    private getBody=(xhr: XMLHttpRequest): AjaxResult|XMLHttpRequestResponseType => {
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

    public unWrapResponse = (nativeResponse: AxiosResponse): any =>{
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
      
    public responseProcess=(response: AxiosResponse<AjaxResult>,unWrapResponseFn:((ajaxResult: AjaxResult)=>any)|undefined=undefined):Promise<any> => {
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
                resolve(this.unWrapResponse(response))
              }
          }
          if(code===AjaxResultCode.InvalidToken){
            if(!this.requests.isRefreshing)
            {
                this.requests.isRefreshing=true
              return new Promise(resolve=>{
                this.refreshToken().then(async token=>{
                    if (token) {
                      this.config.saveToken(token)
                      response.headers['Authorization'] = `Bearer ${token}`
                      this.config.headerHook(response.headers)
                      const newret =  await this.service(response.config)
                      this.requests.listing.forEach((cb) => cb(token))
                      this.requests.clear()
                      resolve(newret)
                    }
                    else {
                      throw new Error('refresh token is invalid')
                    }
                }).catch(reason=>{
                    this.requests.clear(true,reason)
                })
              }) 
            }
            else if(this.requests.isRefreshing){
              return Promise.reject("刷新令牌已失效")
            }
            return new Promise<any>(resolve=>{
                this.requests.listing.push(token=>{
                  response.headers['Authorization'] = `Bearer ${token}`
                  this.config.headerHook(response.headers)
                  this.service(response.config).then(real=>{
                    resolveFn(resolve,real)
                  })
              })
            })
          }
          this.tryPopMessage(response.data)
          return new Promise<any>(resolve=>resolveFn(resolve,response))
        } 
        else {
            this.showError(response)
          return Promise.reject(response)
        }
    }

    //获取包装好的响应内容
    public getAxiosResponse=(xhr:XMLHttpRequest,config:InternalAxiosRequestConfig) : AxiosResponse<AjaxResult,InternalAxiosRequestConfig>=>
    {
        return {
            data: this.getBody(xhr) as AjaxResult,
            status: xhr.status,
            statusText: xhr.statusText,
            headers:config.headers,
            config,
            request: xhr,
        }
    }

    public get bigUploadApi(){
        return `${this.config.baseUrl}/file/uploadBig`
    }

    public get normalUploadApi(){
        return `${this.config.baseUrl}/file`
    }
    
    /**
     * @description 系统前端开发快速应用接口的能力，并提供标准的接口请求和响应处理
     * @author kongjing
     * @date 2022.10.12
     */
    public request=<T=any>(config: AxiosRequestConfig): Promise<T>=>{
        return this.service(config) as any;
    }
}

export default RequestFactory
# CORE
## 说明:
> 用于辅助前端开发的工具包
- 【RequestFactory】基于Axios封装的标准化前端请求模块
- 【UploadRequestFactory】提供Element-Plus组件upload分片上传或者WangEditor编辑器文件分片上传的标准化请求处理器，也可用于其他受支持的上传模块
- 【ProgressComputing】用于提供符合实际情况的进度值计算的工具，比如它可以借助Vue组件的onMounte 和 onUnmounted钩子函数实现页面需要多组件耗时加载的统一进度展示功能。
- 【utils】基本工具库，后期还将扩充

 ```getFileMd5``` 获取文件的MD5
 ```precision``` 精度控制
 ```debounce``` 防抖
 ```throttle``` 节流
## 使用
### 安装
``` shell
yarn add kongj@latest
```
OR
``` shell
npm install kongj@latest
```
### 定义配置文件 axiosConfig.ts
``` javascript
const config:AxiosConfig = {
    baseUrl: baseURL,
    timeout: 3000,
    bigUploadApi: '',
    normalUploadAPi: '',
    refreshTokenApi:'',
    headerHook: (headers) => {
        console.debug("尚未实现kconfig.api.headerHook",headers)
    },
    signOut: () => {
        store.dispatch('user/loginOut')
    },
    token: () => {
        return  store.state.user.token
    },
    refreshToken: () => {
        return store.state.user.refreshToken
    },
    saveToken: (token) => {
        store.commit('user/tokenChange',token)
    },
    uploadNotify: (e: { uid: string | number; message: string} ) => {
        mitter.emit('uploadNotify',e as any)
    },
    messageBox: (type,message) => {
        ElMessage({
            message: message || '服务异常',
            type: 'error',
            duration: 3 * 1000
        })
    },
    chunkSize: 1024 * 1024 * 1,
    merge: function (options: Optional<AxiosConfig>): void {
    }
}
export default config
```
### 定义用于api请求的文件 request.ts
``` javascript
import {baseUrl} from '@/config'
import {RequestFactory} from 'kongj'
import axiosConfig from '@/config/axiosConfig'
import { AxiosRequestConfig } from 'axios'
let baseURL: any = import.meta.env.VITE_BASE_URL
baseURL = baseURL=='/pro-api'?baseUrl:baseURL
const facory = new RequestFactory(axiosConfig)
export const getAxiosResponse= ()=>facory.getAxiosResponse
export const responseProcess= ()=>facory.responseProcess
const request=<T>(config: AxiosRequestConfig)=>{
   return facory.request()<T>(config)
}
export default request
```

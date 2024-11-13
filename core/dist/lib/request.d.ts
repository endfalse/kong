import { AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AjaxResult, AxiosConfig } from '../types/index';
declare class RequestFactory {
    service: AxiosInstance;
    private get defaultInterceptor();
    private config;
    constructor(config: AxiosConfig);
    private get requests();
    private refreshToken;
    private tryPopMessage;
    private showError;
    /**
     * @description 系统前端开发快速应用接口的能力，并提供标准的接口请求和响应处理
     * @author kongjing
     * @date 2022.10.12
     */
    private _request;
    private getBody;
    unWrapResponse(nativeResponse: AxiosResponse): any;
    responseProcess(response: AxiosResponse<AjaxResult>, unWrapResponseFn?: ((ajaxResult: AjaxResult) => any) | undefined): Promise<any>;
    getAxiosResponse(xhr: XMLHttpRequest, config: InternalAxiosRequestConfig): AxiosResponse<AjaxResult, InternalAxiosRequestConfig>;
    get bigUploadApi(): string;
    get normalUploadApi(): string;
    get request(): AxiosInstance;
}
export default RequestFactory;

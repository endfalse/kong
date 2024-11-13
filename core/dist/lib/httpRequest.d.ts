import { AxiosConfig } from "../types/index";
import { UploadRequestHandler, UploadRequestOptions } from "../types/upload";
type OptionType = Omit<UploadRequestOptions, 'data'> & {
    data: Record<string, string | Blob | [string | Blob, string]>;
    loaded?: number;
};
declare class HttpRequestFactory {
    private chunkSize;
    private uploadNotify;
    private request;
    constructor(config: AxiosConfig);
    create(): (option: OptionType) => Promise<UploadRequestHandler>;
    private getError;
    private isNil;
    private sliceFile;
    private nextProcess;
    private setHeaders;
    private uploadCore;
    /**
     * @description 提供文件上传的封装，使用与el-plus和编辑器文件上传等配置
     * @author kongjing
     * @date 2024.11.11
     * */
    private httpRequest;
}
export default HttpRequestFactory;

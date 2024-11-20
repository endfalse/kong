import { AxiosRequestHeaders, RawAxiosRequestHeaders } from "axios";
export interface UploadRequestOptions {
    action: string;
    method: string;
    data: Record<string, string | Blob | [Blob, string]>;
    filename: string;
    file: UploadRawFile;
    headers: RawAxiosRequestHeaders | AxiosRequestHeaders;
    onError: (evt: UploadAjaxError) => void;
    onProgress: (evt: UploadProgressEvent) => void;
    onSuccess: (response: any) => void;
    withCredentials: boolean;
}
export interface UploadRawFile extends File {
    uid: number;
}
export interface UploadAjaxError extends Error {
    name: string;
    status: number;
    method: string;
    url: string;
}
export interface UploadProgressEvent extends ProgressEvent {
    percent: number;
}
export type UploadRequestHandler = (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>;

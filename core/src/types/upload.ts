export interface UploadRequestOptions {
    action: string;
    method: string;
    data: Record<string, string | Blob | [Blob, string]>;
    filename: string;
    file: UploadRawFile;
    headers: Headers | Record<string, string | number | null | undefined>;
    onError: (evt: UploadAjaxError) => void;
    onProgress: (evt: UploadProgressEvent) => void;
    onSuccess: (response: any) => void;
    withCredentials: boolean;
}
export interface UploadRawFile extends File {
    uid: number;
}
export declare class UploadAjaxError extends Error {
    name: string;
    status: number;
    method: string;
    url: string;
    constructor(message: string, status: number, method: string, url: string);
}
export interface UploadProgressEvent extends ProgressEvent {
    percent: number;
}

export type UploadRequestHandler = (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>;


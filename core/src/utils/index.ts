import SparkMD5 from "spark-md5";

/**
 * 获取文件的MD5
 * 
*/
export const getFileMd5 = (file: File,callabck:(percent:number)=>void) => {
    return new Promise<string>((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        const chunkSize = 1*1024*1024; // 2MB的块大小，可以根据实际情况调整
        let chunksRead = 0;
        let totalChunks = Math.ceil(file.size / chunkSize);
        const readNextChunk = () => {
            const start = chunksRead * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const blob = file.slice(start, end);
            fileReader.readAsArrayBuffer(blob);
        }
        fileReader.onload = function (event) {
            if (event.target && event.target.result instanceof ArrayBuffer) {
                spark.append(event.target.result);
                chunksRead++;
                if (chunksRead < totalChunks) {
                    readNextChunk();
                    callabck(chunksRead*100/totalChunks)
                } else {
                  callabck(100)
                    resolve(spark.end());
                }
            } else {
                resolve('');
            }
        }
        fileReader.onerror = function (error) {
            reject(error);
        }
        readNextChunk();
    });
}

/**
* @description 精度控制
*/
export const precision = function(f: number, digit: number) {
    const m = Math.pow(10, digit)
    return parseInt((f * m).toString(), 10) / m
}
/**
* @description 防抖
*/
export const debounce = (fun:Function, span = 500) => {
    let handler = 0
    return (p:any|undefined=undefined) => {
      handler && clearTimeout(handler)
      handler = window.setTimeout(() => {
        fun.apply(this, [p])
      }, span)
    }
}
/**
* @description 节流：控制有节奏的触发操作
*/
export const throttle = (fn: Function, interval = 500) => {
    let last: number;
    let timer: number;
    interval = interval || 200;
    return (...args: any) => {
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
}
/**
 * 随机生成uuid
 * 
*/
export const generateUUID = ()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x'? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * 获取文件大小的文本表达
 * 
*/
export const formatFileSize = (bytes: number): string  =>{
    if (bytes === 0) return '0 KB';
    const units = ['KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    const value = bytes.toFixed(2);
    const parts = value.split('.');
    if (parts.length > 1 && parts[1].match(/^0*$/)) {
      return parts[0] + ' ' + units[i];
    } else {
      return value + ' ' + units[i];
    }
}
export type FileType='doc'|'ppt'|'excel'|'txt'|'csv'|'rar'|'zip'|'mp4'
/**
 * 判断是否是允许的文件类型
 * 
*/
export const checkIsAllowFileType=(filetype: string, allowedTypes:FileType[])=> {
    const typeMap = {
        'doc': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
        'ppt': ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'],
        'excel': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        'txt': ['text/plain'],
        'csv': ['text/csv'],
        'rar': ['application/x-rar-compressed'],
        'zip': ['application/zip'],
        'mp4': ['video/mp4']
    };
    const relevantMimeTypes:string[] = [];
    allowedTypes.forEach(type => {
        relevantMimeTypes.push(...typeMap[type]);
    });
    return relevantMimeTypes.includes(filetype);
}
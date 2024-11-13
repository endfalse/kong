var _this = this;
import SparkMD5 from "spark-md5";
/**
 * 获取文件的MD5
 *
*/
export var getFileMd5 = function (file, callabck) {
    return new Promise(function (resolve, reject) {
        var spark = new SparkMD5.ArrayBuffer();
        var fileReader = new FileReader();
        var chunkSize = 1 * 1024 * 1024; // 2MB的块大小，可以根据实际情况调整
        var chunksRead = 0;
        var totalChunks = Math.ceil(file.size / chunkSize);
        var readNextChunk = function () {
            var start = chunksRead * chunkSize;
            var end = Math.min(start + chunkSize, file.size);
            var blob = file.slice(start, end);
            fileReader.readAsArrayBuffer(blob);
        };
        fileReader.onload = function (event) {
            if (event.target && event.target.result instanceof ArrayBuffer) {
                spark.append(event.target.result);
                chunksRead++;
                if (chunksRead < totalChunks) {
                    readNextChunk();
                    callabck(chunksRead * 100 / totalChunks);
                }
                else {
                    callabck(100);
                    resolve(spark.end());
                }
            }
            else {
                resolve('');
            }
        };
        fileReader.onerror = function (error) {
            reject(error);
        };
        readNextChunk();
    });
};
/**
* @description 精度控制
*/
export var precision = function (f, digit) {
    var m = Math.pow(10, digit);
    return parseInt((f * m).toString(), 10) / m;
};
/**
* @description 防抖
*/
export var debounce = function (fun, span) {
    if (span === void 0) { span = 500; }
    var handler = 0;
    return function (p) {
        if (p === void 0) { p = undefined; }
        handler && clearTimeout(handler);
        handler = window.setTimeout(function () {
            fun.apply(_this, [p]);
        }, span);
    };
};
/**
* @description 节流：控制有节奏的触发操作
*/
export var throttle = function (fn, interval) {
    if (interval === void 0) { interval = 500; }
    var last;
    var timer;
    interval = interval || 200;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = window.setTimeout(function () {
                last = now;
                fn.apply(_this, args);
            }, interval);
        }
        else {
            last = now;
            fn.apply(_this, args);
        }
    };
};
/**
 * 随机生成uuid
 *
*/
export var generateUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
/**
 * 获取文件大小的文本表达
 *
*/
export var formatFileSize = function (bytes) {
    var _a;
    if (bytes === 0)
        return '0 KB';
    var units = ['KB', 'MB', 'GB', 'TB'];
    var i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    var value = bytes.toFixed(2);
    var parts = value.split('.');
    if (parts.length > 1 && ((_a = parts[1]) === null || _a === void 0 ? void 0 : _a.match(/^0*$/))) {
        return parts[0] + ' ' + units[i];
    }
    else {
        return value + ' ' + units[i];
    }
};
/**
 * 判断是否是允许的文件类型
 *
*/
export var checkIsAllowFileType = function (filetype, allowedTypes) {
    var typeMap = {
        'doc': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
        'ppt': ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'],
        'excel': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        'txt': ['text/plain'],
        'csv': ['text/csv'],
        'rar': ['application/x-rar-compressed'],
        'zip': ['application/zip'],
        'mp4': ['video/mp4']
    };
    var relevantMimeTypes = [];
    allowedTypes.forEach(function (type) {
        relevantMimeTypes.push.apply(relevantMimeTypes, typeMap[type]);
    });
    return relevantMimeTypes.includes(filetype);
};

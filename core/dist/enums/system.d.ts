/**
 * @description ajax 请求响应码
 */
export declare enum AjaxResultCode {
    /***
     * 默认
    */
    None = 1000,
    /***
     * 警告
    */
    Warning = 1001,
    /***
     * 操作成功
    */
    Success = 1002,
    /***
     * 发生错误
    */
    Error = 1003,
    /***
     * 操作失败
    */
    Fail = 1004,
    /***
     * 令牌失效
    */
    InvalidToken = 1005,
    /***
     * 尚未上传
    */
    unUpload = 1006,
    /**
     * 部分上传成功
    */
    uploadSuccessPart = 1007,
    /**
     * 秒传完成
    */
    uploadInstant = 1008
}
export declare enum ContentTypeEnum {
    JSON = "application/json;charset=UTF-8",
    TEXT = "text/plain;charset=UTF-8",
    XML = "application/xml;charset=UTF-8",
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    FORM_DATA = "multipart/form-data;charset=UTF-8"
}
/**
 * @description 业务操作时的返回类型
*/
export declare enum FeedbackEnum {
    /**
     * 处理成功
    */
    success = 1002,
    /**
     * 处理失败
    */
    failure = 1004,
    /**
     * 存在资源引用情况不可操作
    */
    hadReference = 100401,
    /**
     * 存在子节点情况不可操作
    */
    hadChildren = 100402
}
/**
 * @description 国际化语言类型
*/
export declare enum LocaleTypeEnum {
    /** 通用语言类型*/
    Common = 0,
    /** 系统语言类型*/
    System = 1,
    /** 菜单语言类型*/
    Menu = 2,
    /**
     * 当前系统业务语言类型
     */
    Product = 3
}

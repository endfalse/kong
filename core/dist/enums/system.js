/**
 * @description ajax 请求响应码
 */
export var AjaxResultCode;
(function (AjaxResultCode) {
    /***
     * 默认
    */
    AjaxResultCode[AjaxResultCode["None"] = 1000] = "None";
    /***
     * 警告
    */
    AjaxResultCode[AjaxResultCode["Warning"] = 1001] = "Warning";
    /***
     * 操作成功
    */
    AjaxResultCode[AjaxResultCode["Success"] = 1002] = "Success";
    /***
     * 发生错误
    */
    AjaxResultCode[AjaxResultCode["Error"] = 1003] = "Error";
    /***
     * 操作失败
    */
    AjaxResultCode[AjaxResultCode["Fail"] = 1004] = "Fail";
    /***
     * 令牌失效
    */
    AjaxResultCode[AjaxResultCode["InvalidToken"] = 1005] = "InvalidToken";
    /***
     * 尚未上传
    */
    AjaxResultCode[AjaxResultCode["unUpload"] = 1006] = "unUpload";
    /**
     * 部分上传成功
    */
    AjaxResultCode[AjaxResultCode["uploadSuccessPart"] = 1007] = "uploadSuccessPart";
    /**
     * 秒传完成
    */
    AjaxResultCode[AjaxResultCode["uploadInstant"] = 1008] = "uploadInstant";
})(AjaxResultCode || (AjaxResultCode = {}));
// 常用的contentTyp类型
export var ContentTypeEnum;
(function (ContentTypeEnum) {
    // json
    ContentTypeEnum["JSON"] = "application/json;charset=UTF-8";
    // text
    ContentTypeEnum["TEXT"] = "text/plain;charset=UTF-8";
    // xml
    ContentTypeEnum["XML"] = "application/xml;charset=UTF-8";
    // application/x-www-form-urlencoded 一般配合qs
    ContentTypeEnum["FORM_URLENCODED"] = "application/x-www-form-urlencoded;charset=UTF-8";
    // form-data  上传
    ContentTypeEnum["FORM_DATA"] = "multipart/form-data;charset=UTF-8";
})(ContentTypeEnum || (ContentTypeEnum = {}));
/**
 * @description 业务操作时的返回类型
*/
export var FeedbackEnum;
(function (FeedbackEnum) {
    /**
     * 处理成功
    */
    FeedbackEnum[FeedbackEnum["success"] = 1002] = "success";
    /**
     * 处理失败
    */
    FeedbackEnum[FeedbackEnum["failure"] = 1004] = "failure";
    /**
     * 存在资源引用情况不可操作
    */
    FeedbackEnum[FeedbackEnum["hadReference"] = 100401] = "hadReference";
    /**
     * 存在子节点情况不可操作
    */
    FeedbackEnum[FeedbackEnum["hadChildren"] = 100402] = "hadChildren";
})(FeedbackEnum || (FeedbackEnum = {}));
/**
 * @description 国际化语言类型
*/
export var LocaleTypeEnum;
(function (LocaleTypeEnum) {
    /** 通用语言类型*/
    LocaleTypeEnum[LocaleTypeEnum["Common"] = 0] = "Common";
    /** 系统语言类型*/
    LocaleTypeEnum[LocaleTypeEnum["System"] = 1] = "System";
    /** 菜单语言类型*/
    LocaleTypeEnum[LocaleTypeEnum["Menu"] = 2] = "Menu";
    /**
     * 当前系统业务语言类型
     */
    LocaleTypeEnum[LocaleTypeEnum["Product"] = 3] = "Product";
})(LocaleTypeEnum || (LocaleTypeEnum = {}));

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios, { AxiosError } from 'axios';
import { AjaxResultCode } from '../enums/system';
import kconfig from '../kconfig';
var RequestFactory = /** @class */ (function () {
    function RequestFactory(config) {
        var _this = this;
        this.refreshToken = function () {
            if (_this.requests.retry > 0) {
                throw new Error('refresh token is invalid');
            }
            return _this.request({
                url: _this.config.refreshTokenApi,
                method: 'post',
                data: { refreshToken: _this.config.refreshToken() }
            });
        };
        this.tryPopMessage = function (ajaxResult) {
            if (typeof (ajaxResult.code) === 'number' && ajaxResult.message) {
                var code = ajaxResult.code, message = ajaxResult.message;
                switch (code) {
                    case AjaxResultCode.Error:
                        _this.config.messageBox('error', message || '服务异常');
                        break;
                    case AjaxResultCode.Fail:
                    case AjaxResultCode.Warning:
                        _this.config.messageBox('warning', message || '服务异常');
                        break;
                    case AjaxResultCode.None:
                        message && _this.config.messageBox('info', message);
                        break;
                    case AjaxResultCode.Success:
                        message && _this.config.messageBox('success', message);
                        break;
                    default:
                        _this.config.messageBox('error', message || "\u672A\u80FD\u8BC6\u522Bcode:".concat(code, "\uFF0C\u8BF7\u68C0\u67E5\u63A5\u53E3"));
                        break;
                }
            }
        };
        // 错误处理
        this.showError = function (error) {
            var _a;
            if (error instanceof AxiosError) {
                if (_this.isAjaxResult((_a = error.response) === null || _a === void 0 ? void 0 : _a.data)) {
                    _this.tryPopMessage(error.response.data);
                }
                else {
                    var badMessage = error.message || error;
                    _this.config.messageBox('error', badMessage || '服务异常');
                }
                // token过期，清除本地数据，并跳转至登录页面
                if (error.status === 403 || error.status === 401) {
                    setTimeout(function () {
                        _this.config.signOut();
                    }, 3000);
                }
            }
            else {
                _this.tryPopMessage(error.data);
            }
        };
        //获取响应体数据
        this.getBody = function (xhr) {
            var text = xhr.responseText || xhr.response;
            if (!text) {
                return text;
            }
            try {
                return JSON.parse(text);
            }
            catch (_a) {
                return text;
            }
        };
        this.unWrapResponse = function (nativeResponse) {
            if (nativeResponse.data.feedback) {
                return nativeResponse.data;
            }
            if (typeof nativeResponse.data === "undefined") {
                nativeResponse.data = {};
            }
            var response;
            var data = nativeResponse.data;
            if (data && typeof (data.code) !== 'undefined') {
                response = data.code === AjaxResultCode.Success
                    ? (data.data !== undefined ? data.data : true)
                    : (data.data !== undefined ? data.data : false);
            }
            else {
                response = data;
            }
            return response;
        };
        this.responseProcess = function (response, unWrapResponseFn) {
            if (unWrapResponseFn === void 0) { unWrapResponseFn = undefined; }
            if (response.status === 200) {
                var code = response.data.code;
                var resolveFn_1 = function (resolve, response) {
                    if (unWrapResponseFn) {
                        resolve(unWrapResponseFn(response.data));
                    }
                    else {
                        resolve(_this.unWrapResponse(response));
                    }
                };
                if (code === AjaxResultCode.InvalidToken) {
                    if (!_this.requests.isRefreshing) {
                        _this.requests.isRefreshing = true;
                        return new Promise(function (resolve) {
                            _this.refreshToken().then(function (token) { return __awaiter(_this, void 0, void 0, function () {
                                var newret;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!token) return [3 /*break*/, 2];
                                            this.config.saveToken(token);
                                            this.config.headerHook(response.headers);
                                            return [4 /*yield*/, this.service(response.config)];
                                        case 1:
                                            newret = _a.sent();
                                            this.requests.listing.forEach(function (cb) { return cb(token); });
                                            this.requests.clear();
                                            resolve(newret);
                                            return [3 /*break*/, 3];
                                        case 2: throw new Error('refresh token is invalid');
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }).catch(function (reason) {
                                _this.requests.clear(true, reason);
                            });
                        });
                    }
                    // else if(this.requests.isRefreshing)
                    // {
                    //   return Promise.reject("刷新令牌已失效")
                    // }
                    return new Promise(function (resolve) {
                        _this.requests.listing.push(function (_) {
                            //response.headers['Authorization'] = `Bearer ${token}`
                            _this.config.headerHook(response.headers);
                            _this.service(response.config).then(function (real) {
                                resolveFn_1(resolve, real);
                            });
                        });
                    });
                }
                _this.tryPopMessage(response.data);
                return new Promise(function (resolve) { return resolveFn_1(resolve, response); });
            }
            else {
                _this.showError(response);
                return Promise.reject(response);
            }
        };
        //获取包装好的响应内容
        this.getAxiosResponse = function (xhr, config) {
            return {
                data: _this.getBody(xhr),
                status: xhr.status,
                statusText: xhr.statusText,
                headers: config.headers,
                config: config,
                request: xhr,
            };
        };
        /**
         * @description 系统前端开发快速应用接口的能力，并提供标准的接口请求和响应处理
         * @author kongjing
         * @date 2022.10.12
         */
        this.request = function (config) {
            return _this.service(config);
        };
        this.config = kconfig;
        for (var key in config) {
            config[key] && (this.config[key] = config[key]);
        }
        this.service = axios.create({ baseURL: this.config.baseUrl, timeout: this.config.timeout });
        // 请求前的统一处理
        this.service.interceptors.request.use(this.defaultInterceptor, function (error) { return Promise.reject(error); });
        this.service.interceptors.response.use(this.responseProcess, function (error) {
            _this.showError(error);
            return Promise.reject(error);
        });
    }
    Object.defineProperty(RequestFactory.prototype, "defaultInterceptor", {
        get: function () {
            var _this = this;
            return function (config) {
                var token = _this.config.token();
                // JWT鉴权处理
                if (token && config.headers) {
                    config.headers.Authorization = "Bearer ".concat(token);
                }
                if (config != null && config.data && (config.method || 'get').toLowerCase() === "get") {
                    config.params = config.data;
                    delete config.data;
                }
                return config;
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestFactory.prototype, "axiosConfig", {
        get: function () {
            return this.config;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestFactory.prototype, "requests", {
        get: function () {
            var that = this;
            return {
                isRefreshing: false,
                listing: [],
                retry: 0,
                clear: function (loginOut, reason) {
                    if (loginOut === void 0) { loginOut = false; }
                    if (reason === void 0) { reason = undefined; }
                    this.listing = [],
                        this.isRefreshing = false,
                        this.retry = 0;
                    if (loginOut) {
                        that.config.signOut();
                    }
                    if (reason) {
                        Promise.reject(reason);
                    }
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    RequestFactory.prototype.isAjaxResult = function (ajaxResult) {
        return ajaxResult && typeof ajaxResult === 'object' && 'code' in ajaxResult;
    };
    Object.defineProperty(RequestFactory.prototype, "bigUploadApi", {
        get: function () {
            return this.config.bigUploadApi;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestFactory.prototype, "normalUploadApi", {
        get: function () {
            return this.config.normalUploadApi;
        },
        enumerable: false,
        configurable: true
    });
    return RequestFactory;
}());
export default RequestFactory;

import kConfig from './kconfig';
import { UploadRequestFactory, RequestFactory, ProgressComputing } from './lib';
import * as utils from './utils';
export { kConfig, UploadRequestFactory, RequestFactory, utils, ProgressComputing };
export default (function (axiosConfig) {
    var facory = new RequestFactory(axiosConfig);
    var getAxiosResponse = function (xhr, config) { return facory.getAxiosResponse(xhr, config); };
    var responseProcess = function (response, unWrapResponseFn) { return facory.responseProcess(response, unWrapResponseFn); };
    var request = function (config) {
        return facory.request(config);
    };
    return { getAxiosResponse: getAxiosResponse, responseProcess: responseProcess, request: request };
});

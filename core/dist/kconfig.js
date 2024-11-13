var config = {
    baseUrl: 'https://j.jq123.net',
    timeout: 3000,
    bigUploadApi: '',
    normalUploadApi: '',
    refreshTokenApi: 'system/user/refreshToken',
    headerHook: function () {
        console.debug("尚未实现kconfig.api.headerHook");
    },
    signOut: function () {
        throw new Error("请实现此Hook->sinOut");
    },
    token: function () {
        return '---token---';
    },
    refreshToken: function () {
        return '---refreshToken---';
    },
    saveToken: function () {
        throw new Error("请实现此Hook->saveToken");
    },
    uploadNotify: function (e) {
        console.info('kconfig.uploadHook.uploadNotify->e:%o', e);
    },
    messageBox: function () {
        throw new Error("kconfig.ts尚未实现:messageBox(type:'error'|'success'|'warning'|'info',message:string)");
    },
    chunkSize: 1024 * 1024 * 1,
    merge: function (options) {
        for (var key in options) {
            this[key] = options[key];
        }
    }
};
export default config;

import path from 'path';
import fs from 'fs';
/**
 * @description 配置
 * @author kongjing
 * @date 2024.11.12
*/
// const loadConfig =  () => {
//     const userConfigPath = path.join(__dirname, 'kConfig.ts');
//     console.log('userConfigPath:', userConfigPath);
//     //const configModule = await import(userConfigPath);
//     const configModule = require(userConfigPath)
//     return configModule.default as KongConfig;
// }
//const kConfig =(()=>loadConfig() as KongConfig)()
//export default kConfig
const CONFIG_FILE_NAME = 'kconfig.ts';
let cachedConfig;
const loadConfigFromProjectRoot = () => {
    if (cachedConfig) {
        return cachedConfig;
    }
    let currentDir = __dirname;
    let configPath;
    while (currentDir !== '/' && !configPath) {
        const possibleConfigPath = path.join(currentDir, CONFIG_FILE_NAME);
        if (fs.existsSync(possibleConfigPath)) {
            configPath = possibleConfigPath;
        }
        else {
            currentDir = path.dirname(currentDir);
        }
    }
    if (configPath) {
        // 对于kconfig.ts文件，可能需要进行转译等处理才能正确加载
        // 这里可以根据实际情况选择合适的方法，比如使用ts - node等工具进行临时转译加载
        // 以下是一种简单的假设它可以直接被TypeScript的模块加载机制处理的情况
        cachedConfig = require(configPath).default;
        return cachedConfig;
    }
    else {
        throw new Error(`无法在项目根目录找到配置文件 ${CONFIG_FILE_NAME}`);
    }
};
export default loadConfigFromProjectRoot();

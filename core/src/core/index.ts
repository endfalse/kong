import path from 'path'
import { KongConfig } from '../types/index.ts';
async function loadConfig(): Promise<KongConfig> {
    const userConfigPath = path.join(__dirname, 'king.ts');
    const configModule = await import(userConfigPath);
    return configModule.default as KongConfig;
}

export const kong: KongConfig = await loadConfig()
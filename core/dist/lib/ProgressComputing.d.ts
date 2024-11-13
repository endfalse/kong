/**
 * @description 此模块可以结合组件加载和卸载实现进度条播放值的计算
 * @author kongjing
 * @date 2024.11.11
 *
*/
export default class ProgressComputing {
    private loading;
    private growthRate;
    private ms;
    private complete;
    private deviation;
    constructor(growthRate: number, deviation: number, ms: number);
    recordComponent(uid: string, total: number): void;
    finishComponent(uid: string): void;
    private getNextUid;
    private boundedFunction;
    aniamteStart(uid: string): void;
    get percentage(): number;
}

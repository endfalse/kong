/**
 * @description 此模块可以结合组件加载和卸载实现进度条播放值的计算
 * @author kongjing
 * @date 2024.11.11
 *
*/
var ProgressComputing = /** @class */ (function () {
    function ProgressComputing(growthRate, deviation, ms) {
        this.loading = { finished: [], complete: [], index: 0, listing: [] };
        this.complete = false;
        this.growthRate = growthRate || 0.2;
        this.ms = ms || 300;
        this.deviation = deviation || 0.5;
    }
    ProgressComputing.prototype.recordComponent = function (uid, total) {
        if (this.complete)
            return;
        this.loading.index = 0;
        this.loading.listing.push({ uid: uid, total: total || 1000, loaded: 0, increaseX: 0 });
    };
    ProgressComputing.prototype.finishComponent = function (uid) {
        if (this.complete)
            return;
        this.loading.finished.push(uid);
    };
    ProgressComputing.prototype.getNextUid = function () {
        var _this = this;
        var _a;
        if (this.loading.finished.length > 0) {
            var mathuid_1 = this.loading.finished.filter(function (p) { return !_this.loading.complete.includes(p); });
            if (mathuid_1 && mathuid_1.length > 0) {
                this.growthRate = 1;
                this.loading.index = this.loading.finished.findIndex(function (p) { return p == mathuid_1[0]; });
                return this.loading.finished[this.loading.index];
            }
        }
        else {
            var nextIndex = this.loading.index + 1;
            var nextUid = (_a = this.loading.listing[nextIndex]) === null || _a === void 0 ? void 0 : _a.uid;
            return nextUid;
        }
        return '';
    };
    ProgressComputing.prototype.boundedFunction = function (x, maxValue, growthRate) {
        return maxValue * (1 - Math.exp(-growthRate * x));
    };
    ProgressComputing.prototype.aniamteStart = function (uid) {
        var _this = this;
        if (this.complete)
            return;
        var current = this.loading.listing.find(function (p) { return p.uid == uid; });
        if (!current)
            return;
        var loaded = current.loaded, total = current.total;
        console.log(loaded);
        if (Math.abs(loaded - total) < this.deviation) {
            current.loaded = total;
            this.loading.complete.push(uid);
            var nextUid = this.getNextUid();
            nextUid && this.aniamteStart(nextUid);
        }
        else {
            setTimeout(function () {
                current.loaded = _this.boundedFunction(current.increaseX++, total, _this.growthRate);
                _this.aniamteStart(uid);
            }, this.ms);
        }
    };
    Object.defineProperty(ProgressComputing.prototype, "percentage", {
        // public start(uid:string){
        //     const innerFn=(uid:string)=>{
        //         window.requestAnimationFrame(()=>{
        //             if(this.complete) return
        //             const current = this.loading.listing.find(p=>p.uid==uid)
        //             if(!current) return
        //             const {loaded,total} = current
        //             console.log(loaded)
        //             if(Math.abs(loaded-total)<this.deviation){
        //                 current.loaded = total
        //                 this.loading.complete.push(uid)
        //                 const nextUid = this.getNextUid()
        //                 nextUid&&innerFn(nextUid)
        //             }
        //             else{
        //                 current.loaded = this.boundedFunction(current.increaseX++,total,this.growthRate)
        //                 innerFn(uid)
        //             }
        //         })
        //     }
        //     innerFn(uid)
        // }
        get: function () {
            var total = Object.values(this.loading.listing).reduce(function (prev, current) {
                return prev + current.total;
            }, 0);
            if (total <= 0)
                return 0;
            var currentLoaded = Object.values(this.loading.listing).reduce(function (prev, current) {
                return prev + current.loaded;
            }, 0);
            var pg = parseInt((currentLoaded * 100 / total).toString());
            this.complete = pg == 100;
            return pg;
        },
        enumerable: false,
        configurable: true
    });
    return ProgressComputing;
}());
export default ProgressComputing;

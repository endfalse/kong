/**
 * @description 此模块可以结合组件加载和卸载实现进度条播放值的计算
 * @author kongjing
 * @date 2024.11.11
 * 
*/
export default class ProgressComputing{
    private loading:{
        index:number;
        finished:string[],
        complete:string[],
        listing: Array<{uid:string;loaded:number;total:number;increaseX:0}>
    }={finished:[],complete:[],index:0,listing:[]}
    private growthRate:number
    private ms:number
    private complete =false
    private deviation;
    constructor(growthRate:number,deviation:number,ms:number){
        this.growthRate =growthRate||0.2
        this.ms = ms||300
        this.deviation = deviation||0.5
    }

    public recordComponent(uid:string,total:number){
        if(this.complete) return
        this.loading.index = 0
        this.loading.listing.push({uid,total:total||1000,loaded:0,increaseX:0})
    }

    public finishComponent(uid:string) {
        if(this.complete) return
        this.loading.finished.push(uid)
    }

    private getNextUid(){
        
        if(this.loading.finished.length>0){
            const mathuid = this.loading.finished.filter(p=>!this.loading.complete.includes(p))
            if(mathuid&&mathuid.length>0)
            {
                this.growthRate = 1
                this.loading.index = this.loading.finished.findIndex(p=>p==mathuid[0])
                return this.loading.finished[this.loading.index]
            }
        }
        else
        {
            const nextIndex = this.loading.index+1
            const nextUid = this.loading.listing[nextIndex]?.uid
            return nextUid
        }
        return ''
    }
    
    private boundedFunction(x:number, maxValue:number,growthRate:number) {
       
        return maxValue * (1 - Math.exp(-growthRate * x));
    }

    public aniamteStart(uid:string){
        if(this.complete) return
        const current = this.loading.listing.find(p=>p.uid==uid)
        if(!current) return
        const {loaded,total} = current
        console.log(loaded)
        if(Math.abs(loaded-total)<this.deviation){
            current.loaded = total
            this.loading.complete.push(uid)
            const nextUid = this.getNextUid()
            nextUid&&this.aniamteStart(nextUid)
        }
        else{
            setTimeout(() => {
                current.loaded = this.boundedFunction(current.increaseX++,total,this.growthRate)
                this.aniamteStart(uid)
            }, this.ms);
        }
    }
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
    public get percentage(){
        const total = Object.values(this.loading.listing).reduce((prev,current)=>{
            return prev+current.total
        },0)
        if(total<=0) return 0
        const currentLoaded =  Object.values(this.loading.listing).reduce((prev,current)=>{
            return prev+current.loaded
        },0)
        const pg= parseInt((currentLoaded*100/total).toString())
        this.complete = pg==100
        return pg;
    }
}
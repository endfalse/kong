import loadConfig,{kConfig} from '../index'
loadConfig({
    api:{
         baseUrl:'http://j.jq123.net',
         timeout:3000,
         bigUploadApi:'',
         normalUploadAPi:'',
         headerHook:()=>{
             console.debug("尚未实现kconfig.api.headerHook")
         }
    },
    storeHook:{
         sinOut:()=>{
             console.debug("请实现此Hook->sinOut")
         },
         token:()=>{
             return '---token---'
           },
         refreshToken:()=>{
            return '---refreshToken---'
         },
         saveToken:()=>{
             console.debug("请实现此Hook->saveToken")
         }
    },
    messageBox:()=>{
       console.debug("kconfig.ts尚未实现:messageBox(type:'error'|'success'|'warning'|'info',message:string)")
    },
    uploadHook: {
       uploadNotify:(e:{uid:string|number,message:string})=>{
         console.info('kconfig.uploadHook.uploadNotify->e:%o',e)
       }
    }
 })
test("get the prefix url of api", () => {
    expect(kConfig.api.baseUrl).toBeDefined()
});
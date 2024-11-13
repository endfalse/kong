import { KongConfig } from "kongj/types";
const config:KongConfig={
   api:{
        baseUrl:'https://j.jq123.net',
        timeout:3000,
        bigUploadApi:'',
        normalUploadAPi:'',
        headerHook:()=>{
            console.debug("尚未实现kconfig.api.headerHook")
        }
   },
   storeHook:{
        sinOut:()=>{
            throw new Error("请实现此Hook->sinOut")
        },
        token:()=>{
            return '---token---'
          },
        refreshToken:()=>{
           return '---refreshToken---'
        },
        saveToken:()=>{
            throw new Error("请实现此Hook->saveToken")
        }
   },
   messageBox:()=>{
      throw new Error("kconfig.ts尚未实现:messageBox(type:'error'|'success'|'warning'|'info',message:string)")
   },
   uploadHook: {
      uploadNotify:(e:{uid:string|number,message:string})=>{
        console.info('kconfig.uploadHook.uploadNotify->e:%o',e)
      }
   }
   
}
export default config
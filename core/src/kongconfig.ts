import { KongConfig } from "./types";
const config:KongConfig={
   api:{
        baseUrl:'',
        timeout:3000,
        bigUploadApi:'',
        normalUploadAPi:''
   },
   store:{
        sinOut:()=>{

        },
        token:()=>{
            return ''
          },
        refreshToken:()=>{
           return ''
        },
        saveToken:(token:string)=>{

        }
   },
   messageBox:(type:'error'|'success'|'warning'|'info',message:string)=>{

   },
   uploadHook: {
      uploadNotify:(e:{uid:string|number,message:string})=>{

      }
   }
   
}
export default config
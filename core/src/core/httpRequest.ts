import { AjaxResult } from "../types"
import { AjaxResultCode } from "../enums/system"
import { getAxiosResponse, responseProcess } from "./request"
import { getFileMd5 } from "../utils"
import { UploadAjaxError, UploadProgressEvent, UploadRequestHandler, UploadRequestOptions } from "../types/upload"
import {kong} from '../core';

type OptionType = Omit<UploadRequestOptions,'data'>&{
  data: Record<string, string | Blob | [string | Blob, string]>,
  loaded?: number
}
class ElementPlusError extends Error {
  constructor(m: string) {
    super(m)
    this.name = "ElementPlusError"
  }
}
//默认文件分片上传大小
const chunkSize:number = 1024 * 1024 * 1
const getError = (
        action: string,
        option: OptionType,
        xhr: XMLHttpRequest
      ) =>{
        let msg: string
        if (xhr.response) {
          msg = `${xhr.response.error || xhr.response}`
        } else if (xhr.responseText) {
          msg = `${xhr.responseText}`
        } else {
          msg = `fail to ${option.method} ${action} ${xhr.status}`
        }
      
        return new UploadAjaxError(msg, xhr.status, option.method, action)
}

//文件切片
const sliceFile = (file:File, chunkSize = 1024 * 1024 * 2) => {
  const chunks:Blob[] = [];
  let start = 0;
  let end;
  while (start < file.size) {
      end = Math.min(start + chunkSize, file.size);
      chunks.push(file.slice(start, end));
      start = end;
  }
  return chunks;
}

//下一步响应处理兼容本框架异步axos封装逻辑
const nextProcess =async (xhr:XMLHttpRequest,option:OptionType,uploadIfNot:((uploadedMap:string[])=>void)|undefined =undefined):Promise<AjaxResult|undefined>=>{
  const response =  getAxiosResponse(xhr,option as any)
  const unwapperFun=(ajaxResult: AjaxResult) =>{
    if(typeof(ajaxResult.code)==='undefined'){
       throw new Error('返回的数据格式错误')
    }
    if(ajaxResult.code == AjaxResultCode.uploadInstant){
      console.log('已存在：秒传成功!')
      option.loaded=option.file.size
      option.onProgress({percent:100,message:ajaxResult.message} as any)
      const ret ={code:AjaxResultCode.uploadInstant,data:ajaxResult.data,message:ajaxResult.message}
      option.onSuccess(ret)
      return ret
    }
    else if (ajaxResult.code == AjaxResultCode.Success) {
      option.onProgress({percent:100,message:ajaxResult.message} as any)
      const ret ={code:AjaxResultCode.Success,data:ajaxResult.data,message:ajaxResult.message}
      option.onSuccess(ret)
      return ret
    }
    else if(ajaxResult.code == AjaxResultCode.uploadSuccessPart){
      uploadIfNot&&uploadIfNot(ajaxResult.data?ajaxResult.data.split(''):[])
    }
    else if(ajaxResult.code === AjaxResultCode.unUpload)
    {
       console.log('未上传此文件，开始全新上传')
       uploadIfNot&&uploadIfNot([])
    }
  }
  return await responseProcess(response,unwapperFun)
}
const setHeaders=(xhr:XMLHttpRequest,headers:Headers | Record<string, string | number | null | undefined>,withCredentials:boolean)=>{
    xhr.withCredentials = withCredentials
  headers = headers || {}
  if (headers instanceof Headers) {
      headers.forEach((value, key) => xhr.setRequestHeader(key, value))
  } 
  else {
      for (const [key, value] of Object.entries(headers)) {
        if (isNil(value)) continue
        xhr.setRequestHeader(key, String(value))
      }
  }
}
//执行文件分片上传
const uploadCore=(md5:string, option:OptionType, uploadedMap:string[])=>{
  return new Promise<boolean>(resolve=>{
      const fileslices = sliceFile(option.file,chunkSize);
      let currentIndex =0
      const xhr = new XMLHttpRequest()
      xhr.addEventListener('load', async () => {
        const ret = await nextProcess(xhr,option)
        if(!!ret&&(ret.code === AjaxResultCode.uploadInstant||ret.code === AjaxResultCode.Success))
        {
          resolve(true)
        }
        currentIndex++
        sendAjax()
      })
      xhr.addEventListener('error', () => 
        getError(option.action, option as UploadRequestOptions, xhr)
      )
      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
      }
      setHeaders(xhr,option.headers,option.withCredentials && 'withCredentials' in xhr)
      let lastIndex = uploadedMap.lastIndexOf('1')
      lastIndex = lastIndex==-1?fileslices.length-1:lastIndex
      const sendAjax=()=>{
        while(currentIndex<fileslices.length){
          const blob =  fileslices[currentIndex]
          const unUploaded = uploadedMap[currentIndex]!=='1'
          if(unUploaded){
            let data = new FormData();
            data.append("totalNumber", fileslices.length.toString())
            data.append("chunkSize", chunkSize.toString())
            data.append("chunkNumber", currentIndex.toString())
            data.append("md5", md5)
            const file = new File([blob],option.file.name)
            data.append("file",file ,option.file.name)
            //原始表单额外数据尚未添加
            //if(lastIndex===currentIndex){
              if (option.data) {
                for (const [key, value] of Object.entries(option.data)) {
                  if(key==='md5') continue
                  if (Array.isArray(value) && value.length) data.append(key, (value as any))
                  else data.append(key, value)
                }
              }
            //}
            xhr.open(option.method,option.action, true)
            xhr.send(data)
          }
          option.loaded=(option.loaded||0) + blob.size
          const progressEvt:UploadProgressEvent={} as any;
          progressEvt.percent = option.file.size > 0 ? (option.loaded / option.file.size) * 100 : 0
          progressEvt.percent=progressEvt.percent>=100?100:progressEvt.percent
          option.onProgress(progressEvt)
          if(!unUploaded){
            currentIndex++
            continue
          }
          break
        }
      }
      sendAjax()
  })
}

function isNil(value: string | number | null | undefined) {
  return value === null || value === undefined || isNaN(value as any);
}

//el-upload 上传逻辑
const httpRequest:UploadRequestHandler= async (option:OptionType) =>{
  if (typeof XMLHttpRequest === 'undefined'){
      throw new ElementPlusError(`[XMLHttpRequest is undefined`)
  }
  kong.uploadHook.uploadNotify({uid:option.file.uid,message:'正在计算中...'})
  const md5 =  await getFileMd5(option.file,(percent)=>{
    kong.uploadHook.uploadNotify({uid:option.file.uid,message:`正在计算中...${percent.toFixed(0)}%`})
  })
  /***
   * 当为Promise时elupload内部将根据resolve调用一次onSucces，
   * 当前封装的上传逻辑不需要本次默认的调用而是需要根据其内部异步处理逻辑更具处理进度情况调用
   * by kongj 2024.0913
  **/
  return new Promise(_=>{
    const xhr = new XMLHttpRequest()
    setHeaders(xhr,option.headers,true)
    var urlParams = new URLSearchParams()
    urlParams.append("title",option.file.name)
    urlParams.append("md5",md5)
    if (option.data) {
      for (const [key, value] of Object.entries(option.data)) {
        if (Array.isArray(value) && value.length) urlParams.append(key, (value as any))
        else urlParams.append(key, value as string)
      }
    }
    kong.uploadHook.uploadNotify({uid:option.file.uid,message:'稍等，正在上传中...'})
    xhr.addEventListener('load',async ()=>{
      const result = await nextProcess(xhr,option,async (uploadedMap)=>{
        option.loaded=0
        //非秒传文件时进行分片上传-如果文件较小同样适用分片逻辑
        const complete =await uploadCore(md5,option,uploadedMap)
        complete&&kong.uploadHook.uploadNotify({uid:option.file.uid,message:''})
      })
      if(result&&result.code==AjaxResultCode.uploadInstant){
        kong.uploadHook.uploadNotify({uid:option.file.uid,message:''})
      }
    })
    xhr.addEventListener('error', () => {
      option.onError(getError(option.action, option, xhr))
    }) 
    xhr.open('get',`${option.action}/preCheck?${urlParams.toString()}`,true)
    xhr.send(urlParams)
  })
}

export default httpRequest
/*
 * @Author: your name
 * @Date: 2020-08-06 18:17:28
 * @LastEditTime: 2020-08-06 18:21:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\components\flowCom\drawCanvas.d.ts
 */
export interface textProps {
    rectCfg: any,
    ctx: any,
    x: any,
    y: any,
    title?: any,
    active?: any
}
export interface selectProps {
    ctx: any,
    sx: any,
    sy: any,
    x: any,
    y: any
}

export interface rectProps {
    corner?: any,
    rectCfg: any,
    ctx: any,
    x: any,
    y: any,
    title?: any,
    active?: any
}
export interface triangleProps {
    lineCfg: any,
    rectCfg: any,
    ctx: any,
    sy: any,
    x: any,
    y: any,
    active?: any
}

export interface lineProps {
    lineCfg: any,
    rectCfg: any,
    ctx: any,
    sx: any,
    sy: any,
    x: any,
    y: any,
    active?: any
}
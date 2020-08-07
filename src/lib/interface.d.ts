/*
 * @Author: your name
 * @Date: 2020-08-06 10:50:12
 * @LastEditTime: 2020-08-07 13:59:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\components\flowCom\index.d.ts
 */
export interface FlowProps {
    selectedKeys: itemKey[],
    rectConfig?: rectCofig,
    lineCofig?: lineCofig,
    mode?: string,
    onEdit?: (val: any) => void
    onChange?: (val: itemKey[]) => void
}
export interface rectCofig {
    activeBgColor?: string,
    BgColor?: string,
    corner?: number
    width?: number,
    height?: number,
    xCorrecting?: number,
    yCorrecting?: number,
    xText?: number,
    yText?: number,
    fontSize?: string,
    bgImg?: string,
    edit?: boolean
}
export interface lineCofig {
    activeColor?: string,
    color?: string,
    width?: number
}
export interface itemKey {
    x: number,
    y: number,
    height?: number,
    width?: number,
    title?: string,
    key: string | number,
    to?: any[],
    active?: boolean,
    bgImg?: string,
    url?: string
}
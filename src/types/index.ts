/*
 * @Author: your name
 * @Date: 2020-08-06 10:50:12
 * @LastEditTime: 2020-08-25 16:07:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\components\flowCom\index.d.ts
 */
export interface FlowProps {
    flowNodes?: itemNodeType[],                         //展示的flow节点
    rectConfig?: rectCofigType,                         //flow节点配置项
    lineCofig?: lineCofigType,                          //flow连接线条配置
    onDBClick?: (val: any) => void                      //双击单个节点编辑事件
    onChange?: (val: itemNodeType[]) => void            //节点的位置、删除、线条删除等事件变化后的响应事件
}
export interface rectCofigType {
    activeBgColor?: string,                             //节点激活的背景颜色    默认#40a9ff
    bgColor?: string,                                   //未激活背景颜色    默认白色
    corner?: number                                     //圆角(如果是正方形，圆角>长宽一半则绘制为圆形) 默认0
    width?: number,                                     //节点的宽度    默认100px
    height?: number,                                    //节点的高度    默认30px
    xCorrecting?: number,                               //节点移动X方向的自动校正距离   默认10px
    yCorrecting?: number,                               //节点移动Y方向的自动校正距离   默认5px
    fontSize?: string,                                  //节点的字体大小    默认12px
    xText?: number,                                     //节点文本的X方向偏移   默认居中展示
    yText?: number,                                     //节点文本Y方向的偏移   默认距离中心偏移5px
    // bgImg?: string,                                  //节点的背景图片（性能问题比较明显）
    edit?: boolean                                      //是否支持编辑  默认false
    autoY?: number                                      //singleFlow 子节点挂载到父节点后Y方向偏移得位置    默认100
    autoX?: number                                      //singleFlow 子节点挂载到父节点后X方向偏移得位置    默认0
}
export interface lineCofigType {
    activeColor?: string,                               //连线高亮颜色  默认#40a9ff
    color?: string,                                     //连线未激活颜色    默认白色
    width?: number                                      //线条宽度  默认2px
}
export interface itemNodeType {
    x: number,                                          //节点初始X坐标 
    y: number,                                          //节点初始Y坐标
    height?: number,                                    //单独设置节点高度  默认100px
    width?: number,                                     //单独设置节点宽度  默认30px
    title?: string,                                     //节点显示文本  
    key: string | number,                               //唯一值key
    to?: any[],                                         //节点连接的子节点key集合
    active?: boolean,                                   //是否激活状态  默认false
    // bgImg?: string,                                  //单独设置节点的背景图片（性能问题比较明显）
    // url?: string                                     //节点点击后跳转的连接
}
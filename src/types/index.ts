/*
 * @Author: your name
 * @Date: 2021-06-18 15:19:37
 * @LastEditTime: 2021-08-23 14:02:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \BigDataAP\src\views\caseAnalysis\flow\interface.ts
 */
export interface nodeType {
  key: string | number; //唯一key值
  toNodes: any[]; //子节点key数组
  fromNodes: any[]; //父节点key数组
  x: number; //x坐标
  y: number; //y坐标
  active?: boolean; //激活状态
  level?: string | number; //层级 用于判断连接关系 高level可以链接低level节点
  bgImg?: CanvasImageSource; //背景图片
  corner?: number; //圆角
  name?: string; //显示文本
  tool?: toolType; //显示按钮
}

export interface toolType {
  x?: number; //x坐标
  y?: number; //y坐标
  width?: number; //宽度
  height?: number; //高度
  title?: string; //显示文本
  active?: boolean; //激活状态
  bgImg?: CanvasImageSource; //背景图片
  activeBgColor?: string; //高亮背景色
  bgColor?: string; //背景颜色
  corner?: number; //圆角
  shadowBlur?: number; //阴影范围
  shadowColor?: string; //阴影颜色
}

export interface labelType {
  width?: number; //宽度
  height?: number; //高度
  title?: string; //文本
  bgColor?: string; //背景颜色
  corner?: number; //圆角
  active?: boolean; //激活状态
  bgImg?: CanvasImageSource; //背景图片
  shadowBlur?: number; //阴影范围
  shadowColor?: string; //阴影颜色
  textMargin?: number[]; //文本位置偏移
  textAlign?: "center" | "left" | "right";
  txtColor?: string; //文本位置偏移
  aTextColor?: string;
  fontSize?: string; //文本位置偏移
}
export interface lineCfg {
  levelLimit?: boolean; //是否开启层级限制 默认关闭
  move?: boolean; //是否允许线拖动
  width?: number; //线宽
  label?: labelType; //label
}
export interface rectCfg {
  width?: number; //宽度
  height?: number; //高度
  xCorrecting?: number; //x方向位置校正
  yCorrecting?: number; //y方向位置校正
  textMargin?: number[]; //文本位置偏移
  textAlign?: "center" | "left" | "right";
  corner?: number; //圆角
  bgImg?: CanvasImageSource; //背景图片
  activeBgColor?: string; //激活背景颜色
  bgColor?: string; //背景颜色
  shadowBlur?: number; //阴影范围
  shadowColor?: string; //阴影颜色
  tool?: toolType; //按钮
}
export interface selectAreaType {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export interface lineType {
  [propName: string]: any;
  x?: number;
  y?: number;
  fromNode: any;
  toNode: any;
  data?: {};
  turnPoints?: { x: number; y: number }[];
}
export interface rectType {
  point: any;
  key: number | string;
}
export interface dbClickType {
  type: "line" | "node" | "tool";
  node: rectType | lineType;
}
export interface grdCfg {
  color?: string;
  type?: "point" | "line"; //point是点格 line是线
  stepX?: number; //传入X方向距离
  stepY?: number; //传入Y方向距离
  width?: number;
  space?: number; //网格绘制多余的范围
}
export interface propsType {
  flowNodes: nodeType[];
  canvas: HTMLCanvasElement;
  wrapper: HTMLDivElement;
  flowLines?: lineType[];
  rectConfig?: rectCfg;
  lineConfig?: lineCfg;
  gradConfig?: grdCfg;
  onChange?: (val: any) => void;
  onConnect?:(val: any) => boolean;
  onDBClick?: (val: dbClickType) => void;
  onChangePosition?: (val: { translateX: number; translateY: number }) => void;
}
export interface drawTextType {
  x: number;
  y: number;
  hWidth: number;
  title?: string | number;
  txtColor?: string;
  aTextColor?: string;
  fontSize?: string;
  align?: string;
  margin?: number[];
  active?: boolean;
  r?: number;
}

export interface drawLineType {
  sx: number; //开始x坐标
  sy: number; //开始y坐标
  x: number; //结束x坐标
  y: number; //结束y坐标
  active?: boolean; //激活状态
  _h?: number; //节点高度
  _w?: number; //线宽度
  color?: string; //线颜色
  aColor?: string; //线激活颜色
  label?: labelType; //label
}
export interface drawTriangleType {
  sy: number; //开始y坐标
  x: number; //结束x坐标
  y: number; //结束y坐标
  _w?: number; //线宽
  _h?: number; //节点高度
  _xDev?: number; //箭头宽度
  color?: string; //箭头颜色
  aColor?: string; //箭头激活颜色
  active?: boolean; //激活状态
}

export interface drawRoundedType {
  x: number;
  y: number;
  r: number;
  active?: boolean;
  bgImg?: CanvasImageSource;
  hWidth: number;
  hHeight: number;
  bgColor?: string;
  aBgColor?: string;
  shadowBlur?: number;
  shadowColor?: string;
}

export interface nodeType {
    key: string | number;
    toNodes: any[];
    fromNodes: any[];
    x: number;
    y: number;
    active?: boolean;
    level?: string | number;
    bgImg?: CanvasImageSource;
    corner?: number;
    name?: string;
    tool?: toolType;
}
export interface toolType {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    title?: string;
    active?: boolean;
    bgImg?: CanvasImageSource;
    activeBgColor?: string;
    bgColor?: string;
    corner?: number;
    shadowBlur?: number;
    shadowColor?: string;
}
export interface labelType {
    width?: number;
    height?: number;
    title?: string;
    bgColor?: string;
    corner?: number;
    active?: boolean;
    bgImg?: CanvasImageSource;
    shadowBlur?: number;
    shadowColor?: string;
    textMargin?: number[];
    textAlign?: "center" | "left" | "right";
    txtColor?: string;
    aTextColor?: string;
    fontSize?: string;
}
export interface lineCfg {
    levelLimit?: boolean;
    move?: boolean;
    width?: number;
    label?: labelType;
}
export interface rectCfg {
    width?: number;
    height?: number;
    xCorrecting?: number;
    yCorrecting?: number;
    textMargin?: number[];
    textAlign?: "center" | "left" | "right";
    corner?: number;
    bgImg?: CanvasImageSource;
    activeBgColor?: string;
    bgColor?: string;
    shadowBlur?: number;
    shadowColor?: string;
    tool?: toolType;
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
    turnPoints?: {
        x: number;
        y: number;
    }[];
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
    type?: "point" | "line";
    stepX?: number;
    stepY?: number;
    width?: number;
    space?: number;
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
    onConnect?: (val: any) => boolean;
    onDBClick?: (val: dbClickType) => void;
    onChangePosition?: (val: {
        translateX: number;
        translateY: number;
    }) => void;
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
    sx: number;
    sy: number;
    x: number;
    y: number;
    active?: boolean;
    _h?: number;
    _w?: number;
    color?: string;
    aColor?: string;
    label?: labelType;
}
export interface drawTriangleType {
    sy: number;
    x: number;
    y: number;
    _w?: number;
    _h?: number;
    _xDev?: number;
    color?: string;
    aColor?: string;
    active?: boolean;
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

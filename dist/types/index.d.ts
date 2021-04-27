export interface FlowProps {
    flowNodes?: itemNodeType[];
    rectConfig?: rectCofigType;
    lineCofig?: lineCofigType;
    onDBClick?: (val: any) => void;
    onChange?: (val: itemNodeType[]) => void;
}
export interface rectCofigType {
    activeBgColor?: string;
    bgColor?: string;
    corner?: number;
    width?: number;
    height?: number;
    xCorrecting?: number;
    yCorrecting?: number;
    fontSize?: string;
    txtColor?: string;
    activeTxtColor?: string;
    align?: string;
    edit?: boolean;
    autoY?: number;
    autoX?: number;
}
export interface lineCofigType {
    activeColor?: string;
    color?: string;
    width?: number;
}
export interface itemNodeType {
    x: number;
    y: number;
    height?: number;
    width?: number;
    title?: string;
    key: string | number;
    to?: any[];
    active?: boolean;
    parent?: string;
}

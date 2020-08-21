export interface FlowProps {
    selectedKeys?: itemKey[];
    rectConfig?: rectCofig;
    lineCofig?: lineCofig;
    mode?: string;
    onEdit?: (val: any) => void;
    onChange?: (val: itemKey[]) => void;
}
export interface rectCofig {
    activeBgColor?: string;
    BgColor?: string;
    corner?: number;
    width?: number;
    height?: number;
    xCorrecting?: number;
    yCorrecting?: number;
    xText?: number;
    yText?: number;
    fontSize?: string;
    bgImg?: string;
    edit?: boolean;
}
export interface lineCofig {
    activeColor?: string;
    color?: string;
    width?: number;
}
export interface itemKey {
    x: number;
    y: number;
    height?: number;
    width?: number;
    title?: string;
    key: string | number;
    to?: any[];
    active?: boolean;
    bgImg?: string;
    url?: string;
}

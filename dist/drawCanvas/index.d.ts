import { rectCofigType, lineCofigType } from '../types/index';
export declare function drawText(rectCfg: rectCofigType, ctx: any, x: number, y: number, title?: string, active?: boolean): void;
export declare function drawRoundedRect(rectCfg: rectCofigType, ctx: any, x: number, y: number, corner: number, title?: string, active?: boolean, bgImg?: string): void;
export declare function drawImage(ctx: any, bgImg: string, rectCfg: rectCofigType, x: number, y: number, title: string, active: boolean): void;
export declare function dragSelect(ctx: any, sx: number, sy: number, x: number, y: number): void;
export declare function dragTriangle(lineCfg: lineCofigType, rectCfg: rectCofigType, ctx: any, sy: number, x: number, y: number, active?: boolean): void;
export declare function drawLine(lineCfg: lineCofigType, rectCfg: rectCofigType, ctx: any, sx: number, sy: number, x: number, y: number, active?: boolean): void;

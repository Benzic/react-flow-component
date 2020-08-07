/*
 * @Author: your name
 * @Date: 2020-08-06 15:21:59
 * @LastEditTime: 2020-08-07 10:24:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\components\flowCom\drawCanvas.ts
 */
// import { textProps, selectProps, rectProps, triangleProps, lineProps } from './drawCanvasInterface'
export function drawText<textProps>(rectCfg: any, ctx: any, x: any, y: any, title?: any, active?: any) {
    ctx.fillStyle = "black";
    ctx.font = rectCfg?.fontSize ? rectCfg?.fontSize + ' Arial' : '12px Arial'
    active && (ctx.fillStyle = "white");
    const txtWidth = ctx.measureText(title).width
    ctx.fillText(title, x - (rectCfg?.xText ?? txtWidth / 2), y + (rectCfg?.yText ?? 5));
}

export function drawRoundedRect(rectCfg: any, ctx: any, x: any, y: any, corner: any, title?: any, active?: any, bgImg?: string) {
    const r = corner ? corner : rectCfg?.corner ?? 0
    const halfWidth = (rectCfg?.width / 2) || 50
    const halfHeight = (rectCfg?.height / 2) || 15
    console.log(halfWidth, halfHeight)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x - halfWidth + r, y - halfHeight);
    ctx.lineTo(x + halfWidth - r, y - halfHeight);
    ctx.arcTo(x + halfWidth, y - halfHeight, x + halfWidth, y + r, r);
    ctx.lineTo(x + halfWidth, y + halfHeight - r);
    ctx.arcTo(x + halfWidth, y + halfHeight, x + halfWidth - r, y + halfHeight, r);
    ctx.lineTo(x - halfWidth + r, y + halfHeight);
    ctx.arcTo(x - halfWidth, y + halfHeight, x - halfWidth, y + halfHeight - r, r);
    ctx.lineTo(x - halfWidth, y - halfHeight + r);
    ctx.arcTo(x - halfWidth, y - halfHeight, x - halfWidth + r, y - halfHeight, r);
    ctx.fillStyle = rectCfg?.BgColor ?? "white";
    active && (ctx.fillStyle = rectCfg?.activeBgColor ?? "#40a9ff");
    ctx.fill()
    ctx.closePath();
    ctx.restore();
    if (bgImg) {
        drawImage(ctx, bgImg, rectCfg, x, y, title, active)
    } else {
        title && drawText(rectCfg, ctx, x, y, title, active)
    }
}
export function drawImage(ctx: any, bgImg: any, rectCfg: any, x: any, y: any, title: any, active: any) {
    const halfWidth = (rectCfg?.width / 2) || 50
    const halfHeight = (rectCfg?.height / 2) || 15
    var pic: any = new Image();
    pic.src = bgImg;
    pic.onload = function () {
        ctx.drawImage(pic, x - halfWidth, y - halfHeight, rectCfg?.width ?? 50, rectCfg?.height ?? 30)
        title && drawText(rectCfg, ctx, x, y, title, active)
    };
}
export function dragSelect(ctx: any, sx: any, sy: any, x: any, y: any) {
    ctx.save()
    ctx.beginPath();
    ctx.setLineDash([8, 8]);
    ctx.moveTo(sx, sy);
    ctx.lineTo(x, sy);
    ctx.lineTo(x, y);
    ctx.lineTo(sx, y);
    ctx.lineTo(sx, sy);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#999";
    ctx.closePath();
    ctx.stroke();
    ctx.restore()
}

export function dragTriangle(lineCfg: any, rectCfg: any, ctx: any, sy: any, x: any, y: any, active?: any) {
    const halfHeight = (rectCfg?.height / 2) || 15
    const xDeviation = (lineCfg?.width ?? 2) * 2.5
    const yDeviation = Math.sqrt(Math.pow(2 * xDeviation, 2) - Math.pow(xDeviation, 2))
    ctx.save()
    ctx.beginPath();
    ctx.fillStyle = lineCfg?.color ?? "#40a9ff";
    active && (ctx.fillStyle = lineCfg?.activeColor ?? "orange")
    ctx.moveTo(x, y - (sy - y > 0 ? -halfHeight : halfHeight));
    ctx.lineTo(x - xDeviation, y - (sy - y > 0 ? -halfHeight - yDeviation : halfHeight + yDeviation));
    ctx.lineTo(x + xDeviation, y - (sy - y > 0 ? -halfHeight - yDeviation : halfHeight + yDeviation));
    ctx.lineTo(x, y - (sy - y > 0 ? -halfHeight : halfHeight));
    ctx.lineWidth = lineCfg?.width ?? 2;
    ctx.closePath();
    ctx.fill()
    ctx.restore()
}

export function drawLine(lineCfg: any, rectCfg: any, ctx: any, sx: any, sy: any, x: any, y: any, active?: any) {
    const halfHeight = (rectCfg?.height / 2) || 15
    ctx.save()
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    if ((sy > y && sy > y + halfHeight) || (sy < y && sy < y - halfHeight) || !halfHeight) {
        ctx.lineTo(sx, (sy + (y - sy) / 2));
        ctx.lineTo(x, (sy + (y - sy) / 2));
    } else {
        ctx.lineTo(sx, sy + (sy > y ? rectCfg + 25 : -rectCfg - 25));
        ctx.lineTo(x, sy + (sy > y ? rectCfg + 25 : -rectCfg - 25));
    }
    ctx.lineTo(x, y);
    ctx.lineWidth = lineCfg?.width ?? 2;
    ctx.strokeStyle = lineCfg?.color ?? "#40a9ff";
    active && (ctx.strokeStyle = lineCfg?.activeColor ?? "orange")
    ctx.stroke();
    ctx.restore()
}
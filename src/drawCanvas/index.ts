/*
 * @Author: your name
 * @Date: 2020-08-06 15:21:59
 * @LastEditTime: 2020-08-26 15:15:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\components\flowCom\drawCanvas.ts
 */
import { rectCofigType, lineCofigType } from '../types/index'
export function drawText(rectCfg: rectCofigType, ctx: any, x: number, y: number, title?: string, active?: boolean): void {
  ctx.fillStyle = rectCfg?.txtColor ?? 'black';
  ctx.font = rectCfg?.fontSize ? rectCfg?.fontSize + ' Arial' : '12px Arial'
  const align = rectCfg?.align ?? 'center'
  let txtX, txtY;
  const txtWidth = ctx.measureText(title).width
  const padding = (rectCfg?.corner ?? 5) < 5 ? 5 : (rectCfg?.corner ?? 5)
  if (align === 'center') {
    txtX = x - (txtWidth / 2)
    txtY = y + 5
  } else if (align === 'left') {
    txtX = x - (rectCfg?.width / 2) + padding
    txtY = y + 5
  } else if (align === 'right') {
    txtX = x + (rectCfg?.width / 2 - txtWidth) - padding
    txtY = y + 5
  }
  active && (ctx.fillStyle = rectCfg?.activeTxtColor ?? "white");
  ctx.fillText(title, txtX, txtY);
}

export function drawRoundedRect(rectCfg: rectCofigType, ctx: any, x: number, y: number, corner: number, title?: string, active?: boolean, bgImg?: string): void {
  const r = corner ? corner : rectCfg?.corner ?? 0
  const halfWidth = (rectCfg?.width / 2) || 50
  const halfHeight = (rectCfg?.height / 2) || 15
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
  ctx.fillStyle = rectCfg?.bgColor ?? "white";
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
export function drawImage(ctx: any, bgImg: string, rectCfg: rectCofigType, x: number, y: number, title: string, active: boolean): void {
  const halfWidth = (rectCfg?.width / 2) || 50
  const halfHeight = (rectCfg?.height / 2) || 15
  const pic: any = new Image();
  pic.src = bgImg;
  pic.onload = function () {
    ctx.drawImage(pic, x - halfWidth, y - halfHeight, rectCfg?.width ?? 50, rectCfg?.height ?? 30)
    title && drawText(rectCfg, ctx, x, y, title, active)
  };
}
export function dragSelect(ctx: any, sx: number, sy: number, x: number, y: number): void {
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

export function dragTriangle(lineCfg: lineCofigType, rectCfg: rectCofigType, ctx: any, sy: number, x: number, y: number, active?: boolean): void {
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

export function drawLine(lineCfg: lineCofigType, rectCfg: rectCofigType, ctx: any, sx: number, sy: number, x: number, y: number, active?: boolean): void {
  const halfHeight = (rectCfg?.height / 2) || 15
  ctx.save()
  ctx.beginPath();
  if (sy > y) {
    ctx.moveTo(sx, sy - halfHeight);
  } else {
    ctx.moveTo(sx, sy + halfHeight);
  }
  if ((sy > y && sy > y + halfHeight + 30) || (sy < y && sy < y - halfHeight - 30)) {
    ctx.lineTo(sx, (sy + (y - sy) / 2));
    ctx.lineTo(x, (sy + (y - sy) / 2));
  } else {
    ctx.lineTo(sx, sy + (sy > y ? 30 : -30));
    ctx.lineTo(x, sy + (sy > y ? 30 : -30));
  }
  if (sy > y) {
    ctx.lineTo(x, y + halfHeight);
  } else {
    ctx.lineTo(x, y - halfHeight);
  }
  ctx.lineWidth = lineCfg?.width ?? 2;
  ctx.strokeStyle = lineCfg?.color ?? "#40a9ff";
  active && (ctx.strokeStyle = lineCfg?.activeColor ?? "orange")
  ctx.stroke();
  ctx.restore()
}
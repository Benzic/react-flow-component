/*
 * @Author: your name
 * @Date: 2021-03-17 10:59:10
 * @LastEditTime: 2021-04-27 10:42:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\flow\base.ts
 */

export class Flow {
  private ctx: any;
  private nodes: any;
  private canvas: any;
  private lineCfg: any;
  private rectCfg: any;
  private onChange: any;
  private onDBClick: any;
  private selectArea: any;
  private activeLines: any;
  private activeRects: any;
  private activeMoveRect: any;
  private lastMouseUpTime: any;
  private editLine: any;
  private doubleClickArea: any;
  private mousePosition: any;
  private mouseDownXY: any;
  private isMutiple: any;
  constructor(flowNodes: any, canvas: any, isMutiple: boolean, rectConfig: any, lineCofig: any, onChange: any, onDBClick: any) {
    console.log(flowNodes, canvas, rectConfig, lineCofig, onChange, onDBClick)
    this.ctx = canvas.getContext("2d");
    this.nodes = flowNodes;
    this.canvas = canvas;
    this.onChange = onChange;
    this.lineCfg = lineCofig;
    this.rectCfg = rectConfig;
    this.onDBClick = onDBClick;
    this.selectArea = {
      startX: null,
      startY: null,
      endX: null,
      endY: null
    };
    this.doubleClickArea = {
      x: null,
      y: null
    }
    this.isMutiple = isMutiple;
    this.activeLines = [];
    this.activeRects = [];
    this.editLine = null
    this.activeMoveRect = null;
    this.mouseDownXY = {
      x: null,
      y: null
    };
    onDBClick && this.onListenDBClick()
    this.initCanvas()
    this.onListenKeyDown()
  }
  onListenKeyDown() {
    window.addEventListener('keydown', this.checkKeyDown.bind(this), true);
  }
  onListenDBClick() {
    if (this.rectCfg?.edit) {
      window.addEventListener('mouseup', (event) => {
        if ((new Date()).getTime() - this.lastMouseUpTime < 250) {
          const rectIndex = this.getRectIndex(this.activeMoveRect)
          const node = {
            node: this.nodes[rectIndex],
            index: rectIndex
          }
          this.doubleClickArea.x = event.offsetX;
          this.doubleClickArea.y = event.offsetY;
          this.findEditLine()
          console.log(this.editLine, this.activeMoveRect)
          if (this.activeMoveRect) {
            this.onDBClick && this.onDBClick(node)
          }
          if (this.editLine) {
            console.log('3333')
            this.onDBClick && this.onDBClick({
              type: "line",
              node: this.editLine
            })
          }
        }
        this.lastMouseUpTime = (new Date()).getTime()
      }, true);
    }
  }
  checkKeyDown(event: any): void {
    if (event.keyCode === 46) {
      if (this.activeLines?.length) {
        this.deleLine()
      }
      if (this.activeRects?.length) {
        this.deleRect()
      }
      this.initCanvas()
    }
  }
  onCheckPosition(x: number, y: number) {
    console.log(this.getRectIndex(this.activeMoveRect), this.activeMoveRect)
  }
  getRectIndex(key: any): any {
    let index: number = 0;
    const nodes = this.nodes;
    for (let i = 0; i <= nodes?.length - 1; i++) {
      if (nodes[i]?.key === key) {
        index = i
        //  console.log(i, nodes[i], key)
        return index
      }
    }
    return index
  }
  initCanvas() {
    const nodes = this.nodes;
    if (this.ctx && nodes && nodes?.length) {
      this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
      for (let i = 0; i <= nodes?.length - 1; i++) {
        for (let j = 0; j <= nodes[i].toNodes?.length - 1; j++) {
          const rectIndex = this.getRectIndex(nodes[i].toNodes[j])
          const ENode = nodes[rectIndex]
          if (ENode) {
            const SNode = nodes[i];
            const active = this.activeLines.find((item: any) => {
              return item.fromNodes === SNode.key && item.toNodes === SNode.toNodes[j]
            })
            let edit: any = false;
            if (this.editLine) {
              edit = this.editLine.fromNodes === SNode.key && this.editLine.toNodes === SNode.toNodes[j]
            }
            if (active) {
              (async () => {
                await setTimeout(() => { }, 0);
                this.drawLine(SNode.x, SNode.y, ENode.x, ENode.y, active, edit)
                this.dragTriangle(SNode.y, ENode.x, ENode.y, active, edit)
              })()
            } else {
              this.drawLine(SNode.x, SNode.y, ENode.x, ENode.y, active)
              this.dragTriangle(SNode.y, ENode.x, ENode.y, active)
            }
          }
        }
      }
      for (let i = 0; i <= nodes?.length - 1; i++) {
        const node = nodes[i]
        const corner = node.corner ?? this.rectCfg?.corner;
        const width = this.rectCfg?.width;
        const height = this.rectCfg?.height;
        const isActiveKey = this.activeMoveRect === node.key
        const bgImg = node.bgImg ?? this.rectCfg?.bgImg
        const bgColor = this.rectCfg?.bgColor
        const activeBgColor = this.rectCfg?.activeBgColor
        this.drawRoundedRect(node.x, node.y, corner, node.title, isActiveKey, bgImg, width, height, bgColor, activeBgColor)
      }
    }
  }
  deleLine() {
    const nodes = this.nodes
    const lines = this.activeLines
    for (let i = 0; i <= lines?.length - 1; i++) {
      const rectIndex = this.getRectIndex(lines[i]?.key)
      if (nodes[rectIndex]) {
        nodes[rectIndex].toNodes = nodes[rectIndex]?.toNodes.filter((a: any) => a !== lines[i].toNodes)
      }
    }
    console.log(lines, nodes)
    this.onChange && this.onChange(nodes)
    this.activeLines = []
  }
  deleRect() {
    const nodes = this.nodes
    for (let i = 0; i <= nodes?.length - 1; i++) {
      for (let j = 0; j <= nodes[i]?.toNodes?.length - 1; j++) {
        if (nodes[i].toNodes[j] === this.activeRects) {
          nodes[i].toNodes = nodes[i].toNodes.splice(this.getRectIndex(this.activeRects), 1)
        }
      }
    }
    const rectIndex = this.getRectIndex(this.activeRects)
    nodes.splice(rectIndex, 1)
    this.onChange && this.onChange(nodes)
    this.activeRects = null
  }
  findRectInCanvas(x: number, y: number): any {
    let rect = null
    const nodes = this.nodes
    const halfWidth = (this.rectCfg?.width / 2) || 50
    const halfHeight = (this.rectCfg?.height / 2) || 15
    for (let i = 0; i <= nodes?.length - 1; i++) {
      const r = nodes[i].corner ? nodes[i].corner : this.rectCfg?.corner ?? 0
      const realLen = Math.sqrt(Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2))
      const maxLen = Math.sqrt(Math.pow(halfWidth - r, 2) + Math.pow(halfHeight - r, 2)) + r
      if ((x < nodes[i].x + halfWidth && x > nodes[i].x - halfWidth) && (y < nodes[i].y + halfHeight && y > nodes[i].y - halfHeight)) {
        if (realLen < maxLen) {
          if (nodes[i].key !== this.activeMoveRect) {
            rect = { point: nodes[i], key: nodes[i].key }
            break
          }
        }
      }
    }
    return rect
  }
  findLeftRightLine(X: number, Y1: number, Y2: number) {
    const { startY, endY, endX, startX } = this.selectArea;
    const xIsInterset = X < endX && X > startX
    if (Y1 > Y2) {
      if (Y1 > endY && Y2 < startY) {
        return xIsInterset && true
      }
    } else {
      if (Y2 > endY && Y1 < startY) {
        return xIsInterset && true
      }
    }
    if (Y1 > startY && Y1 < endY) {
      return xIsInterset && true
    } else if (Y2 > startY && Y2 < endY) {
      return xIsInterset && true
    }
    return false
  }
  findCenterLine(X1: number, Y: number, X2: number) {
    const { startY, endY, endX, startX } = this.selectArea;
    const yIsInterset = Y < endY && Y > startY
    if (X1 > startX && X1 < endX) {
      return yIsInterset && true
    } else if (X2 > startX && X2 < endX) {
      return yIsInterset && true
    } else if (X1 < startX && X2 > startX) {
      return yIsInterset && true
    } else if (X2 > endX && X1 < endX) {
      return yIsInterset && true
    }
    return false
  }
  findEditLine() {
    this.editLine = null;
    const { x, y } = this.doubleClickArea;
    for (let i = 0; i <= this.activeLines?.length - 1; i++) {
      let lineX = this.activeLines[i]?.x;
      let lineY = this.activeLines[i]?.y
      if (x > lineX - 20 && x < lineX + 20 && y > lineY - 5 && y < lineY + 5) {
        this.editLine = this.activeLines[i]
      }
    }
  }
  findLineInCanvas() {
    let line: any = null;
    const nodes = this.nodes
    this.activeLines = []
    for (let i = 0; i <= nodes?.length - 1; i++) {
      for (let j = 0; j <= nodes[i].toNodes?.length - 1; j++) {
        const startX = nodes[i].x, startY = nodes[i].y;                                   //起点位置的X轴、Y轴
        const endIndex = this.getRectIndex(nodes[i].toNodes[j])
        const endX = nodes[endIndex].x, endY = nodes[endIndex].y;           //终点位置的X轴、Y轴
        let halfY, firstLine, lastLine, centerLine;     //halfY是指两个区域间中间一半的位置，firstLine是指出发后得第一条线，centerLine是中间线段，lastLine是出发后最后一条线
        const halfHeight = (this.rectCfg?.height / 2) || 15
        if ((startY > endY && startY > endY + halfHeight + 30) || (startY < endY && startY < endY - halfHeight - 30)) {
          halfY = startY < endY ? startY + Math.abs((startY - endY) / 2) : endY + Math.abs((startY - endY) / 2)
        } else {
          halfY = startY < endY ? startY - 30 - halfHeight : startY + 30
        }
        if (startX < endX) {
          firstLine = this.findLeftRightLine(startX, startY, halfY)
          centerLine = this.findCenterLine(startX, halfY, endX)
          lastLine = this.findLeftRightLine(endX, endY, halfY)
        } else {
          firstLine = this.findLeftRightLine(endX, endY, halfY)
          centerLine = this.findCenterLine(endX, halfY, startX)
          lastLine = this.findLeftRightLine(startX, startY, halfY)
        }
        if (firstLine || centerLine || lastLine) {      //有一个条件满足即视为在选中区域
          let x = startX < endX ? startX + (endX - startX) / 2 : endX + (startX - endX) / 2;
          line = { fromNodes: nodes[i].key, toNodes: nodes[i].toNodes[j], x, y: halfY }
          line && this.activeLines.push(line)
          // this.editLine = null;
        }
      }
    }
    if (this.activeLines?.length) {
      this.activeMoveRect = null
    }
    this.initCanvas()
  }
  drawText(x: number, y: number, title?: string | number, active?: boolean) {
    this.ctx.fillStyle = this.rectCfg?.txtColor ?? 'black';
    this.ctx.font = this.rectCfg?.fontSize ? this.rectCfg?.fontSize + ' Arial' : '12px Arial'
    const align = this.rectCfg?.align ?? 'center'
    let txtX, txtY;
    const txtWidth = this.ctx.measureText(title).width
    const padding = (this.rectCfg?.corner ?? 5) < 5 ? 5 : (this.rectCfg?.corner ?? 5)
    if (align === 'center') {
      txtX = x - (txtWidth / 2)
      txtY = y + 5
    } else if (align === 'left') {
      txtX = x - (this.rectCfg?.width / 2) + padding
      txtY = y + 5
    } else if (align === 'right') {
      txtX = x + (this.rectCfg?.width / 2 - txtWidth) - padding
      txtY = y + 5
    }
    active && (this.ctx.fillStyle = this.rectCfg?.activeTxtColor ?? "white");
    this.ctx.fillText(title, txtX, txtY);
  }
  drawLine(sx: number, sy: number, x: number, y: number, active: boolean, editLine?: boolean) {
    const halfHeight = (this.rectCfg?.height / 2) || 15
    this.ctx.save()
    this.ctx.beginPath();
    if ((sy > y && sy > y + halfHeight + 30) || (sy < y && sy < y - halfHeight - 30)) {
      if (sy > y) {
        this.ctx.moveTo(sx, sy - halfHeight);
      } else {
        this.ctx.moveTo(sx, sy + halfHeight);
      }
      this.ctx.lineTo(sx, (sy + (y - sy) / 2));
      this.ctx.lineTo(x, (sy + (y - sy) / 2));
    } else {//上下相错位置不多的区域需要把线拉开连接
      if (sy > y) {
        this.ctx.moveTo(sx, sy + halfHeight);
      } else {
        this.ctx.moveTo(sx, sy - halfHeight);
      }
      this.ctx.lineTo(sx, sy + (sy > y ? 30 : -30));
      this.ctx.lineTo(x, sy + (sy > y ? 30 : -30));
    }
    if (sy > y) {
      this.ctx.lineTo(x, y + halfHeight);
    } else {
      this.ctx.lineTo(x, y - halfHeight);
    }
    this.ctx.lineWidth = this.lineCfg?.width ?? 2;
    this.ctx.strokeStyle = this.lineCfg?.color ?? "#40a9ff";
    active && (this.ctx.strokeStyle = this.lineCfg?.activeColor ?? "orange");
    editLine && (this.ctx.strokeStyle = "red");
    this.ctx.stroke();
    this.ctx.restore()
    active && this.drawLineRect(sx, sy, x, y)
  }
  dragTriangle(sy: number, x: number, y: number, active: boolean, editLine?: boolean) {
    const halfHeight = (this.rectCfg?.height / 2) || 15
    const xDeviation = (this.lineCfg?.width ?? 2) * 2.5
    const yDeviation = Math.sqrt(Math.pow(2 * xDeviation, 2) - Math.pow(xDeviation, 2))
    this.ctx.save()
    this.ctx.beginPath();
    this.ctx.fillStyle = this.lineCfg?.color ?? "#40a9ff";
    active && (this.ctx.fillStyle = this.lineCfg?.activeColor ?? "orange")
    editLine && (this.ctx.strokeStyle = "red");
    this.ctx.moveTo(x, y - (sy - y > 0 ? -halfHeight : halfHeight));
    this.ctx.lineTo(x - xDeviation, y - (sy - y > 0 ? -halfHeight - yDeviation : halfHeight + yDeviation));
    this.ctx.lineTo(x + xDeviation, y - (sy - y > 0 ? -halfHeight - yDeviation : halfHeight + yDeviation));
    this.ctx.lineTo(x, y - (sy - y > 0 ? -halfHeight : halfHeight));
    this.ctx.lineWidth = this.lineCfg?.width ?? 2;
    this.ctx.closePath();
    this.ctx.fill()
    this.ctx.restore()
  }
  drawLineRect(sx: number, sy: number, x: number, y: number) {
    const halfHeight = 5
    const xCenter = sx > x ? x + Math.abs((sx - x) / 2) : sx + Math.abs((sx - x) / 2);
    let yCenter: any = null;
    if ((sy > y && sy > y + halfHeight + 30) || (sy < y && sy < y - halfHeight - 30)) {
      yCenter = (sy + (y - sy) / 2)
    } else {//上下相错位置不多的区域需要把线拉开连接
      yCenter = sy + (sy > y ? 30 : -30)
    }
    this.drawRoundedRect(xCenter, yCenter, 3, "编辑线", false, "", 20, 5)
  }
  drawRoundedRect(x: number, y: number, corner: number, title?: string, active?: boolean, bgImg?: string, width?: number, height?: number, bgColor?: string, activeBgColor?: string) {
    const r = corner ?? 0
    const halfWidth = width ?? 50
    const halfHeight = height ?? 15
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x - halfWidth + r, y - halfHeight);
    this.ctx.lineTo(x + halfWidth - r, y - halfHeight);
    this.ctx.arcTo(x + halfWidth, y - halfHeight, x + halfWidth, y + r, r);
    this.ctx.lineTo(x + halfWidth, y + halfHeight - r);
    this.ctx.arcTo(x + halfWidth, y + halfHeight, x + halfWidth - r, y + halfHeight, r);
    this.ctx.lineTo(x - halfWidth + r, y + halfHeight);
    this.ctx.arcTo(x - halfWidth, y + halfHeight, x - halfWidth, y + halfHeight - r, r);
    this.ctx.lineTo(x - halfWidth, y - halfHeight + r);
    this.ctx.arcTo(x - halfWidth, y - halfHeight, x - halfWidth + r, y - halfHeight, r);
    this.ctx.fillStyle = bgColor ?? "white";
    active && (this.ctx.fillStyle = activeBgColor ?? "#40a9ff");
    this.ctx.fill()
    this.ctx.closePath();
    this.ctx.restore();
    if (bgImg) {
      this.drawImage(bgImg, x, y, title, active)
    } else {
      title && this.drawText(x, y, title, active)
    }
  }
  drawImage(bgImg: string, x: number, y: number, title?: string, active?: boolean) {
    const halfWidth = (this.rectCfg?.width / 2) || 50
    const halfHeight = (this.rectCfg?.height / 2) || 15
    const pic: any = new Image();
    pic.src = bgImg;
    this.ctx.drawImage(pic, x - halfWidth, y - halfHeight, this.rectCfg?.width ?? 50, this.rectCfg?.height ?? 30)
    title && this.drawText(x, y, title, active)
  }
  dragSelect(sx: number, sy: number, x: number, y: number) {
    this.ctx.save()
    this.ctx.beginPath();
    this.ctx.setLineDash([8, 8]);
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(x, sy);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(sx, y);
    this.ctx.lineTo(sx, sy);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#999";
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore()
  }
}
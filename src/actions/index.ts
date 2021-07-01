/*
 * @Author: benzic
 * @Date: 2021-03-17 10:59:10
 * @LastEditTime: 2021-07-01 17:22:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\flow\base.ts
 */
import {
  nodeType,
  lineCfg,
  rectCfg,
  selectAreaType,
  lineType,
  rectType,
  propsType,
  dbClickType,
  drawTextType,
  drawLineType,
  drawTriangleType,
  drawRoundedType,
  toolType,
  grdCfg
} from "./../types/index";
export class Flow {
  private ctx: CanvasRenderingContext2D | null;
  private nodes: nodeType[];
  private lines: any[]
  private canvas: HTMLCanvasElement;
  private wrapper: HTMLDivElement;
  private lineCfg: lineCfg;
  private rectCfg: rectCfg;
  private gradConfig: grdCfg;
  private selectArea: selectAreaType = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };
  private activeLines: lineType[] = [];
  private activeKey: number | null = null;
  private lastMouseUpTime: number = 0;
  private editLine: lineType | null = null;
  private activeTool: rectType | null = null;
  private mouseDownXY: { x: number; y: number } = {
    x: 0,
    y: 0,
  };
  private translateX: number = 0;
  private translateY: number = 0;
  private singleClick: boolean = true;
  private cancelDBClick: boolean = false;
  private leftMouseDown: boolean = false; //暂存左键是否点击的变量
  private drawElement: HTMLElement | null = null; //画线的按钮
  private drawLineModel: boolean = false; //画线模式
  private lineFormNodeKey: any = null; //画线模式下的开始节点
  private onChange?: (val: any) => void;
  private onDBClick?: (val: dbClickType) => void;
  private onChangePosition?: (val: {
    translateX: number;
    translateY: number;
  }) => void;
  constructor({
    flowNodes,
    canvas,
    wrapper,
    rectConfig,
    lineConfig,
    gradConfig,
    onChange,
    onDBClick,
    onChangePosition,
  }: propsType) {
    this.ctx = canvas.getContext("2d");
    this.nodes = flowNodes;
    this.canvas = canvas;
    this.wrapper = wrapper;
    this.lines = []
    this.lineCfg = lineConfig ?? {};
    this.rectCfg = rectConfig ?? {};
    this.gradConfig = gradConfig;
    this.onDBClick = onDBClick;
    this.onChange = onChange;
    this.onChangePosition = onChangePosition;
    this.resetValues();
    this.initListenEvent();
  }
  resetValues() {
    this.singleClick = true;
    this.cancelDBClick = false;
    this.leftMouseDown = false;
    this.mouseDownXY = { x: 0, y: 0 };
    this.editLine = null;
    this.lastMouseUpTime = 0;
    this.activeKey = null;
    this.activeLines = [];
    this.lineFormNodeKey = null;
    this.selectArea = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    };
    this.render();
  }
  initListenEvent() {
    this.createResetBtn();
    this.createLineBtn();
    this.onListenKeyDown();
    this.onListenKeyUp();
    this.onListenOnMouseDown();
    this.onListenDBClick();
  }
  throttle = (
    fn: { apply: (arg0: any, arg1: any[]) => void },
    t: number = 500
  ) => {
    let flag = true;
    const interval = t;
    return function (this: any, ...args: any) {
      if (flag) {
        fn.apply(this, args);
        flag = false;
        setTimeout(() => {
          flag = true;
        }, interval);
      }
    };
  };
  onListenKeyDown = () => {
    window.onkeydown = (event: KeyboardEvent): void => {
      if (event.keyCode === 46) {
        //删除节点或线
        if (this.activeLines?.length) {
          this.deleLine();
        }
        if (this.activeKey) {
          this.deleRect();
        }
        this.render();
      }
      if (event.keyCode === 17) {
        //按住ctrl 位移
        window.document.body.style.cursor = "move";
      }
    };
  };
  onListenKeyUp = () => {
    window.onkeyup = (event: KeyboardEvent): void => {
      if (event.keyCode === 17) {
        //松开ctrl 结束位移
        window.document.body.style.cursor = "inherit";
      }
    };
  };
  onConectLine = (offsetX: number, offsetY: number) => {
    //纯画线模式
    const _index: number = this.getRectIndex(this.lineFormNodeKey) || 0;
    const { height: rectHeight } = this.rectCfg;
    const { width: lineWidth } = this.lineCfg;
    this.render();
    this.drawLine({
      sx: this.nodes[_index].x + this.translateX,
      sy: this.nodes[_index].y + this.translateY,
      x: offsetX,
      y: offsetY,
      _w: lineWidth,
      _h: rectHeight / 2,
    });
  };
  onListenMouseMove = (event: MouseEvent) => {
    let { clientX: oldX, clientY: oldY } = event;
    this.canvas.onmousemove = (event: MouseEvent) => {
      const { clientX: newX, clientY: newY, ctrlKey, offsetX, offsetY } = event;
      if (this.drawLineModel) {
        this.onConectLine(offsetX, offsetY);
      } else {
        const { leftMouseDown, activeKey, rectCfg, lineCfg } = this;
        if (ctrlKey && leftMouseDown) {
          //按住ctrl 以及鼠标左键 画布位移
          const dX = newX - oldX;
          const dY = newY - oldY;
          oldX = newX;
          oldY = newY;
          this.translateX += dX;
          this.translateY += dY;
          this.onChangePosition?.({
            translateX: this.translateX,
            translateY: this.translateY,
          });
          this.render();
        }
        if (!ctrlKey) {
          const { xCorrecting = 10, yCorrecting = 5, height: _h } = rectCfg;
          const { width: _lineW } = lineCfg;
          const { width: _W, height: _H } = this.canvas
          if (activeKey !== null) {
            const _index = this.getRectIndex(activeKey) ?? 0;
            if (this.singleClick) {
              //单击拖动节点位移
              this.render();
              if (this.nodes[_index].active) {
                const _X = (offsetX - this.translateX) / xCorrecting;
                const _Y = (offsetY - this.translateY) / yCorrecting;
                this.nodes[_index].x = Math.floor(_X) * xCorrecting; //校正X位移
                this.nodes[_index].y = Math.floor(_Y) * yCorrecting; //校正Y位移
              }
            } else {
              //双击长安拖动节点连线
              this.render();
              this.drawLine({
                sx: this.nodes[_index].x + this.translateX,
                sy: this.nodes[_index].y + this.translateY,
                x: offsetX,
                y: offsetY,
                _w: _lineW,
                _h: _h / 2,
              });
            }
          } else {
            //框选
            this.selectArea.startX = this.mouseDownXY.x - this.translateX;
            this.selectArea.startY = this.mouseDownXY.y - this.translateY;
            this.selectArea.endX = offsetX - this.translateX;
            this.selectArea.endY = offsetY - this.translateY;
            this.render();
            this.dragSelect(
              this.mouseDownXY.x,
              this.mouseDownXY.y,
              offsetX,
              offsetY
            );
          }
        }
      }
    };
  };

  onConectNode = (index: number, node: any) => {
    const { levelLimit } = this.lineCfg;
    if (levelLimit && node.point?.level < this.nodes[index]?.level) {
      return;
    }
    console.log(node);
    const _Y = (this.nodes[index].y - node.point?.y) / 2;
    this.lines = [...this.lines, {
      formNode: this.nodes[index].key,
      toNode: node.key,
      data: {},
      transition: [{ x: this.nodes[index].x, y: this.nodes[index].y - _Y }, { x: node.point?.x, y: node.point?.y + _Y }]
    }]
    console.log(this.lines);
    this.nodes[index] = {
      ...this.nodes[index],
      toNodes: [...this.nodes[index].toNodes, node.key],
      active: false,
    };
    this.onChange?.(this.nodes);
  };
  onListenMouseUp = () => {
    window.onmouseup = (event: MouseEvent) => {
      const { buttons } = event;
      if (buttons !== 1) {
        this.leftMouseDown = false;
      }
      if (!this.drawLineModel) {
        //非纯画线模式
        const { offsetX, offsetY } = event;
        const { activeKey, lastMouseUpTime, mouseDownXY } = this;
        const { x: _x, y: _y } = mouseDownXY;
        if (Math.abs(_x - offsetX) > 10 || Math.abs(_y - offsetY) > 10) {
          this.cancelDBClick = true; //当双击偏移位置较大取消掉双击事件
        } else {
          this.cancelDBClick = false;
        }
        if (activeKey !== null) {
          const _node = this.findRectInCanvas(
            offsetX - this.translateX,
            offsetY - this.translateY
          ); //找到鼠标抬起是否有置于某个节点上方
          const _index = this.getRectIndex(activeKey) ?? 0;
          if (_node && _node?.key !== activeKey) {
            this.onConectNode(_index, _node);
          }
          this.render();
        } else {
          //避免和点击事件混淆，过滤掉时间较短的框选事件
          const _time = new Date().valueOf() - lastMouseUpTime.valueOf() > 150;
          if (activeKey === null && _time) {
            this.findLineInCanvas();
          }
          this.render();
        }
        this.canvas.onmousemove = null;
      }
    };
  };
  onDragRect = (event: MouseEvent) => {
    this.onListenMouseMove(event);
    this.onListenMouseUp();
  };
  onListenDBClick() {
    this.canvas.ondblclick = (event: MouseEvent) => {
      if (!this.cancelDBClick) {
        const { offsetY, offsetX } = event;
        const { translateX: _X, translateY: _Y } = this;
        const _node = this.findRectInCanvas(offsetX - _X, offsetY - _Y);
        this.mouseDownXY.x = offsetX - _X;
        this.mouseDownXY.y = offsetY - _Y;
        this.findEditLine();
        this.findToolInCanvas(offsetX - _X, offsetY - _Y);
        if (_node) {
          //双击节点
          this.onDBClick?.({ node: _node, type: "node" });
        }
        if (this.activeTool) {
          //双击ICON
          this.onDBClick &&
            this.onDBClick({
              type: "tool",
              node: this.activeTool,
            });
        }
        if (this.editLine) {
          //双击线
          this.onDBClick?.({
            type: "line",
            node: this.editLine,
          });
        }
      } else {
        this.cancelDBClick = false;
      }
    };
  }
  onListenOnMouseDown = () => {
    this.canvas.onmousedown = (event: MouseEvent) => {
      this.activeKey = null;
      const { offsetX, offsetY, buttons, ctrlKey } = event;
      this.leftMouseDown = buttons === 1;
      if (this.drawLineModel) {
        //画线模式
        const _node = this.findRectInCanvas(
          offsetX - this.translateX,
          offsetY - this.translateY
        );
        if (_node) {
          if (!this.lineFormNodeKey) {
            this.lineFormNodeKey = _node?.key;
            this.onListenMouseMove(event);
          } else {
            const _fromNodes = this.lineFormNodeKey;
            const _index = this.getRectIndex(_fromNodes);
            const _toNodes = this.nodes[_index].toNodes;
            if (!_toNodes.includes(_node?.key) && _fromNodes !== _node?.key) {
              this.onConectNode(_index, _node);
            }
            this.lineFormNodeKey = null;
            this.activeKey = null;
            this.canvas.onmousemove = null;
            this.render();
          }
        } else {
          this.canvas.onmousemove = null;
          this.lineFormNodeKey = null;
          this.render();
        }
      } else {
        if (!ctrlKey) {
          //单击寻找高亮节点
          const _node = this.findRectInCanvas(
            offsetX - this.translateX,
            offsetY - this.translateY
          );
          const { lastMouseUpTime: _Time } = this;
          if (_Time) {
            const _time = new Date().valueOf() - _Time.valueOf() < 250;
            this.singleClick = !_time;
          }
          this.lastMouseUpTime = new Date().getTime();
          this.mouseDownXY.x = offsetX;
          this.mouseDownXY.y = offsetY;
          if (_node) {
            this.activeKey = _node?.key;
            this.editLine = null;
            this.activeLines = [];
            const _index = this.getRectIndex(_node?.key);
            const current = this.nodes[_index];
            if (current) {
              //更改节点顺序，canvas会绘制到最顶层
              this.nodes.splice(_index, 1);
              this.nodes.push({ ...current, active: true });
              this.onChange?.(this.nodes);
              this.render();
            }
          }
          this.onDragRect(event);
        } else {
          this.onListenMouseMove(event);
        }
      }
    };
  };
  createResetBtn() {
    const eli: HTMLDivElement = window.document.createElement("div");
    eli.innerHTML = "<div>还原</div>";
    eli.setAttribute("class", "flow-reset-btn flow-btn");
    eli.onclick = () => {
      this.resetPosition();
    };
    this.wrapper.appendChild(eli);
  }
  createLineBtn() {
    const eli: HTMLDivElement = window.document.createElement("div");
    eli.innerHTML = "<div>画线</div>";
    eli.setAttribute("class", "flow-line-btn flow-btn");
    eli.onclick = () => {
      this.onDrawLine();
    };
    this.drawElement = eli;
    this.wrapper.appendChild(eli);
  }
  onDrawLine() {
    if (this.drawElement) {
      if (!this.drawLineModel) {
        this.drawElement.innerHTML = "<div>取消</div>";
        this.drawLineModel = true;
      } else {
        this.drawElement.innerHTML = "<div>画线</div>";
        this.drawLineModel = false;
      }
    }
  }
  resize(wrapper: DOMRectReadOnly) {
    this.canvas.width = wrapper.width;
    this.canvas.height = wrapper.height;
    this.render();
  }
  resetPosition() {
    this.translateX = 0;
    this.translateY = 0;
    this.render();
  }
  render = () => {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
      this.ctx.save();
      this.ctx.translate(this.translateX, this.translateY);
      this.gradConfig && this.drawDrid()
      this.initCanvas();
      this.ctx.restore();
    }
  };
  getRectIndex(key: any): number {
    let index: number = 0;
    const { nodes } = this;
    for (let i = 0; i <= nodes?.length - 1; i++) {
      if (nodes[i]?.key === key) {
        index = i;
        return index;
      }
    }
    return index;
  }
  drawNodeInCanvas = (index: number) => {
    const { nodes, rectCfg, activeKey } = this;
    const {
      width,
      height,
      corner,
      bgImg,
      activeBgColor,
      bgColor,
      tool,
      textAlign,
      textMargin,
      shadowBlur,
      shadowColor
    } = rectCfg;
    const _node = nodes[index];
    const _tool = _node.tool ?? tool;
    this.drawRoundedRect({
      x: _node.x,
      y: _node.y,
      r: _node.corner ?? corner,
      active: activeKey === _node.key,
      bgImg: _node.bgImg ?? bgImg,
      hWidth: width / 2,
      hHeight: height / 2,
      bgColor,
      aBgColor: activeBgColor,
      shadowBlur,
      shadowColor
    });
    this.drawText({
      x: _node.x,
      y: _node.y,
      margin: textMargin,
      align: textAlign,
      title: _node.name,
      active: activeKey === _node.key,
      hWidth: width / 2,
      r: _node.corner ?? corner,
    });
    if (_tool) {
      this.drawTool(_tool, _node);
    }
  };
  drawTool = (tool: toolType, node: any) => {
    const { x: _x1, y: _y1 } = node;
    const { bgImg, title, x: _x2, y: _y2, corner, width, height } = tool;
    const _x = _x1 + _x2;
    const _y = _y1 + _y2;
    const _w = width / 2;
    const _h = height / 2;
    if (bgImg) {
      this.drawImage(bgImg, _x, _y, _w, _h);
    } else {
      this.drawRoundedRect({
        x: _x,
        y: _y,
        r: corner,
        active: false,
        hWidth: _w,
        hHeight: _h,
        bgColor: tool?.bgColor,
        aBgColor: tool?.activeBgColor,
        shadowColor: tool?.shadowColor,
        shadowBlur: tool?.shadowBlur
      });
    }
    if (title) {
      this.drawText({
        x: _x,
        y: _y,
        title,
        active: false,
        hWidth: _w,
        r: corner,
      });
    }
  };
  drawLineInCanvas = (_Snode: any, index: number) => {
    const { nodes, activeLines, rectCfg, lineCfg } = this;
    const { key: _key } = _Snode;
    const { height } = rectCfg;
    const { width, label } = lineCfg;
    const _index = this.getRectIndex(_Snode.toNodes[index]);
    const _subKey = _Snode.toNodes[index];
    const _Enode = nodes[_index];
    if (_Enode) {
      const active = activeLines.find((item: any) => {
        const { fromNodes: _fNodes, toNodes: _tNodes } = item;
        return _fNodes === _key && _tNodes === _subKey;
      });
      let _edit: boolean = false;
      if (this.editLine) {
        const { fromNodes, toNodes } = this.editLine;
        _edit = fromNodes === _key && toNodes === _subKey;
      }
      this.drawLine({
        sx: _Snode.x,
        sy: _Snode.y,
        x: _Enode.x,
        y: _Enode.y,
        _w: width,
        _h: height / 2,
        active: active ? true : false,
        aColor: _edit ? "red" : "orange",
        label,
      });
      this.dragTriangle({
        sy: _Snode.y,
        x: _Enode.x,
        y: _Enode.y,
        _w: width,
        _h: height / 2,
        _xDev: (width ?? 2) * 2.5,
        active: active ? true : false,
        aColor: _edit ? "red" : "orange",
      });
    }
  };
  initCanvas() {
    const { nodes, ctx } = this;
    if (ctx && nodes) {
      for (let i = 0; i <= nodes?.length - 1; i++) {
        this.drawNodeInCanvas(i);
        const _node = nodes[i];
        for (let j = 0; j <= _node.toNodes?.length - 1; j++) {
          this.drawLineInCanvas(_node, j);
        }
      }
    }
  }
  deleLine() {
    const { nodes, activeLines } = this;
    for (let i = 0; i <= activeLines?.length - 1; i++) {
      const _index = this.getRectIndex(activeLines[i]?.fromNodes);
      if (nodes[_index]) {
        nodes[_index].toNodes = nodes[_index]?.toNodes.filter(
          (a: any) => a !== activeLines[i].toNodes
        );
      }
    }
    this.onChange?.(nodes);
    this.activeLines = [];
  }
  deleRect() {
    const { nodes } = this;
    for (let i = 0; i <= nodes?.length - 1; i++) {
      nodes[i].toNodes = nodes[i].toNodes.filter((item: any) => {
        return item !== this.activeKey;
      });
    }
    const _index = this.getRectIndex(this.activeKey);
    nodes.splice(_index, 1);
    this.onChange?.(nodes);
    this.activeKey = null;
  }
  findToolInCanvas(x: number, y: number): any {
    let rect = null;
    const { nodes } = this;
    const { tool } = this.rectCfg;
    for (let i = nodes?.length - 1; i >= 0; i--) {
      const _tool: toolType | undefined = nodes[i]?.tool ?? tool;
      if (_tool) {
        const {
          x: _x = 0,
          y: _y = 0,
          corner: _r = 0,
          width: _w = 0,
          height: _h = 0,
        } = _tool;
        const _x1 = nodes[i].x + _x - x; //点击位置X偏移
        const _y1 = nodes[i].y + _y - y; //点击位置Y偏移
        const _hw = _w / 2; //宽度一半
        const _hy = _h / 2; //高度一半
        const realLen = Math.sqrt(Math.pow(_x1, 2) + Math.pow(_y1, 2)); //实际点击的位置距离矩形中心的距离
        const maxLen =
          Math.sqrt(Math.pow(_hw - _r, 2) + Math.pow(_hy - _r, 2)) + _r; //最外围距离矩形中心的距离
        if (
          x < nodes[i].x + _x + _hw &&
          x > nodes[i].x + _x - _hw &&
          y < nodes[i].y + _hy + _y &&
          y > nodes[i].y - _hy + _y
        ) {
          if (realLen < maxLen) {
            if (nodes[i].key !== this.activeKey) {
              rect = { point: nodes[i], key: nodes[i].key };
              break;
            }
          }
        }
      }
    }
    this.activeTool = rect;
  }
  findRectInCanvas(x: number, y: number): any {
    const { nodes, rectCfg } = this;
    const { width, height, corner } = rectCfg;
    const halfWidth = width / 2 || 50;
    const halfHeight = height / 2 || 15;
    for (let i = nodes?.length - 1; i >= 0; i--) {
      const r = nodes[i].corner ? nodes[i].corner ?? 0 : corner ?? 0;
      const realLen = Math.sqrt(
        Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2)
      );
      const maxLen =
        Math.sqrt(Math.pow(halfWidth - r, 2) + Math.pow(halfHeight - r, 2)) + r;
      if (
        x < nodes[i].x + halfWidth &&
        x > nodes[i].x - halfWidth &&
        y < nodes[i].y + halfHeight &&
        y > nodes[i].y - halfHeight
      ) {
        if (realLen < maxLen) {
          return { point: nodes[i], key: nodes[i].key };
        }
      }
    }
  }
  findLeftRightLine(X: number, Y1: number, Y2: number) {
    const { startY, endY, endX, startX } = this.selectArea;
    const xIsInterset = X < endX && X > startX;
    if (Y1 > Y2) {
      if (Y1 > endY && Y2 < startY) {
        return xIsInterset && true;
      }
    } else {
      if (Y2 > endY && Y1 < startY) {
        return xIsInterset && true;
      }
    }
    if (Y1 > startY && Y1 < endY) {
      return xIsInterset && true;
    } else if (Y2 > startY && Y2 < endY) {
      return xIsInterset && true;
    }
    return false;
  }
  findCenterLine(X1: number, Y: number, X2: number) {
    const { startY, endY, endX, startX } = this.selectArea;
    const yIsInterset = Y < endY && Y > startY;
    if (X1 > startX && X1 < endX) {
      return yIsInterset && true;
    } else if (X2 > startX && X2 < endX) {
      return yIsInterset && true;
    } else if (X1 < startX && X2 > startX) {
      return yIsInterset && true;
    } else if (X2 > endX && X1 < endX) {
      return yIsInterset && true;
    }
    return false;
  }
  findEditLine() {
    this.editLine = null;
    const { x, y } = this.mouseDownXY;
    for (let i = 0; i <= this.activeLines?.length - 1; i++) {
      let lineX = this.activeLines[i]?.x;
      let lineY = this.activeLines[i]?.y;
      if (x > lineX - 20 && x < lineX + 20 && y > lineY - 5 && y < lineY + 5) {
        this.editLine = this.activeLines[i];
      }
    }
    this.render();
  }
  findLineInCanvas() {
    const { nodes, rectCfg } = this;
    const { height } = rectCfg;
    this.activeLines = [];
    this.editLine = null;
    for (let i = nodes?.length - 1; i >= 0; i--) {
      for (let j = 0; j <= nodes[i].toNodes?.length - 1; j++) {
        const _Sx = nodes[i].x;
        const _Sy = nodes[i].y; //起点位置的X轴、Y轴
        const _index = this.getRectIndex(nodes[i].toNodes[j]);
        const _Ex = nodes[_index].x;
        const _Ey = nodes[_index].y; //终点位置的X轴、Y轴
        let halfY, firstLine, lastLine, centerLine; //halfY是指两个区域间中间一半的位置，firstLine是指出发后得第一条线，centerLine是中间线段，lastLine是出发后最后一条线
        const _height = height / 2 || 15; //高度的一半
        const _h = _height + 15; //处理线高度相差不大的情况
        if ((_Sy > _Ey && _Sy > _Ey + _h) || (_Sy < _Ey && _Sy < _Ey - _h)) {
          const _num = (_Sy - _Ey) / 2;
          halfY = _Sy < _Ey ? _Sy + Math.abs(_num) : _Ey + Math.abs(_num);
        } else {
          halfY = _Sy < _Ey ? _Sy - 15 - _height : _Sy + 15;
        }
        if (_Sx < _Ex) {
          firstLine = this.findLeftRightLine(_Sx, _Sy, halfY);
          centerLine = this.findCenterLine(_Sx, halfY, _Ex);
          lastLine = this.findLeftRightLine(_Ex, _Ey, halfY);
        } else {
          firstLine = this.findLeftRightLine(_Ex, _Ey, halfY);
          centerLine = this.findCenterLine(_Ex, halfY, _Sx);
          lastLine = this.findLeftRightLine(_Sx, _Sy, halfY);
        }
        if (firstLine || centerLine || lastLine) {
          //有一个条件满足即视为在选中区域
          let x = _Sx < _Ex ? _Sx + (_Ex - _Sx) / 2 : _Ex + (_Sx - _Ex) / 2;
          this.activeLines.push({
            fromNodes: nodes[i].key,
            toNodes: nodes[i].toNodes[j],
            x,
            y: halfY,
          });
        }
      }
    }
    this.render();
  }
  getXY = (margin) => {
    switch (margin.length) {
      case 1:
        return { x: margin[0], x2: margin[0], y: margin[0], y2: margin[0] }
      case 2:
        return { x: margin[1], x2: margin[1], y: margin[0], y2: margin[0] }
      case 3:
        return { x: margin[1], x2: margin[1], y: margin[0], y2: margin[2] }
      case 4:
        return { x: margin[3], x2: margin[1], y: margin[0], y2: margin[2] }
      default:
        return { x: 0, x2: 0, y: 0, y2: 0 }
    }
  }
  drawText({
    x = 0,
    y = 0,
    title = "",
    active = false,
    hWidth = 50,
    txtColor = "black",
    aTextColor = "white",
    fontSize = "11px",
    margin = [0, 0, 0, 0],
    align = "center",
    r = 5,
  }: drawTextType) {
    if (this.ctx) {
      this.ctx.fillStyle = txtColor;
      this.ctx.font = fontSize + " Arial";
      let txtX = 0;
      let txtY = 0;
      const _margin = this.getXY(margin)
      const txtWidth = this.ctx.measureText(title as string).width;
      const padding = r < 5 ? 5 : r;
      if (align === "center") {
        txtX = x - txtWidth / 2 + _margin?.x - _margin?.x2;
      } else if (align === "left") {
        txtX = x - hWidth + padding + _margin?.x - _margin?.x2;
      } else if (align === "right") {
        txtX = x + (hWidth - txtWidth) - padding + _margin?.x - _margin?.x2;
      }
      txtY = y + _margin?.y - _margin?.y2;
      active && (this.ctx.fillStyle = aTextColor);
      this.ctx.fillText(title as string, txtX, txtY);
    }
  }
  drawLine({
    sx = 0,
    sy = 0,
    x = 0,
    y = 0,
    active = false,
    _h = 15,
    _w = 2,
    color = "#50a9ff",
    aColor = "orange",
    label,
  }: drawLineType) {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.beginPath();
      if ((sy > y && sy > y + _h + 30) || (sy < y && sy < y - _h - 30)) {
        if (sy > y) {
          this.ctx.moveTo(sx, sy - _h);
        } else {
          this.ctx.moveTo(sx, sy + _h);
        }
        this.ctx.lineTo(sx, sy + (y - sy) / 2);
        this.ctx.lineTo(x, sy + (y - sy) / 2);
      } else {
        //上下相错位置不多的区域需要把线拉开连接
        if (sy > y) {
          this.ctx.moveTo(sx, sy + _h);
        } else {
          this.ctx.moveTo(sx, sy - _h);
        }
        this.ctx.lineTo(sx, sy + (sy > y ? 30 : -30));
        this.ctx.lineTo(x, sy + (sy > y ? 30 : -30));
      }
      if (sy > y) {
        this.ctx.lineTo(x, y + _h);
      } else {
        this.ctx.lineTo(x, y - _h);
      }
      this.ctx.lineWidth = _w;
      this.ctx.strokeStyle = color;
      active && (this.ctx.strokeStyle = aColor);
      this.ctx.stroke();
      this.ctx.restore();
      if (label && active) {
        this.drawLineRect(sx, sy, x, y);
      }
    }
  }
  dragTriangle({
    sy = 0,
    x = 0,
    y = 0,
    _w = 2,
    _h = 15,
    _xDev = 5,
    color = "#50a9ff",
    aColor = "orange",
    active = false,
  }: drawTriangleType) {
    if (this.ctx) {
      const _yDev = Math.sqrt(Math.pow(2 * _xDev, 2) - Math.pow(_xDev, 2));
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = color;
      active && (this.ctx.fillStyle = aColor);
      this.ctx.moveTo(x, y - (sy - y > 0 ? -_h : _h));
      this.ctx.lineTo(x - _xDev, y - (sy - y > 0 ? -_h - _yDev : _h + _yDev));
      this.ctx.lineTo(x + _xDev, y - (sy - y > 0 ? -_h - _yDev : _h + _yDev));
      this.ctx.lineTo(x, y - (sy - y > 0 ? -_h : _h));
      this.ctx.lineWidth = _w;
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
  }
  drawLineRect(sx: number, sy: number, ex: number, ey: number) {
    const { lineCfg } = this;
    const { label } = lineCfg;
    if (label) {
      const {
        width = 0,
        height = 0,
        title = "",
        bgColor = "red",
        corner = 0,
        bgImg,
        shadowBlur,
        shadowColor,
        textMargin,
        textAlign
      } = label;
      const _xDis = Math.abs((sx - ex) / 2); //X方向点的距离
      const xCenter = sx > ex ? ex + _xDis : sx + _xDis; //X方向中心点
      const _yDis = height / 2 + 30; //Y方向点的距离
      let yCenter: number = 0;
      if ((sy > ey && sy > ey + _yDis) || (sy < ey && sy < ey - _yDis)) {
        yCenter = sy + (ey - sy) / 2;
      } else {
        //上下相错位置不多的区域需要把线拉开连接
        yCenter = sy + (sy > ey ? 30 : -30);
      }
      if (bgImg) {
        this.drawImage(bgImg, xCenter, yCenter, width, height);
      } else {
        this.drawRoundedRect({
          x: xCenter,
          y: yCenter,
          r: corner,
          hWidth: width,
          hHeight: height,
          bgColor,
          shadowBlur,
          shadowColor
        });
      }
      if (title) {
        this.drawText({
          x: xCenter,
          y: yCenter,
          title: title,
          hWidth: width,
          r: corner,
          align: textAlign,
          margin: textMargin
        });
      }
    }
  }
  drawRoundedRect({
    x = 0,
    y = 0,
    r = 0,
    active = false,
    bgImg,
    hWidth = 50,
    hHeight = 15,
    shadowBlur,
    shadowColor = "rgba(0,0,0,0.3)",
    bgColor = "white",
    aBgColor = "#50a9ff",
  }: drawRoundedType) {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x - hWidth + r, y - hHeight);
      this.ctx.lineTo(x + hWidth - r, y - hHeight);
      this.ctx.arcTo(x + hWidth, y - hHeight, x + hWidth, y + r, r);
      this.ctx.lineTo(x + hWidth, y + hHeight - r);
      this.ctx.arcTo(x + hWidth, y + hHeight, x + hWidth - r, y + hHeight, r);
      this.ctx.lineTo(x - hWidth + r, y + hHeight);
      this.ctx.arcTo(x - hWidth, y + hHeight, x - hWidth, y + hHeight - r, r);
      this.ctx.lineTo(x - hWidth, y - hHeight + r);
      this.ctx.arcTo(x - hWidth, y - hHeight, x - hWidth + r, y - hHeight, r);
      shadowBlur && (this.ctx.shadowBlur = shadowBlur);
      shadowBlur && (this.ctx.shadowColor = shadowColor);
      !active && (this.ctx.fillStyle = bgColor);
      active && (this.ctx.fillStyle = aBgColor);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.restore();
      bgImg && this.drawImage(bgImg, x, y, hWidth, hHeight);
    }
  }
  drawImage(
    bgImg: CanvasImageSource,
    x: number = 0,
    y: number = 0,
    hWidth: number = 50,
    hHeight: number = 15
  ) {
    if (this.ctx && bgImg) {
      this.ctx.drawImage(
        bgImg,
        x - hWidth,
        y - hHeight,
        hWidth * 2,
        hHeight * 2
      );
    }
  }
  dragSelect(sx: number = 0, sy: number = 0, x: number = 0, y: number = 0) {
    //虚线框选框
    if (this.ctx) {
      this.ctx.save();
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
      this.ctx.restore();
    }
  }
  drawDrid() {
    if (this.ctx) {
      const { width: _w, height: _h } = this.canvas
      const { color = "#dddddd", space = 100, width = 0.5, type = "point", stepX = 20, stepY = 20 } = this.gradConfig
      this.ctx.save()
      this.ctx.strokeStyle = color;
      if (type === "line") {
        this.ctx.lineWidth = width;
        for (let i = -space; i < _w + space; i += stepX) {
          this.ctx.beginPath();
          this.ctx.moveTo(i, 0);
          this.ctx.lineTo(i, _h + space);
          this.ctx.closePath();
          this.ctx.stroke();
        }
        for (let j = -space; j < _h + space; j += stepY) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, j);
          this.ctx.lineTo(_w + space, j);
          this.ctx.closePath();
          this.ctx.stroke();
        }
      } else {
        for (let i = -space; i < _w + space; i += stepX) {
          for (let j = -space; j < _h + space; j += stepY) {
            this.ctx.beginPath();
            this.ctx.arc(i, j, width, 0, Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.stroke();
          }
        }
      }
      this.ctx.restore();
    }
  }
}

/*
 * @Author: your name
 * @Date: 2020-08-06 15:21:59
 * @LastEditTime: 2020-08-24 18:16:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\components\flowCom\drawCanvas.ts
 */
import { dragTriangle, drawLine, drawRoundedRect } from '../drawCanvas'

const action: any = {
  activeMoveRect: null,
  activeDeleRect: null,
  activeLines: [],
  singleClick: true,
  lastClickTime: null,
  lastMouseUpTime: null,
  mouseDownXY: { x: 0, y: 0 },
  selectArea: { startX: 0, startY: 0, endX: 0, endY: 0 },
  nodes: [],
  canvas: null,
  rectCfg: null,
  lineCfg: null,
  ctx: null,
  onChange: null,
  checkKeyDown: (event: any) => {
    if (event.keyCode === 46) {
      if (action.activeLines.length) {
        action.deleLine()
      }
      if (action.activeDeleRect !== null) {
        action.deleRect()
      }
      action.initCanvas()
    }
  },
  getRectIndex: (key: any) => {
    let index = 0
    const nodes = action.nodes
    for (let i = 0; i <= nodes.length - 1; i++) {
      if (nodes[i].key === key) {
        index = i
      }
    }
    return index
  },
  initCanvas: () => {
    const nodes = action.nodes
    action.ctx.clearRect(0, 0, action.canvas?.width, action.canvas?.height)
    for (let i = 0; i <= nodes.length - 1; i++) {
      for (let j = 0; j <= nodes[i].to.length - 1; j++) {
        const rectIndex = action.getRectIndex(nodes[i].to[j])
        const ENode = nodes[rectIndex]
        if (ENode) {
          const SNode = nodes[i]
          const active = JSON.stringify(action.activeLines).includes(JSON.stringify({ key: SNode.key, toKey: SNode.to[j] }))
          drawLine(action.lineCfg, action.rectCfg, action.ctx, SNode.x, SNode.y, ENode.x, ENode.y, active)
          dragTriangle(action.lineCfg, action.rectCfg, action.ctx, SNode.y, ENode.x, ENode.y, active)
        }
      }
    }
    for (let i = 0; i <= nodes.length - 1; i++) {
      const node = nodes[i]
      drawRoundedRect(action.rectCfg, action.ctx, node.x, node.y, node.corner, node.title, action.activeMoveRect === node.key, node.bgImg ?? action.rectCfg?.bgImg)
    }
  },
  deleLine: () => {
    const nodes = action.nodes
    const lines = action.activeLines
    for (let i = 0; i <= lines.length - 1; i++) {
      const rectIndex = action.getRectIndex(lines[i].key)
      if (nodes[rectIndex]) {
        nodes[rectIndex].to = nodes[rectIndex].to.filter((a: any) => a !== lines[i].toKey)
      }
    }
    action.onChange && action.onChange(nodes)
    action.activeLines = []
  },
  deleRect: () => {
    const nodes = action.nodes
    for (let i = 0; i <= nodes.length - 1; i++) {
      for (let j = 0; j <= nodes[i].to.length - 1; j++) {
        if (nodes[i].to[j] === action.activeDeleRect) {
          nodes[i].to = nodes[i].to.splice(action.getRectIndex(action.activeDeleRect), 1)
        }
      }
    }
    const rectIndex = action.getRectIndex(action.activeDeleRect)
    nodes.splice(rectIndex, 1)
    action.onChange && action.onChange(nodes)
    action.activeDeleRect = null
  },
  findRectInCanvas: (x: any, y: any) => {
    let rect = null
    const nodes = action.nodes
    const halfWidth = (action.rectCfg?.width / 2) || 50
    const halfHeight = (action.rectCfg?.height / 2) || 15
    for (let i = 0; i <= nodes.length - 1; i++) {
      const r = nodes[i].corner ? nodes[i].corner : action.rectCfg?.corner ?? 0
      const realLen = Math.sqrt(Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2))
      const maxLen = Math.sqrt(Math.pow(halfWidth - r, 2) + Math.pow(halfHeight - r, 2)) + r
      if ((x < nodes[i].x + halfWidth && x > nodes[i].x - halfWidth) && (y < nodes[i].y + halfHeight && y > nodes[i].y - halfHeight)) {
        if (realLen < maxLen) {
          if (nodes[i].key !== action.activeMoveRect) {
            rect = { point: nodes[i], key: nodes[i].key }
            break
          }
        }
      }
    }
    return rect
  },
  findLineInCanvas: () => {
    let line = {};
    const nodes = action.nodes
    action.activeLines = []
    for (let i = 0; i <= nodes.length - 1; i++) {
      for (let j = 0; j <= nodes[i].to.length - 1; j++) {
        const startX = nodes[i].x, startY = nodes[i].y;                                   //起点位置的X轴、Y轴
        const endIndex = action.getRectIndex(nodes[i].to[j])
        const endX = nodes[endIndex].x, endY = nodes[endIndex].y;           //终点位置的X轴、Y轴
        let halfY, firstLine, lastLine, centerLine, firstCircle;     //halfY是指两个区域间中间一半的位置，firstLine是指出发后得第一条线，centerLine是中间线段，lastLine是出发后最后一条线,firstCircle是指出发后第一个转折点
        if (startY < endY) {                       //如果线条从上往下画
          halfY = startY + (endY - startY) / 2
          firstCircle = (startX < action.selectArea.endX && startX > action.selectArea.startX) && (halfY < action.selectArea.endY && halfY > action.selectArea.startY)
          firstLine = (startX < action.selectArea.endX && startX > action.selectArea.startX) && (action.selectArea.startY > startY && action.selectArea.startY < halfY)
          lastLine = (action.selectArea.startX < endX && action.selectArea.endX > endX) && (action.selectArea.endY > halfY && action.selectArea.endY < endY)
        } else {                                        //如果线条从下往上画
          halfY = endY + (startY - endY) / 2
          firstCircle = (startX < action.selectArea.endX && startX > action.selectArea.startX) && (halfY < action.selectArea.endY && halfY > action.selectArea.startY)
          firstLine = (action.selectArea.endX > startX && action.selectArea.startX < startX) && (action.selectArea.startY > halfY && action.selectArea.startY < startY)
          lastLine = (action.selectArea.startX < endX && action.selectArea.endX > endX) && (action.selectArea.endY < halfY && action.selectArea.endY > endY)
        }
        if (startX > endX) {                       //中间的只处理X方向的大小关系
          centerLine = (action.selectArea.endX > endX && action.selectArea.endX < startX) && (action.selectArea.endY > halfY && action.selectArea.startY < halfY)
        } else {
          centerLine = (action.selectArea.endX > startX && action.selectArea.endX < endX) && (action.selectArea.endY > halfY && action.selectArea.startY < halfY)
        }
        if (firstLine || centerLine || lastLine || firstCircle) {      //有一个条件满足即视为在选中区域
          line = { key: nodes[i].key, toKey: nodes[i].to[j] }
          action.activeLines.push((line))
        }
      }
    }
    action.initCanvas(action.rectCfg, action.lineCfg, action.ctx, action.canvas, nodes)
  }
}
export default action

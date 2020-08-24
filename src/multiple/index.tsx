import React, { useEffect, useCallback, useRef } from 'react'
import { FlowProps } from '../types/index'
import { dragSelect, drawLine } from '../drawCanvas'
import action from '../actions'
const MultipleFlow: React.FC<FlowProps> = ({ flowNodes = [], rectConfig, lineCofig, onChange, onDBClick }) => {
  const canvas: any = useRef(null)
  const wrapper: any = useRef(null)
  useEffect(() => {
    action.rectCfg = rectConfig
    action.lineCfg = lineCofig
    action.onChange = onChange
  }, [rectConfig, lineCofig, onChange])
  useEffect(() => {
    window.addEventListener('keydown', action.checkKeyDown, true);
    if (rectConfig?.edit) {
      window.addEventListener('mouseup', () => {
        if ((new Date()).getTime() - action.lastMouseUpTime < 250) {
          action.singleClick = false
          const rectIndex = action.getRectIndex(action.activeMoveRect)
          const node = {
            node: action.nodes[rectIndex],
            index: rectIndex
          }
          onDBClick && onDBClick(node)
        }
        action.lastMouseUpTime = (new Date()).getTime()
      }, true);
    }
    return () => {
      window.removeEventListener('mouseup', null)
      window.removeEventListener('keydown', null)
    }
  }, [rectConfig.edit])
  useEffect(() => {
    action.nodes = flowNodes
    action.ctx && action.initCanvas()
  }, [flowNodes])
  const onMouseMove = useCallback((event: any) => {
    const ax = event.offsetX, ay = event.offsetY;
    if (action.activeMoveRect !== null) {
      const rectIndex = action.getRectIndex(action.activeMoveRect)
      if (action.singleClick) {
        if (action.nodes[rectIndex].active) {
          action.nodes[rectIndex].x = Math.floor(ax / (action.rectCfg?.xCorrecting ?? 10)) * (action.rectCfg?.xCorrecting ?? 10)
          action.nodes[rectIndex].y = Math.floor(ay / (action.rectCfg?.yCorrecting ?? 5)) * (action.rectCfg?.yCorrecting ?? 5)
        }
        action.initCanvas()
      } else {
        action.initCanvas()
        drawLine(action.lineCfg, action.rectCfg, action.ctx, action.nodes[rectIndex].x, action.nodes[rectIndex].y, ax, ay)
      }
    } else {
      action.activeDeleRect = null
      action.initCanvas()
      action.selectArea.startX = action.mouseDownXY.x;
      action.selectArea.startY = action.mouseDownXY.y;
      action.selectArea.endX = ax;
      action.selectArea.endY = ay;
      dragSelect(action.ctx, action.mouseDownXY.x, action.mouseDownXY.y, ax, ay)
    }
  }, [])
  const onDragRect = useCallback(() => {
    canvas.current.onmousemove = onMouseMove
    canvas.current.onmouseup = function (event: any) {
      const ax = event.offsetX, ay = event.offsetY;
      if (action.activeMoveRect !== null && !action.singleClick) {
        const activeMoveRectPoint = action.findRectInCanvas(ax, ay)
        const rectIndex = action.getRectIndex(action.activeMoveRect)
        if (activeMoveRectPoint) {
          action.nodes[rectIndex].to = [...action.nodes[rectIndex].to, activeMoveRectPoint.key]
          action.nodes[rectIndex].active = false
          onChange && onChange(action.nodes)
        }
        action.initCanvas()
      } else {
        if (action.activeMoveRect === null) {
          action.findLineInCanvas()
        }
      }
      action.activeMoveRect = null
      canvas.current.onmousemove = null;
      canvas.current.onmouseup = null;
    };
  }, [onMouseMove, onChange])
  const onMouseDown = useCallback((event: any) => {
    const x = event.offsetX, y = event.offsetY;
    if (action.lastClickTime) {
      action.singleClick = (new Date()).valueOf() - (action.lastClickTime).valueOf() < 250 ? false : true
    }
    action.lastClickTime = new Date()
    action.mouseDownXY.x = x;
    action.mouseDownXY.y = y;
    const activeMoveRectPoint = action.findRectInCanvas(x, y)
    if (activeMoveRectPoint) {
      action.activeMoveRect = activeMoveRectPoint?.key
      action.activeDeleRect = activeMoveRectPoint?.key
      const rectIndex = action.getRectIndex(activeMoveRectPoint?.key)
      const current = action.nodes[rectIndex]
      action.nodes[rectIndex].active = true
      action.nodes.splice(rectIndex, 1)
      action.nodes.push(current)
      onChange && onChange(action.nodes)
      action.initCanvas()
    }
    onDragRect();
  }, [onDragRect, onChange])
  useEffect(() => {
    if (wrapper.current && !action.canvas) {
      action.canvas = canvas.current
      canvas.current.width = wrapper.current.offsetWidth;
      canvas.current.height = wrapper.current.offsetHeight
      action.canvas.width = wrapper.current.offsetWidth;
      action.canvas.height = wrapper.current.offsetHeight
      action.ctx = canvas.current.getContext("2d");
      canvas.current.onmousedown = onMouseDown
      action.initCanvas()
    }
  }, [onMouseDown])
  return <div ref={wrapper} style={{ width: "100%", height: "100%" }}>
    <canvas ref={canvas} id="canvas"></canvas>
  </div>
}
export default MultipleFlow

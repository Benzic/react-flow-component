import React, { useEffect, useCallback, useRef } from 'react'
import { FlowProps } from '../types/index'
import { dragSelect } from '../drawCanvas'
import action from '../actions'
const SingleFlow: React.FC<FlowProps> = ({ flowNodes = [], rectConfig, lineCofig, onChange, onDBClick }) => {
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
      window.addEventListener('dblclick', () => {
        const rectIndex = action.getRectIndex(action.activeMoveRect)
        const node = {
          node: action.nodes[rectIndex],
          index: rectIndex
        }
        onDBClick && onDBClick(node)
      }, true);
    }
    return () => {
      window.removeEventListener('dblclick', null)
      window.removeEventListener('keydown', null)
    }
  }, [rectConfig.edit])
  const getSubWidth = useCallback(() => {
    for (let i = 0; i <= action.nodes.length - 1; i++) {
      let leftDis = action.nodes[i].x - ((action.nodes[i]?.total ?? 0) / 2)
      for (let j = action.nodes[i].to.length; j--;) {
        const rectIndex = action.getRectIndex(action.nodes[i].to[j])
        if (action.nodes[rectIndex].to.length) {
          action.nodes[rectIndex].x = leftDis + (action.nodes[rectIndex].total / 2)
          action.nodes[rectIndex].y = action.nodes[i].y + 100
          leftDis = leftDis + action.nodes[rectIndex].total
        } else {
          action.nodes[rectIndex].x = leftDis + ((action.rectCfg?.width ?? 100) * 1.25) / 2
          action.nodes[rectIndex].y = action.nodes[i].y + 100
          leftDis = leftDis + ((action.rectCfg?.width ?? 100) * 1.25)
        }
      }
    }
  }, [])
  const getSubNode = useCallback((to: any, len: number) => {
    for (let j = to.length; j--;) {
      const rectIndex = action.getRectIndex(to[j])
      if (!action.nodes[rectIndex].to.length) {
        len += 1
      } else {
        len = getSubNode(action.nodes[rectIndex].to, len)
      }
    }
    return len
  }, [])
  const changeParent = useCallback(() => {
    const rectIndex = action.getRectIndex(action.activeMoveRect)
    if (rectIndex !== null) {
      const parentIndex = action.getRectIndex(action.nodes[rectIndex].parent)
      if (parentIndex !== null) {
        action.nodes[parentIndex].to = action.nodes[parentIndex].to.filter((a: any) => {
          return a !== action.activeMoveRect
        })
      }
    }
  }, [])
  const onMouseMove = useCallback((event: any) => {
    const ax = event.offsetX, ay = event.offsetY;
    if (action.activeMoveRect !== null) {
      const rectIndex = action.getRectIndex(action.activeMoveRect)
      if (action.nodes[rectIndex].active) {
        action.nodes[rectIndex].x = Math.floor(ax / (action.rectCfg?.xCorrecting ?? 10)) * (action.rectCfg?.xCorrecting ?? 10)
        action.nodes[rectIndex].y = Math.floor(ay / (action.rectCfg?.yCorrecting ?? 5)) * (action.rectCfg?.yCorrecting ?? 5)
      }
      onChange && onChange(action.nodes)
      action.initCanvas()
    } else {
      action.activeDeleRect = null
      action.initCanvas()
      action.selectArea.startX = action.mouseDownXY.x;
      action.selectArea.startY = action.mouseDownXY.y;
      action.selectArea.endX = ax;
      action.selectArea.endY = ay;
      dragSelect(action.ctx, action.mouseDownXY.x, action.mouseDownXY.y, ax, ay)
    }
  }, [onChange])
  const onCheckPosition = useCallback((ax: any, ay: any) => {
    if (action.activeMoveRect !== null && action.singleClick) {
      const rectIndex = action.getRectIndex(action.activeMoveRect)
      const parentNode: any = action.findRectInCanvas(ax, ay)
      if (parentNode) {
        const parentIndex = action.getRectIndex(parentNode.key)
        if (action.activeMoveRect !== action.nodes[parentIndex].parent) {
          if ((action.activeMoveRect !== parentNode.key)) {
            changeParent()
            action.nodes[parentIndex].to = [...action.nodes[parentIndex].to, action.activeMoveRect]
            action.nodes[rectIndex].y = action.nodes[parentIndex].y + 100
            action.nodes[rectIndex].parent = parentNode.key
          } else {
            action.nodes[rectIndex].to = [...action.nodes[rectIndex].to, action.activeMoveRect]
          }
          for (let i = action.nodes.length; i--;) {
            action.nodes[i].total = getSubNode(action.nodes[i].to, 0) * ((action.rectCfg?.width ?? 100) * 1.25)
          }
        }
      }
      getSubWidth()
      action.nodes[rectIndex].active = false
      onChange && onChange(action.nodes)
      action.initCanvas()
      action.activeMoveRect = null
    } else {
      if (action.activeMoveRect === null) {
        action.findLineInCanvas()
      }
    }
  }, [getSubNode, changeParent, getSubWidth, onChange])
  useEffect(() => {
    action.nodes = flowNodes
    if (flowNodes.length) {
      action.activeMoveRect = flowNodes[flowNodes.length - 1].key
      action.activeDeleRect = flowNodes[flowNodes.length - 1].key
      onCheckPosition(flowNodes[flowNodes.length - 1].x, flowNodes[flowNodes.length - 1].y)
    }
  }, [flowNodes, onCheckPosition])
  const onDragRect = useCallback(() => {
    canvas.current.onmousemove = onMouseMove
    //鼠标移开事件
    canvas.current.onmouseup = function (event: any) {
      const ax = event.offsetX, ay = event.offsetY;
      onCheckPosition(ax, ay)
      canvas.current.onmousemove = null;
      canvas.current.onmouseup = null;
    };
  }, [onMouseMove, onCheckPosition])

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
    if (wrapper.current) {
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
export default SingleFlow

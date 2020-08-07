import React, { useEffect, useCallback, useRef } from 'react'
import { FlowProps } from '../interface'
import { dragSelect, drawLine } from '../drawCanvas'
import action from '../actions'
const MultipleFlow: React.FC<FlowProps> = ({ selectedKeys = [], mode, rectConfig, lineCofig, onChange, onEdit }) => {
    const canvas: any = useRef(null)
    const wrapper: any = useRef(null)
    useEffect(() => {
        action.rectCfg = rectConfig
        action.lineCfg = lineCofig
        action.onChange = onChange
        window.addEventListener('keydown', action.checkKeyDown, true);
        console.log(rectConfig,"-")
        if (rectConfig?.edit) {
            window.addEventListener('dblclick', () => {
                let rectIndex = action.getRectIndex(action.activeMoveRect)
                let node = {
                    node: action.nodes[rectIndex],
                    index: rectIndex
                }
                onEdit && onEdit(node)
            }, true);
        }
    }, [rectConfig, lineCofig, onChange, onEdit])
    useEffect(() => {
        console.log(selectedKeys)
        action.nodes = selectedKeys
        action.ctx &&  action.initCanvas()
    }, [selectedKeys])
    const onMouseMove = useCallback((event: any) => {
        let ax = event.offsetX, ay = event.offsetY;
        if (action.activeMoveRect !== null) {
            let rectIndex = action.getRectIndex(action.activeMoveRect)
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
            action.startX = action.mouseDownXY.x;
            action.selectArea.startY = action.mouseDownXY.y;
            action.selectArea.endX = ax;
            action.selectArea.endY = ay;
            dragSelect(action.ctx, action.mouseDownXY.x, action.mouseDownXY.y, ax, ay)
        }
    }, [])
    const onDragRect = useCallback(() => {
        canvas.current.onmousemove = onMouseMove
        canvas.current.onmouseup = function (event: any) {
            let ax = event.offsetX, ay = event.offsetY;
            if (action.activeMoveRect !== null && !action.singleClick) {
                let activeMoveRectPoint = action.findRectInCanvas(ax, ay)
                let rectIndex = action.getRectIndex(action.activeMoveRect)
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
        let x = event.offsetX, y = event.offsetY;
        if (action.lastClickTime) {
            action.singleClick = (new Date()).valueOf() - (action.lastClickTime).valueOf() < 250 ? false : true
        }
        action.lastClickTime = new Date()
        action.mouseDownXY.x = x;
        action.mouseDownXY.y = y;
        let activeMoveRectPoint = action.findRectInCanvas(x, y)
        if (activeMoveRectPoint) {
            action.activeMoveRect = activeMoveRectPoint?.key
            action.activeDeleRect = activeMoveRectPoint?.key
            const rectIndex = action.getRectIndex(activeMoveRectPoint?.key)
            let current = action.nodes[rectIndex]
            action.nodes[rectIndex].active = true
            action.nodes.splice(rectIndex, 1)
            action.nodes.push(current)
            onChange && onChange(action.nodes)
            action.initCanvas()
        }
        onDragRect();
    }, [onDragRect, onChange])
    useEffect(() => {
        console.log(wrapper.current)
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
export default MultipleFlow

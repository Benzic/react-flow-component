/*
 * @Author: your name
 * @Date: 2021-03-17 10:59:36
 * @LastEditTime: 2021-04-26 14:10:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\flow\mutiple.tsx
 */
import React, { useEffect, useCallback, useRef } from 'react'
import { Flow } from '../actions/index'
const MultipleFlow: React.FC<any> = ({ flowNodes = [], rectConfig, lineCofig, onChange, onDBClick }) => {
    const canvas: any = useRef(null)
    const wrapper: any = useRef(null)
    const flow: any = useRef(null)
    const singleClick: any = useRef(false)
    useEffect(() => {
        flow.current = new Flow(flowNodes, canvas.current, true, rectConfig, lineCofig, onChange, onDBClick);
    }, [rectConfig, lineCofig, flowNodes, onChange])
    const onMouseMove = useCallback((event: any) => {
        const ax = event.offsetX, ay = event.offsetY;
        if (flow.current.activeMoveRect !== null) {
            const rectIndex = flow.current.getRectIndex(flow.current.activeMoveRect)
            if (singleClick.current) {
                if (flow.current.nodes[rectIndex].active) {
                    flow.current.nodes[rectIndex].x = Math.floor(ax / (rectConfig?.xCorrecting ?? 10)) * (rectConfig?.xCorrecting ?? 10)
                    flow.current.nodes[rectIndex].y = Math.floor(ay / (rectConfig?.yCorrecting ?? 5)) * (rectConfig?.yCorrecting ?? 5)
                }
                flow.current.initCanvas()
            } else {
                flow.current.initCanvas()
                flow.current.drawLine(flow.current.nodes[rectIndex].x, flow.current.nodes[rectIndex].y, ax, ay)
            }
        } else {
            flow.current.activeDeleRect = null
            flow.current.initCanvas()
            flow.current.selectArea.startX = flow.current.mouseDownXY.x;
            flow.current.selectArea.startY = flow.current.mouseDownXY.y;
            flow.current.selectArea.endX = ax;
            flow.current.selectArea.endY = ay;
            flow.current.dragSelect(flow.current.mouseDownXY.x, flow.current.mouseDownXY.y, ax, ay)
        }
    }, [])
    const onDragRect = useCallback(() => {
        canvas.current.onmousemove = onMouseMove
        canvas.current.onmouseup = function (event: any) {
            const ax = event.offsetX, ay = event.offsetY;
            if (flow.current.activeMoveRect !== null && !singleClick.current) {
                const activeMoveRectPoint = flow.current.findRectInCanvas(ax, ay)
                const rectIndex = flow.current.getRectIndex(flow.current.activeMoveRect)
                if (activeMoveRectPoint) {
                    flow.current.nodes[rectIndex].toNodes = [...flow.current.nodes[rectIndex].toNodes, activeMoveRectPoint.key]
                    flow.current.nodes[rectIndex].active = false
                    onChange && onChange(flow.current.nodes)
                }
                flow.current.initCanvas()
            } else {
                if (flow.current.activeMoveRect === null) {
                    flow.current.findLineInCanvas()
                }
            }
            flow.current.activeMoveRect = null
            canvas.current.onmousemove = null;
            canvas.current.onmouseup = null;
        };
    }, [onMouseMove, onChange])
    const onMouseDown = useCallback((event: any) => {
        const x = event.offsetX, y = event.offsetY;
        if (flow.current.lastClickTime) {
            singleClick.current = (new Date()).valueOf() - (flow.current.lastClickTime).valueOf() < 250 ? false : true
        }
        flow.current.lastClickTime = new Date()
        flow.current.mouseDownXY.x = x;
        flow.current.mouseDownXY.y = y;
        const activeMoveRectPoint = flow.current.findRectInCanvas(x, y)
        if (activeMoveRectPoint) {
            flow.current.activeMoveRect = activeMoveRectPoint?.key
            flow.current.activeDeleRect = activeMoveRectPoint?.key;
            flow.current.editLine = null
            flow.current.activeLines = []
            const rectIndex = flow.current.getRectIndex(activeMoveRectPoint?.key)
            const current = flow.current.nodes[rectIndex]
            flow.current.nodes[rectIndex].active = true
            flow.current.nodes.splice(rectIndex, 1)
            flow.current.nodes.push(current)
            onChange && onChange(flow.current.nodes)
            flow.current.initCanvas()
        }
        onDragRect();
    }, [onDragRect, onChange])
    useEffect(() => {
        if (wrapper.current) {
            canvas.current.width = wrapper.current.offsetWidth;
            canvas.current.height = wrapper.current.offsetHeight
            canvas.current.onmousedown = onMouseDown
        }
    }, [onMouseDown])
    return <div ref={wrapper} style={{ width: "100%", height: "100%" }}>
        <canvas ref={canvas} id="canvas"></canvas>
    </div>
}
export default MultipleFlow

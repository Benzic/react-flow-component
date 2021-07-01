/*
 * @Author: benzic
 * @Date: 2021-03-17 10:59:36
 * @LastEditTime: 2021-06-24 15:43:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-app\src\flow\mutiple.tsx
 */
import React, { useEffect, useRef } from "react";
import { Flow } from "../actions/index";
import ResizeObserver from "resize-observer-polyfill";
import "./index.less";
import {
    nodeType,
    lineCfg,
    rectCfg,
    grdCfg,
    dbClickType,
} from "./../types/index";
const MultipleFlow: React.FC<{
    flowNodes: nodeType[],
    rectConfig?: rectCfg,
    lineConfig?: lineCfg,
    gradConfig?: grdCfg,
    onChange?: (val: any) => void,
    onDBClick?: (val: dbClickType) => void;
    onChangePosition?: (val: { translateX: number; translateY: number }) => void;
}> = ({
    flowNodes = [],
    rectConfig,
    lineConfig,
    gradConfig,
    onChange,
    onDBClick,
    onChangePosition,
}) => {
        const canvas: any = useRef(null);
        const wrapper: any = useRef(null);
        const flow: any = useRef(null);
        const resizeObserver = new ResizeObserver((entries) => {
            flow.current.resize(entries[0].contentRect);
        });
        useEffect(() => {
            resizeObserver.observe(wrapper.current);
            flow.current = new Flow({
                flowNodes,
                canvas: canvas.current,
                wrapper: wrapper.current,
                rectConfig,
                lineConfig,
                gradConfig,
                onChange,
                onDBClick,
                onChangePosition,
            });
        }, []);
        useEffect(() => {
            flow.current.nodes = flowNodes;
            flow.current.resetValues();
        }, [flowNodes]);
        return (
            <div
                ref={wrapper}
                style={{ width: "100%", height: "100%", position: "relative" }}
            >
                <canvas ref={canvas} id="canvas"></canvas>
            </div>
        );
    };
export default MultipleFlow;

import React from "react";
import "./index.less";
import { nodeType, lineCfg, rectCfg, grdCfg, dbClickType } from "./../types/index";
declare const MultipleFlow: React.FC<{
    flowNodes: nodeType[];
    rectConfig?: rectCfg;
    lineConfig?: lineCfg;
    gradConfig?: grdCfg;
    onChange?: (val: any) => void;
    onDBClick?: (val: dbClickType) => void;
    onChangePosition?: (val: {
        translateX: number;
        translateY: number;
    }) => void;
}>;
export default MultipleFlow;

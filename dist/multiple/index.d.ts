import React from "react";
import "./index.less";
import { nodeType, lineCfg, rectCfg, grdCfg, dbClickType, lineType } from "./../types/index";
declare const MultipleFlow: React.FC<{
    flowNodes: nodeType[];
    flowLines?: lineType[];
    rectConfig?: rectCfg;
    lineConfig?: lineCfg;
    cref?: any;
    gradConfig?: grdCfg;
    onChange?: (val: any) => void;
    onConnect?: (val: any) => boolean;
    onDBClick?: (val: dbClickType) => void;
    onChangePosition?: (val: {
        translateX: number;
        translateY: number;
    }) => void;
}>;
export default MultipleFlow;

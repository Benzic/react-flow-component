import React, { useCallback, useRef, useState } from 'react';
import { render } from 'react-dom';
// import Renderer from '../../dist';
import { MultipleFlow } from '../../src/index';
import './index.less'
const treeData = [
    {
        title: '检测集中性分析',
        key: '0-0',
        children: [
            { title: '分析子项A01', key: '0-0-1', type: 1 },
            { title: '分析子项A02', key: '0-0-2', type: 1 },
            { title: '分析子项A03', key: '0-0-3', type: 2 },
            { title: '分析子项A04', key: '0-0-4', type: 2 },
        ],
    },
    {
        title: 'Map分析',
        key: '0-1',
        children: [
            { title: '分析子项B01', key: '0-1-1', type: 1 },
            { title: '分析子项B02', key: '0-1-2', type: 1 },
            { title: '分析子项B03', key: '0-1-3', type: 2 },
            { title: '分析子项B04', key: '0-1-4', type: 2 },
        ],
    },
    {
        title: '工艺路径分析',
        key: '0-2',
        children: [
            { title: '分析子项C01', key: '0-2-1', type: 1 },
            { title: '分析子项C02', key: '0-2-2', type: 1 },
            { title: '分析子项C03', key: '0-2-3', type: 2 },
            { title: '分析子项C04', key: '0-2-4', type: 2 },
        ],
    },
    {
        title: '工艺履历分析',
        key: '0-3',
        children: [
            { title: '分析子项D01', key: '0-3-1', type: 1 },
            { title: '分析子项D02', key: '0-3-2', type: 1 },
            { title: '分析子项D03', key: '0-3-3', type: 2 },
            { title: '分析子项D04', key: '0-3-4', type: 2 },
        ],
    },
    {
        title: '过程品质分析',
        key: '0-4',
        children: [
            { title: '分析子项E01', key: '0-4-1', type: 1 },
            { title: '分析子项E02', key: '0-4-2', type: 1 },
            { title: '分析子项E03', key: '0-4-3', type: 2 },
            { title: '分析子项E04', key: '0-4-4', type: 2 },
        ],
    },
    {
        title: '工艺参数分析',
        key: '0-5',
        children: [
            { title: '分析子项F01', key: '0-5-1', type: 1 },
            { title: '分析子项F02', key: '0-5-2', type: 1 },
            { title: '分析子项F03', key: '0-5-3', type: 2 },
            { title: '分析子项F04', key: '0-5-4', type: 2 },
        ],
    },
    {
        title: '工艺原料分析',
        key: '0-6',
        children: [
            { title: '分析子项G01', key: '0-6-1', type: 1 },
            { title: '分析子项G02', key: '0-6-2', type: 1 },
            { title: '分析子项G03', key: '0-6-3', type: 2 },
            { title: '分析子项G04', key: '0-6-4', type: 2 },
        ],
    },
];
const App: React.SFC = () => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [zIndex, setZindex] = useState(0)
    const [currentKey, setCurrentKey] = useState(null)
    const [showKeys, setShowKeys] = useState([])
    const [editKey, setEditKey] = useState(null)
    const dragBox = useRef(null)
    window.ondragstart = function (event) {
        console.log(event)
        setZindex(100)
        var evt = event || window.event;
        setCurrentKey({
            x: evt.clientX - evt.target.offsetLeft,
            y: evt.clientY - evt.target.offsetTop,
            title: evt.target.dataset.title,
            key: evt.target.dataset.key
        })
    }
    window.ondragover = function (event) {
        event.preventDefault()
    }
    window.ondragenter = function (event) {
        event.preventDefault()
    }
    window.ondrop = function (event) {
        var evt = event || window.event;
        var offset_x = currentKey.x, offset_y = currentKey.y;//偏移
        evt.preventDefault();
        setZindex(0)
        if (!JSON.stringify(selectedKeys).includes('"key":"' + currentKey.key + '"')) {
            setSelectedKeys([...selectedKeys, {
                title: currentKey.title,
                key: currentKey.key,
                x: evt.clientX - offset_x + 50 - 200,
                y: evt.clientY - offset_y + 15,
                active: false,
                to: []
            }]);
        }
    }
    return <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <div style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0, zIndex: zIndex }}>
            {
                treeData.map((item, index) => {
                    return <div className={`list_sub ${showKeys.includes(index) ? 'list_sub_active' : ''}`} ref={dragBox} key={item.key} >
                        <div draggable className="list_title" onClick={() => {
                            if (showKeys.indexOf(index) !== -1) {
                                showKeys.splice(showKeys.indexOf(index), 1)
                                setShowKeys(showKeys)
                            } else {
                                setShowKeys([...showKeys, index])
                            }
                        }} key={item.key} data-title={item.title} data-key={item.key}>{item.title}</div>
                        {item.children.map((itx) => {
                            return <div draggable className="list_child" key={itx.key} data-title={itx.title} data-key={itx.key}>
                                {itx.title}
                            </div>
                        })}
                    </div>
                })
            }
        </div>
        <div style={{ marginLeft: "200px", width: "calc(100% - 200px)", height: "100%", position: "relative", zIndex: 10, background: "#ddd" }}>
            <MultipleFlow selectedKeys={selectedKeys}></MultipleFlow>
        </div>
        {/* <div style={{ marginLeft: "200px", width: "calc(100% - 200px)", height: "100%", position: "relative", zIndex: "10", background: "#ddd" }}>
        <SingleFlow selectedKeys={selectedKeys}></SingleFlow>
    </div> */}
    </div>;
};
render(<App />, document.querySelector('#app'));
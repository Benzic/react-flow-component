import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { MultipleFlow } from '../../src/index';
import './index.less'
const treeData = [
  {
    name: '测试7',
    key: '0-0',
    children: [
      { name: '子项A01', key: '0-0-1', type: 1 },
      { name: '子项A02', key: '0-0-2', type: 1 },
      { name: '子项A03', key: '0-0-3', type: 2 },
      { name: '子项A04', key: '0-0-4', type: 2 },
    ],
  },
  {
    name: '测试6',
    key: '0-1',
    children: [
      { name: '子项B01', key: '0-1-1', type: 1 },
      { name: '子项B02', key: '0-1-2', type: 1 },
      { name: '子项B03', key: '0-1-3', type: 2 },
      { name: '子项B04', key: '0-1-4', type: 2 },
    ],
  },
  {
    name: '测试5',
    key: '0-2',
    children: [
      { name: '子项C01', key: '0-2-1', type: 1 },
      { name: '子项C02', key: '0-2-2', type: 1 },
      { name: '子项C03', key: '0-2-3', type: 2 },
      { name: '子项C04', key: '0-2-4', type: 2 },
    ],
  },
  {
    name: '测试4',
    key: '0-3',
    children: [
      { name: '子项D01', key: '0-3-1', type: 1, level: 1, },
      { name: '子项D02', key: '0-3-2', type: 1 },
      { name: '子项D03', key: '0-3-3', type: 2 },
      { name: '子项D04', key: '0-3-4', type: 2 },
    ],
  },
  {
    name: '测试3',
    key: '0-4',
    children: [
      { name: '子项E01', key: '0-4-1', type: 1, level: 2 },
      { name: '子项E02', key: '0-4-2', type: 1, level: 3 },
      { name: '子项E03', key: '0-4-3', type: 2 },
      { name: '子项E04', key: '0-4-4', type: 2 },
    ],
  },
  {
    name: '测试2',
    key: '0-5',
    children: [
      { name: '子项F01', key: '0-5-1', type: 1, level: 3 },
      { name: '子项F02', key: '0-5-2', type: 1, level: 3 },
      { name: '子项F03', key: '0-5-3', type: 2, level: 3 },
      { name: '子项F04', key: '0-5-4', type: 2, level: 3 },
    ],
  },
  {
    name: '测试1',
    key: '0-6',
    children: [
      { name: '子项G01', key: '0-6-1', type: 1 },
      { name: '子项G02', key: '0-6-2', type: 1 },
      { name: '子项G03', key: '0-6-3', type: 2 },
      { name: '子项G04', key: '0-6-4', type: 2 },
    ],
  },
];
const App: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [zIndex, setZindex] = useState(0)
  const [currentKey, setCurrentKey] = useState(null)
  const [showKeys, setShowKeys] = useState([])
  const [lineList, setLineList] = useState([])
  const dragBox = useRef(null)
  window.ondragstart = function (event) {
    setZindex(100)
    const evt = event || window.event;
    setCurrentKey({
      x: evt.clientX - evt.target.offsetLeft,
      y: evt.clientY - evt.target.offsetTop,
      name: evt.target.dataset.name,
      key: evt.target.dataset.key,
      level: evt.target.dataset.level
    })
  }
  window.ondragover = function (event) {
    event.preventDefault()
  }
  window.ondragenter = function (event) {
    event.preventDefault()
  }
  window.ondrop = function (event) {
    const evt = event || window.event;
    const offset_x = currentKey.x, offset_y = currentKey.y;//偏移
    evt.preventDefault();
    setZindex(0)
    if (!JSON.stringify(selectedKeys).includes('"key":"' + currentKey.key + '"')) {
      setSelectedKeys([...selectedKeys, {
        name: currentKey.name,
        key: currentKey.key,
        x: evt.clientX - offset_x + 50 - 200,
        y: evt.clientY - offset_y + 15,
        active: false,
        toNodes: [],
        level: currentKey.level
      }]);
    }
  }
  return <div style={{ width: "100%", height: "100%", display: "flex" }}>
    <div style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0, zIndex: zIndex }}>
      {
        treeData.map((item, index) => {
          return <div className={`list_sub ${showKeys.includes(index) ? 'list_sub_active' : ''}`} ref={dragBox} key={item.key} >
            <div draggable className="list_name" onClick={() => {
              if (showKeys.indexOf(index) !== -1) {
                showKeys.splice(showKeys.indexOf(index), 1)
                setShowKeys(showKeys);
              } else {
                setShowKeys([...showKeys, index])
              }
            }} key={item.key} data-name={item.name}  data-key={item.key}>{item.name}</div>
            {item.children.map((itx) => {
              return <div draggable className="list_child" key={itx.key} data-level={itx.level} data-name={itx.name} data-key={itx.key}>
                {itx.name}
              </div>
            })}
          </div>
        })
      }
    </div>
    <div style={{ marginLeft: "200px", width: "calc(100% - 200px)", height: "100%", position: "relative", zIndex: 10 }}>
      <MultipleFlow onDBClick={(val) => {
        console.log(val)
      }} rectConfig={{
        width: 100,
        height: 30,
        activeBgColor: "red",
        bgColor: "white",
        shadowBlur: 20,
        shadowColor: "rgba(0,0,0,0.2)",
        textMargin: [5, 0, 0, 0],
        tool: {
          x: 50,
          y: 30,
          width: 15,
          height: 15,
          bgColor: "green"
        }
      }} lineConfig={{
        move: true,
        label: {
          title: "编辑",
          width: 16,
          height: 8,
          bgColor: "orange",
          txtColor: "white",
          fontSize: "9px"
        },
        levelLimit: false
      }} flowLines={lineList} gradConfig={{ type: "point", color: "#999" }} flowNodes={selectedKeys} onChange={(val) => {
        console.log(val)
        setLineList(val.lines)
      }} onConnect={(val) => {
        console.log(val);
        if (!val.ENode.level) {
          return false
        }
        if (val.FNode.level > val.ENode.level) {
          return false
        }
        return true
      }}></MultipleFlow>
    </div>
  </div>;
};
render(<App />, document.querySelector('#app'));
# React-flow-component

基于react+typescript开发，react生态下的work-flow组件，提供单根节点的SingleFlow组件和不限制根节点的MultipleFlow组件。

### 安装方法

##### npm安装

npm i react-flow-compoent 

##### yarn安装

yarn add react-flow-component

### 引入

``` import { MultipleFlow } from 'react-flow-component' 

```

``` <MultipleFlow rectConfig={{ width: 100, height:30 }} flowNodes={flowNodes}></MultipleFlow> ```

##### MultipleFlow 双击长按连线 单击拖动 双击编辑

![multipleFlow.gif](https://upload-images.jianshu.io/upload_images/2669301-b959212d1cd99bbd.gif?imageMogr2/auto-orient/strip)

##### 更改corner 修改样式  以下是直接全局统一配置flow节点样式，也可以单独配置flow节点样式

```
  <MultipleFlow rectConfig={{
        activeBgColor: "red",
        bgColor: "green",
        corner: 50,
        width: 100,
        height: 100,
        autoY: 200
      }} flowNodes={selectedKeys}></MultipleFlow>
```

![changeConfig.gif](https://upload-images.jianshu.io/upload_images/2669301-d0dad9339abbeddc.gif?imageMogr2/auto-orient/strip)

示例具体代码见：[https://github.com/Benzic/react-flow-component/blob/master/example/src/index.tsx](https://github.com/Benzic/react-flow-component/blob/master/example/src/index.tsx)

### API

##### FlowProps配置项

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| flowNodes  | flow节点 |nodeType[]  | - |
| flowLines  | flow线条 |lineType[]  | - |
| rectConfig  | flow节点统一配置项 |rectCofigType  | - |
| lineCofig  | flow连线配置项 |lineCofigType  | - |
| onDBClick  | 节点为可编辑事件双击会触发 |(val)=>void  | - |
| onChange  | 节点的位置、删除、线条等改变触发 |(val：nodeType[])=>void  | - |
| onConnect  | 节点连接触发 |({FNode:nodeType, ENode:nodeType})=>void  | - |
| onChangePosition  | 画布位移触发 |({
  translateX:number, translateY:number
})=>void  | - |

##### Flow节点统一配置项 rectConfig

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| width  | 节点宽度 |number  | 100 |
| height  | 节点高度 |number | 30 |
| xCorrecting  | X方向移动校正位置 |number | 10|
| yCorrecting  | Y方向移动校正位置 |number | 5 |
| activeBgColor  |节点激活背景颜色  | string | #40a9ff|
| bgColor  | 节点背景颜色 |string  | #ffffff |
| bgImg  | 节点背景图片 |CanvasImageSource  | - |
| shadowBlur  | 节点阴影范围 |number  | - |
| shadowColor  | 节点阴影颜色 |string  |  rgba(0, 0, 0, 0.3) |
| corner  | 节点圆角(如果是正方形圆角为大于长宽一半则绘制节点为圆形) |number  | 0 |
| textMargin  | 文本位置偏移 |number[] | [] |
| textAlign  | 节点字体水平位置 | center \| left \| right | center |
| fontSize  | 节点显示文本的字体大小 |string | 12px |
| txtColor| 节点的字体颜色 |string | #000000 |
| align| 节点字体水平位置 |string|水平垂直居中显示 left\|center \| right |
| tool  | 节点上的按钮 | toolType | - |
| textEllipsis  | 文本省略 | boolean | false |

##### Flow连线的配置项 lineCofig

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| levelLimit  | 开启线条链接层级限制  | boolean | false|
| move  | 是否允许线拖动 | boolean  | false |
| width  | 线条宽度 |number  | 2 |
| label  | 线条label |labelType  | - |

##### Flow节点的配置项 nodeType

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| x  |flow节点初始X坐标 | number |必传|
| y  | flow节点初始Y坐标 |number  |必传|
| key  | flow节点key值(必须为唯一值) |string\|number  | 必传 |
| toNodes  | flow节点连接的子节点key集合 |string[]\|number[]  | - |
| fromNodes  | flow节点连接的父节点key集合 |string[]\|number[]  | - |
| active  | flow节点是否激活 |boolean  | false |
| name  | flow节点显示文本 | string | - |
| bgImg  | 节点背景图片 |CanvasImageSource  | - |
| corner  | 节点圆角(如果是正方形圆角为大于长宽一半则绘制节点为圆形) |number  | 0 |
| level  | flow节点层级 用于判断连接关系高level可以链接低level节点 | string | number | - |
| tool  | flow节点按钮 | toolType | - |

##### Flow节点的配置项 toolType

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| x  | 初始X坐标 | number |-|
| y  | 初始Y坐标 | number  |-|
| width  | tool宽 |number  | - |
| height  | too高 |number  | - |
| active  | 是否激活 |boolean  | false |
| title  | 显示文本 | string | - |
| bgImg  | 背景图片 |CanvasImageSource  | - |
| corner  | 圆角(如果是正方形圆角为大于长宽一半则绘制节点为圆形) |number  | 0 |
| bgColor  | tool背景颜色 |string  | - |
| activeBgColor  | tool高亮背景颜色 |string | - |
| shadowBlur  | 阴影范围 | number | - |
| shadowColor  | 阴影颜色 | string | - |

##### Flow节点的配置项 labelType

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| width  | tool宽 |number  | - |
| height  | too高 |number  | - |
| active  | 是否激活 |boolean  | false |
| title  | 显示文本 | string | - |
| txtColor| 节点的字体颜色 |string |- |
| fontSize  | 节点显示文本的字体大小 |string | 12px |
| aTextColor| 高亮节点的字体颜色 |string | - |
| textMargin  | 文本位置偏移 |number[] | [] |
| textAlign  | 节点字体水平位置 | center \| left \| right | center |
| bgImg  | 背景图片 |CanvasImageSource  | - |
| corner  | 圆角(如果是正方形圆角为大于长宽一半则绘制节点为圆形) |number  | 0 |
| bgColor  | tool背景颜色 |string  | - |
| shadowBlur  | 阴影范围 | number | - |
| shadowColor  | 阴影颜色 | string | - |

##### Flow节点的配置项 grdCfg

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| color  | 网格颜色 |string  | #dddddd|
| space  | 网格范围外多余空间 |number  | 100 |
| width  | 网格线粗 | number | 0.5 |
| type  | 网格样式 | point\|line | point |
| stepX  | X方向距离 | number | - |
| stepY  | Y方向距离 | number | - |

##### Flow节点的配置项 dbClickType

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| type  | 点击类型 |point\|line \|tool  |-|
| node  | 点击对象 |rectType |lineType   | - |

##### Flow节点的配置项 lineType

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| x  | 初始X坐标 | number |必传|
| y  |  初始Y坐标 |number  |必传|
| toNodes  |  连接的子节点key集合 |string[]\|number[]  | - |
| fromNodes  |  连接的父节点key集合 |string[]\|number[]  | - |
| data  |  额外参数 | object  | - |
| turnPoints  |  转折点集合 | {x:number, y:number}[] | - |

##### Flow节点的配置项 rectType

|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| key  | 节点key | number | string |-|
| point  |  节点信息 |nodeType  |-|

# 使用反馈

希望有什么bug和意见都可以告诉我，谢谢。

github地址：[https://github.com/Benzic/react-flow-component](https://github.com/Benzic/react-flow-component)

# React-flow-component
基于react+typescript开发，react生态下的work-flow组件，提供单根节点的SingleFlow组件和不限制根节点的MultipleFlow组件。

### 安装方法
##### npm安装
npm i react-flow-compoent 
##### yarn安装
yarn add react-flow-component

### 引入
``` import { MultipleFlow，SingleFlow } from 'react-flow-component' ```  

``` <MultipleFlow rectConfig={{ width: 100, height:30 }} flowNodes={flowNodes}></MultipleFlow> ```
##### MultipleFlow 双击长按连线 单击拖动 双击编辑
![multipleFlow.gif](https://upload-images.jianshu.io/upload_images/2669301-b959212d1cd99bbd.gif?imageMogr2/auto-orient/strip)
##### SingleFlow 单击拖动 双击编辑 
![singleFlow.gif](https://upload-images.jianshu.io/upload_images/2669301-4306d4c35360eeca.gif?imageMogr2/auto-orient/strip)

##### 更改corner 修改样式  以下是直接全局统一配置flow节点样式，也可以单独配置flow节点样式
```
  <SingleFlow rectConfig={{
        activeBgColor: "red",
        bgColor: "green",
        corner: 50,
        width: 100,
        height: 100,
        autoY: 200
      }} flowNodes={selectedKeys}></SingleFlow>
```
![changeConfig.gif](https://upload-images.jianshu.io/upload_images/2669301-d0dad9339abbeddc.gif?imageMogr2/auto-orient/strip)

示例具体代码见：[https://github.com/Benzic/react-flow-component/blob/master/example/src/index.tsx](https://github.com/Benzic/react-flow-component/blob/master/example/src/index.tsx)

### API
##### FlowProps配置项
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| flowNodes  | flow节点 |itemNodeType[]  | - |
| rectConfig  | flow节点统一配置项 |rectCofigType  | - |
| lineCofig  | flow连线配置项 |lineCofigType  | - |
| onDBClick  | 节点为可编辑事件双击会触发 |(val)=>void  | - |
| onChange  | 节点的位置、删除、线条等改变触发 |(val：itemNodeType[])=>void  | - |

##### Flow节点统一配置项 rectConfig
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| activeBgColor  |节点激活背景颜色  | string | #40a9ff|
| bgColor  | 节点背景颜色 |string  | #ffffff |
| corner  | 节点圆角(如果是正方形圆角为大于长宽一半则绘制节点为圆形) |number  | 0 |
| width  | 节点宽度 |number  | 100 |
| height  | 节点高度 |number | 30 |
| xCorrecting  | X方向移动校正位置 |number | 10|
| yCorrecting  | Y方向移动校正位置 |number | 5 |
| fontSize  | 节点显示文本的字体大小 |string | 12px |
| txtColor| 节点的字体颜色 |string | #000000 |
| activeTxtColor| 节点的高亮字体颜色 |string| #ffffff |
| align| 节点字体水平位置 |string|水平垂直居中显示 left\|center \| right |
| edit  | 节点是否支持编辑 |boolean | false |
| autoX  | singleFlow子节点挂载到父节点后X方向偏移的位置 |number | 100 |
| autoY  | singleFlow子节点挂载到父节点后Y方向偏移的位置 |number | 0 |
##### Flow连线的配置项 lineCofig
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| activeColor  |线条激活颜色  | string | #40a9ff|
| color  | 线条颜色 |string  | #ffffff |
| width  | 线条宽度 |number  | 2 |

##### Flow节点的配置项 itemNodeType
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| x  |flow节点初始X坐标 | string |必传|
| y  | flow节点初始Y坐标 |string  |必传|
| width  | flow节点宽度 |number  | 100 |
| height  | flow节点高度 |number  | 30 |
| title  | flow节点显示文本 |string  | - |
| key  | flow节点key值(必须为唯一值) |string\|number  | 必传 |
| to  | flow节点连接的子节点key集合 |string[]\|number[]  | - |
| active  | flow节点是否激活 |boolean  | false |

# 使用反馈
希望有什么bug和意见都可以告诉我，谢谢。

github地址：[https://github.com/Benzic/react-flow-component](https://github.com/Benzic/react-flow-component)



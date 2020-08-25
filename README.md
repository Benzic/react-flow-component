<!--
 * @Author: your name
 * @Date: 2020-08-24 09:30:05
 * @LastEditTime: 2020-08-25 11:22:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-flow-component\README.md
-->


#React-flow-component
基于react+typescript开发，react生态下的work-flow组件，提供单根节点的SingleFlow组件和不限制根节点的MultipleFlow组件。

###安装方法
##### npm安装
npm i react-flow-compoent 
##### yarn安装
yarn add react-flow-component

###引入
```import { MultipleFlow，SingleFlow } from 'react-flow-component' ```
```
    <MultipleFlow rectConfig={{ width: 100, height:30 }}></MultipleFlow>
```
####MultipleFlow
![multipleFlow.gif](https://upload-images.jianshu.io/upload_images/2669301-b959212d1cd99bbd.gif?imageMogr2/auto-orient/strip)
####SingleFlow
![singleFlow.gif](https://upload-images.jianshu.io/upload_images/2669301-216d197b5ab6619d.gif?imageMogr2/auto-orient/strip)

###API
#####FlowProps配置项
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| flowNodes  | flow节点 |itemNodeType[]  | - |
| rectConfig  | flow节点统一配置项 |rectCofigType  | - |
| lineCofig  | flow连线配置项 |lineCofigType  | - |
| onDBClick  | 节点为可编辑事件双击会触发 |(val)=>void  | - |
| onChange  | 节点的位置、删除、线条等改变触发 |(val：itemNodeType[])=>void  | - |

#####Flow节点统一配置项 rectConfig
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| activeBgColor  |节点激活背景颜色  | string | #40a9ff|
| BgColor  | 节点背景颜色 |string  | #ffffff |
| corner  | 节点圆角(如果是正方形圆角为大于长宽一半则绘制节点为圆形) |number  | 0 |
| width  | 节点宽度 |number  | 100 |
| height  | 节点高度 |number | 30 |
| xCorrecting  | X方向移动校正位置 |number | 10|
| yCorrecting  | Y方向移动校正位置 |number | 5 |
| fontSize  | 节点显示文本的字体大小 |string | 12px |
| xText  | 节点显示文本X方向偏移 |number | 居中显示 |
| yText  | 节点显示文本X方向偏移 |number | 距离中心位置向下偏移5px |
| edit  | 节点是否支持编辑 |boolean | false |

#####Flow连线的配置项 lineCofig
|  参数   | 说明  | 类型| 默认值|
|  ----  | ----  |  ----  | ----  |
| activeColor  |线条激活颜色  | string | #40a9ff|
| color  | 线条颜色 |string  | #ffffff |
| width  | 线条宽度 |number  | 2 |

#####Flow节点的配置项 itemNodeType
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

#使用反馈
希望有什么bug和意见都可以告诉我，谢谢。


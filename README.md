# laputa-renderer

![](https://img.shields.io/npm/v/laputa-renderer?style=flat-square)

习题渲染器（可提交答案）


## 安装
yarn
> yarn add laputa-renderer

npm
> npm i laputa-renderer


## 使用

> 关于习题的 mock 可查看：[mock.ts](./example/src/mock.ts)

只展示
```js
/**
 * 只渲染
 */
import React from 'react';
import Renderer from 'lapuata-renderer';

const App: React.SFC<{}> = () => (
  <div>
    <Renderer schemas={MOCK_SCHEMA} />
  </div>
);
```
可提交答案
```js
/**
 * 可提交
 */
import React, { useCallback } from 'react';
import Renderer from 'laputa-renderer';
import { RenderRef, AnswerItemType } from 'laputa-renderer/dist/types';

const App: React.SFC<{}> = () => {

  const renderer = React.createRef<RenderRef>();

  const handleSubmit = useCallback((answers: AnswerItemType[]) => {
    console.log('answers:::', answers);
  }, []);

  return (
    <div>
      <Renderer
        renderer={renderer}
        schemas={MOCK_SCHEMA}
        onSubmit={handleSubmit}
      />
      <button onClick={() => renderer.current.submit()}>提交</button>
    </div>
  )
}
```

## API

| 参数      | 说明                               | 类型                                  |
|----------|------------------------------------|--------------------------------------|
| renderer | 习题 form 的 ref，可用于触发提交答案   | Ref                                  |
| schemas  | 习题的 schema，用于渲染习题           | TaskTestSchema[]                     |
| onSubmit | 提交答案的回调                       | Function(answers: AnswerItemType[])  |


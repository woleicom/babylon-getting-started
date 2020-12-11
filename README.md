# babylon-getting-started
Babylon.js入门教程示例代码
- 启动：
```
npm run start
```
- 打包：
```
npm run build
```

- 在`src/main.ts`中切换想要看的章节对象即可

如：
```
import FirstSceneAndModel from './GettingStarted/Chapter1/firstSceneAndModel';
window.addEventListener("DOMContentLoaded", () => { 
  // 替换FirstSceneAndModel类即可
  let game = new FirstSceneAndModel('renderCanvas'); 
  game.init();
});
```
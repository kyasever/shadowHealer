## 游戏地址

https://sh-1302744707.cos.ap-beijing.myqcloud.com/lastest/index.html

## 环境搭建

安装 IDE-vscode, vscode 中安装以下插件

- Prettier (代码格式化)
- Volar (vue 辅助)
- ESLint (代码错误检查)

1. 安装 [node](https://nodejs.org/zh-cn/)
2. 安装 [yarn](https://yarn.bootcss.com/docs/install/#windows-stable) 执行 `yarn --version` 有结果即为成功
3. 在本目录,执行 `yarn install` 安装依赖
4. 执行 `yarn dev` 开启 vue 调试, chrome 访问 [http://localhost:3000/](http://localhost:3000/) 即可开始调试.
5. `yarn publish-vue <version> <passwd>` 发布游戏

## tips

调试模式中, 可以通过在加入一行`debugger`, 即可添加断点

## 目录说明

- src 游戏主入口, 使用 vue
- phaser 游戏画面部分, 承载在 canvas,opengl 上.
- core 游戏逻辑
- core/data 游戏数据部分,数据采用 ts 编写, 编写规则等同于 json(附带类型检测)

## 相关学习链接

- [phaser-startup](http://phaser.io/tutorials/making-your-first-phaser-3-game-chinese)
- [phaser-demo](https://github.com/photonstorm/phaser3-examples) 在线访问非常慢,最好 clone 下来(--depth=1 也有 1G)
- [phaser-api-doc](https://photonstorm.github.io/phaser3-docs/index.html) 静态页面,速度还凑活
- [phaser-tilemap-demo](https://blog.ourcade.co/posts/2020/phaser3-mrpas-fov-field-of-view-algorithm-roguelike-dungeon-crawler/)
- [vite](https://vitejs.cn/guide/)
- [vue3](https://v3.cn.vuejs.org/guide/introduction.html)
- [element](https://element-plus.gitee.io/zh-CN/component/button.html)

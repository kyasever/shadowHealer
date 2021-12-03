## IDE:

vscode 安装插件

- Prettier (代码格式化)
- Volar (vue 辅助)
- ESLint (代码错误检查)

## 环境安装

1. 安装: node npm yarn (略)
2. yarn 安装依赖
3. yarn dev 开启 vue 调试, chrome 访问 http://localhost:3000/ 即可开始调试.
4. yarn publish-vue <version> 以指定版本号发布

## tips

代码中加上 debugger 可以在指定到这条语句时命中断点

## 简易开发说明

src/main.ts 是程序的主入口

开发版本包含三个部分:

- 挂在 canvas 节点上的 phaser 部分, 承载主要逻辑,最终界面
- vue 部分挂在 vue 组件上,用于 debug 界面和调试使用
- 命令行部分挂在 chrome 控制台上,控制台输入 run('xxx')执行命令

## 相关学习链接

- [phaser](http://phaser.io/tutorials/making-your-first-phaser-3-game-chinese)
- [vite](https://vitejs.cn/guide/)
- [vue3](https://v3.cn.vuejs.org/guide/introduction.html)
- [vant](https://vant-contrib.gitee.io/vant/v3/#/zh-CN)

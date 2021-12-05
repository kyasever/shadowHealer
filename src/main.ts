import { createApp } from 'vue';
import App from './App.vue';
import { run } from '../node/index';
import { Button, Switch, Slider } from 'vant';
import { createPhaser } from '../phaser';

// 学习地址:
// [vite] https://vitejs.cn/guide/
// [vue3] https://v3.cn.vuejs.org/guide/introduction.html
// [vant] https://vant-contrib.gitee.io/vant/v3/#/zh-CN
// [vant] https://www.jianshu.com/p/9f0ca1d0921a vant的格式需要装vite插件.

declare const window: any;

// @core 位于core,是平台无关的游戏核心逻辑

// 启动vue: vue相关代码位于src(非src还得单独配置太麻烦了)
const app = createApp(App);
app.use(Button);
app.use(Switch);
app.use(Slider);
app.mount('#app');

// 启动命令行: 命令行相关代码位于node
window.run = (command) => {
  return run(command);
};

createPhaser('#glcanvas');

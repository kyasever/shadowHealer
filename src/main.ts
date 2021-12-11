import { createApp } from 'vue';
import App from './App.vue';
import { run } from '@core/commander';

import { createPhaser } from '../phaser';
import { EventEmitter } from 'events';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

declare const window: any;

// @core 位于core,是平台无关的游戏核心逻辑

// 启动vue: vue相关代码位于src(非src还得单独配置太麻烦了)
const app = createApp(App);
app.use(ElementPlus);

app.mount('#app');

// 启动命令行: 命令行相关代码位于node
window.run = async (command) => {
  return await run(command);
};

createPhaser('#glcanvas');

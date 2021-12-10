import { createApp } from 'vue';
import App from './App.vue';
import { run } from '@core/commander';
import { Button, Switch, Slider, Tab, Tabs } from 'vant';
import { createPhaser } from '../phaser';
import { EventEmitter } from 'events';

declare const window: any;

// @core 位于core,是平台无关的游戏核心逻辑

// 启动vue: vue相关代码位于src(非src还得单独配置太麻烦了)
const app = createApp(App);
app.use(Button);
app.use(Switch);
app.use(Slider);
app.use(Tab);
app.use(Tabs);
app.mount('#app');

// 启动命令行: 命令行相关代码位于node
window.run = (command) => {
  return run(command);
};

createPhaser('#glcanvas');

const emit = new EventEmitter();

emit.on('a', (res) => {
  console.log('a', res);
});

emit.emit('a');
emit.emit('a', 'arg1', 'arg2');

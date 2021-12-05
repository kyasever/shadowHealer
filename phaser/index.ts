import { debug } from 'console';
import { createGame } from './scene';

export function createPhaser(id) {
  const canvas: any = document.querySelector(id);
  if (!canvas) {
    console.warn(`未找到节点${id}`);
    return;
  }

  //  It's important to set the WebGL context values that Phaser needs:
  const contextCreationConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default',
  };

  const ctx: CanvasRenderingContext2D = canvas.getContext(
    'webgl2',
    contextCreationConfig
  );
  if (!ctx) {
    console.warn('创建ctx失败');
    return;
  }
  createGame(canvas, ctx);
}

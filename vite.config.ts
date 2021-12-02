import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import styleImport from 'vite-plugin-style-import';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`,
        },
      ],
    }),
  ],
  // 这样打包后资源文件的索引就是相对路径而不是绝对路径了
  base: './',
  // 将根目录中的core设置别名, 结合tsconfig, 优化引入层级
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'core'),
    },
  },
});

import { SHLog } from '../utils';

export class Commander {
  callbacks = {};
  keywords_key = {};
  defaultOptions = {};
  defaultParams = [];

  options(key: string, optionKey: string, defaultValue?: any) {
    key.split(' ').forEach((item) => {
      this.keywords_key[item] = optionKey;
    });
    this.defaultOptions[optionKey] = defaultValue || false;
    return this;
  }

  register(method: string, callback: (options, params?) => void) {
    if (method === '' || !method) {
      this.callbacks['default'] = callback;
    }
    this.callbacks[method] = callback;
    return this;
  }

  parse(input?: string | string[]): [object, string[]] {
    let args: string[];
    if (typeof input === 'string') {
      args = input.split(' ');
    } else if (typeof input === 'object') {
      args = [...input];
    } else {
      args = process.argv.slice(2);
    }

    const params = [...this.defaultParams];
    const options = { ...this.defaultOptions };
    let hasSetOptions = false;
    SHLog.info(args);
    for (let i = 0; i < args.length; i++) {
      const p = args[i];
      if (p[0] === '-') {
        let value: any = true;
        if (i < args.length - 1) {
          if (args[i + 1][0] !== '-') {
            value = args[i + 1];
            i++;
          }
        }
        if (this.keywords_key[p]) {
          options[this.keywords_key[p]] = value;
          hasSetOptions = true;
        } else {
          console.warn(`未注册的参数: ${p}`);
        }
      } else {
        if (hasSetOptions) {
          console.warn(`多余的不合规参数: ${args[i]}`);
        } else {
          params.push(args[i]);
        }
      }
    }
    return [options, params];
  }

  async run(cmd?: string | string[]) {
    const [options, params] = this.parse(cmd);
    SHLog.info(options, params);
    if (params.length === 0 && !this.callbacks['default']) {
      console.error('至少需要注册一个回调');
      return;
    }

    if (this.callbacks['default']) {
      this.callbacks['default'](options, params);
    }

    console.time('cmd_used_time');
    const res = await this.callbacks[params[0]](options, params.slice(1));
    console.timeEnd('cmd_used_time');

    if (typeof window !== 'undefined') {
      let memory = (window.performance as any).memory;
      SHLog.info(
        `memory used: ${(memory.totalJSHeapSize / 1000000).toFixed(2)}mb`
      );
    }
    return res;
  }
}

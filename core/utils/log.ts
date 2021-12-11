import { GameConfig } from '../game';

export type ConsoleStyles = keyof IStyles;

interface IStyles {
  bold: string[];
  italic: string[];
  underline: string[];
  inverse: string[];
  white: string[];
  grey: string[];
  black: string[];
  blue: string[];
  cyan: string[];
  green: string[];
  magenta: string[];
  red: string[];
  yellow: string[];
  whiteBG: string[];
  greyBG: string[];
  blackBG: string[];
  blueBG: string[];
  cyanBG: string[];
  greenBG: string[];
  magentaBG: string[];
  redBG: string[];
  yellowBG: string[];
}

const styles: IStyles = {
  // style:    [ style code, reset code  ]
  bold: ['\x1B[1m', '\x1B[22m'],
  italic: ['\x1B[3m', '\x1B[23m'],
  underline: ['\x1B[4m', '\x1B[24m'],
  inverse: ['\x1B[7m', '\x1B[27m'],
  white: ['\x1B[37m', '\x1B[39m'],
  grey: ['\x1B[90m', '\x1B[39m'],
  black: ['\x1B[30m', '\x1B[39m'],
  blue: ['\x1B[34m', '\x1B[39m'],
  cyan: ['\x1B[36m', '\x1B[39m'],
  green: ['\x1B[32m', '\x1B[39m'],
  magenta: ['\x1B[35m', '\x1B[39m'],
  red: ['\x1B[31m', '\x1B[39m'],
  yellow: ['\x1B[33m', '\x1B[39m'],
  whiteBG: ['\x1B[47m', '\x1B[49m'],
  greyBG: ['\x1B[49;5;8m', '\x1B[49m'],
  blackBG: ['\x1B[40m', '\x1B[49m'],
  blueBG: ['\x1B[44m', '\x1B[49m'],
  cyanBG: ['\x1B[46m', '\x1B[49m'],
  greenBG: ['\x1B[42m', '\x1B[49m'],
  magentaBG: ['\x1B[45m', '\x1B[49m'],
  redBG: ['\x1B[41m', '\x1B[49m'],
  yellowBG: ['\x1B[43m', '\x1B[49m'],
};

export function setPrototypeColor(str, style: ConsoleStyles) {
  return styles[style][0] + str + styles[style][1];
}

function formatMsg(msg) {
  // 不允许string外的参数, 否则就别用SHLog了
  if (typeof msg !== 'string') {
    msg = JSON.stringify(msg, null, 2);
  }
  return msg;
}

/**
 * log规范:
 *    长久保留的log全部通过SHLog打印, 临时调试用的log用console打印.(便于使用后统一删除)
 *    info以上级别用于打印频率低于 1s/条 的log
 *    debug和log级别的不要使用额外的参数(带对象打印) error打印时尽可能把有关的对象都打印出来
 *    debug级别建议增加[channel]字段便于调试使用
 */
export const SHLog = {
  debug: (msg, ...args) => {
    if (GameConfig.logLevel <= log_level.verbose) {
      console.debug(setPrototypeColor(formatMsg(msg), 'grey'), ...args);
    }
  },

  log: (msg, ...args) => {
    if (GameConfig.logLevel <= log_level.debug) {
      console.log(formatMsg(msg), ...args);
    }
  },

  info: (msg, ...args) => {
    if (GameConfig.logLevel <= log_level.info) {
      console.info(setPrototypeColor(formatMsg(msg), 'green'), ...args);
    }
  },

  warn: (msg, ...args) => {
    if (GameConfig.logLevel <= log_level.warn) {
      console.warn(formatMsg(msg), ...args);
    }
  },

  error: (msg, ...args) => {
    console.error(formatMsg(msg), ...args);
    throw new Error(formatMsg(msg));
  },

  table: (object, level) => {
    if (GameConfig.logLevel <= level) {
      console.table(object);
    }
  },
};

export const log_level = {
  verbose: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
};

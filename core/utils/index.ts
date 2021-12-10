import axios from 'axios';
import { NonFunctionKeys } from 'utility-types';

export * from './log';

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, ms);
  });
}

export function randomRange(min: number, max: number) {
  let dis = max - min;
  return min + Math.random() * dis;
}

export function randomString(length: number = 5) {
  return Math.random()
    .toString()
    .slice(3, length);
}

/** 将class除了函数外的字段抽象为接口 */
export type SHInterface<T extends object> = {
  [key in NonFunctionKeys<T>]: T[key];
};

/** 从本地资源文件中读取一个json */
export async function loadFromJson<T>(name: string): Promise<T> {
  const res = await axios({
    method: 'get',
    url: `./assets/data/${name}`,
  }).catch((error) => {
    console.error('get data failed', error);
  });

  if (res) {
    return res['data'] as T;
  }
  return null;
}

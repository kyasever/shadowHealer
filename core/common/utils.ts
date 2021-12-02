import { IEntity } from '.';
import { SHLog } from '../log';

export function randomRange(min: number, max: number) {
  let dis = max - min;
  return min + Math.random() * dis;
}

/** 修改目标字段, 返回值为实际修改的值 */
export function changeValue(
  value: number,
  target: IEntity,
  key: string,
  min: number,
  max: number
) {
  if (typeof target[key] !== 'number') {
    SHLog.warn(`key:${key} 指定错误`);
    return 0;
  }
  // 临时策略, 长远来看不应该这么粗糙的搞. 目前只卡最后一步,过程中仍然是浮点数
  value = Math.round(value);
  let end = target[key] + value;
  if (end > max) {
    end = max;
  }
  if (end < min) {
    end = min;
    if (key === 'hp') {
      target.isAlive = false;
      SHLog.info(`${target.name} dead`);
    }
  }
  const changed = end - target[key];
  target[key] = end;
  return changed;
}

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, ms);
  });
}

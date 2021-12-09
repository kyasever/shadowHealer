import { IEntity, makeEffect } from '.';
import { SHLog } from '../log';

export function randomRange(min: number, max: number) {
  let dis = max - min;
  return min + Math.random() * dis;
}

/** 改变一个对象的hp, 返回实际改变的值 */
export function changeHp(target: IEntity, value: number): number {
  value = Math.round(value);
  let end = target.hp + value;
  if (end > target.hpmax) {
    end = target.hpmax;
  }
  if (end < 0) {
    end = 0;
    target.isAlive = false;
    Object.values(target.buffs).forEach((buff) => {
      makeEffect({
        caster: target,
        target: target,
        name: 'dead',
        removeBuff: buff,
      });
    });
    SHLog.info(`${target.name} dead`);
  }
  const changed = end - target.hp;
  target.hp = end;
  return changed;
}

/** 改变一个对象的ap, 返回实际改变的值  */
export function changeAp(target: IEntity, value: number) {
  value = Math.round(value);
  let end = target.ap + value;
  if (end > target.apmax) {
    end = target.apmax;
  }
  if (end < 0) {
    end = 0;
  }
  const changed = end - target.ap;
  target.ap = end;
  return changed;
}

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, ms);
  });
}

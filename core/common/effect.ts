import {
  Battle,
  calculateProperty,
  changeAp,
  changeHp,
  DeltaTime,
  FrameCount,
  IBuff,
  IEffect,
  IEntity,
  ISkill,
} from '.';
import { SHLog } from '../log';
import { Skada } from './skada';

export const MakeEffectInstance = -1;

/**
 * effect在帧末生效
 */
export function makeEffect(effect: IEffect, time?: number) {
  // 暂时删除effect的延迟执行机制, 不然调试有点麻烦,堆栈断了...
  _dealEffect(effect);

  // // time为负 代表立即执行
  // if (time && time < 0) {
  //   _dealEffect(effect);
  //   return;
  // }
  // // 为空或0 代表本帧执行
  // const battle = effect.caster.battle;
  // if (battle) {
  //   battle.effectToCall.push(effect);
  // }
  // // 为正数,代表延迟执行
}

/**
 * effect立即生效
 */
export function _dealEffect(effect: IEffect) {
  const { caster, target } = effect;
  if (!caster || !target) {
    SHLog.error('not fond target');
  }
  effect.time = caster.battle.time;
  effect.critRate = effect.critRate || caster.critRate;
  effect.critDamage = effect.critDamage || caster.critDamage;

  if (!effect.logs) {
    // 每一步回调都把回调的返回值填到log里, 这样可以记录一系列回调对于effect的影响
    effect.logs = [];
  }
  const log = (msg) => {
    effect.logs.push(msg);
  };
  // ----- 回调处理阶段 -----
  const call = (obj, eventName: string) => {
    if (!obj) {
      SHLog.error(`effect entity not fond`, effect);
      return;
    }
    if (obj[eventName]) {
      let res = obj[eventName](effect);
      if (!res) {
        res = `${obj.name} called ${eventName}`;
      }
      log(res);
      return res;
    }
  };
  let callRes = call(caster, 'onEffect');
  if (callRes === 'reject') {
    return;
  }
  for (let i = 0; i < Object.keys(caster.buffs).length; i++) {
    let buffname = Object.keys(caster.buffs)[i];
    call(caster.buffs[buffname], 'onEffect');
    if (callRes === 'reject') {
      return;
    }
  }
  call(target, 'onBehit');
  if (callRes === 'reject') {
    return;
  }
  for (let i = 0; i < Object.keys(target.buffs).length; i++) {
    let buffname = Object.keys(target.buffs)[i];
    call(target.buffs[buffname], 'onBehit');
    if (callRes === 'reject') {
      return;
    }
  }
  // ----- 变更结算阶段 -----
  effect.isCrit = Math.random() < effect.critRate;
  if (effect.isCrit) {
    log('crit!');
  }

  if (effect.damage) {
    if (effect.isCrit) {
      effect.damage *= effect.critDamage;
    }
    effect.damage = -changeHp(target, -effect.damage);
  }

  if (effect.heal) {
    if (effect.isCrit) {
      effect.heal *= effect.critDamage;
    }
    effect.heal = changeHp(target, effect.heal);
  }

  if (effect.ap_caster) {
    changeAp(caster, effect.ap_caster);
  }

  if (effect.ap_target) {
    changeAp(target, effect.ap_target);
  }

  if (effect.addBuff) {
    const buff = effect.addBuff;
    buff.caster = caster;
    buff.target = target;
    const oldBuff = target.buffs[buff.name];
    if (!target.buffs[buff.name]) {
      target.buffs[buff.name] = { ...buff };
    } else {
      // 结算堆叠层数
      if (oldBuff.maxStack) {
        if (!oldBuff.stack) {
          oldBuff.stack = 0;
        }
        if (oldBuff.stack < oldBuff.maxStack) {
          oldBuff.stack++;
        }
      }
      if (oldBuff) {
        oldBuff.release = buff.release;
      }
    }
    call(buff, 'onAdd');
    SHLog.debug(`${buff.target.name} add buff ${buff.name}`);
    // addBuff会触发属性计算
    calculateProperty(buff.target);
  }

  if (effect.removeBuff) {
    const buff = effect.removeBuff;
    if (!buff.static && buff.target.buffs[buff.name]) {
      call(buff, 'onRemove');
      delete buff.target.buffs[buff.name];
      SHLog.debug(`${buff.target.name} remove buff ${buff.name}`);
      calculateProperty(buff.target);
    }
  }

  // ----- 结束处理阶段 -----
  target.afterBehit && target.afterBehit(effect);
  caster.afterEffect && caster.afterEffect(effect);
  effect.logs.push('deal effect end');
  Skada.instance.addRecord(effect);
}

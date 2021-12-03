import {
  Battle,
  calculateProperty,
  changeValue,
  DeltaTime,
  FrameCount,
  IBuff,
  IEntity,
  ISkill,
} from '.';
import { SHLog } from '../log';
import { Skada } from './skada';

/*
 * makeEffect 核心函数: 所有的数据操作都要走effect
 */
export interface IEffect {
  // 记录中的名字
  name: string;
  // 释放者
  caster: IEntity;
  // 目标, 每个effect结算一个目标
  target: IEntity;

  // 默认暴击率取caster
  critRate?: number;
  critDamage?: number;
  isCrit?: boolean;

  // 对target造成伤害(相对于hp变化取反)
  damage?: number;
  // 对target造成治疗
  heal?: number;
  // 对caster改变ap
  ap_caster?: number;
  // 对target改变ap
  ap_target?: number;
  // 对target施加buff
  addBuff?: IBuff;
  // 移除
  removeBuff?: IBuff;
  // 对battle增加实体
  addEntity?: IEntity;

  // 每一步回调和处理,在这里记录日志
  logs?: string[];

  // 预期结算时间, 默认为now
  time?: number;
}

/**
 * effect在帧末生效
 */
export function makeEffect(effect: IEffect, time?: number) {
  // time为负 代表立即执行
  if (time && time < 0) {
    _dealEffect(effect);
    return;
  }
  // 为空或0 代表本帧执行
  const battle = effect.caster.battle;
  if (battle) {
    battle.effectToCall.push(effect);
  }
  // 为正数,代表延迟执行
}

/**
 * effect立即生效
 */
export function _dealEffect(effect: IEffect) {
  const { caster, target } = effect;
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
  const call = (obj, eventName: string) => {
    if (obj[eventName]) {
      let res = obj[eventName](effect);
      if (!res) {
        res = `${obj.name} called ${eventName}`;
      }
      log(res);
    }
  };

  // ----- 回调处理阶段 -----
  call(caster, 'onEffect');
  Object.values(caster.buffs).forEach((buff) => {
    call(buff, 'onEffect');
  });
  call(target, 'onBehit');
  Object.values(target.buffs).forEach((buff) => {
    call(buff, 'onBehit');
  });

  // ----- 变更结算阶段 -----
  effect.isCrit = Math.random() < effect.critRate;
  if (effect.isCrit) {
    log('crit!');
  }

  if (effect.damage) {
    if (effect.isCrit) {
      effect.damage *= effect.critDamage;
    }
    effect.damage = -changeValue(-effect.damage, target, 'hp', 0, target.hpmax);
  }

  if (effect.heal) {
    if (effect.isCrit) {
      effect.heal *= effect.critDamage;
    }
    effect.heal = changeValue(effect.heal, target, 'hp', 0, target.hpmax);
  }

  if (effect.ap_caster) {
    changeValue(effect.ap_caster, caster, 'ap', 0, caster.apmax);
  }

  if (effect.ap_target) {
    changeValue(effect.ap_target, target, 'ap', 0, target.apmax);
  }

  if (effect.addBuff) {
    const buff = effect.addBuff;
    const oldBuff = buff.target.buffs[buff.name];
    if (!buff.target.buffs[buff.name]) {
      buff.target.buffs[buff.name] = { ...buff };
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

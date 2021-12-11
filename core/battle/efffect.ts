import { SHLog } from '../utils';
import { Battle } from './battle';
import { Buff } from './buff';
import { Entity } from './entity';
import { calculateProperty } from './property';
import { Skada } from './skada';

/*
 * makeEffect 核心函数: 所有的数据操作都要走effect
 */
export interface IEffect {
  // 记录中的名字
  name: string;
  // 释放者
  caster?: Entity;
  // 目标, 每个effect结算一个目标
  target: Entity;

  // 默认暴击率取caster
  critRate?: number;
  critDamage?: number;
  isCrit?: boolean;

  // 对target造成伤害(相对于hp变化取反)
  damage?: number;
  // 对target造成治疗, 负治疗也会算作治疗,但不会致死
  heal?: number;
  // 对caster改变ap
  ap_caster?: number;
  // 对target改变ap
  ap_target?: number;
  // 对target施加buff, 通过caster的create获得实例
  addBuff?: string;
  // 移除
  removeBuff?: string;
  // 对battle增加实体
  addEntity?: Entity;

  // 每一步回调和处理,在这里记录日志
  logs?: string[];

  // 预期结算时间, 默认为now
  time?: number;
}

/**
 * effect立即生效
 */
export function makeEffect(effect: IEffect) {
  const { caster, target } = effect;
  if (!caster) {
    SHLog.error('not found caster', effect);
    return;
  }
  if (!target) {
    SHLog.error('not found target', effect);
    return;
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

  caster.emit('effect', effect);
  for (let i = 0; i < Object.keys(caster.buffs).length; i++) {
    let buffname = Object.keys(caster.buffs)[i];
    caster.buffs[buffname].emit('effect', effect);
  }

  target.emit('behit', effect);
  for (let i = 0; i < Object.keys(target.buffs).length; i++) {
    let buffname = Object.keys(target.buffs)[i];
    target.buffs[buffname].emit('behit', effect);
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
    effect.damage = -target.changeHp(-effect.damage);
  }

  if (effect.heal) {
    if (effect.isCrit) {
      effect.heal *= effect.critDamage;
    }
    effect.heal = target.changeHp(effect.heal);
  }

  if (effect.ap_caster) {
    caster.changeAp(effect.ap_caster);
  }

  if (effect.ap_target) {
    target.changeAp(effect.ap_target);
  }

  if (effect.addBuff) {
    if (!caster.buffCreater[effect.addBuff]) {
      SHLog.error(`${caster.name} can not create buff ${effect.addBuff}`);
      return;
    }
    const buff: Buff = caster.buffCreater[effect.addBuff]();
    buff.caster = caster;
    buff.target = target;
    if (buff.name !== effect.addBuff) {
      SHLog.error(`buff 中的name 与addBuff中的name不符`, {
        name: buff.name,
        addName: effect.addBuff,
      });
    }

    const oldBuff = target.buffs[effect.addBuff];
    if (!target.buffs[effect.addBuff]) {
      target.buffs[buff.name] = buff;
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
    buff.emit('add', null);
    SHLog.debug(`${buff.target.name} add buff ${buff.name}`);
    // addBuff会触发属性计算
    calculateProperty(buff.target);
  }

  if (effect.removeBuff) {
    if (!target.buffs[effect.removeBuff]) {
      SHLog.warn(`${target.name} not have buff ${effect.removeBuff}`);
    }
    const buff = target.buffs[effect.removeBuff];
    if (buff.type !== 'normal') {
      SHLog.warn(`buff ${buff.name} is not normal buff, 不应该被驱散`);
    }

    buff.emit('remove', null);
    delete target.buffs[effect.removeBuff];
    SHLog.debug(`${buff.target.name} remove buff ${buff.name}`);
    calculateProperty(buff.target);
  }

  // ----- 结束处理阶段 -----
  target.emit('afterBehit', effect);
  caster.emit('afterEffect', effect);

  effect.logs.push('deal effect end');

  caster.battle.skada.addRecord(effect);
}

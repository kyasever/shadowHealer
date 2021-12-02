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
import { SHMap } from './SHMap';

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

  // 对target造成伤害
  damage?: {
    value: number;
    critRate: number;
    critDamage: number;
  };
  // 对target造成治疗
  heal?: {
    value: number;
    critRate: number;
    critDamage: number;
  };
  // 对caster改变ap
  ap_caster?: {
    value: number;
  };
  // 对target改变ap
  ap_target?: {
    value: number;
  };
  // 对target施加buff
  addBuff?: {
    value: IBuff;
  };
  // 对battle增加实体
  addEntity?: {
    value: IEntity;
  };

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

  if (!effect.logs) {
    // 每一步回调都把回调的返回值填到log里, 这样可以记录一系列回调对于effect的影响
    effect.logs = [];
  }

  // 释放者回调
  caster.onEffect && caster.onEffect(effect);

  // buff
  Object.values(caster.buffs).forEach((buff) => {
    buff.onEffect && buff.onEffect(effect);
  });

  // 承受者回调
  target.onBehit && target.onBehit(effect);

  _dealDamage(effect);
  _dealHeal(effect);

  if (effect.ap_caster) {
    changeValue(effect.ap_caster.value, caster, 'ap', 0, caster.apmax);
  }

  if (effect.ap_target) {
    changeValue(effect.ap_target.value, target, 'ap', 0, target.apmax);
    console.log(effect.target.ap);
  }

  if (effect.addBuff) {
    const buff = effect.addBuff.value;
    if (!buff.target.buffs[buff.name]) {
      buff.target.buffs[buff.name] = { ...buff };
    }
    buff.onAdd && buff.onAdd();
    SHLog.debug(`${buff.target.name} add buff ${buff.name}`);
    calculateProperty(buff.target);
  }

  effect.logs.push('deal effect end');
}

function _dealDamage(effect: IEffect) {
  if (!effect.damage) {
    return;
  }
  const { caster, target, damage } = effect;
  const isCrit = Math.random() < damage.critRate;
  // 暴击
  if (isCrit) {
    damage.value *= damage.critDamage;
  }
  effect.logs.push(`dealdamege: ${effect.damage.value}`);
  damage.value = -changeValue(-damage.value, target, 'hp', 0, target.hpmax);

  const critMsg = isCrit ? '(crit)' : '';
  SHLog.log(
    `[${caster.battle.time.toFixed(2)}][${caster.name}](${caster.ap}/${
      caster.apmax
    }) use ${effect.name} to [${target.name}(${target.hp}/${
      target.hpmax
    })] deal [${damage.value}]${critMsg} damage`
  );
  // 伤害统计
  Skada.instance.addRecord(caster, target, effect.name, damage.value, 0);
}

function _dealHeal(effect: IEffect) {
  if (!effect.heal) {
    return;
  }
  const { caster, target, heal } = effect;
  const isCrit = Math.random() < heal.critRate;
  // 暴击
  if (isCrit) {
    heal.value *= heal.critDamage;
  }
  heal.value = changeValue(heal.value, target, 'hp', 0, target.hpmax);

  const critMsg = isCrit ? '(crit)' : '';
  SHLog.log(
    `[${caster.battle.time.toFixed(2)}][${caster.name}](${caster.ap}/${
      caster.apmax
    }) use ${effect.name} to [${target.name}(${target.hp}/${
      target.hpmax
    })] heal [${heal.value}]${critMsg} hp`
  );
  // 伤害统计
  Skada.instance.addRecord(caster, target, effect.name, 0, heal.value);
}

interface SkadaData {
  totalDamage: number;
  dps: number;
  totalHeal: number;
  detail: SHMap<{
    totalDamage: number;
    totalHeal: number;
    count: 0;
    distribution: SHMap<number>;
  }>;
  buffCoverage: SHMap<{
    totalTime: number;
  }>;
}

export class Skada {
  battle: Battle;
  static instance: Skada;
  constructor(battle: Battle) {
    Skada.instance = this;
    this.battle = battle;

    this.data = new SHMap(() => {
      return {
        totalHeal: 0,
        totalDamage: 0,
        dps: 0,
        detail: new SHMap(() => {
          return {
            totalDamage: 0,
            count: 0,
            totalHeal: 0,
            distribution: new SHMap(() => 0),
          };
        }),
        buffCoverage: new SHMap(() => {
          return {
            totalTime: 0,
          };
        }),
      };
    });
  }

  // characterName:  { total, dps , skillRedord}
  data: SHMap<SkadaData>;

  addRecord(
    caster: IEntity,
    target: IEntity,
    name: string,
    damage: number,
    heal: number
  ) {
    let c = this.data.get(caster.name);
    c.totalDamage += damage;
    c.totalHeal += heal;
    c.dps = c.totalDamage / caster.battle.time;

    const cn = c.detail.get(name);
    cn.totalDamage += damage;
    cn.totalHeal += heal;
    cn.count++;
    const dmgStr = damage.toString();
    cn.distribution[dmgStr] = cn.distribution.get(dmgStr) + 1;
  }

  // 每帧记录, 如果有这个buff,则count + 1最终得出buff覆盖率
  addBuffData(c: IEntity) {
    Object.keys(c.buffs).forEach((key) => {
      let b = this.data.get(c.name).buffCoverage;
      if (!b[c.buffs[key].name]) {
        b[c.buffs[key].name] = { totalTime: 0 };
      }
      b[c.buffs[key].name].totalTime += DeltaTime;
    });
  }

  outPut(target: string = 'fire') {
    console.log('damage total:');
    // 数据总表
    console.table(this.data);

    // 伤害详情
    console.log('damege detail:');

    const { totalDamage: total, detail, buffCoverage } = this.data.get(target);
    if (detail) {
      const sortedData = [];
      detail.forEach((key, value) => {
        sortedData.push({
          name: key,
          totalDamage: value.totalDamage,
          count: value.count,
          average: (value.totalDamage / value.count).toFixed(2),
          proportion: ((value.totalDamage / total) * 100).toFixed(2) + '%',
          distribution: value.distribution,
        });
        sortedData.sort((a, b) => {
          return b.totalDamage - a.totalDamage;
        });
      });
      console.table(sortedData);
    }

    // buff覆盖率
    console.log('buff coverage:');
    if (buffCoverage) {
      const sortedBuff = [];
      buffCoverage.forEach((key, value) => {
        sortedBuff.push({
          name: key,
          total: value.totalTime.toFixed(2),
          proportion:
            ((value.totalTime / this.battle.time) * 100).toFixed(2) + '%',
        });
      });
      console.table(sortedBuff);
    }

    console.log(`effect count: ${this.battle.effectCalled.length}`);
  }
}
